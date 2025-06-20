import Button from '@/components/Button';
import Input from '@/components/Input';
import LocationPicker from '@/components/LocationPicker';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { LocationCoords } from '@/utils/location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function EditSchoolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSchoolById, updateSchool } = useSchoolStore();
  
  const school = getSchoolById(id);
  
  // If school not found, show error
  if (!school) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>School not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
      </View>
    );
  }
  
  const [name, setName] = useState(school.name);
  const [region, setRegion] = useState(school.region);
  const [district, setDistrict] = useState(school.district);
  const [subCounty, setSubCounty] = useState(school.subCounty);
  const [type, setType] = useState<'Public' | 'Private'>(school.type);
  const [environment, setEnvironment] = useState<'Urban' | 'Rural'>(school.environment);
  const [totalStudents, setTotalStudents] = useState(school.enrollmentData.totalStudents.toString());
  const [maleStudents, setMaleStudents] = useState(school.enrollmentData.maleStudents.toString());
  const [femaleStudents, setFemaleStudents] = useState(school.enrollmentData.femaleStudents.toString());
  const [headTeacher, setHeadTeacher] = useState(school.contactInfo.headTeacher);
  const [email, setEmail] = useState(school.contactInfo.email);
  const [phone, setPhone] = useState(school.contactInfo.phone);
  const [location, setLocation] = useState<LocationCoords>(school.location);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'School name is required';
    if (!region.trim()) newErrors.region = 'Region is required';
    if (!district.trim()) newErrors.district = 'District is required';
    if (!subCounty.trim()) newErrors.subCounty = 'Sub-county is required';
    
    const totalStudentsNum = parseInt(totalStudents);
    const maleStudentsNum = parseInt(maleStudents);
    const femaleStudentsNum = parseInt(femaleStudents);
    
    if (isNaN(totalStudentsNum) || totalStudentsNum < 0) {
      newErrors.totalStudents = 'Total students must be a positive number';
    }
    
    if (isNaN(maleStudentsNum) || maleStudentsNum < 0) {
      newErrors.maleStudents = 'Male students must be a positive number';
    }
    
    if (isNaN(femaleStudentsNum) || femaleStudentsNum < 0) {
      newErrors.femaleStudents = 'Female students must be a positive number';
    }
    
    if (maleStudentsNum + femaleStudentsNum !== totalStudentsNum) {
      newErrors.totalStudents = 'Total students must equal male + female students';
    }
    
    if (!headTeacher.trim()) newErrors.headTeacher = 'Head teacher name is required';
    
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Create updated school object
    const updatedSchool = {
      ...school,
      name,
      region,
      district,
      subCounty,
      location,
      type,
      environment,
      enrollmentData: {
        totalStudents: parseInt(totalStudents),
        maleStudents: parseInt(maleStudents),
        femaleStudents: parseInt(femaleStudents),
      },
      contactInfo: {
        headTeacher,
        email,
        phone,
      },
    };
    
    // Update in store
    updateSchool(updatedSchool);
    
    // Show success message and navigate back
    Alert.alert(
      'School Updated',
      'School information has been successfully updated.',
      [
        { 
          text: 'OK', 
          onPress: () => router.replace(`/schools/${id}`) 
        }
      ]
    );
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Input
            label="School Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter school name"
            error={errors.name}
          />
          
          <Input
            label="Region"
            value={region}
            onChangeText={setRegion}
            placeholder="Enter region"
            error={errors.region}
          />
          
          <View style={styles.row}>
            <Input
              label="District"
              value={district}
              onChangeText={setDistrict}
              placeholder="Enter district"
              error={errors.district}
              containerStyle={styles.halfWidth}
            />
            
            <Input
              label="Sub-County"
              value={subCounty}
              onChangeText={setSubCounty}
              placeholder="Enter sub-county"
              error={errors.subCounty}
              containerStyle={styles.halfWidth}
            />
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>School Type</Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="Public"
                  onPress={() => setType('Public')}
                  variant={type === 'Public' ? 'primary' : 'outline'}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemLeft]}
                  size="small"
                />
                <Button
                  title="Private"
                  onPress={() => setType('Private')}
                  variant={type === 'Private' ? 'primary' : 'outline'}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemRight]}
                  size="small"
                />
              </View>
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Environment</Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="Urban"
                  onPress={() => setEnvironment('Urban')}
                  variant={environment === 'Urban' ? 'primary' : 'outline'}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemLeft]}
                  size="small"
                />
                <Button
                  title="Rural"
                  onPress={() => setEnvironment('Rural')}
                  variant={environment === 'Rural' ? 'primary' : 'outline'}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemRight]}
                  size="small"
                />
              </View>
            </View>
          </View>
          
          <LocationPicker
            location={location}
            onLocationChange={setLocation}
            title="School Location"
          />
          
          <Text style={styles.sectionTitle}>Enrollment Data</Text>
          
          <Input
            label="Total Students"
            value={totalStudents}
            onChangeText={setTotalStudents}
            placeholder="Enter total number of students"
            keyboardType="numeric"
            error={errors.totalStudents}
          />
          
          <View style={styles.row}>
            <Input
              label="Male Students"
              value={maleStudents}
              onChangeText={setMaleStudents}
              placeholder="Enter number"
              keyboardType="numeric"
              error={errors.maleStudents}
              containerStyle={styles.halfWidth}
            />
            
            <Input
              label="Female Students"
              value={femaleStudents}
              onChangeText={setFemaleStudents}
              placeholder="Enter number"
              keyboardType="numeric"
              error={errors.femaleStudents}
              containerStyle={styles.halfWidth}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <Input
            label="Head Teacher"
            value={headTeacher}
            onChangeText={setHeadTeacher}
            placeholder="Enter head teacher's name"
            error={errors.headTeacher}
          />
          
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address (optional)"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.phone}
          />
          
          <View style={styles.submitContainer}>
            <Button
              title="Save Changes"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />
            
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  buttonGroupItem: {
    flex: 1,
    borderRadius: 0,
  },
  buttonGroupItemLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  buttonGroupItemRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  submitContainer: {
    marginTop: 24,
    marginBottom: 40,
    gap: 12,
  },
  submitButton: {
    height: 50,
  },
  cancelButton: {
    height: 50,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    minWidth: 120,
  },
});