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
  Wifi
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
  { id: 'basic', title: 'Basic Info', icon: SchoolIcon },
  { id: 'enrollment', title: 'Enrollment', icon: Users },
  { id: 'infrastructure', title: 'ICT Setup', icon: Laptop },
  { id: 'connectivity', title: 'Internet', icon: Wifi },
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
  const [type, setType] = useState<"Public" | "Private">("Public");
  const [environment, setEnvironment] = useState<"Urban" | "Rural">("Urban");
  const [emisNumber, setEmisNumber] = useState("");
  const [upiCode, setUpiCode] = useState("");
  const [ownershipType, setOwnershipType] = useState<
    "Government" | "Government-aided" | "Community" | "Private"
  >("Government");
  const [schoolCategory, setSchoolCategory] = useState<
    "Mixed" | "Girls" | "Boys" | "Special Needs"
  >("Mixed");
  const [signatureProgram, setSignatureProgram] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");

  // Location
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  // Enrollment
  const [totalStudents, setTotalStudents] = useState("");
  const [maleStudents, setMaleStudents] = useState("");
  const [femaleStudents, setFemaleStudents] = useState("");

  // Contact
  const [headTeacher, setHeadTeacher] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ICT Infrastructure
  const [studentComputers, setStudentComputers] = useState("0");
  const [teacherComputers, setTeacherComputers] = useState("0");
  const [projectors, setProjectors] = useState("0");
  const [smartBoards, setSmartBoards] = useState("0");
  const [tablets, setTablets] = useState("0");
  const [laptops, setLaptops] = useState("0");
  const [hasComputerLab, setHasComputerLab] = useState(false);
  const [labCondition, setLabCondition] = useState<
    "Excellent" | "Good" | "Fair" | "Poor"
  >("Good");
  const [powerBackup, setPowerBackup] = useState<string[]>([]);
  const [hasICTRoom, setHasICTRoom] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasSecureRoom, setHasSecureRoom] = useState(false);
  const [hasFurniture, setHasFurniture] = useState(false);

  // Internet Connectivity
  const [connectionType, setConnectionType] = useState<
    "None" | "Fiber" | "Mobile Broadband" | "Satellite"
  >("None");
  const [bandwidthMbps, setBandwidthMbps] = useState("0");
  const [wifiCoverage, setWifiCoverage] = useState<string[]>([]);
  const [stability, setStability] = useState<"High" | "Medium" | "Low">(
    "Medium"
  );
  const [hasUsagePolicy, setHasUsagePolicy] = useState(false);
  const [provider, setProvider] = useState("");
  const [isStable, setIsStable] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Simulate getting current location
  useEffect(() => {
    const randomLat = 0.3 + Math.random() * 2;
    const randomLng = 30 + Math.random() * 3;
    setLocation({
      latitude: randomLat,
      longitude: randomLng,
    });
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
        if (
          yearEstablished &&
          (isNaN(parseInt(yearEstablished)) ||
            parseInt(yearEstablished) < 1900 ||
            parseInt(yearEstablished) > new Date().getFullYear())
        ) {
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

      case 2: // Infrastructure
        if (isNaN(parseInt(studentComputers)) || parseInt(studentComputers) < 0) {
          newErrors.studentComputers = "Enter a valid number";
        }
        if (isNaN(parseInt(teacherComputers)) || parseInt(teacherComputers) < 0) {
          newErrors.teacherComputers = "Enter a valid number";
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

  const togglePowerBackup = (source: string) => {
    if (powerBackup.includes(source)) {
      setPowerBackup(powerBackup.filter((s) => s !== source));
    } else {
      setPowerBackup([...powerBackup, source]);
    }
  };

  const toggleWifiCoverage = (area: string) => {
    if (wifiCoverage.includes(area)) {
      setWifiCoverage(wifiCoverage.filter((a) => a !== area));
    } else {
      setWifiCoverage([...wifiCoverage, area]);
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
      location,
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

      // Initialize other sections with default values
      software: {
        hasLMS: false,
        lmsName: "",
        hasLicensedSoftware: false,
        licensedSoftware: [],
        hasProductivitySuite: false,
        productivitySuite: [],
        hasDigitalLibrary: false,
        hasLocalContent: false,
        contentSource: "",
      },

      humanCapacity: {
        ictTrainedTeachers: 0,
        totalTeachers: 0,
        maleTeachers: 0,
        femaleTeachers: 0,
        p5ToP7Teachers: 0,
        supportStaff: 0,
        monthlyTrainings: 0,
        teacherCompetencyLevel: "Basic",
        hasCapacityBuilding: false,
      },

      pedagogicalUsage: {
        ictIntegratedLessons: 0,
        usesICTAssessments: false,
        hasStudentProjects: false,
        usesBlendedLearning: false,
        hasAssistiveTech: false,
        digitalToolUsageFrequency: "Rarely",
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
        digitalLiteracyLevel: "Basic",
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
        incidentDetails: "",
        hasToilets: true,
        hasWaterSource: true,
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
        waterAccess: "None",
        securityInfrastructure: [],
        schoolAccessibility: "All-Weather",
        nearbyHealthFacility: "",
        healthFacilityDistance: 0,
      },

      performance: {
        plePassRateYear1: 0,
        plePassRateYear2: 0,
        plePassRateYear3: 0,
        literacyTrends: "",
        numeracyTrends: "",
        innovations: "",
        uniqueAchievements: "",
      },

      synced: false,
      lastUpdated: new Date().toISOString(),
    };

    addSchool(newSchool);

    Alert.alert("School Added", "School has been successfully added.", [
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
  }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
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
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
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
                <Check size={16} color={colors.card} />
              ) : (
                <IconComponent 
                  size={16} 
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
            {index < STEPS.length - 1 && (
              <View style={[
                styles.stepConnector,
                isCompleted && styles.stepConnectorCompleted,
              ]} />
            )}
          </TouchableOpacity>
        );
      })}
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

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color={colors.primary} />
          <Text style={styles.locationTitle}>GPS Location</Text>
        </View>
        <Text style={styles.locationText}>
          Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
        </Text>
        <Button
          title="Refresh Location"
          onPress={() => {
            const randomLat = 0.3 + Math.random() * 2;
            const randomLng = 30 + Math.random() * 3;
            setLocation({ latitude: randomLat, longitude: randomLng });
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
          error={errors.studentComputers}
          containerStyle={styles.halfWidth}
        />
        <Input
          label="Teacher Computers"
          value={teacherComputers}
          onChangeText={setTeacherComputers}
          placeholder="0"
          keyboardType="numeric"
          error={errors.teacherComputers}
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
        />
        <TouchableCheckbox
          label="Has Electricity"
          checked={hasElectricity}
          onToggle={() => setHasElectricity(!hasElectricity)}
        />
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
                onToggle={() => toggleWifiCoverage(area)}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderEnrollment();
      case 2:
        return renderInfrastructure();
      case 3:
        return renderConnectivity();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        {renderStepIndicator()}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.formContainer}>
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      <View style={styles.navigationContainer}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 12,
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
  stepConnector: {
    position: 'absolute',
    top: 20,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: colors.border,
    zIndex: -1,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.success,
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
    marginBottom: 8,
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  locationButton: {
    alignSelf: 'flex-start',
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
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  navigationContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
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