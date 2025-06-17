import Button from "@/components/Button";
import Input from "@/components/Input";
import { colors } from "@/constants/Colors";
import { useSchoolStore } from "@/store/schoolStore";
import { School } from "@/types";
import { generateId } from "@/utils/sync";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
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
} from "react-native";

export default function AddSchoolScreen() {
  const router = useRouter();
  const { addSchool } = useSchoolStore();

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

  // Current active section
  const [activeSection, setActiveSection] = useState("basic");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Simulate getting current location
  useEffect(() => {
    // In a real app, we would use expo-location
    // For demo, set a random location in Uganda
    const randomLat = 0.3 + Math.random() * 2; // Uganda latitude range
    const randomLng = 30 + Math.random() * 3; // Uganda longitude range

    setLocation({
      latitude: randomLat,
      longitude: randomLng,
    });
  }, []);

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEnrollment = () => {
    const newErrors: Record<string, string> = {};

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
      newErrors.totalStudents =
        "Total students must equal male + female students";
    }

    if (!headTeacher.trim())
      newErrors.headTeacher = "Head teacher name is required";

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInfrastructure = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation for numeric fields
    if (isNaN(parseInt(studentComputers)) || parseInt(studentComputers) < 0) {
      newErrors.studentComputers = "Enter a valid number";
    }

    if (isNaN(parseInt(teacherComputers)) || parseInt(teacherComputers) < 0) {
      newErrors.teacherComputers = "Enter a valid number";
    }

    if (isNaN(parseInt(projectors)) || parseInt(projectors) < 0) {
      newErrors.projectors = "Enter a valid number";
    }

    if (isNaN(parseInt(smartBoards)) || parseInt(smartBoards) < 0) {
      newErrors.smartBoards = "Enter a valid number";
    }

    if (isNaN(parseInt(tablets)) || parseInt(tablets) < 0) {
      newErrors.tablets = "Enter a valid number";
    }

    if (isNaN(parseInt(laptops)) || parseInt(laptops) < 0) {
      newErrors.laptops = "Enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateConnectivity = () => {
    const newErrors: Record<string, string> = {};

    if (connectionType !== "None") {
      if (isNaN(parseFloat(bandwidthMbps)) || parseFloat(bandwidthMbps) < 0) {
        newErrors.bandwidthMbps = "Enter a valid bandwidth";
      }

      if (!provider.trim()) {
        newErrors.provider = "Provider is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    switch (activeSection) {
      case "basic":
        isValid = validateBasicInfo();
        if (isValid) setActiveSection("enrollment");
        break;
      case "enrollment":
        isValid = validateEnrollment();
        if (isValid) setActiveSection("infrastructure");
        break;
      case "infrastructure":
        isValid = validateInfrastructure();
        if (isValid) setActiveSection("connectivity");
        break;
      case "connectivity":
        isValid = validateConnectivity();
        if (isValid) handleSubmit();
        break;
    }
  };

  const handleBack = () => {
    switch (activeSection) {
      case "enrollment":
        setActiveSection("basic");
        break;
      case "infrastructure":
        setActiveSection("enrollment");
        break;
      case "connectivity":
        setActiveSection("infrastructure");
        break;
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

    // Create new school object with the comprehensive data structure
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

      // ICT Infrastructure
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

      // Internet Connectivity
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

    // Add to store
    addSchool(newSchool);

    // Show success message and navigate back
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
          {checked && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      activeSection === "basic"
                        ? "25%"
                        : activeSection === "enrollment"
                        ? "50%"
                        : activeSection === "infrastructure"
                        ? "75%"
                        : "100%",
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text
                style={[
                  styles.progressLabel,
                  activeSection === "basic" && styles.activeLabel,
                ]}
              >
                Basic
              </Text>
              <Text
                style={[
                  styles.progressLabel,
                  activeSection === "enrollment" && styles.activeLabel,
                ]}
              >
                Enrollment
              </Text>
              <Text
                style={[
                  styles.progressLabel,
                  activeSection === "infrastructure" && styles.activeLabel,
                ]}
              >
                Infrastructure
              </Text>
              <Text
                style={[
                  styles.progressLabel,
                  activeSection === "connectivity" && styles.activeLabel,
                ]}
              >
                Connectivity
              </Text>
            </View>
          </View>

          {/* Basic Information Section */}
          {activeSection === "basic" && (
            <>
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

              <Text style={styles.label}>School Type</Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="Public"
                  onPress={() => setType("Public")}
                  variant={type === "Public" ? "primary" : "outline"}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemLeft]}
                />
                <Button
                  title="Private"
                  onPress={() => setType("Private")}
                  variant={type === "Private" ? "primary" : "outline"}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemRight]}
                />
              </View>

              <Text style={styles.label}>Environment</Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="Urban"
                  onPress={() => setEnvironment("Urban")}
                  variant={environment === "Urban" ? "primary" : "outline"}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemLeft]}
                />
                <Button
                  title="Rural"
                  onPress={() => setEnvironment("Rural")}
                  variant={environment === "Rural" ? "primary" : "outline"}
                  style={[styles.buttonGroupItem, styles.buttonGroupItemRight]}
                />
              </View>

              <Text style={styles.label}>Ownership Type</Text>
              <View style={styles.wideButtonGroup}>
                <Button
                  title="Government"
                  onPress={() => setOwnershipType("Government")}
                  variant={
                    ownershipType === "Government" ? "primary" : "outline"
                  }
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
                <Button
                  title="Government-aided"
                  onPress={() => setOwnershipType("Government-aided")}
                  variant={
                    ownershipType === "Government-aided" ? "primary" : "outline"
                  }
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
                <Button
                  title="Community"
                  onPress={() => setOwnershipType("Community")}
                  variant={
                    ownershipType === "Community" ? "primary" : "outline"
                  }
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
                <Button
                  title="Private"
                  onPress={() => setOwnershipType("Private")}
                  variant={ownershipType === "Private" ? "primary" : "outline"}
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
              </View>

              <Text style={styles.label}>School Category</Text>
              <View style={styles.wideButtonGroup}>
                <Button
                  title="Mixed"
                  onPress={() => setSchoolCategory("Mixed")}
                  variant={schoolCategory === "Mixed" ? "primary" : "outline"}
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
                <Button
                  title="Girls"
                  onPress={() => setSchoolCategory("Girls")}
                  variant={schoolCategory === "Girls" ? "primary" : "outline"}
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
                <Button
                  title="Boys"
                  onPress={() => setSchoolCategory("Boys")}
                  variant={schoolCategory === "Boys" ? "primary" : "outline"}
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
                <Button
                  title="Special Needs"
                  onPress={() => setSchoolCategory("Special Needs")}
                  variant={
                    schoolCategory === "Special Needs" ? "primary" : "outline"
                  }
                  style={styles.wideButtonGroupItem}
                  size="small"
                />
              </View>

              <Input
                label="Signature Program (Optional)"
                value={signatureProgram}
                onChangeText={setSignatureProgram}
                placeholder="Enter signature program"
              />

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
            </>
          )}

          {/* Enrollment Section */}
          {activeSection === "enrollment" && (
            <>
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
                label="Head Teacher Name"
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
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                error={errors.phone}
              />
            </>
          )}

          {/* Infrastructure Section */}
          {activeSection === "infrastructure" && (
            <>
              <Text style={styles.sectionTitle}>ICT Infrastructure</Text>

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
                  error={errors.projectors}
                  containerStyle={styles.halfWidth}
                />

                <Input
                  label="Smart Boards"
                  value={smartBoards}
                  onChangeText={setSmartBoards}
                  placeholder="0"
                  keyboardType="numeric"
                  error={errors.smartBoards}
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
                  error={errors.tablets}
                  containerStyle={styles.halfWidth}
                />

                <Input
                  label="Laptops"
                  value={laptops}
                  onChangeText={setLaptops}
                  placeholder="0"
                  keyboardType="numeric"
                  error={errors.laptops}
                  containerStyle={styles.halfWidth}
                />
              </View>

              <TouchableCheckbox
                label="Has Computer Lab"
                checked={hasComputerLab}
                onToggle={() => setHasComputerLab(!hasComputerLab)}
              />

              {hasComputerLab && (
                <>
                  <Text style={styles.label}>Lab Condition</Text>
                  <View style={styles.buttonGroup}>
                    <Button
                      title="Excellent"
                      onPress={() => setLabCondition("Excellent")}
                      variant={
                        labCondition === "Excellent" ? "primary" : "outline"
                      }
                      style={styles.buttonGroupItem}
                      size="small"
                    />
                    <Button
                      title="Good"
                      onPress={() => setLabCondition("Good")}
                      variant={labCondition === "Good" ? "primary" : "outline"}
                      style={styles.buttonGroupItem}
                      size="small"
                    />
                    <Button
                      title="Fair"
                      onPress={() => setLabCondition("Fair")}
                      variant={labCondition === "Fair" ? "primary" : "outline"}
                      style={styles.buttonGroupItem}
                      size="small"
                    />
                    <Button
                      title="Poor"
                      onPress={() => setLabCondition("Poor")}
                      variant={labCondition === "Poor" ? "primary" : "outline"}
                      style={styles.buttonGroupItem}
                      size="small"
                    />
                  </View>
                </>
              )}

              <Text style={styles.label}>Power Backup</Text>
              <View style={styles.checkboxContainer}>
                <TouchableCheckbox
                  label="Generator"
                  checked={powerBackup.includes("Generator")}
                  onToggle={() => togglePowerBackup("Generator")}
                />
                <TouchableCheckbox
                  label="Solar"
                  checked={powerBackup.includes("Solar")}
                  onToggle={() => togglePowerBackup("Solar")}
                />
                <TouchableCheckbox
                  label="UPS"
                  checked={powerBackup.includes("UPS")}
                  onToggle={() => togglePowerBackup("UPS")}
                />
                <TouchableCheckbox
                  label="Battery Backup"
                  checked={powerBackup.includes("Battery")}
                  onToggle={() => togglePowerBackup("Battery")}
                />
              </View>

              <View style={styles.checkboxRow}>
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

              <View style={styles.checkboxRow}>
                <TouchableCheckbox
                  label="Has Secure Room"
                  checked={hasSecureRoom}
                  onToggle={() => setHasSecureRoom(!hasSecureRoom)}
                />
                <TouchableCheckbox
                  label="Has Furniture"
                  checked={hasFurniture}
                  onToggle={() => setHasFurniture(!hasFurniture)}
                />
              </View>
            </>
          )}

          {/* Connectivity Section */}
          {activeSection === "connectivity" && (
            <>
              <Text style={styles.sectionTitle}>Internet Connectivity</Text>

              <Text style={styles.label}>Connection Type</Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="None"
                  onPress={() => setConnectionType("None")}
                  variant={connectionType === "None" ? "primary" : "outline"}
                  style={styles.buttonGroupItem}
                  size="small"
                />
                <Button
                  title="Fiber"
                  onPress={() => setConnectionType("Fiber")}
                  variant={connectionType === "Fiber" ? "primary" : "outline"}
                  style={styles.buttonGroupItem}
                  size="small"
                />
                <Button
                  title="Mobile"
                  onPress={() => setConnectionType("Mobile Broadband")}
                  variant={
                    connectionType === "Mobile Broadband"
                      ? "primary"
                      : "outline"
                  }
                  style={styles.buttonGroupItem}
                  size="small"
                />
                <Button
                  title="Satellite"
                  onPress={() => setConnectionType("Satellite")}
                  variant={
                    connectionType === "Satellite" ? "primary" : "outline"
                  }
                  style={styles.buttonGroupItem}
                  size="small"
                />
              </View>

              {connectionType !== "None" && (
                <>
                  <Input
                    label="Bandwidth (Mbps)"
                    value={bandwidthMbps}
                    onChangeText={setBandwidthMbps}
                    placeholder="Enter bandwidth in Mbps"
                    keyboardType="numeric"
                    error={errors.bandwidthMbps}
                  />

                  <Input
                    label="Provider"
                    value={provider}
                    onChangeText={setProvider}
                    placeholder="Enter internet provider"
                    error={errors.provider}
                  />

                  <Text style={styles.label}>WiFi Coverage Areas</Text>
                  <View style={styles.checkboxContainer}>
                    <TouchableCheckbox
                      label="Computer Lab"
                      checked={wifiCoverage.includes("Computer Lab")}
                      onToggle={() => toggleWifiCoverage("Computer Lab")}
                    />
                    <TouchableCheckbox
                      label="Staff Room"
                      checked={wifiCoverage.includes("Staff Room")}
                      onToggle={() => toggleWifiCoverage("Staff Room")}
                    />
                    <TouchableCheckbox
                      label="Classrooms"
                      checked={wifiCoverage.includes("Classrooms")}
                      onToggle={() => toggleWifiCoverage("Classrooms")}
                    />
                    <TouchableCheckbox
                      label="Library"
                      checked={wifiCoverage.includes("Library")}
                      onToggle={() => toggleWifiCoverage("Library")}
                    />
                    <TouchableCheckbox
                      label="Administration"
                      checked={wifiCoverage.includes("Administration")}
                      onToggle={() => toggleWifiCoverage("Administration")}
                    />
                  </View>

                  <Text style={styles.label}>Connection Stability</Text>
                  <View style={styles.buttonGroup}>
                    <Button
                      title="High"
                      onPress={() => setStability("High")}
                      variant={stability === "High" ? "primary" : "outline"}
                      style={styles.buttonGroupItem}
                    />
                    <Button
                      title="Medium"
                      onPress={() => setStability("Medium")}
                      variant={stability === "Medium" ? "primary" : "outline"}
                      style={styles.buttonGroupItem}
                    />
                    <Button
                      title="Low"
                      onPress={() => setStability("Low")}
                      variant={stability === "Low" ? "primary" : "outline"}
                      style={styles.buttonGroupItem}
                    />
                  </View>

                  <View style={styles.checkboxRow}>
                    <TouchableCheckbox
                      label="Has Usage Policy"
                      checked={hasUsagePolicy}
                      onToggle={() => setHasUsagePolicy(!hasUsagePolicy)}
                    />
                    <TouchableCheckbox
                      label="Is Stable"
                      checked={isStable}
                      onToggle={() => setIsStable(!isStable)}
                    />
                  </View>
                </>
              )}
            </>
          )}

          <View style={styles.navigationButtons}>
            {activeSection !== "basic" && (
              <Button
                title="Back"
                onPress={handleBack}
                variant="outline"
                style={styles.navigationButton}
              />
            )}

            <Button
              title={activeSection === "connectivity" ? "Save School" : "Next"}
              onPress={handleNext}
              loading={isLoading}
              style={styles.navigationButton}
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
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 6,
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 16,
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
  wideButtonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  wideButtonGroupItem: {
    minWidth: "48%",
    marginBottom: 8,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "500",
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
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
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
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 40,
    gap: 12,
  },
  navigationButton: {
    flex: 1,
    height: 50,
  },
});
