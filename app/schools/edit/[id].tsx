import Button from '@/components/Button';
import Input from '@/components/Input';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
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
  const [district, setDistrict] = useState(school.district);
  const [subCounty, setSubCounty] = useState(school.subCounty);
  const [type, setType] = useState<'Public' | 'Private'>(school.type);
  const [environment, setEnvironment] = useState<'Urban' | 'Rural'>(school.environment);
  const [totalStudents, setTotalStudents] = useState(school.enrollmentData.totalStudents.toString());
  const [maleStudents, setMaleStudents] = useState(school.enrollmentData.maleStudents.toString());
  const [femaleStudents, setFemaleStudents] = useState(school.enrollmentData.femaleStudents.toString());
  const [principalName, setPrincipalName] = useState(school.contactInfo.principalName);
  const [email, setEmail] = useState(school.contactInfo.email);
  const [phone, setPhone] = useState(school.contactInfo.phone);
  const [location, setLocation] = useState(school.location);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'School name is required';
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
    
    if (!principalName.trim()) newErrors.principalName = 'Principal name is required';
    
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
        principalName,
        email,
        phone,
      },
      // These will be updated by the store
      // synced: false,
      // lastUpdated: new Date().toISOString(),
    };
    
    // Update in store
    updateSchool(updatedSchool);
    
    // Show success message and navigate back
    Alert.alert(
      'School Updated',
      'School has been successfully updated.',
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>School Information</Text>
          
          <Input
            label="School Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter school name"
            error={errors.name}
          />
          
          <Input
            label="District"
            value={district}
            onChangeText={setDistrict}
            placeholder="Enter district"
            error={errors.district}
          />
          
          <Input
            label="Sub-County"
            value={subCounty}
            onChangeText={setSubCounty}
            placeholder="Enter sub-county"
            error={errors.subCounty}
          />
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>School Type</Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="Public"
                  onPress={() => setType('Public')}
                  variant={type === 'Public' ? 'primary' : 'outline'}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemLeft]}
                />
                <Button
                  title="Private"
                  onPress={() => setType('Private')}
                  variant={type === 'Private' ? 'primary' : 'outline'}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemRight]}
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
                />
                <Button
                  title="Rural"
                  onPress={() => setEnvironment('Rural')}
                  variant={environment === 'Rural' ? 'primary' : 'outline'}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemRight]}
                />
              </View>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <MapPin size={18} color={colors.primary} />
              <Text style={styles.locationTitle}>GPS Location</Text>
            </View>
            <Text style={styles.locationText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
            <Button
              title="Refresh Location"
              onPress={() => {
                // Simulate refreshing location
                const randomLat = 0.3 + Math.random() * 2;
                const randomLng = 30 + Math.random() * 3;
                setLocation({
                  latitude: randomLat,
                  longitude: randomLng,
                });
              }}
              variant="outline"
              style={styles.locationButton}
            />
          </View>
          
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
            label="Principal Name"
            value={principalName}
            onChangeText={setPrincipalName}
            placeholder="Enter principal's name"
            error={errors.principalName}
          />
          
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          
          <Input
            label="Phone"
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
    marginBottom: 12,
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
  locationContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationButton: {
    marginTop: 12,
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