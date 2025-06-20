import Button from '@/components/Button';
import Input from '@/components/Input';
import LocationPicker from '@/components/LocationPicker';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { School } from '@/types';
import { generateId } from '@/utils/sync';
import { LocationCoords } from '@/utils/location';
import { useRouter } from 'expo-router';
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

export default function AddSchoolScreen() {
  const router = useRouter();
  const { addSchool } = useSchoolStore();

  // Form state
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [type, setType] = useState<'Public' | 'Private'>('Public');
  const [environment, setEnvironment] = useState<'Urban' | 'Rural'>('Urban');
  const [totalStudents, setTotalStudents] = useState('');
  const [maleStudents, setMaleStudents] = useState('');
  const [femaleStudents, setFemaleStudents] = useState('');
  const [headTeacher, setHeadTeacher] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<LocationCoords>({ latitude: 0, longitude: 0 });
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

    if (location.latitude === 0 && location.longitude === 0) {
      newErrors.location = 'Please record the school location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Create new school with comprehensive data structure
    const newSchool: School = {
      id: generateId(),
      name,
      region,
      district,
      subCounty,
      location,
      type,
      environment,
      emisNumber: '',
      upiCode: '',
      ownershipType: type === 'Public' ? 'Government' : 'Private',
      schoolCategory: 'Mixed',
      signatureProgram: '',
      yearEstablished: new Date().getFullYear(),
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
      ictInfrastructure: {
        studentComputers: 0,
        teacherComputers: 0,
        projectors: 0,
        smartBoards: 0,
        tablets: 0,
        laptops: 0,
        hasComputerLab: false,
        labCondition: 'Good',
        powerBackup: [],
        hasICTRoom: false,
        hasElectricity: false,
        hasSecureRoom: false,
        hasFurniture: false,
      },
      internetConnectivity: {
        connectionType: 'None',
        bandwidthMbps: 0,
        wifiCoverage: [],
        stability: 'Medium',
        hasUsagePolicy: false,
        provider: '',
        isStable: false,
      },
      software: {
        hasLMS: false,
        lmsName: '',
        hasLicensedSoftware: false,
        licensedSoftware: [],
        hasProductivitySuite: false,
        productivitySuite: [],
        hasDigitalLibrary: false,
        hasLocalContent: false,
        contentSource: '',
      },
      humanCapacity: {
        ictTrainedTeachers: 0,
        totalTeachers: 0,
        maleTeachers: 0,
        femaleTeachers: 0,
        p5ToP7Teachers: 0,
        supportStaff: 0,
        monthlyTrainings: 0,
        teacherCompetencyLevel: 'Basic',
        hasCapacityBuilding: false,
      },
      pedagogicalUsage: {
        ictIntegratedLessons: 0,
        usesICTAssessments: false,
        hasStudentProjects: false,
        usesBlendedLearning: false,
        hasAssistiveTech: false,
        digitalToolUsageFrequency: 'Never',
        hasDigitalContent: false,
        hasPeerSupport: false,
      },
      governance: {
        hasICTPolicy: false,
        alignedWithNationalStrategy: false,
        hasICTCommittee: false,
        hasICTBudget: false,
        hasMonitoringSystem: false,
        hasActiveSMC: false,
        hasActivePTA: false,
        hasLocalLeaderEngagement: false,
      },
      studentEngagement: {
        digitalLiteracyLevel: 'Basic',
        hasICTClub: false,
        usesOnlinePlatforms: false,
        studentFeedbackRating: 3,
        studentsUsingDigitalContent: 0,
      },
      communityEngagement: {
        hasParentPortal: false,
        hasCommunityOutreach: false,
        hasIndustryPartners: false,
        partnerOrganizations: [],
        ngoSupport: [],
        communityContributions: [],
      },
      security: {
        isFenced: false,
        hasSecurityGuard: false,
        hasRecentIncidents: false,
        incidentDetails: '',
        hasToilets: false,
        hasWaterSource: false,
      },
      accessibility: {
        distanceFromHQ: 0,
        isAccessibleAllYear: true,
        isInclusive: false,
        servesGirls: true,
        servesPWDs: false,
        servesRefugees: false,
        isOnlySchoolInArea: false,
      },
      facilities: {
        permanentClassrooms: 0,
        semiPermanentClassrooms: 0,
        temporaryClassrooms: 0,
        pupilClassroomRatio: 0,
        boysToilets: 0,
        girlsToilets: 0,
        staffToilets: 0,
        waterAccess: 'None',
        securityInfrastructure: [],
        schoolAccessibility: 'All-Weather',
        nearbyHealthFacility: '',
        healthFacilityDistance: 0,
      },
      performance: {
        plePassRateYear1: 0,
        plePassRateYear2: 0,
        plePassRateYear3: 0,
        literacyTrends: '',
        numeracyTrends: '',
        innovations: '',
        uniqueAchievements: '',
      },
      synced: false,
      lastUpdated: new Date().toISOString(),
    };

    addSchool(newSchool);

    Alert.alert(
      'School Added',
      'School has been successfully added to the database.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
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
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}

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
              title="Add School"
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
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
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
});