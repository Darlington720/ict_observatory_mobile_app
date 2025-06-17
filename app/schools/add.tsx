import Button from "@/components/Button";
import Input from "@/components/Input";
import { colors } from "@/constants/Colors";
import { useSchoolStore } from "@/store/schoolStore";
import { School } from "@/types";
import { generateId } from "@/utils/sync";
import { useRouter } from "expo-router";
import { 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  School as SchoolIcon,
  Users,
  Laptop,
  Wifi,
  BookOpen,
  Shield,
  Heart,
  Building,
  TrendingUp,
  Globe
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: SchoolIcon, description: 'School details & location' },
  { id: 'enrollment', title: 'Enrollment', icon: Users, description: 'Students & contact info' },
  { id: 'infrastructure', title: 'ICT Setup', icon: Laptop, description: 'Computers & equipment' },
  { id: 'connectivity', title: 'Internet', icon: Wifi, description: 'Network & connectivity' },
  { id: 'software', title: 'Software', icon: BookOpen, description: 'Digital resources' },
  { id: 'capacity', title: 'Capacity', icon: Shield, description: 'Teachers & training' },
  { id: 'governance', title: 'Governance', icon: Building, description: 'Policies & management' },
  { id: 'community', title: 'Community', icon: Heart, description: 'Engagement & safety' },
  { id: 'facilities', title: 'Facilities', icon: Globe, description: 'Infrastructure & access' },
  { id: 'performance', title: 'Performance', icon: TrendingUp, description: 'Academic outcomes' },
];

export default function AddSchoolScreen() {
  const router = useRouter();
  const { addSchool } = useSchoolStore();

  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [animatedValue] = useState(new Animated.Value(0));

  // Basic Information
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [type, setType] = useState<"Public" | "Private">("Public");
  const [environment, setEnvironment] = useState<"Urban" | "Rural">("Urban");
  const [emisNumber, setEmisNumber] = useState("");
  const [upiCode, setUpiCode] = useState("");
  const [ownershipType, setOwnershipType] = useState<"Government" | "Government-aided" | "Community" | "Private">("Government");
  const [schoolCategory, setSchoolCategory] = useState<"Mixed" | "Girls" | "Boys" | "Special Needs">("Mixed");
  const [signatureProgram, setSignatureProgram] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");

  // Enrollment & Contact
  const [headTeacher, setHeadTeacher] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalStudents, setTotalStudents] = useState("");
  const [maleStudents, setMaleStudents] = useState("");
  const [femaleStudents, setFemaleStudents] = useState("");

  // ICT Infrastructure
  const [studentComputers, setStudentComputers] = useState("0");
  const [teacherComputers, setTeacherComputers] = useState("0");
  const [projectors, setProjectors] = useState("0");
  const [smartBoards, setSmartBoards] = useState("0");
  const [tablets, setTablets] = useState("0");
  const [laptops, setLaptops] = useState("0");
  const [hasComputerLab, setHasComputerLab] = useState(false);
  const [labCondition, setLabCondition] = useState<"Excellent" | "Good" | "Fair" | "Poor">("Good");
  const [powerBackup, setPowerBackup] = useState<string[]>([]);
  const [hasICTRoom, setHasICTRoom] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasSecureRoom, setHasSecureRoom] = useState(false);
  const [hasFurniture, setHasFurniture] = useState(false);

  // Internet Connectivity
  const [connectionType, setConnectionType] = useState<"None" | "Fiber" | "Mobile Broadband" | "Satellite">("None");
  const [bandwidthMbps, setBandwidthMbps] = useState("0");
  const [wifiCoverage, setWifiCoverage] = useState<string[]>([]);
  const [stability, setStability] = useState<"High" | "Medium" | "Low">("Medium");
  const [hasUsagePolicy, setHasUsagePolicy] = useState(false);
  const [provider, setProvider] = useState("");
  const [isStable, setIsStable] = useState(false);

  // Software & Digital Resources
  const [hasLMS, setHasLMS] = useState(false);
  const [lmsName, setLmsName] = useState("");
  const [hasLicensedSoftware, setHasLicensedSoftware] = useState(false);
  const [licensedSoftware, setLicensedSoftware] = useState<string[]>([]);
  const [hasProductivitySuite, setHasProductivitySuite] = useState(false);
  const [productivitySuite, setProductivitySuite] = useState<string[]>([]);
  const [hasDigitalLibrary, setHasDigitalLibrary] = useState(false);
  const [hasLocalContent, setHasLocalContent] = useState(false);
  const [contentSource, setContentSource] = useState("");

  // Human Capacity
  const [ictTrainedTeachers, setIctTrainedTeachers] = useState("0");
  const [totalTeachers, setTotalTeachers] = useState("0");
  const [maleTeachers, setMaleTeachers] = useState("0");
  const [femaleTeachers, setFemaleTeachers] = useState("0");
  const [p5ToP7Teachers, setP5ToP7Teachers] = useState("0");
  const [supportStaff, setSupportStaff] = useState("0");
  const [monthlyTrainings, setMonthlyTrainings] = useState("0");
  const [teacherCompetencyLevel, setTeacherCompetencyLevel] = useState<"Basic" | "Intermediate" | "Advanced">("Basic");
  const [hasCapacityBuilding, setHasCapacityBuilding] = useState(false);

  // Pedagogical Usage
  const [ictIntegratedLessons, setIctIntegratedLessons] = useState("0");
  const [usesICTAssessments, setUsesICTAssessments] = useState(false);
  const [hasStudentProjects, setHasStudentProjects] = useState(false);
  const [usesBlendedLearning, setUsesBlendedLearning] = useState(false);
  const [hasAssistiveTech, setHasAssistiveTech] = useState(false);
  const [digitalToolUsageFrequency, setDigitalToolUsageFrequency] = useState<"Daily" | "Weekly" | "Rarely" | "Never">("Rarely");
  const [hasDigitalContent, setHasDigitalContent] = useState(false);
  const [hasPeerSupport, setHasPeerSupport] = useState(false);

  // Governance & Policy
  const [hasICTPolicy, setHasICTPolicy] = useState(false);
  const [alignedWithNationalStrategy, setAlignedWithNationalStrategy] = useState(false);
  const [hasICTCommittee, setHasICTCommittee] = useState(false);
  const [hasICTBudget, setHasICTBudget] = useState(false);
  const [hasMonitoringSystem, setHasMonitoringSystem] = useState(false);
  const [hasActiveSMC, setHasActiveSMC] = useState(false);
  const [hasActivePTA, setHasActivePTA] = useState(false);
  const [hasLocalLeaderEngagement, setHasLocalLeaderEngagement] = useState(false);

  // Student Engagement
  const [digitalLiteracyLevel, setDigitalLiteracyLevel] = useState<"Basic" | "Intermediate" | "Advanced">("Basic");
  const [hasICTClub, setHasICTClub] = useState(false);
  const [usesOnlinePlatforms, setUsesOnlinePlatforms] = useState(false);
  const [studentFeedbackRating, setStudentFeedbackRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [studentsUsingDigitalContent, setStudentsUsingDigitalContent] = useState("0");

  // Community Engagement
  const [hasParentPortal, setHasParentPortal] = useState(false);
  const [hasCommunityOutreach, setHasCommunityOutreach] = useState(false);
  const [hasIndustryPartners, setHasIndustryPartners] = useState(false);
  const [partnerOrganizations, setPartnerOrganizations] = useState<string[]>([]);
  const [ngoSupport, setNgoSupport] = useState<string[]>([]);
  const [communityContributions, setCommunityContributions] = useState<string[]>([]);

  // Security & Safety
  const [isFenced, setIsFenced] = useState(false);
  const [hasSecurityGuard, setHasSecurityGuard] = useState(false);
  const [hasRecentIncidents, setHasRecentIncidents] = useState(false);
  const [incidentDetails, setIncidentDetails] = useState("");
  const [hasToilets, setHasToilets] = useState(true);
  const [hasWaterSource, setHasWaterSource] = useState(true);

  // Accessibility
  const [distanceFromHQ, setDistanceFromHQ] = useState("0");
  const [isAccessibleAllYear, setIsAccessibleAllYear] = useState(true);
  const [isInclusive, setIsInclusive] = useState(false);
  const [servesGirls, setServesGirls] = useState(true);
  const [servesPWDs, setServesPWDs] = useState(false);
  const [servesRefugees, setServesRefugees] = useState(false);
  const [isOnlySchoolInArea, setIsOnlySchoolInArea] = useState(false);

  // Facilities
  const [permanentClassrooms, setPermanentClassrooms] = useState("0");
  const [semiPermanentClassrooms, setSemiPermanentClassrooms] = useState("0");
  const [temporaryClassrooms, setTemporaryClassrooms] = useState("0");
  const [pupilClassroomRatio, setPupilClassroomRatio] = useState("0");
  const [boysToilets, setBoysToilets] = useState("0");
  const [girlsToilets, setGirlsToilets] = useState("0");
  const [staffToilets, setStaffToilets] = useState("0");
  const [waterAccess, setWaterAccess] = useState<"Borehole" | "Tap" | "Rainwater" | "None">("None");
  const [securityInfrastructure, setSecurityInfrastructure] = useState<string[]>([]);
  const [schoolAccessibility, setSchoolAccessibility] = useState<"All-Weather" | "Seasonal" | "Remote">("All-Weather");
  const [nearbyHealthFacility, setNearbyHealthFacility] = useState("");
  const [healthFacilityDistance, setHealthFacilityDistance] = useState("0");

  // Performance
  const [plePassRateYear1, setPlePassRateYear1] = useState("0");
  const [plePassRateYear2, setPlePassRateYear2] = useState("0");
  const [plePassRateYear3, setPlePassRateYear3] = useState("0");
  const [literacyTrends, setLiteracyTrends] = useState("");
  const [numeracyTrends, setNumeracyTrends] = useState("");
  const [innovations, setInnovations] = useState("");
  const [uniqueAchievements, setUniqueAchievements] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize location
  useEffect(() => {
    const randomLat = (0.3 + Math.random() * 2).toFixed(6);
    const randomLng = (30 + Math.random() * 3).toFixed(6);
    setLatitude(randomLat);
    setLongitude(randomLng);
  }, []);

  // Animate step transition
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Basic Info
        if (!name.trim()) newErrors.name = "School name is required";
        if (!district.trim()) newErrors.district = "District is required";
        if (!subCounty.trim()) newErrors.subCounty = "Sub-county is required";
        if (!latitude.trim() || isNaN(parseFloat(latitude))) newErrors.latitude = "Valid latitude required";
        if (!longitude.trim() || isNaN(parseFloat(longitude))) newErrors.longitude = "Valid longitude required";
        if (yearEstablished && (isNaN(parseInt(yearEstablished)) || parseInt(yearEstablished) < 1900 || parseInt(yearEstablished) > new Date().getFullYear())) {
          newErrors.yearEstablished = "Enter a valid year";
        }
        break;

      case 1: // Enrollment
        const totalStudentsNum = parseInt(totalStudents);
        const maleStudentsNum = parseInt(maleStudents);
        const femaleStudentsNum = parseInt(femaleStudents);

        if (isNaN(totalStudentsNum) || totalStudentsNum < 0) {
          newErrors.totalStudents = "Total students must be a positive number";
        }
        if (isNaN(maleStudentsNum) || maleStudentsNum < 0) {
          newErrors.maleStudents = "Male students must be a positive number";
        }
        if (isNaN(femaleStudentsNum) || femaleStudentsNum < 0) {
          newErrors.femaleStudents = "Female students must be a positive number";
        }
        if (maleStudentsNum + femaleStudentsNum !== totalStudentsNum) {
          newErrors.totalStudents = "Total must equal male + female students";
        }
        if (!headTeacher.trim()) newErrors.headTeacher = "Head teacher name is required";
        if (email && !/\S+@\S+\.\S+/.test(email)) {
          newErrors.email = "Invalid email address";
        }
        if (!phone.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ""))) {
          newErrors.phone = "Invalid phone number";
        }
        break;

      case 5: // Capacity
        const totalTeachersNum = parseInt(totalTeachers);
        const maleTeachersNum = parseInt(maleTeachers);
        const femaleTeachersNum = parseInt(femaleTeachers);
        const ictTrainedNum = parseInt(ictTrainedTeachers);

        if (isNaN(totalTeachersNum) || totalTeachersNum < 0) {
          newErrors.totalTeachers = "Total teachers must be a positive number";
        }
        if (isNaN(maleTeachersNum) || maleTeachersNum < 0) {
          newErrors.maleTeachers = "Male teachers must be a positive number";
        }
        if (isNaN(femaleTeachersNum) || femaleTeachersNum < 0) {
          newErrors.femaleTeachers = "Female teachers must be a positive number";
        }
        if (maleTeachersNum + femaleTeachersNum !== totalTeachersNum) {
          newErrors.totalTeachers = "Total must equal male + female teachers";
        }
        if (ictTrainedNum > totalTeachersNum) {
          newErrors.ictTrainedTeachers = "Cannot exceed total teachers";
        }
        break;

      case 3: // Connectivity
        if (connectionType !== "None") {
          if (isNaN(parseFloat(bandwidthMbps)) || parseFloat(bandwidthMbps) < 0) {
            newErrors.bandwidthMbps = "Enter a valid bandwidth";
          }
          if (!provider.trim()) {
            newErrors.provider = "Provider is required";
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepPress = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);

    const newSchool: School = {
      id: generateId(),
      name,
      region,
      district,
      subCounty,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      type,
      environment,
      emisNumber,
      upiCode,
      ownershipType,
      schoolCategory,
      signatureProgram,
      yearEstablished: yearEstablished ? parseInt(yearEstablished) : 0,

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
        labCondition,
        powerBackup,
        hasICTRoom,
        hasElectricity,
        hasSecureRoom,
        hasFurniture,
      },

      internetConnectivity: {
        connectionType,
        bandwidthMbps: parseFloat(bandwidthMbps),
        wifiCoverage,
        stability,
        hasUsagePolicy,
        provider,
        isStable,
      },

      software: {
        hasLMS,
        lmsName,
        hasLicensedSoftware,
        licensedSoftware,
        hasProductivitySuite,
        productivitySuite,
        hasDigitalLibrary,
        hasLocalContent,
        contentSource,
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
        incidentDetails,
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

      synced: false,
      lastUpdated: new Date().toISOString(),
    };

    addSchool(newSchool);

    Alert.alert("School Added", "School has been successfully added with all information.", [
      {
        text: "OK",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  // Custom checkbox component
  const TouchableCheckbox = ({
    label,
    checked,
    onToggle,
    description,
  }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
    description?: string;
  }) => {
    return (
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.checkboxBox, checked && styles.checkboxChecked]}>
          {checked && <Check size={14} color={colors.card} />}
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxLabel}>{label}</Text>
          {description && <Text style={styles.checkboxDescription}>{description}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepScrollContent}
      >
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = index === currentStep;
          const isAccessible = index <= currentStep || isCompleted;
          const IconComponent = step.icon;

          return (
            <TouchableOpacity
              key={step.id}
              style={styles.stepItem}
              onPress={() => handleStepPress(index)}
              disabled={!isAccessible}
              activeOpacity={0.7}
            >
              <View style={[
                styles.stepCircle,
                isCompleted && styles.stepCompleted,
                isCurrent && styles.stepCurrent,
                !isAccessible && styles.stepDisabled,
              ]}>
                {isCompleted ? (
                  <Check size={14} color={colors.card} />
                ) : (
                  <IconComponent 
                    size={14} 
                    color={isCurrent ? colors.card : isAccessible ? colors.primary : colors.disabled} 
                  />
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                isCompleted && styles.stepLabelCompleted,
                isCurrent && styles.stepLabelCurrent,
                !isAccessible && styles.stepLabelDisabled,
              ]}>
                {step.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>School Information</Text>
      <Text style={styles.stepDescription}>
        Enter the basic details about the school
      </Text>

      <Input
        label="School Name *"
        value={name}
        onChangeText={setName}
        placeholder="Enter school name"
        error={errors.name}
      />

      <View style={styles.row}>
        <Input
          label="Region"
          value={region}
          onChangeText={setRegion}
          placeholder="Enter region"
          containerStyle={styles.halfWidth}
        />
        <Input
          label="District *"
          value={district}
          onChangeText={setDistrict}
          placeholder="Enter district"
          error={errors.district}
          containerStyle={styles.halfWidth}
        />
      </View>

      <Input
        label="Sub-County *"
        value={subCounty}
        onChangeText={setSubCounty}
        placeholder="Enter sub-county"
        error={errors.subCounty}
      />

      <View style={styles.row}>
        <Input
          label="EMIS Number"
          value={emisNumber}
          onChangeText={setEmisNumber}
          placeholder="Enter EMIS number"
          containerStyle={styles.halfWidth}
        />
        <Input
          label="UPI Code"
          value={upiCode}
          onChangeText={setUpiCode}
          placeholder="Enter UPI code"
          containerStyle={styles.halfWidth}
        />
      </View>

      <Input
        label="Year Established"
        value={yearEstablished}
        onChangeText={setYearEstablished}
        placeholder="Enter year"
        keyboardType="numeric"
        error={errors.yearEstablished}
      />

      <View style={styles.selectionGroup}>
        <Text style={styles.label}>School Type</Text>
        <View style={styles.buttonGroup}>
          <Button
            title="Public"
            onPress={() => setType("Public")}
            variant={type === "Public" ? "primary" : "outline"}
            style={styles.selectionButton}
            size="small"
          />
          <Button
            title="Private"
            onPress={() => setType("Private")}
            variant={type === "Private" ? "primary" : "outline"}
            style={styles.selectionButton}
            size="small"
          />
        </View>
      </View>

      <View style={styles.selectionGroup}>
        <Text style={styles.label}>Environment</Text>
        <View style={styles.buttonGroup}>
          <Button
            title="Urban"
            onPress={() => setEnvironment("Urban")}
            variant={environment === "Urban" ? "primary" : "outline"}
            style={styles.selectionButton}
            size="small"
          />
          <Button
            title="Rural"
            onPress={() => setEnvironment("Rural")}
            variant={environment === "Rural" ? "primary" : "outline"}
            style={styles.selectionButton}
            size="small"
          />
        </View>
      </View>

      <View style={styles.selectionGroup}>
        <Text style={styles.label}>Ownership Type</Text>
        <View style={styles.buttonGroup}>
          {["Government", "Government-aided", "Community", "Private"].map((ownership) => (
            <Button
              key={ownership}
              title={ownership}
              onPress={() => setOwnershipType(ownership as any)}
              variant={ownershipType === ownership ? "primary" : "outline"}
              style={styles.ownershipButton}
              size="small"
            />
          ))}
        </View>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color={colors.primary} />
          <Text style={styles.locationTitle}>GPS Location</Text>
        </View>
        <View style={styles.row}>
          <Input
            label="Latitude *"
            value={latitude}
            onChangeText={setLatitude}
            placeholder="0.000000"
            keyboardType="numeric"
            error={errors.latitude}
            containerStyle={styles.halfWidth}
          />
          <Input
            label="Longitude *"
            value={longitude}
            onChangeText={setLongitude}
            placeholder="0.000000"
            keyboardType="numeric"
            error={errors.longitude}
            containerStyle={styles.halfWidth}
          />
        </View>
        <Button
          title="Get Current Location"
          onPress={() => {
            const randomLat = (0.3 + Math.random() * 2).toFixed(6);
            const randomLng = (30 + Math.random() * 3).toFixed(6);
            setLatitude(randomLat);
            setLongitude(randomLng);
          }}
          variant="outline"
          size="small"
          style={styles.locationButton}
        />
      </View>
    </View>
  );

  const renderEnrollment = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Enrollment & Contact</Text>
      <Text style={styles.stepDescription}>
        Student enrollment data and contact information
      </Text>

      <Input
        label="Total Students *"
        value={totalStudents}
        onChangeText={setTotalStudents}
        placeholder="Enter total number of students"
        keyboardType="numeric"
        error={errors.totalStudents}
      />

      <View style={styles.row}>
        <Input
          label="Male Students *"
          value={maleStudents}
          onChangeText={setMaleStudents}
          placeholder="Enter number"
          keyboardType="numeric"
          error={errors.maleStudents}
          containerStyle={styles.halfWidth}
        />
        <Input
          label="Female Students *"
          value={femaleStudents}
          onChangeText={setFemaleStudents}
          placeholder="Enter number"
          keyboardType="numeric"
          error={errors.femaleStudents}
          containerStyle={styles.halfWidth}
        />
      </View>

      <View style={styles.divider} />

      <Input
        label="Head Teacher Name *"
        value={headTeacher}
        onChangeText={setHeadTeacher}
        placeholder="Enter head teacher's name"
        error={errors.headTeacher}
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
        label="Phone Number *"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        error={errors.phone}
      />
    </View>
  );

  const renderInfrastructure = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>ICT Infrastructure</Text>
      <Text style={styles.stepDescription}>
        Information about computers and ICT equipment
      </Text>

      <View style={styles.row}>
        <Input
          label="Student Computers"
          value={studentComputers}
          onChangeText={setStudentComputers}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
        <Input
          label="Teacher Computers"
          value={teacherComputers}
          onChangeText={setTeacherComputers}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>

      <View style={styles.row}>
        <Input
          label="Projectors"
          value={projectors}
          onChangeText={setProjectors}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
        <Input
          label="Smart Boards"
          value={smartBoards}
          onChangeText={setSmartBoards}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>

      <View style={styles.row}>
        <Input
          label="Tablets"
          value={tablets}
          onChangeText={setTablets}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
        <Input
          label="Laptops"
          value={laptops}
          onChangeText={setLaptops}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>

      <View style={styles.checkboxSection}>
        <TouchableCheckbox
          label="Has Computer Lab"
          checked={hasComputerLab}
          onToggle={() => setHasComputerLab(!hasComputerLab)}
          description="Dedicated room for computer classes"
        />

        {hasComputerLab && (
          <View style={styles.conditionalSection}>
            <Text style={styles.label}>Lab Condition</Text>
            <View style={styles.buttonGroup}>
              {["Excellent", "Good", "Fair", "Poor"].map((condition) => (
                <Button
                  key={condition}
                  title={condition}
                  onPress={() => setLabCondition(condition as any)}
                  variant={labCondition === condition ? "primary" : "outline"}
                  style={styles.conditionButton}
                  size="small"
                />
              ))}
            </View>
          </View>
        )}

        <TouchableCheckbox
          label="Has ICT Room"
          checked={hasICTRoom}
          onToggle={() => setHasICTRoom(!hasICTRoom)}
          description="Separate room for ICT equipment"
        />
        
        <TouchableCheckbox
          label="Has Electricity"
          checked={hasElectricity}
          onToggle={() => setHasElectricity(!hasElectricity)}
          description="Reliable electrical power supply"
        />

        <TouchableCheckbox
          label="Has Secure Storage"
          checked={hasSecureRoom}
          onToggle={() => setHasSecureRoom(!hasSecureRoom)}
          description="Lockable room for equipment security"
        />

        <TouchableCheckbox
          label="Has Proper Furniture"
          checked={hasFurniture}
          onToggle={() => setHasFurniture(!hasFurniture)}
          description="Desks and chairs suitable for ICT use"
        />
      </View>

      <View style={styles.selectionGroup}>
        <Text style={styles.label}>Power Backup Options</Text>
        <View style={styles.checkboxSection}>
          {["Generator", "Solar", "UPS", "Battery"].map((backup) => (
            <TouchableCheckbox
              key={backup}
              label={backup}
              checked={powerBackup.includes(backup)}
              onToggle={() => toggleArrayItem(powerBackup, setPowerBackup, backup)}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const renderConnectivity = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Internet Connectivity</Text>
      <Text style={styles.stepDescription}>
        Internet connection and network information
      </Text>

      <View style={styles.selectionGroup}>
        <Text style={styles.label}>Connection Type</Text>
        <View style={styles.buttonGroup}>
          {["None", "Fiber", "Mobile", "Satellite"].map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => setConnectionType(type === "Mobile" ? "Mobile Broadband" : type as any)}
              variant={
                (type === "Mobile" ? "Mobile Broadband" : type) === connectionType 
                  ? "primary" 
                  : "outline"
              }
              style={styles.connectionButton}
              size="small"
            />
          ))}
        </View>
      </View>

      {connectionType !== "None" && (
        <>
          <Input
            label="Bandwidth (Mbps) *"
            value={bandwidthMbps}
            onChangeText={setBandwidthMbps}
            placeholder="Enter bandwidth in Mbps"
            keyboardType="numeric"
            error={errors.bandwidthMbps}
          />

          <Input
            label="Internet Provider *"
            value={provider}
            onChangeText={setProvider}
            placeholder="Enter internet provider"
            error={errors.provider}
          />

          <View style={styles.selectionGroup}>
            <Text style={styles.label}>Connection Stability</Text>
            <View style={styles.buttonGroup}>
              {["High", "Medium", "Low"].map((level) => (
                <Button
                  key={level}
                  title={level}
                  onPress={() => setStability(level as any)}
                  variant={stability === level ? "primary" : "outline"}
                  style={styles.stabilityButton}
                  size="small"
                />
              ))}
            </View>
          </View>

          <View style={styles.checkboxSection}>
            <Text style={styles.label}>WiFi Coverage Areas</Text>
            {["Computer Lab", "Staff Room", "Classrooms", "Library", "Administration"].map((area) => (
              <TouchableCheckbox
                key={area}
                label={area}
                checked={wifiCoverage.includes(area)}
                onToggle={() => toggleArrayItem(wifiCoverage, setWifiCoverage, area)}
              />
            ))}
          </View>

          <View style={styles.checkboxSection}>
            <TouchableCheckbox
              label="Has Internet Usage Policy"
              checked={hasUsagePolicy}
              onToggle={() => setHasUsagePolicy(!hasUsagePolicy)}
              description="Written guidelines for internet use"
            />

            <TouchableCheckbox
              label="Connection is Stable"
              checked={isStable}
              onToggle={() => setIsStable(!isStable)}
              description="Reliable connection throughout the day"
            />
          </View>
        </>
      )}
    </View>
  );

  const renderSoftware = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Software & Digital Resources</Text>
      <Text style={styles.stepDescription}>
        Learning management systems and educational software
      </Text>

      <TouchableCheckbox
        label="Has Learning Management System (LMS)"
        checked={hasLMS}
        onToggle={() => setHasLMS(!hasLMS)}
        description="Platform for online learning and course management"
      />

      {hasLMS && (
        <Input
          label="LMS Name"
          value={lmsName}
          onChangeText={setLmsName}
          placeholder="e.g., Moodle, Google Classroom"
        />
      )}

      <TouchableCheckbox
        label="Has Licensed Software"
        checked={hasLicensedSoftware}
        onToggle={() => setHasLicensedSoftware(!hasLicensedSoftware)}
        description="Properly licensed educational software"
      />

      <TouchableCheckbox
        label="Has Productivity Suite"
        checked={hasProductivitySuite}
        onToggle={() => setHasProductivitySuite(!hasProductivitySuite)}
        description="Office applications like Word, Excel, PowerPoint"
      />

      <TouchableCheckbox
        label="Has Digital Library"
        checked={hasDigitalLibrary}
        onToggle={() => setHasDigitalLibrary(!hasDigitalLibrary)}
        description="Digital books and educational resources"
      />

      <TouchableCheckbox
        label="Has Local Content"
        checked={hasLocalContent}
        onToggle={() => setHasLocalContent(!hasLocalContent)}
        description="Locally developed educational materials"
      />

      {hasLocalContent && (
        <Input
          label="Content Source"
          value={contentSource}
          onChangeText={setContentSource}
          placeholder="Source of local content"
        />
      )}
    </View>
  );

  const renderCapacity = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Human Capacity & Training</Text>
      <Text style={styles.stepDescription}>
        Teacher capacity and ICT competency information
      </Text>

      <Input
        label="Total Teachers *"
        value={totalTeachers}
        onChangeText={setTotalTeachers}
        placeholder="Enter total number of teachers"
        keyboardType="numeric"
        error={errors.totalTeachers}
      />

      <View style={styles.row}>
        <Input
          label="Male Teachers *"
          value={maleTeachers}
          onChangeText={setMaleTeachers}
          placeholder="Enter number"
          keyboardType="numeric"
          error={errors.maleTeachers}
          containerStyle={styles.halfWidth}
        />
        <Input
          label="Female Teachers *"
          value={femaleTeachers}
          onChangeText={setFemaleTeachers}
          placeholder="Enter number"
          keyboardType="numeric"
          error={errors.femaleTeachers}
          containerStyle={styles.halfWidth}
        />
      </View>

      <Input
        label="ICT Trained Teachers"
        value={ictTrainedTeachers}
        onChangeText={setIctTrainedTeachers}
        placeholder="Teachers with ICT training"
        keyboardType="numeric"
        error={errors.ictTrainedTeachers}
      />

      <View style={styles.row}>
        <Input
          label="P5-P7 Teachers"
          value={p5ToP7Teachers}
          onChangeText={setP5ToP7Teachers}
          placeholder="Upper primary teachers"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
        <Input
          label="ICT Support Staff"
          value={supportStaff}
          onChangeText={setSupportStaff}
          placeholder="Technical support staff"
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>

      <Input
        label="Monthly ICT Trainings"
        value={monthlyTrainings}
        onChangeText={setMonthlyTrainings}
        placeholder="Training sessions per month"
        keyboardType="numeric"
      />

      <View style={styles.selectionGroup}>
        <Text style={styles.label}>Teacher ICT Competency Level</Text>
        <View style={styles.buttonGroup}>
          {["Basic", "Intermediate", "Advanced"].map((level) => (
            <Button
              key={level}
              title={level}
              onPress={() => setTeacherCompetencyLevel(level as any)}
              variant={teacherCompetencyLevel === level ? "primary" : "outline"}
              style={styles.competencyButton}
              size="small"
            />
          ))}
        </View>
      </View>

      <TouchableCheckbox
        label="Has Capacity Building Program"
        checked={hasCapacityBuilding}
        onToggle={() => setHasCapacityBuilding(!hasCapacityBuilding)}
        description="Ongoing teacher development in ICT"
      />
    </View>
  );

  const renderGovernance = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>ICT Governance & Policy</Text>
      <Text style={styles.stepDescription}>
        Policies, committees, and management structures
      </Text>

      <View style={styles.checkboxSection}>
        <TouchableCheckbox
          label="Has ICT Policy"
          checked={hasICTPolicy}
          onToggle={() => setHasICTPolicy(!hasICTPolicy)}
          description="Written ICT policy document"
        />

        <TouchableCheckbox
          label="Aligned with National ICT Strategy"
          checked={alignedWithNationalStrategy}
          onToggle={() => setAlignedWithNationalStrategy(!alignedWithNationalStrategy)}
          description="Follows national ICT guidelines"
        />

        <TouchableCheckbox
          label="Has ICT Committee"
          checked={hasICTCommittee}
          onToggle={() => setHasICTCommittee(!hasICTCommittee)}
          description="Committee overseeing ICT implementation"
        />

        <TouchableCheckbox
          label="Has ICT Budget"
          checked={hasICTBudget}
          onToggle={() => setHasICTBudget(!hasICTBudget)}
          description="Dedicated budget for ICT activities"
        />

        <TouchableCheckbox
          label="Has Monitoring System"
          checked={hasMonitoringSystem}
          onToggle={() => setHasMonitoringSystem(!hasMonitoringSystem)}
          description="System to track ICT progress"
        />

        <TouchableCheckbox
          label="Has Active SMC"
          checked={hasActiveSMC}
          onToggle={() => setHasActiveSMC(!hasActiveSMC)}
          description="Active School Management Committee"
        />

        <TouchableCheckbox
          label="Has Active PTA"
          checked={hasActivePTA}
          onToggle={() => setHasActivePTA(!hasActivePTA)}
          description="Active Parent-Teacher Association"
        />

        <TouchableCheckbox
          label="Has Local Leader Engagement"
          checked={hasLocalLeaderEngagement}
          onToggle={() => setHasLocalLeaderEngagement(!hasLocalLeaderEngagement)}
          description="Involvement of local community leaders"
        />
      </View>
    </View>
  );

  const renderCommunity = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Community & Safety</Text>
      <Text style={styles.stepDescription}>
        Community engagement, security, and accessibility
      </Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Student Engagement</Text>
        
        <View style={styles.selectionGroup}>
          <Text style={styles.label}>Digital Literacy Level</Text>
          <View style={styles.buttonGroup}>
            {["Basic", "Intermediate", "Advanced"].map((level) => (
              <Button
                key={level}
                title={level}
                onPress={() => setDigitalLiteracyLevel(level as any)}
                variant={digitalLiteracyLevel === level ? "primary" : "outline"}
                style={styles.literacyButton}
                size="small"
              />
            ))}
          </View>
        </View>

        <Input
          label="Students Using Digital Content"
          value={studentsUsingDigitalContent}
          onChangeText={setStudentsUsingDigitalContent}
          placeholder="Number of students"
          keyboardType="numeric"
        />

        <TouchableCheckbox
          label="Has ICT Club"
          checked={hasICTClub}
          onToggle={() => setHasICTClub(!hasICTClub)}
          description="Student ICT interest group"
        />

        <TouchableCheckbox
          label="Uses Online Learning Platforms"
          checked={usesOnlinePlatforms}
          onToggle={() => setUsesOnlinePlatforms(!usesOnlinePlatforms)}
          description="Students access online educational content"
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Community Engagement</Text>
        
        <TouchableCheckbox
          label="Has Parent Portal"
          checked={hasParentPortal}
          onToggle={() => setHasParentPortal(!hasParentPortal)}
          description="Online platform for parent communication"
        />

        <TouchableCheckbox
          label="Has Community Outreach"
          checked={hasCommunityOutreach}
          onToggle={() => setHasCommunityOutreach(!hasCommunityOutreach)}
          description="Programs involving local community"
        />

        <TouchableCheckbox
          label="Has Industry Partners"
          checked={hasIndustryPartners}
          onToggle={() => setHasIndustryPartners(!hasIndustryPartners)}
          description="Partnerships with private sector"
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Security & Safety</Text>
        
        <TouchableCheckbox
          label="School is Fenced"
          checked={isFenced}
          onToggle={() => setIsFenced(!isFenced)}
          description="Perimeter security fence"
        />

        <TouchableCheckbox
          label="Has Security Guard"
          checked={hasSecurityGuard}
          onToggle={() => setHasSecurityGuard(!hasSecurityGuard)}
          description="On-site security personnel"
        />

        <TouchableCheckbox
          label="Has Recent Security Incidents"
          checked={hasRecentIncidents}
          onToggle={() => setHasRecentIncidents(!hasRecentIncidents)}
          description="Security issues in past year"
        />

        {hasRecentIncidents && (
          <Input
            label="Incident Details"
            value={incidentDetails}
            onChangeText={setIncidentDetails}
            placeholder="Describe recent incidents"
            multiline
          />
        )}

        <TouchableCheckbox
          label="Has Adequate Toilets"
          checked={hasToilets}
          onToggle={() => setHasToilets(!hasToilets)}
          description="Sufficient toilet facilities"
        />

        <TouchableCheckbox
          label="Has Water Source"
          checked={hasWaterSource}
          onToggle={() => setHasWaterSource(!hasWaterSource)}
          description="Access to clean water"
        />
      </View>
    </View>
  );

  const renderFacilities = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Facilities & Environment</Text>
      <Text style={styles.stepDescription}>
        Physical infrastructure and accessibility information
      </Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Classrooms</Text>
        
        <View style={styles.row}>
          <Input
            label="Permanent Classrooms"
            value={permanentClassrooms}
            onChangeText={setPermanentClassrooms}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
          <Input
            label="Semi-Permanent"
            value={semiPermanentClassrooms}
            onChangeText={setSemiPermanentClassrooms}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
        </View>

        <View style={styles.row}>
          <Input
            label="Temporary Classrooms"
            value={temporaryClassrooms}
            onChangeText={setTemporaryClassrooms}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
          <Input
            label="Pupil:Classroom Ratio"
            value={pupilClassroomRatio}
            onChangeText={setPupilClassroomRatio}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Sanitation Facilities</Text>
        
        <View style={styles.row}>
          <Input
            label="Boys' Toilets"
            value={boysToilets}
            onChangeText={setBoysToilets}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
          <Input
            label="Girls' Toilets"
            value={girlsToilets}
            onChangeText={setGirlsToilets}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
        </View>

        <Input
          label="Staff Toilets"
          value={staffToilets}
          onChangeText={setStaffToilets}
          placeholder="0"
          keyboardType="numeric"
        />

        <View style={styles.selectionGroup}>
          <Text style={styles.label}>Water Access</Text>
          <View style={styles.buttonGroup}>
            {["Borehole", "Tap", "Rainwater", "None"].map((access) => (
              <Button
                key={access}
                title={access}
                onPress={() => setWaterAccess(access as any)}
                variant={waterAccess === access ? "primary" : "outline"}
                style={styles.waterButton}
                size="small"
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Accessibility</Text>
        
        <Input
          label="Distance from District HQ (km)"
          value={distanceFromHQ}
          onChangeText={setDistanceFromHQ}
          placeholder="0"
          keyboardType="numeric"
        />

        <View style={styles.selectionGroup}>
          <Text style={styles.label}>School Accessibility</Text>
          <View style={styles.buttonGroup}>
            {["All-Weather", "Seasonal", "Remote"].map((access) => (
              <Button
                key={access}
                title={access}
                onPress={() => setSchoolAccessibility(access as any)}
                variant={schoolAccessibility === access ? "primary" : "outline"}
                style={styles.accessButton}
                size="small"
              />
            ))}
          </View>
        </View>

        <View style={styles.checkboxSection}>
          <TouchableCheckbox
            label="Accessible All Year"
            checked={isAccessibleAllYear}
            onToggle={() => setIsAccessibleAllYear(!isAccessibleAllYear)}
            description="Can be reached in all seasons"
          />

          <TouchableCheckbox
            label="Inclusive Education"
            checked={isInclusive}
            onToggle={() => setIsInclusive(!isInclusive)}
            description="Accommodates students with disabilities"
          />

          <TouchableCheckbox
            label="Serves Girls"
            checked={servesGirls}
            onToggle={() => setServesGirls(!servesGirls)}
            description="Enrolls female students"
          />

          <TouchableCheckbox
            label="Serves PWDs"
            checked={servesPWDs}
            onToggle={() => setServesPWDs(!servesPWDs)}
            description="Serves persons with disabilities"
          />

          <TouchableCheckbox
            label="Serves Refugees"
            checked={servesRefugees}
            onToggle={() => setServesRefugees(!servesRefugees)}
            description="Enrolls refugee children"
          />

          <TouchableCheckbox
            label="Only School in Area"
            checked={isOnlySchoolInArea}
            onToggle={() => setIsOnlySchoolInArea(!isOnlySchoolInArea)}
            description="Sole educational facility in the area"
          />
        </View>

        <Input
          label="Nearby Health Facility"
          value={nearbyHealthFacility}
          onChangeText={setNearbyHealthFacility}
          placeholder="Name of nearest health facility"
        />

        <Input
          label="Health Facility Distance (km)"
          value={healthFacilityDistance}
          onChangeText={setHealthFacilityDistance}
          placeholder="0"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderPerformance = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Academic Performance</Text>
      <Text style={styles.stepDescription}>
        Academic outcomes and achievements
      </Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>PLE Pass Rates (%)</Text>
        
        <View style={styles.row}>
          <Input
            label="Year 1 (Previous)"
            value={plePassRateYear1}
            onChangeText={setPlePassRateYear1}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
          <Input
            label="Year 2"
            value={plePassRateYear2}
            onChangeText={setPlePassRateYear2}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={styles.halfWidth}
          />
        </View>

        <Input
          label="Year 3 (Latest)"
          value={plePassRateYear3}
          onChangeText={setPlePassRateYear3}
          placeholder="0"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Learning Trends</Text>
        
        <Input
          label="Literacy Trends"
          value={literacyTrends}
          onChangeText={setLiteracyTrends}
          placeholder="Describe literacy performance trends"
          multiline
        />

        <Input
          label="Numeracy Trends"
          value={numeracyTrends}
          onChangeText={setNumeracyTrends}
          placeholder="Describe numeracy performance trends"
          multiline
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Achievements & Innovation</Text>
        
        <Input
          label="Innovations"
          value={innovations}
          onChangeText={setInnovations}
          placeholder="Describe innovative practices"
          multiline
        />

        <Input
          label="Unique Achievements"
          value={uniqueAchievements}
          onChangeText={setUniqueAchievements}
          placeholder="Notable accomplishments"
          multiline
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderEnrollment();
      case 2: return renderInfrastructure();
      case 3: return renderConnectivity();
      case 4: return renderSoftware();
      case 5: return renderCapacity();
      case 6: return renderGovernance();
      case 7: return renderCommunity();
      case 8: return renderFacilities();
      case 9: return renderPerformance();
      default: return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        {renderStepIndicator()}
        <View style={styles.stepInfo}>
          <Text style={styles.stepInfoTitle}>{STEPS[currentStep].title}</Text>
          <Text style={styles.stepInfoDescription}>{STEPS[currentStep].description}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.formContainer}>
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / STEPS.length) * 100}%` }]} />
        </View>
        
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <Button
              title="Previous"
              onPress={handlePrevious}
              variant="outline"
              icon={<ChevronLeft size={16} color={colors.primary} />}
              style={styles.navButton}
            />
          )}
          
          <Button
            title={currentStep === STEPS.length - 1 ? "Save School" : "Next"}
            onPress={handleNext}
            loading={isLoading}
            icon={
              currentStep === STEPS.length - 1 ? 
                <Check size={16} color={colors.card} /> : 
                <ChevronRight size={16} color={colors.card} />
            }
            style={[styles.navButton, styles.primaryNavButton]}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepIndicator: {
    marginBottom: 16,
  },
  stepScrollContent: {
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 60,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  stepCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepLabelCompleted: {
    color: colors.success,
  },
  stepLabelCurrent: {
    color: colors.primary,
  },
  stepLabelDisabled: {
    color: colors.disabled,
  },
  stepInfo: {
    alignItems: 'center',
  },
  stepInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  stepInfoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  stepContent: {
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  selectionGroup: {
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectionButton: {
    flex: 1,
    minWidth: 100,
  },
  ownershipButton: {
    flex: 1,
    minWidth: 120,
  },
  connectionButton: {
    flex: 1,
    minWidth: 80,
  },
  stabilityButton: {
    flex: 1,
    minWidth: 70,
  },
  conditionButton: {
    flex: 1,
    minWidth: 70,
  },
  competencyButton: {
    flex: 1,
    minWidth: 90,
  },
  literacyButton: {
    flex: 1,
    minWidth: 90,
  },
  waterButton: {
    flex: 1,
    minWidth: 80,
  },
  accessButton: {
    flex: 1,
    minWidth: 90,
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  locationButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  checkboxSection: {
    marginTop: 16,
  },
  conditionalSection: {
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  navigationContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: 48,
  },
  primaryNavButton: {
    flex: 2,
  },
});