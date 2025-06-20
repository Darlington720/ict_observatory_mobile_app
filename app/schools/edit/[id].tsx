import Button from '@/components/Button';
import Input from '@/components/Input';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { School } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Building,
  Globe,
  GraduationCap,
  HardDrive,
  Laptop,
  MapPin,
  Shield,
  Users,
  Wifi,
  Zap,
  BookOpen,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Helper component for section headers
function SectionHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      {icon && icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// Helper component for custom checkboxes
function TouchableCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.checkbox}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkboxBox, checked && styles.checkboxChecked]}>
        {checked && <View style={styles.checkboxInner} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

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

  // State for all School fields - Initialize with existing school data
  // Basic Information
  const [name, setName] = useState(school.name);
  const [region, setRegion] = useState<'Central' | 'Eastern' | 'Western' | 'Southern' | 'Northern' | 'West Nile'>(school.region);
  const [district, setDistrict] = useState(school.district);
  const [subCounty, setSubCounty] = useState(school.subCounty);
  const [location, setLocation] = useState(school.location);
  const [type, setType] = useState<'Public' | 'Private'>(school.type);
  const [environment, setEnvironment] = useState<'Urban' | 'Rural'>(school.environment);
  const [emisNumber, setEmisNumber] = useState(school.emisNumber);
  const [upiCode, setUpiCode] = useState(school.upiCode);
  const [ownershipType, setOwnershipType] = useState<'Government' | 'Government-aided' | 'Community' | 'Private'>(school.ownershipType);
  const [schoolCategory, setSchoolCategory] = useState<'Mixed' | 'Girls' | 'Boys' | 'Special Needs'>(school.schoolCategory);
  const [signatureProgram, setSignatureProgram] = useState(school.signatureProgram || '');
  const [yearEstablished, setYearEstablished] = useState(school.yearEstablished?.toString() || '');

  // Enrollment Data
  const [totalStudents, setTotalStudents] = useState(school.enrollmentData.totalStudents.toString());
  const [maleStudents, setMaleStudents] = useState(school.enrollmentData.maleStudents.toString());
  const [femaleStudents, setFemaleStudents] = useState(school.enrollmentData.femaleStudents.toString());

  // Contact Info
  const [headTeacher, setHeadTeacher] = useState(school.contactInfo.headTeacher);
  const [email, setEmail] = useState(school.contactInfo.email);
  const [phone, setPhone] = useState(school.contactInfo.phone);

  // ICT Infrastructure
  const [studentComputers, setStudentComputers] = useState(school.ictInfrastructure.studentComputers.toString());
  const [teacherComputers, setTeacherComputers] = useState(school.ictInfrastructure.teacherComputers.toString());
  const [projectors, setProjectors] = useState(school.ictInfrastructure.projectors.toString());
  const [smartBoards, setSmartBoards] = useState(school.ictInfrastructure.smartBoards.toString());
  const [tablets, setTablets] = useState(school.ictInfrastructure.tablets.toString());
  const [laptops, setLaptops] = useState(school.ictInfrastructure.laptops.toString());
  const [hasComputerLab, setHasComputerLab] = useState(school.ictInfrastructure.hasComputerLab);
  const [labCondition, setLabCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>(school.ictInfrastructure.labCondition);
  const [powerBackup, setPowerBackup] = useState<string[]>(school.ictInfrastructure.powerBackup);
  const [hasICTRoom, setHasICTRoom] = useState(school.ictInfrastructure.hasICTRoom);
  const [hasElectricity, setHasElectricity] = useState(school.ictInfrastructure.hasElectricity);
  const [hasSecureRoom, setHasSecureRoom] = useState(school.ictInfrastructure.hasSecureRoom);
  const [hasFurniture, setHasFurniture] = useState(school.ictInfrastructure.hasFurniture);

  // Internet Connectivity
  const [connectionType, setConnectionType] = useState<'None' | 'Fiber' | 'Mobile Broadband' | 'Satellite'>(school.internetConnectivity.connectionType);
  const [bandwidthMbps, setBandwidthMbps] = useState(school.internetConnectivity.bandwidthMbps.toString());
  const [wifiCoverage, setWifiCoverage] = useState<string[]>(school.internetConnectivity.wifiCoverage);
  const [stability, setStability] = useState<'High' | 'Medium' | 'Low'>(school.internetConnectivity.stability);
  const [hasUsagePolicy, setHasUsagePolicy] = useState(school.internetConnectivity.hasUsagePolicy);
  const [provider, setProvider] = useState(school.internetConnectivity.provider);
  const [isStable, setIsStable] = useState(school.internetConnectivity.isStable);

  // ICT Software and Digital Resources
  const [hasLMS, setHasLMS] = useState(school.software.hasLMS);
  const [lmsName, setLmsName] = useState(school.software.lmsName);
  const [hasLicensedSoftware, setHasLicensedSoftware] = useState(school.software.hasLicensedSoftware);
  const [licensedSoftware, setLicensedSoftware] = useState<string[]>(school.software.licensedSoftware);
  const [hasProductivitySuite, setHasProductivitySuite] = useState(school.software.hasProductivitySuite);
  const [productivitySuite, setProductivitySuite] = useState<string[]>(school.software.productivitySuite);
  const [hasDigitalLibrary, setHasDigitalLibrary] = useState(school.software.hasDigitalLibrary);
  const [hasLocalContent, setHasLocalContent] = useState(school.software.hasLocalContent);
  const [contentSource, setContentSource] = useState(school.software.contentSource);

  // Human Capacity and ICT Competency
  const [ictTrainedTeachers, setIctTrainedTeachers] = useState(school.humanCapacity.ictTrainedTeachers.toString());
  const [totalTeachers, setTotalTeachersHumanCapacity] = useState(school.humanCapacity.totalTeachers.toString());
  const [maleTeachers, setMaleTeachersHumanCapacity] = useState(school.humanCapacity.maleTeachers.toString());
  const [femaleTeachers, setFemaleTeachersHumanCapacity] = useState(school.humanCapacity.femaleTeachers.toString());
  const [p5ToP7Teachers, setP5ToP7Teachers] = useState(school.humanCapacity.p5ToP7Teachers.toString());
  const [supportStaff, setSupportStaff] = useState(school.humanCapacity.supportStaff.toString());
  const [monthlyTrainings, setMonthlyTrainings] = useState(school.humanCapacity.monthlyTrainings.toString());
  const [teacherCompetencyLevel, setTeacherCompetencyLevel] = useState<'Basic' | 'Intermediate' | 'Advanced'>(school.humanCapacity.teacherCompetencyLevel);
  const [hasCapacityBuilding, setHasCapacityBuilding] = useState(school.humanCapacity.hasCapacityBuilding);

  // Pedagogical ICT Usage
  const [ictIntegratedLessons, setIctIntegratedLessons] = useState(school.pedagogicalUsage.ictIntegratedLessons.toString());
  const [usesICTAssessments, setUsesICTAssessments] = useState(school.pedagogicalUsage.usesICTAssessments);
  const [hasStudentProjects, setHasStudentProjects] = useState(school.pedagogicalUsage.hasStudentProjects);
  const [usesBlendedLearning, setUsesBlendedLearning] = useState(school.pedagogicalUsage.usesBlendedLearning);
  const [hasAssistiveTech, setHasAssistiveTech] = useState(school.pedagogicalUsage.hasAssistiveTech);
  const [digitalToolUsageFrequency, setDigitalToolUsageFrequency] = useState<'Daily' | 'Weekly' | 'Rarely' | 'Never'>(school.pedagogicalUsage.digitalToolUsageFrequency);
  const [hasDigitalContent, setHasDigitalContent] = useState(school.pedagogicalUsage.hasDigitalContent);
  const [hasPeerSupport, setHasPeerSupport] = useState(school.pedagogicalUsage.hasPeerSupport);

  // ICT Governance and Policy
  const [hasICTPolicy, setHasICTPolicy] = useState(school.governance.hasICTPolicy);
  const [alignedWithNationalStrategy, setAlignedWithNationalStrategy] = useState(school.governance.alignedWithNationalStrategy);
  const [hasICTCommittee, setHasICTCommittee] = useState(school.governance.hasICTCommittee);
  const [hasICTBudget, setHasICTBudget] = useState(school.governance.hasICTBudget);
  const [hasMonitoringSystem, setHasMonitoringSystem] = useState(school.governance.hasMonitoringSystem);
  const [hasActiveSMC, setHasActiveSMC] = useState(school.governance.hasActiveSMC);
  const [hasActivePTA, setHasActivePTA] = useState(school.governance.hasActivePTA);
  const [hasLocalLeaderEngagement, setHasLocalLeaderEngagement] = useState(school.governance.hasLocalLeaderEngagement);

  // Students' Digital Literacy and Engagement
  const [digitalLiteracyLevel, setDigitalLiteracyLevel] = useState<'Basic' | 'Intermediate' | 'Advanced'>(school.studentEngagement.digitalLiteracyLevel);
  const [hasICTClub, setHasICTClub] = useState(school.studentEngagement.hasICTClub);
  const [usesOnlinePlatforms, setUsesOnlinePlatforms] = useState(school.studentEngagement.usesOnlinePlatforms);
  const [studentFeedbackRating, setStudentFeedbackRating] = useState<1 | 2 | 3 | 4 | 5>(school.studentEngagement.studentFeedbackRating);
  const [studentsUsingDigitalContent, setStudentsUsingDigitalContent] = useState(school.studentEngagement.studentsUsingDigitalContent.toString());

  // Community and Parental Engagement
  const [hasParentPortal, setHasParentPortal] = useState(school.communityEngagement.hasParentPortal);
  const [hasCommunityOutreach, setHasCommunityOutreach] = useState(school.communityEngagement.hasCommunityOutreach);
  const [hasIndustryPartners, setHasIndustryPartners] = useState(school.communityEngagement.hasIndustryPartners);
  const [partnerOrganizations, setPartnerOrganizations] = useState<string[]>(school.communityEngagement.partnerOrganizations);
  const [ngoSupport, setNgoSupport] = useState<string[]>(school.communityEngagement.ngoSupport);
  const [communityContributions, setCommunityContributions] = useState<string[]>(school.communityEngagement.communityContributions);

  // Security & Safety
  const [isFenced, setIsFenced] = useState(school.security.isFenced);
  const [hasSecurityGuard, setHasSecurityGuard] = useState(school.security.hasSecurityGuard);
  const [hasRecentIncidents, setHasRecentIncidents] = useState(school.security.hasRecentIncidents);
  const [incidentDetails, setIncidentDetails] = useState(school.security.incidentDetails);
  const [hasToilets, setHasToilets] = useState(school.security.hasToilets);
  const [hasWaterSource, setHasWaterSource] = useState(school.security.hasWaterSource);

  // Accessibility
  const [distanceFromHQ, setDistanceFromHQ] = useState(school.accessibility.distanceFromHQ.toString());
  const [isAccessibleAllYear, setIsAccessibleAllYear] = useState(school.accessibility.isAccessibleAllYear);
  const [isInclusive, setIsInclusive] = useState(school.accessibility.isInclusive);
  const [servesGirls, setServesGirls] = useState(school.accessibility.servesGirls);
  const [servesPWDs, setServesPWDs] = useState(school.accessibility.servesPWDs);
  const [servesRefugees, setServesRefugees] = useState(school.accessibility.servesRefugees);
  const [isOnlySchoolInArea, setIsOnlySchoolInArea] = useState(school.accessibility.isOnlySchoolInArea);

  // School Facilities & Environment
  const [permanentClassrooms, setPermanentClassrooms] = useState(school.facilities.permanentClassrooms.toString());
  const [semiPermanentClassrooms, setSemiPermanentClassrooms] = useState(school.facilities.semiPermanentClassrooms.toString());
  const [temporaryClassrooms, setTemporaryClassrooms] = useState(school.facilities.temporaryClassrooms.toString());
  const [pupilClassroomRatio, setPupilClassroomRatio] = useState(school.facilities.pupilClassroomRatio.toString());
  const [boysToilets, setBoysToilets] = useState(school.facilities.boysToilets.toString());
  const [girlsToilets, setGirlsToilets] = useState(school.facilities.girlsToilets.toString());
  const [staffToilets, setStaffToilets] = useState(school.facilities.staffToilets.toString());
  const [waterAccess, setWaterAccess] = useState<'Borehole' | 'Tap' | 'Rainwater' | 'None'>(school.facilities.waterAccess);
  const [securityInfrastructure, setSecurityInfrastructure] = useState<string[]>(school.facilities.securityInfrastructure);
  const [schoolAccessibility, setSchoolAccessibility] = useState<'All-Weather' | 'Seasonal' | 'Remote'>(school.facilities.schoolAccessibility);
  const [nearbyHealthFacility, setNearbyHealthFacility] = useState(school.facilities.nearbyHealthFacility);
  const [healthFacilityDistance, setHealthFacilityDistance] = useState(school.facilities.healthFacilityDistance.toString());

  // Performance
  const [plePassRateYear1, setPlePassRateYear1] = useState(school.performance.plePassRateYear1.toString());
  const [plePassRateYear2, setPlePassRateYear2] = useState(school.performance.plePassRateYear2.toString());
  const [plePassRateYear3, setPlePassRateYear3] = useState(school.performance.plePassRateYear3.toString());
  const [literacyTrends, setLiteracyTrends] = useState(school.performance.literacyTrends);
  const [numeracyTrends, setNumeracyTrends] = useState(school.performance.numeracyTrends);
  const [innovations, setInnovations] = useState(school.performance.innovations);
  const [uniqueAchievements, setUniqueAchievements] = useState(school.performance.uniqueAchievements);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options for various fields
  const regions = ['Central', 'Eastern', 'Western', 'Southern', 'Northern', 'West Nile'];
  const ownershipTypes = ['Government', 'Government-aided', 'Community', 'Private'];
  const schoolCategories = ['Mixed', 'Girls', 'Boys', 'Special Needs'];
  const labConditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const powerBackupOptions = ['Generator', 'Solar', 'UPS'];
  const connectionTypes = ['None', 'Fiber', 'Mobile Broadband', 'Satellite'];
  const wifiCoverageOptions = ['Classrooms', 'Library', 'Lab', 'Admin Office', 'Staff Room'];
  const stabilityOptions = ['High', 'Medium', 'Low'];
  const licensedSoftwareOptions = ['Microsoft Office', 'Adobe Creative Suite', 'Antivirus', 'Educational Games'];
  const productivitySuiteOptions = ['Google Workspace', 'Microsoft 365', 'LibreOffice'];
  const teacherCompetencyLevels = ['Basic', 'Intermediate', 'Advanced'];
  const digitalToolUsageFrequencies = ['Daily', 'Weekly', 'Rarely', 'Never'];
  const digitalLiteracyLevels = ['Basic', 'Intermediate', 'Advanced'];
  const studentFeedbackRatings = [1, 2, 3, 4, 5];
  const partnerOrganizationsOptions = ['UNICEF', 'World Bank', 'USAID', 'Local NGOs'];
  const ngoSupportOptions = ['Plan International', 'Save the Children', 'BRAC'];
  const communityContributionsOptions = ['Land', 'Labor', 'Materials', 'Financial'];
  const waterAccessOptions = ['Borehole', 'Tap', 'Rainwater', 'None'];
  const securityInfrastructureOptions = ['Fence', 'Gate', 'CCTV', 'Alarm System'];
  const schoolAccessibilityOptions = ['All-Weather', 'Seasonal', 'Remote'];

  // Toggle functions for multi-select checkboxes
  const toggleArrayState = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (state.includes(item)) {
      setState(state.filter((s) => s !== item));
    } else {
      setState([...state, item]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic Information
    if (!name.trim()) newErrors.name = 'School name is required';
    if (!region) newErrors.region = 'Region is required';
    if (!district.trim()) newErrors.district = 'District is required';
    if (!subCounty.trim()) newErrors.subCounty = 'Sub-county is required';
    if (!emisNumber.trim()) newErrors.emisNumber = 'EMIS Number is required';
    if (!upiCode.trim()) newErrors.upiCode = 'UPI Code is required';
    if (!yearEstablished.trim() || isNaN(parseInt(yearEstablished)) || parseInt(yearEstablished) <= 0) newErrors.yearEstablished = 'Valid year is required';

    // Enrollment Data
    const totalStudentsNum = parseInt(totalStudents);
    const maleStudentsNum = parseInt(maleStudents);
    const femaleStudentsNum = parseInt(femaleStudents);

    if (isNaN(totalStudentsNum) || totalStudentsNum < 0) newErrors.totalStudents = 'Total students must be a number';
    if (isNaN(maleStudentsNum) || maleStudentsNum < 0) newErrors.maleStudents = 'Male students must be a number';
    if (isNaN(femaleStudentsNum) || femaleStudentsNum < 0) newErrors.femaleStudents = 'Female students must be a number';
    if (totalStudentsNum !== (maleStudentsNum + femaleStudentsNum)) newErrors.enrollmentMismatch = 'Total students must equal male + female students';

    // Contact Info
    if (!headTeacher.trim()) newErrors.headTeacher = 'Head Teacher name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!phone.trim() || !/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = 'Valid phone number is required';

    // ICT Infrastructure
    if (isNaN(parseInt(studentComputers)) || parseInt(studentComputers) < 0) newErrors.studentComputers = 'Valid number required';
    if (isNaN(parseInt(teacherComputers)) || parseInt(teacherComputers) < 0) newErrors.teacherComputers = 'Valid number required';
    if (isNaN(parseInt(projectors)) || parseInt(projectors) < 0) newErrors.projectors = 'Valid number required';
    if (isNaN(parseInt(smartBoards)) || parseInt(smartBoards) < 0) newErrors.smartBoards = 'Valid number required';
    if (isNaN(parseInt(tablets)) || parseInt(tablets) < 0) newErrors.tablets = 'Valid number required';
    if (isNaN(parseInt(laptops)) || parseInt(laptops) < 0) newErrors.laptops = 'Valid number required';

    // Internet Connectivity
    if (connectionType !== 'None' && (isNaN(parseFloat(bandwidthMbps)) || parseFloat(bandwidthMbps) <= 0)) newErrors.bandwidthMbps = 'Valid speed required';
    if (provider.trim() === '' && connectionType !== 'None') newErrors.provider = 'Provider is required';

    // Human Capacity
    if (isNaN(parseInt(ictTrainedTeachers)) || parseInt(ictTrainedTeachers) < 0) newErrors.ictTrainedTeachers = 'Valid number required';
    if (isNaN(parseInt(totalTeachers)) || parseInt(totalTeachers) <= 0) newErrors.totalTeachers = 'Valid number required';
    if (isNaN(parseInt(maleTeachers)) || parseInt(maleTeachers) < 0) newErrors.maleTeachers = 'Valid number required';
    if (isNaN(parseInt(femaleTeachers)) || parseInt(femaleTeachers) < 0) newErrors.femaleTeachers = 'Valid number required';
    if (isNaN(parseInt(p5ToP7Teachers)) || parseInt(p5ToP7Teachers) < 0) newErrors.p5ToP7Teachers = 'Valid number required';
    if (isNaN(parseInt(supportStaff)) || parseInt(supportStaff) < 0) newErrors.supportStaff = 'Valid number required';
    if (isNaN(parseInt(monthlyTrainings)) || parseInt(monthlyTrainings) < 0) newErrors.monthlyTrainings = 'Valid number required';

    // Pedagogical ICT Usage
    if (isNaN(parseInt(ictIntegratedLessons)) || parseInt(ictIntegratedLessons) < 0) newErrors.ictIntegratedLessons = 'Valid number required';

    // Students' Digital Literacy and Engagement
    if (isNaN(parseInt(studentsUsingDigitalContent)) || parseInt(studentsUsingDigitalContent) < 0) newErrors.studentsUsingDigitalContent = 'Valid number required';

    // Security & Safety
    if (hasRecentIncidents && !incidentDetails.trim()) newErrors.incidentDetails = 'Incident details are required';

    // Accessibility
    if (isNaN(parseFloat(distanceFromHQ)) || parseFloat(distanceFromHQ) < 0) newErrors.distanceFromHQ = 'Valid distance required';

    // School Facilities & Environment
    if (isNaN(parseInt(permanentClassrooms)) || parseInt(permanentClassrooms) < 0) newErrors.permanentClassrooms = 'Valid number required';
    if (isNaN(parseInt(semiPermanentClassrooms)) || parseInt(semiPermanentClassrooms) < 0) newErrors.semiPermanentClassrooms = 'Valid number required';
    if (isNaN(parseInt(temporaryClassrooms)) || parseInt(temporaryClassrooms) < 0) newErrors.temporaryClassrooms = 'Valid number required';
    if (isNaN(parseFloat(pupilClassroomRatio)) || parseFloat(pupilClassroomRatio) < 0) newErrors.pupilClassroomRatio = 'Valid ratio required';
    if (isNaN(parseInt(boysToilets)) || parseInt(boysToilets) < 0) newErrors.boysToilets = 'Valid number required';
    if (isNaN(parseInt(girlsToilets)) || parseInt(girlsToilets) < 0) newErrors.girlsToilets = 'Valid number required';
    if (isNaN(parseInt(staffToilets)) || parseInt(staffToilets) < 0) newErrors.staffToilets = 'Valid number required';
    if (isNaN(parseFloat(healthFacilityDistance)) || parseFloat(healthFacilityDistance) < 0) newErrors.healthFacilityDistance = 'Valid distance required';

    // Performance
    if (isNaN(parseFloat(plePassRateYear1)) || parseFloat(plePassRateYear1) < 0 || parseFloat(plePassRateYear1) > 100) newErrors.plePassRateYear1 = 'Valid percentage (0-100) required';
    if (isNaN(parseFloat(plePassRateYear2)) || parseFloat(plePassRateYear2) < 0 || parseFloat(plePassRateYear2) > 100) newErrors.plePassRateYear2 = 'Valid percentage (0-100) required';
    if (isNaN(parseFloat(plePassRateYear3)) || parseFloat(plePassRateYear3) < 0 || parseFloat(plePassRateYear3) > 100) newErrors.plePassRateYear3 = 'Valid percentage (0-100) required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields and correct any errors.');
      return;
    }

    setIsLoading(true);

    const updatedSchool: School = {
      ...school,
      name,
      region,
      district,
      subCounty,
      location,
      type,
      environment,
      emisNumber,
      upiCode,
      ownershipType,
      schoolCategory,
      signatureProgram,
      yearEstablished: parseInt(yearEstablished),
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
        studentComputers: parseInt(studentComputers),
        teacherComputers: parseInt(teacherComputers),
        projectors: parseInt(projectors),
        smartBoards: parseInt(smartBoards),
        tablets: parseInt(tablets),
        laptops: parseInt(laptops),
        hasComputerLab,
        labCondition: hasComputerLab ? labCondition : 'Good',
        powerBackup,
        hasICTRoom,
        hasElectricity,
        hasSecureRoom,
        hasFurniture,
      },
      internetConnectivity: {
        connectionType,
        bandwidthMbps: connectionType !== 'None' ? parseFloat(bandwidthMbps) : 0,
        wifiCoverage,
        stability,
        hasUsagePolicy,
        provider: connectionType !== 'None' ? provider : '',
        isStable,
      },
      software: {
        hasLMS,
        lmsName: hasLMS ? lmsName : '',
        hasLicensedSoftware,
        licensedSoftware: hasLicensedSoftware ? licensedSoftware : [],
        hasProductivitySuite,
        productivitySuite: hasProductivitySuite ? productivitySuite : [],
        hasDigitalLibrary,
        hasLocalContent,
        contentSource: hasLocalContent ? contentSource : '',
      },
      humanCapacity: {
        ictTrainedTeachers: parseInt(ictTrainedTeachers),
        totalTeachers: parseInt(totalTeachers),
        maleTeachers: parseInt(maleTeachers),
        femaleTeachers: parseInt(femaleTeachers),
        p5ToP7Teachers: parseInt(p5ToP7Teachers),
        supportStaff: parseInt(supportStaff),
        monthlyTrainings: parseInt(monthlyTrainings),
        teacherCompetencyLevel,
        hasCapacityBuilding,
      },
      pedagogicalUsage: {
        ictIntegratedLessons: parseInt(ictIntegratedLessons),
        usesICTAssessments,
        hasStudentProjects,
        usesBlendedLearning,
        hasAssistiveTech,
        digitalToolUsageFrequency,
        hasDigitalContent,
        hasPeerSupport,
      },
      governance: {
        hasICTPolicy,
        alignedWithNationalStrategy,
        hasICTCommittee,
        hasICTBudget,
        hasMonitoringSystem,
        hasActiveSMC,
        hasActivePTA,
        hasLocalLeaderEngagement,
      },
      studentEngagement: {
        digitalLiteracyLevel,
        hasICTClub,
        usesOnlinePlatforms,
        studentFeedbackRating,
        studentsUsingDigitalContent: parseInt(studentsUsingDigitalContent),
      },
      communityEngagement: {
        hasParentPortal,
        hasCommunityOutreach,
        hasIndustryPartners,
        partnerOrganizations,
        ngoSupport,
        communityContributions,
      },
      security: {
        isFenced,
        hasSecurityGuard,
        hasRecentIncidents,
        incidentDetails: hasRecentIncidents ? incidentDetails : '',
        hasToilets,
        hasWaterSource,
      },
      accessibility: {
        distanceFromHQ: parseFloat(distanceFromHQ),
        isAccessibleAllYear,
        isInclusive,
        servesGirls,
        servesPWDs,
        servesRefugees,
        isOnlySchoolInArea,
      },
      facilities: {
        permanentClassrooms: parseInt(permanentClassrooms),
        semiPermanentClassrooms: parseInt(semiPermanentClassrooms),
        temporaryClassrooms: parseInt(temporaryClassrooms),
        pupilClassroomRatio: parseFloat(pupilClassroomRatio),
        boysToilets: parseInt(boysToilets),
        girlsToilets: parseInt(girlsToilets),
        staffToilets: parseInt(staffToilets),
        waterAccess,
        securityInfrastructure,
        schoolAccessibility,
        nearbyHealthFacility,
        healthFacilityDistance: parseFloat(healthFacilityDistance),
      },
      performance: {
        plePassRateYear1: parseFloat(plePassRateYear1),
        plePassRateYear2: parseFloat(plePassRateYear2),
        plePassRateYear3: parseFloat(plePassRateYear3),
        literacyTrends,
        numeracyTrends,
        innovations,
        uniqueAchievements,
      },
    };

    updateSchool(updatedSchool);

    Alert.alert('School Updated', 'School has been successfully updated.', [
      {
        text: 'OK',
        onPress: () => router.replace(`/schools/${id}`),
      },
    ]);
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Basic Information */}
          <SectionHeader title="Basic Information" icon={<Building size={20} color={colors.primary} />} />
          <Input label="School Name" value={name} onChangeText={setName} placeholder="Enter school name" error={errors.name} />

          <Text style={styles.label}>Region</Text>
          <View style={styles.buttonGroup}>
            {regions.map((item) => (
              <Button
                key={item}
                title={item}
                onPress={() => setRegion(item as typeof region)}
                variant={region === item ? 'primary' : 'outline'}
                style={styles.buttonGroupItem}
                size="small"
              />
            ))}
          </View>
          {errors.region && <Text style={styles.errorText}>{errors.region}</Text>}

          <Input label="District" value={district} onChangeText={setDistrict} placeholder="Enter district" error={errors.district} />
          <Input label="Sub-County" value={subCounty} onChangeText={setSubCounty} placeholder="Enter sub-county" error={errors.subCounty} />

          <Text style={styles.label}>School Type</Text>
          <View style={styles.buttonGroup}>
            <Button title="Public" onPress={() => setType('Public')} variant={type === 'Public' ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            <Button title="Private" onPress={() => setType('Private')} variant={type === 'Private' ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
          </View>

          <Text style={styles.label}>Environment</Text>
          <View style={styles.buttonGroup}>
            <Button title="Urban" onPress={() => setEnvironment('Urban')} variant={environment === 'Urban' ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            <Button title="Rural" onPress={() => setEnvironment('Rural')} variant={environment === 'Rural' ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
          </View>

          <Input label="EMIS Number" value={emisNumber} onChangeText={setEmisNumber} placeholder="Enter EMIS number" error={errors.emisNumber} />
          <Input label="UPI Code" value={upiCode} onChangeText={setUpiCode} placeholder="Enter UPI code" error={errors.upiCode} />

          <Text style={styles.label}>Ownership Type</Text>
          <View style={styles.buttonGroup}>
            {ownershipTypes.map((item) => (
              <Button key={item} title={item} onPress={() => setOwnershipType(item as typeof ownershipType)} variant={ownershipType === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>

          <Text style={styles.label}>School Category</Text>
          <View style={styles.buttonGroup}>
            {schoolCategories.map((item) => (
              <Button key={item} title={item} onPress={() => setSchoolCategory(item as typeof schoolCategory)} variant={schoolCategory === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>

          <Input label="Signature Program" value={signatureProgram} onChangeText={setSignatureProgram} placeholder="e.g., STEM, Arts" />
          <Input label="Year Established" value={yearEstablished} onChangeText={setYearEstablished} placeholder="e.g., 1990" keyboardType="numeric" error={errors.yearEstablished} />

          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <MapPin size={18} color={colors.primary} />
              <Text style={styles.locationTitle}>GPS Location</Text>
            </View>
            <Text style={styles.locationText}>Latitude: {location.latitude.toFixed(6)}</Text>
            <Text style={styles.locationText}>Longitude: {location.longitude.toFixed(6)}</Text>
            <Button
              title="Refresh Location"
              onPress={() => {
                const randomLat = 0.3 + Math.random() * 2;
                const randomLng = 30 + Math.random() * 3;
                setLocation({ latitude: randomLat, longitude: randomLng });
              }}
              variant="outline"
              style={styles.locationButton}
            />
          </View>

          {/* Enrollment Data */}
          <SectionHeader title="Enrollment Data" icon={<Users size={20} color={colors.primary} />} />
          <Input label="Total Students" value={totalStudents} onChangeText={setTotalStudents} placeholder="0" keyboardType="numeric" error={errors.totalStudents} />
          <View style={styles.row}>
            <Input label="Male Students" value={maleStudents} onChangeText={setMaleStudents} placeholder="0" keyboardType="numeric" error={errors.maleStudents} containerStyle={styles.halfWidth} />
            <Input label="Female Students" value={femaleStudents} onChangeText={setFemaleStudents} placeholder="0" keyboardType="numeric" error={errors.femaleStudents} containerStyle={styles.halfWidth} />
          </View>
          {errors.enrollmentMismatch && <Text style={styles.errorText}>{errors.enrollmentMismatch}</Text>}

          {/* Contact Information */}
          <SectionHeader title="Contact Information" icon={<Users size={20} color={colors.primary} />} />
          <Input label="Head Teacher Name" value={headTeacher} onChangeText={setHeadTeacher} placeholder="Enter head teacher's name" error={errors.headTeacher} />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="Enter email address" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" error={errors.phone} />

          {/* ICT Infrastructure */}
          <SectionHeader title="ICT Infrastructure" icon={<Laptop size={20} color={colors.primary} />} />
          <Input label="Student Computers" value={studentComputers} onChangeText={setStudentComputers} placeholder="0" keyboardType="numeric" error={errors.studentComputers} />
          <Input label="Teacher Computers" value={teacherComputers} onChangeText={setTeacherComputers} placeholder="0" keyboardType="numeric" error={errors.teacherComputers} />
          <Input label="Projectors" value={projectors} onChangeText={setProjectors} placeholder="0" keyboardType="numeric" error={errors.projectors} />
          <Input label="Smart Boards" value={smartBoards} onChangeText={setSmartBoards} placeholder="0" keyboardType="numeric" error={errors.smartBoards} />
          <Input label="Tablets" value={tablets} onChangeText={setTablets} placeholder="0" keyboardType="numeric" error={errors.tablets} />
          <Input label="Laptops" value={laptops} onChangeText={setLaptops} placeholder="0" keyboardType="numeric" error={errors.laptops} />

          <TouchableCheckbox label="Has Computer Lab" checked={hasComputerLab} onToggle={() => setHasComputerLab(!hasComputerLab)} />
          {hasComputerLab && (
            <>
              <Text style={styles.label}>Lab Condition</Text>
              <View style={styles.buttonGroup}>
                {labConditions.map((item) => (
                  <Button key={item} title={item} onPress={() => setLabCondition(item as typeof labCondition)} variant={labCondition === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
                ))}
              </View>
            </>
          )}

          <Text style={styles.label}>Power Backup Sources</Text>
          <View style={styles.checkboxContainer}>
            {powerBackupOptions.map((item) => (
              <TouchableCheckbox key={item} label={item} checked={powerBackup.includes(item)} onToggle={() => toggleArrayState(powerBackup, setPowerBackup, item)} />
            ))}
          </View>

          <TouchableCheckbox label="Has ICT Room" checked={hasICTRoom} onToggle={() => setHasICTRoom(!hasICTRoom)} />
          <TouchableCheckbox label="Has Electricity" checked={hasElectricity} onToggle={() => setHasElectricity(!hasElectricity)} />
          <TouchableCheckbox label="Has Secure Room" checked={hasSecureRoom} onToggle={() => setHasSecureRoom(!hasSecureRoom)} />
          <TouchableCheckbox label="Has Furniture" checked={hasFurniture} onToggle={() => setHasFurniture(!hasFurniture)} />

          {/* Internet Connectivity */}
          <SectionHeader title="Internet Connectivity" icon={<Wifi size={20} color={colors.primary} />} />
          <Text style={styles.label}>Connection Type</Text>
          <View style={styles.buttonGroup}>
            {connectionTypes.map((item) => (
              <Button key={item} title={item} onPress={() => setConnectionType(item as typeof connectionType)} variant={connectionType === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>
          {connectionType !== 'None' && (
            <>
              <Input label="Bandwidth (Mbps)" value={bandwidthMbps} onChangeText={setBandwidthMbps} placeholder="0" keyboardType="numeric" error={errors.bandwidthMbps} />
              <Input label="Provider" value={provider} onChangeText={setProvider} placeholder="e.g., MTN, Airtel" error={errors.provider} />
              <Text style={styles.label}>Stability</Text>
              <View style={styles.buttonGroup}>
                {stabilityOptions.map((item) => (
                  <Button key={item} title={item} onPress={() => setStability(item as typeof stability)} variant={stability === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
                ))}
              </View>
              <TouchableCheckbox label="Is Stable" checked={isStable} onToggle={() => setIsStable(!isStable)} />
              <Text style={styles.label}>WiFi Coverage Areas</Text>
              <View style={styles.checkboxContainer}>
                {wifiCoverageOptions.map((item) => (
                  <TouchableCheckbox key={item} label={item} checked={wifiCoverage.includes(item)} onToggle={() => toggleArrayState(wifiCoverage, setWifiCoverage, item)} />
                ))}
              </View>
              <TouchableCheckbox label="Has Usage Policy" checked={hasUsagePolicy} onToggle={() => setHasUsagePolicy(!hasUsagePolicy)} />
            </>
          )}

          {/* ICT Software and Digital Resources */}
          <SectionHeader title="Software & Digital Resources" icon={<HardDrive size={20} color={colors.primary} />} />
          <TouchableCheckbox label="Has Learning Management System (LMS)" checked={hasLMS} onToggle={() => setHasLMS(!hasLMS)} />
          {hasLMS && <Input label="LMS Name" value={lmsName} onChangeText={setLmsName} placeholder="e.g., Moodle, Google Classroom" />}
          <TouchableCheckbox label="Has Licensed Software" checked={hasLicensedSoftware} onToggle={() => setHasLicensedSoftware(!hasLicensedSoftware)} />
          {hasLicensedSoftware && (
            <>
              <Text style={styles.label}>Licensed Software</Text>
              <View style={styles.checkboxContainer}>
                {licensedSoftwareOptions.map((item) => (
                  <TouchableCheckbox key={item} label={item} checked={licensedSoftware.includes(item)} onToggle={() => toggleArrayState(licensedSoftware, setLicensedSoftware, item)} />
                ))}
              </View>
            </>
          )}
          <TouchableCheckbox label="Has Productivity Suite" checked={hasProductivitySuite} onToggle={() => setHasProductivitySuite(!hasProductivitySuite)} />
          {hasProductivitySuite && (
            <>
              <Text style={styles.label}>Productivity Suite</Text>
              <View style={styles.checkboxContainer}>
                {productivitySuiteOptions.map((item) => (
                  <TouchableCheckbox key={item} label={item} checked={productivitySuite.includes(item)} onToggle={() => toggleArrayState(productivitySuite, setProductivitySuite, item)} />
                ))}
              </View>
            </>
          )}
          <TouchableCheckbox label="Has Digital Library" checked={hasDigitalLibrary} onToggle={() => setHasDigitalLibrary(!hasDigitalLibrary)} />
          <TouchableCheckbox label="Has Local Content" checked={hasLocalContent} onToggle={() => setHasLocalContent(!hasLocalContent)} />
          {hasLocalContent && <Input label="Content Source" value={contentSource} onChangeText={setContentSource} placeholder="e.g., UNEB, NCDC" />}

          {/* Human Capacity and ICT Competency */}
          <SectionHeader title="Human Capacity & ICT Competency" icon={<GraduationCap size={20} color={colors.primary} />} />
          <Input label="ICT Trained Teachers" value={ictTrainedTeachers} onChangeText={setIctTrainedTeachers} placeholder="0" keyboardType="numeric" error={errors.ictTrainedTeachers} />
          <Input label="Total Teachers" value={totalTeachers} onChangeText={setTotalTeachersHumanCapacity} placeholder="0" keyboardType="numeric" error={errors.totalTeachers} />
          <View style={styles.row}>
            <Input label="Male Teachers" value={maleTeachers} onChangeText={setMaleTeachersHumanCapacity} placeholder="0" keyboardType="numeric" error={errors.maleTeachers} containerStyle={styles.halfWidth} />
            <Input label="Female Teachers" value={femaleTeachers} onChangeText={setFemaleTeachersHumanCapacity} placeholder="0" keyboardType="numeric" error={errors.femaleTeachers} containerStyle={styles.halfWidth} />
          </View>
          <Input label="P5 to P7 Teachers" value={p5ToP7Teachers} onChangeText={setP5ToP7Teachers} placeholder="0" keyboardType="numeric" error={errors.p5ToP7Teachers} />
          <Input label="Support Staff" value={supportStaff} onChangeText={setSupportStaff} placeholder="0" keyboardType="numeric" error={errors.supportStaff} />
          <Input label="Monthly Trainings" value={monthlyTrainings} onChangeText={setMonthlyTrainings} placeholder="0" keyboardType="numeric" error={errors.monthlyTrainings} />
          <Text style={styles.label}>Teacher Competency Level</Text>
          <View style={styles.buttonGroup}>
            {teacherCompetencyLevels.map((item) => (
              <Button key={item} title={item} onPress={() => setTeacherCompetencyLevel(item as typeof teacherCompetencyLevel)} variant={teacherCompetencyLevel === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>
          <TouchableCheckbox label="Has Capacity Building" checked={hasCapacityBuilding} onToggle={() => setHasCapacityBuilding(!hasCapacityBuilding)} />

          {/* Pedagogical ICT Usage */}
          <SectionHeader title="Pedagogical ICT Usage" icon={<BookOpen size={20} color={colors.primary} />} />
          <Input label="ICT Integrated Lessons" value={ictIntegratedLessons} onChangeText={setIctIntegratedLessons} placeholder="0" keyboardType="numeric" error={errors.ictIntegratedLessons} />
          <TouchableCheckbox label="Uses ICT Assessments" checked={usesICTAssessments} onToggle={() => setUsesICTAssessments(!usesICTAssessments)} />
          <TouchableCheckbox label="Has Student Projects" checked={hasStudentProjects} onToggle={() => setHasStudentProjects(!hasStudentProjects)} />
          <TouchableCheckbox label="Uses Blended Learning" checked={usesBlendedLearning} onToggle={() => setUsesBlendedLearning(!usesBlendedLearning)} />
          <TouchableCheckbox label="Has Assistive Technology" checked={hasAssistiveTech} onToggle={() => setHasAssistiveTech(!hasAssistiveTech)} />
          <Text style={styles.label}>Digital Tool Usage Frequency</Text>
          <View style={styles.buttonGroup}>
            {digitalToolUsageFrequencies.map((item) => (
              <Button key={item} title={item} onPress={() => setDigitalToolUsageFrequency(item as typeof digitalToolUsageFrequency)} variant={digitalToolUsageFrequency === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>
          <TouchableCheckbox label="Has Digital Content" checked={hasDigitalContent} onToggle={() => setHasDigitalContent(!hasDigitalContent)} />
          <TouchableCheckbox label="Has Peer Support" checked={hasPeerSupport} onToggle={() => setHasPeerSupport(!hasPeerSupport)} />

          {/* ICT Governance and Policy */}
          <SectionHeader title="ICT Governance & Policy" icon={<Shield size={20} color={colors.primary} />} />
          <TouchableCheckbox label="Has ICT Policy" checked={hasICTPolicy} onToggle={() => setHasICTPolicy(!hasICTPolicy)} />
          <TouchableCheckbox label="Aligned with National Strategy" checked={alignedWithNationalStrategy} onToggle={() => setAlignedWithNationalStrategy(!alignedWithNationalStrategy)} />
          <TouchableCheckbox label="Has ICT Committee" checked={hasICTCommittee} onToggle={() => setHasICTCommittee(!hasICTCommittee)} />
          <TouchableCheckbox label="Has ICT Budget" checked={hasICTBudget} onToggle={() => setHasICTBudget(!hasICTBudget)} />
          <TouchableCheckbox label="Has Monitoring System" checked={hasMonitoringSystem} onToggle={() => setHasMonitoringSystem(!hasMonitoringSystem)} />
          <TouchableCheckbox label="Has Active SMC" checked={hasActiveSMC} onToggle={() => setHasActiveSMC(!hasActiveSMC)} />
          <TouchableCheckbox label="Has Active PTA" checked={hasActivePTA} onToggle={() => setHasActivePTA(!hasActivePTA)} />
          <TouchableCheckbox label="Has Local Leader Engagement" checked={hasLocalLeaderEngagement} onToggle={() => setHasLocalLeaderEngagement(!hasLocalLeaderEngagement)} />

          {/* Students' Digital Literacy and Engagement */}
          <SectionHeader title="Students' Digital Literacy & Engagement" icon={<Users size={20} color={colors.primary} />} />
          <Text style={styles.label}>Digital Literacy Level</Text>
          <View style={styles.buttonGroup}>
            {digitalLiteracyLevels.map((item) => (
              <Button key={item} title={item} onPress={() => setDigitalLiteracyLevel(item as typeof digitalLiteracyLevel)} variant={digitalLiteracyLevel === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>
          <TouchableCheckbox label="Has ICT Club" checked={hasICTClub} onToggle={() => setHasICTClub(!hasICTClub)} />
          <TouchableCheckbox label="Uses Online Platforms" checked={usesOnlinePlatforms} onToggle={() => setUsesOnlinePlatforms(!usesOnlinePlatforms)} />
          <Text style={styles.label}>Student Feedback Rating (1-5)</Text>
          <View style={styles.buttonGroup}>
            {studentFeedbackRatings.map((item) => (
              <Button key={item} title={item.toString()} onPress={() => setStudentFeedbackRating(item as typeof studentFeedbackRating)} variant={studentFeedbackRating === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>
          <Input label="Students Using Digital Content" value={studentsUsingDigitalContent} onChangeText={setStudentsUsingDigitalContent} placeholder="0" keyboardType="numeric" error={errors.studentsUsingDigitalContent} />

          {/* Community and Parental Engagement */}
          <SectionHeader title="Community & Parental Engagement" icon={<Globe size={20} color={colors.primary} />} />
          <TouchableCheckbox label="Has Parent Portal" checked={hasParentPortal} onToggle={() => setHasParentPortal(!hasParentPortal)} />
          <TouchableCheckbox label="Has Community Outreach" checked={hasCommunityOutreach} onToggle={() => setHasCommunityOutreach(!hasCommunityOutreach)} />
          <TouchableCheckbox label="Has Industry Partners" checked={hasIndustryPartners} onToggle={() => setHasIndustryPartners(!hasIndustryPartners)} />
          <Text style={styles.label}>Partner Organizations</Text>
          <View style={styles.checkboxContainer}>
            {partnerOrganizationsOptions.map((item) => (
              <TouchableCheckbox key={item} label={item} checked={partnerOrganizations.includes(item)} onToggle={() => toggleArrayState(partnerOrganizations, setPartnerOrganizations, item)} />
            ))}
          </View>
          <Text style={styles.label}>NGO Support</Text>
          <View style={styles.checkboxContainer}>
            {ngoSupportOptions.map((item) => (
              <TouchableCheckbox key={item} label={item} checked={ngoSupport.includes(item)} onToggle={() => toggleArrayState(ngoSupport, setNgoSupport, item)} />
            ))}
          </View>
          <Text style={styles.label}>Community Contributions</Text>
          <View style={styles.checkboxContainer}>
            {communityContributionsOptions.map((item) => (
              <TouchableCheckbox key={item} label={item} checked={communityContributions.includes(item)} onToggle={() => toggleArrayState(communityContributions, setCommunityContributions, item)} />
            ))}
          </View>

          {/* Security & Safety */}
          <SectionHeader title="Security & Safety" icon={<Shield size={20} color={colors.primary} />} />
          <TouchableCheckbox label="Is Fenced" checked={isFenced} onToggle={() => setIsFenced(!isFenced)} />
          <TouchableCheckbox label="Has Security Guard" checked={hasSecurityGuard} onToggle={() => setHasSecurityGuard(!hasSecurityGuard)} />
          <TouchableCheckbox label="Has Recent Incidents" checked={hasRecentIncidents} onToggle={() => setHasRecentIncidents(!hasRecentIncidents)} />
          {hasRecentIncidents && <Input label="Incident Details" value={incidentDetails} onChangeText={setIncidentDetails} placeholder="Describe incidents" error={errors.incidentDetails} />}
          <TouchableCheckbox label="Has Toilets" checked={hasToilets} onToggle={() => setHasToilets(!hasToilets)} />
          <TouchableCheckbox label="Has Water Source" checked={hasWaterSource} onToggle={() => setHasWaterSource(!hasWaterSource)} />

          {/* Accessibility */}
          <SectionHeader title="Accessibility" icon={<MapPin size={20} color={colors.primary} />} />
          <Input label="Distance from HQ (km)" value={distanceFromHQ} onChangeText={setDistanceFromHQ} placeholder="0" keyboardType="numeric" error={errors.distanceFromHQ} />
          <TouchableCheckbox label="Accessible All Year" checked={isAccessibleAllYear} onToggle={() => setIsAccessibleAllYear(!isAccessibleAllYear)} />
          <TouchableCheckbox label="Is Inclusive" checked={isInclusive} onToggle={() => setIsInclusive(!isInclusive)} />
          <TouchableCheckbox label="Serves Girls" checked={servesGirls} onToggle={() => setServesGirls(!servesGirls)} />
          <TouchableCheckbox label="Serves PWDs" checked={servesPWDs} onToggle={() => setServesPWDs(!servesPWDs)} />
          <TouchableCheckbox label="Serves Refugees" checked={servesRefugees} onToggle={() => setServesRefugees(!servesRefugees)} />
          <TouchableCheckbox label="Is Only School in Area" checked={isOnlySchoolInArea} onToggle={() => setIsOnlySchoolInArea(!isOnlySchoolInArea)} />

          {/* School Facilities & Environment */}
          <SectionHeader title="School Facilities & Environment" icon={<Building size={20} color={colors.primary} />} />
          <Input label="Permanent Classrooms" value={permanentClassrooms} onChangeText={setPermanentClassrooms} placeholder="0" keyboardType="numeric" error={errors.permanentClassrooms} />
          <Input label="Semi-Permanent Classrooms" value={semiPermanentClassrooms} onChangeText={setSemiPermanentClassrooms} placeholder="0" keyboardType="numeric" error={errors.semiPermanentClassrooms} />
          <Input label="Temporary Classrooms" value={temporaryClassrooms} onChangeText={setTemporaryClassrooms} placeholder="0" keyboardType="numeric" error={errors.temporaryClassrooms} />
          <Input label="Pupil-Classroom Ratio" value={pupilClassroomRatio} onChangeText={setPupilClassroomRatio} placeholder="0" keyboardType="numeric" error={errors.pupilClassroomRatio} />
          <Input label="Boys Toilets" value={boysToilets} onChangeText={setBoysToilets} placeholder="0" keyboardType="numeric" error={errors.boysToilets} />
          <Input label="Girls Toilets" value={girlsToilets} onChangeText={setGirlsToilets} placeholder="0" keyboardType="numeric" error={errors.girlsToilets} />
          <Input label="Staff Toilets" value={staffToilets} onChangeText={setStaffToilets} placeholder="0" keyboardType="numeric" error={errors.staffToilets} />
          <Text style={styles.label}>Water Access</Text>
          <View style={styles.buttonGroup}>
            {waterAccessOptions.map((item) => (
              <Button key={item} title={item} onPress={() => setWaterAccess(item as typeof waterAccess)} variant={waterAccess === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>
          <Text style={styles.label}>Security Infrastructure</Text>
          <View style={styles.checkboxContainer}>
            {securityInfrastructureOptions.map((item) => (
              <TouchableCheckbox key={item} label={item} checked={securityInfrastructure.includes(item)} onToggle={() => toggleArrayState(securityInfrastructure, setSecurityInfrastructure, item)} />
            ))}
          </View>
          <Text style={styles.label}>School Accessibility</Text>
          <View style={styles.buttonGroup}>
            {schoolAccessibilityOptions.map((item) => (
              <Button key={item} title={item} onPress={() => setSchoolAccessibility(item as typeof schoolAccessibility)} variant={schoolAccessibility === item ? 'primary' : 'outline'} style={styles.buttonGroupItem} size="small" />
            ))}
          </View>
          <Input label="Nearby Health Facility" value={nearbyHealthFacility} onChangeText={setNearbyHealthFacility} placeholder="e.g., Clinic, Hospital" />
          <Input label="Health Facility Distance (km)" value={healthFacilityDistance} onChangeText={setHealthFacilityDistance} placeholder="0" keyboardType="numeric" error={errors.healthFacilityDistance} />

          {/* Performance */}
          <SectionHeader title="Performance" icon={<Zap size={20} color={colors.primary} />} />
          <Input label="PLE Pass Rate Year 1 (%)" value={plePassRateYear1} onChangeText={setPlePassRateYear1} placeholder="0-100" keyboardType="numeric" error={errors.plePassRateYear1} />
          <Input label="PLE Pass Rate Year 2 (%)" value={plePassRateYear2} onChangeText={setPlePassRateYear2} placeholder="0-100" keyboardType="numeric" error={errors.plePassRateYear2} />
          <Input label="PLE Pass Rate Year 3 (%)" value={plePassRateYear3} onChangeText={setPlePassRateYear3} placeholder="0-100" keyboardType="numeric" error={errors.plePassRateYear3} />
          <Input label="Literacy Trends" value={literacyTrends} onChangeText={setLiteracyTrends} placeholder="e.g., Improving, Stable" />
          <Input label="Numeracy Trends" value={numeracyTrends} onChangeText={setNumeracyTrends} placeholder="e.g., Improving, Stable" />
          <Input label="Innovations" value={innovations} onChangeText={setInnovations} placeholder="Describe innovations" />
          <Input label="Unique Achievements" value={uniqueAchievements} onChangeText={setUniqueAchievements} placeholder="Describe achievements" />

          <View style={styles.submitContainer}>
            <Button title="Save Changes" onPress={handleSubmit} loading={isLoading} style={styles.submitButton} />
            <Button title="Cancel" onPress={() => router.back()} variant="outline" style={styles.cancelButton} />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  buttonGroupItem: {
    minWidth: 80,
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
  checkboxContainer: {
    marginBottom: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: colors.card,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 2,
    fontWeight: '500',
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