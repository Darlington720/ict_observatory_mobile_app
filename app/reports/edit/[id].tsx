import Button from "@/components/Button";
import Input from "@/components/Input";
import { colors } from "@/constants/Colors";
import { useSchoolStore } from "@/store/schoolStore";
import { ICTReport } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  BookOpen,
  Camera,
  Laptop,
  Users,
  Wifi,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
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

export default function EditReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getReportById, getSchoolById, updateReport } = useSchoolStore();

  const report = getReportById(id);

  // If report not found, show error
  if (!report) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Report not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const school = getSchoolById(report.schoolId);

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

  // Form state
  const [date, setDate] = useState(report.date);
  const [period, setPeriod] = useState(report.period);

  // Infrastructure
  const [computers, setComputers] = useState(
    report.infrastructure.computers.toString()
  );
  const [tablets, setTablets] = useState(
    report.infrastructure.tablets.toString()
  );
  const [projectors, setProjectors] = useState(
    report.infrastructure.projectors.toString()
  );
  const [printers, setPrinters] = useState(
    report.infrastructure.printers.toString()
  );
  const [internetConnection, setInternetConnection] = useState<
    "None" | "Slow" | "Medium" | "Fast"
  >(report.infrastructure.internetConnection);
  const [internetSpeed, setInternetSpeed] = useState(
    report.infrastructure.internetSpeedMbps.toString()
  );
  const [powerSources, setPowerSources] = useState<
    Array<"NationalGrid" | "Solar" | "Generator">
  >(report.infrastructure.powerSource);
  const [powerBackup, setPowerBackup] = useState(
    report.infrastructure.powerBackup
  );
  const [functionalDevices, setFunctionalDevices] = useState(
    report.infrastructure.functionalDevices.toString()
  );

  // Usage
  const [teachersUsingICT, setTeachersUsingICT] = useState(
    report.usage.teachersUsingICT.toString()
  );
  const [totalTeachers, setTotalTeachers] = useState(
    report.usage.totalTeachers.toString()
  );
  const [weeklyLabHours, setWeeklyLabHours] = useState(
    report.usage.weeklyComputerLabHours.toString()
  );
  const [literacyRate, setLiteracyRate] = useState(
    report.usage.studentDigitalLiteracyRate.toString()
  );

  // Software
  const [operatingSystems, setOperatingSystems] = useState<string[]>(
    report.software.operatingSystems
  );
  const [educationalSoftware, setEducationalSoftware] = useState<string[]>(
    report.software.educationalSoftware
  );
  const [officeApplications, setOfficeApplications] = useState(
    report.software.officeApplications
  );

  // Capacity
  const [trainedTeachers, setTrainedTeachers] = useState(
    report.capacity.ictTrainedTeachers.toString()
  );
  const [supportStaff, setSupportStaff] = useState(
    report.capacity.supportStaff.toString()
  );

  // Photos
  const [photos, setPhotos] = useState<string[]>(report.photos);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Get month and year for period selection
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Extract month and year from period if it's in the format "YYYY-MMM"
    const match = report.period.match(/^(\d{4})-([A-Z]{3})$/);
    if (match) {
      return match[2];
    }
    return "JAN"; // Default to January if format doesn't match
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    const match = report.period.match(/^(\d{4})-([A-Z]{3})$/);
    if (match) {
      return match[1];
    }
    return new Date().getFullYear().toString(); // Default to current year
  });

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Generate years (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) =>
    (currentYear - 5 + i).toString()
  );

  const togglePowerSource = (
    source: "NationalGrid" | "Solar" | "Generator"
  ) => {
    if (powerSources.includes(source)) {
      setPowerSources(powerSources.filter((s) => s !== source));
    } else {
      setPowerSources([...powerSources, source]);
    }
  };

  const toggleOS = (os: string) => {
    if (operatingSystems.includes(os)) {
      setOperatingSystems(operatingSystems.filter((s) => s !== os));
    } else {
      setOperatingSystems([...operatingSystems, os]);
    }
  };

  const toggleEducationalSoftware = (software: string) => {
    if (educationalSoftware.includes(software)) {
      setEducationalSoftware(educationalSoftware.filter((s) => s !== software));
    } else {
      setEducationalSoftware([...educationalSoftware, software]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate infrastructure
    if (
      !computers.trim() ||
      isNaN(parseInt(computers)) ||
      parseInt(computers) < 0
    ) {
      newErrors.computers = "Enter a valid number of computers";
    }

    if (!tablets.trim() || isNaN(parseInt(tablets)) || parseInt(tablets) < 0) {
      newErrors.tablets = "Enter a valid number of tablets";
    }

    if (
      !projectors.trim() ||
      isNaN(parseInt(projectors)) ||
      parseInt(projectors) < 0
    ) {
      newErrors.projectors = "Enter a valid number of projectors";
    }

    if (
      !printers.trim() ||
      isNaN(parseInt(printers)) ||
      parseInt(printers) < 0
    ) {
      newErrors.printers = "Enter a valid number of printers";
    }

    if (
      internetConnection !== "None" &&
      (!internetSpeed.trim() ||
        isNaN(parseFloat(internetSpeed)) ||
        parseFloat(internetSpeed) <= 0)
    ) {
      newErrors.internetSpeed = "Enter a valid internet speed";
    }

    if (
      !functionalDevices.trim() ||
      isNaN(parseInt(functionalDevices)) ||
      parseInt(functionalDevices) < 0
    ) {
      newErrors.functionalDevices =
        "Enter a valid number of functional devices";
    }

    const totalDevices = parseInt(computers) + parseInt(tablets);
    if (parseInt(functionalDevices) > totalDevices) {
      newErrors.functionalDevices =
        "Functional devices cannot exceed total devices";
    }

    // Validate usage
    if (
      !teachersUsingICT.trim() ||
      isNaN(parseInt(teachersUsingICT)) ||
      parseInt(teachersUsingICT) < 0
    ) {
      newErrors.teachersUsingICT = "Enter a valid number of teachers using ICT";
    }

    if (
      !totalTeachers.trim() ||
      isNaN(parseInt(totalTeachers)) ||
      parseInt(totalTeachers) <= 0
    ) {
      newErrors.totalTeachers = "Enter a valid number of total teachers";
    }

    if (parseInt(teachersUsingICT) > parseInt(totalTeachers)) {
      newErrors.teachersUsingICT = "Cannot exceed total teachers";
    }

    if (
      !weeklyLabHours.trim() ||
      isNaN(parseInt(weeklyLabHours)) ||
      parseInt(weeklyLabHours) < 0
    ) {
      newErrors.weeklyLabHours = "Enter valid weekly lab hours";
    }

    if (
      !literacyRate.trim() ||
      isNaN(parseFloat(literacyRate)) ||
      parseFloat(literacyRate) < 0 ||
      parseFloat(literacyRate) > 100
    ) {
      newErrors.literacyRate = "Enter a percentage between 0-100";
    }

    // Validate capacity
    if (
      !trainedTeachers.trim() ||
      isNaN(parseInt(trainedTeachers)) ||
      parseInt(trainedTeachers) < 0
    ) {
      newErrors.trainedTeachers = "Enter a valid number of trained teachers";
    }

    if (parseInt(trainedTeachers) > parseInt(totalTeachers)) {
      newErrors.trainedTeachers = "Cannot exceed total teachers";
    }

    if (
      !supportStaff.trim() ||
      isNaN(parseInt(supportStaff)) ||
      parseInt(supportStaff) < 0
    ) {
      newErrors.supportStaff = "Enter a valid number of support staff";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Create updated report
    const updatedReport: ICTReport = {
      ...report,
      date,
      period: `${selectedYear}-${selectedMonth}`,
      infrastructure: {
        computers: parseInt(computers),
        tablets: parseInt(tablets),
        projectors: parseInt(projectors),
        printers: parseInt(printers),
        internetConnection,
        internetSpeedMbps:
          internetConnection === "None" ? 0 : parseFloat(internetSpeed),
        powerSource: powerSources,
        powerBackup,
        functionalDevices: parseInt(functionalDevices),
      },
      usage: {
        teachersUsingICT: parseInt(teachersUsingICT),
        totalTeachers: parseInt(totalTeachers),
        weeklyComputerLabHours: parseInt(weeklyLabHours),
        studentDigitalLiteracyRate: parseFloat(literacyRate),
      },
      software: {
        operatingSystems,
        educationalSoftware,
        officeApplications,
      },
      capacity: {
        ictTrainedTeachers: parseInt(trainedTeachers),
        supportStaff: parseInt(supportStaff),
      },
      photos,
      // These will be updated by the store
      // synced: false,
      // lastUpdated: new Date().toISOString(),
    };

    // Update in store
    updateReport(updatedReport);

    // Show success message and navigate back
    Alert.alert("Report Updated", "ICT report has been successfully updated.", [
      {
        text: "OK",
        onPress: () => router.replace(`/reports/${id}`),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.schoolName}>{school.name}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Information</Text>

            <Input
              label="Date"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              error={errors.date}
            />

            <Text style={styles.label}>Reporting Period</Text>

            <View style={styles.periodContainer}>
              <View style={styles.halfWidth}>
                <Text style={styles.sublabel}>Year</Text>
                <View style={styles.yearContainer}>
                  {years.map((year) => (
                    <Button
                      key={year}
                      title={year}
                      onPress={() => setSelectedYear(year)}
                      variant={selectedYear === year ? "primary" : "outline"}
                      style={styles.yearButton}
                      size="small"
                    />
                  ))}
                </View>
              </View>

              <View style={styles.halfWidth}>
                <Text style={styles.sublabel}>Month</Text>
                <View style={styles.monthContainer}>
                  {months.map((month) => (
                    <Button
                      key={month}
                      title={month}
                      onPress={() => setSelectedMonth(month)}
                      variant={selectedMonth === month ? "primary" : "outline"}
                      style={styles.monthButton}
                      size="small"
                    />
                  ))}
                </View>
              </View>
            </View>

            <Text style={styles.periodPreview}>
              Period: {selectedYear}-{selectedMonth}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Laptop size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Infrastructure</Text>
            </View>

            <View style={styles.row}>
              <Input
                label="Computers"
                value={computers}
                onChangeText={setComputers}
                placeholder="0"
                keyboardType="numeric"
                error={errors.computers}
                containerStyle={styles.halfWidth}
              />

              <Input
                label="Tablets"
                value={tablets}
                onChangeText={setTablets}
                placeholder="0"
                keyboardType="numeric"
                error={errors.tablets}
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
                label="Printers"
                value={printers}
                onChangeText={setPrinters}
                placeholder="0"
                keyboardType="numeric"
                error={errors.printers}
                containerStyle={styles.halfWidth}
              />
            </View>

            <Input
              label="Functional Devices"
              value={functionalDevices}
              onChangeText={setFunctionalDevices}
              placeholder="Number of working computers and tablets"
              keyboardType="numeric"
              error={errors.functionalDevices}
            />

            <View style={styles.subsection}>
              <View style={styles.subsectionHeader}>
                <Wifi size={18} color={colors.primary} />
                <Text style={styles.subsectionTitle}>Internet Connection</Text>
              </View>

              <View style={styles.buttonGroup}>
                <Button
                  title="None"
                  onPress={() => setInternetConnection("None")}
                  variant={
                    internetConnection === "None" ? "primary" : "outline"
                  }
                  style={styles.internetButton}
                  size="small"
                />
                <Button
                  title="Slow"
                  onPress={() => setInternetConnection("Slow")}
                  variant={
                    internetConnection === "Slow" ? "primary" : "outline"
                  }
                  style={styles.internetButton}
                  size="small"
                />
                <Button
                  title="Medium"
                  onPress={() => setInternetConnection("Medium")}
                  variant={
                    internetConnection === "Medium" ? "primary" : "outline"
                  }
                  style={styles.internetButton}
                  size="small"
                />
                <Button
                  title="Fast"
                  onPress={() => setInternetConnection("Fast")}
                  variant={
                    internetConnection === "Fast" ? "primary" : "outline"
                  }
                  style={styles.internetButton}
                  size="small"
                />
              </View>

              {internetConnection !== "None" && (
                <Input
                  label="Internet Speed (Mbps)"
                  value={internetSpeed}
                  onChangeText={setInternetSpeed}
                  placeholder="Enter speed in Mbps"
                  keyboardType="numeric"
                  error={errors.internetSpeed}
                />
              )}
            </View>

            <View style={styles.subsection}>
              <View style={styles.subsectionHeader}>
                <Zap size={18} color={colors.primary} />
                <Text style={styles.subsectionTitle}>Power Source</Text>
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableCheckbox
                  label="National Grid"
                  checked={powerSources.includes("NationalGrid")}
                  onToggle={() => togglePowerSource("NationalGrid")}
                />

                <TouchableCheckbox
                  label="Solar"
                  checked={powerSources.includes("Solar")}
                  onToggle={() => togglePowerSource("Solar")}
                />

                <TouchableCheckbox
                  label="Generator"
                  checked={powerSources.includes("Generator")}
                  onToggle={() => togglePowerSource("Generator")}
                />
              </View>

              <TouchableCheckbox
                label="Power Backup Available"
                checked={powerBackup}
                onToggle={() => setPowerBackup(!powerBackup)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Usage</Text>
            </View>

            <View style={styles.row}>
              <Input
                label="Teachers Using ICT"
                value={teachersUsingICT}
                onChangeText={setTeachersUsingICT}
                placeholder="0"
                keyboardType="numeric"
                error={errors.teachersUsingICT}
                containerStyle={styles.halfWidth}
              />

              <Input
                label="Total Teachers"
                value={totalTeachers}
                onChangeText={setTotalTeachers}
                placeholder="0"
                keyboardType="numeric"
                error={errors.totalTeachers}
                containerStyle={styles.halfWidth}
              />
            </View>

            <Input
              label="Weekly Computer Lab Hours"
              value={weeklyLabHours}
              onChangeText={setWeeklyLabHours}
              placeholder="Hours per week"
              keyboardType="numeric"
              error={errors.weeklyLabHours}
            />

            <Input
              label="Student Digital Literacy Rate (%)"
              value={literacyRate}
              onChangeText={setLiteracyRate}
              placeholder="0-100"
              keyboardType="numeric"
              error={errors.literacyRate}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Software</Text>
            </View>

            <Text style={styles.label}>Operating Systems</Text>
            <View style={styles.checkboxContainer}>
              <TouchableCheckbox
                label="Windows"
                checked={operatingSystems.includes("Windows")}
                onToggle={() => toggleOS("Windows")}
              />

              <TouchableCheckbox
                label="MacOS"
                checked={operatingSystems.includes("MacOS")}
                onToggle={() => toggleOS("MacOS")}
              />

              <TouchableCheckbox
                label="Linux"
                checked={operatingSystems.includes("Linux")}
                onToggle={() => toggleOS("Linux")}
              />

              <TouchableCheckbox
                label="Chrome OS"
                checked={operatingSystems.includes("Chrome OS")}
                onToggle={() => toggleOS("Chrome OS")}
              />
            </View>

            <Text style={styles.label}>Educational Software</Text>
            <View style={styles.checkboxContainer}>
              <TouchableCheckbox
                label="Khan Academy"
                checked={educationalSoftware.includes("Khan Academy")}
                onToggle={() => toggleEducationalSoftware("Khan Academy")}
              />

              <TouchableCheckbox
                label="Scratch"
                checked={educationalSoftware.includes("Scratch")}
                onToggle={() => toggleEducationalSoftware("Scratch")}
              />

              <TouchableCheckbox
                label="GeoGebra"
                checked={educationalSoftware.includes("GeoGebra")}
                onToggle={() => toggleEducationalSoftware("GeoGebra")}
              />

              <TouchableCheckbox
                label="Typing Tutor"
                checked={educationalSoftware.includes("Typing Tutor")}
                onToggle={() => toggleEducationalSoftware("Typing Tutor")}
              />
            </View>

            <TouchableCheckbox
              label="Office Applications Available"
              checked={officeApplications}
              onToggle={() => setOfficeApplications(!officeApplications)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capacity</Text>

            <Input
              label="ICT Trained Teachers"
              value={trainedTeachers}
              onChangeText={setTrainedTeachers}
              placeholder="0"
              keyboardType="numeric"
              error={errors.trainedTeachers}
            />

            <Input
              label="ICT Support Staff"
              value={supportStaff}
              onChangeText={setSupportStaff}
              placeholder="0"
              keyboardType="numeric"
              error={errors.supportStaff}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Camera size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Photos</Text>
            </View>

            <Button
              title="Manage Photos"
              onPress={() => {
                // In a real app, we would use expo-image-picker
                Alert.alert(
                  "Photo Management",
                  "This would open the photo management interface in a real app."
                );
              }}
              variant="outline"
              style={styles.photoButton}
            />

            {photos.length > 0 ? (
              <Text style={styles.photoCount}>
                {photos.length} photos added
              </Text>
            ) : (
              <Text style={styles.photoHint}>
                Add photos of computer labs, equipment, etc.
              </Text>
            )}
          </View>

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

// Custom checkbox component
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
  schoolName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  subsection: {
    marginTop: 16,
    marginBottom: 16,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  periodContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  yearContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  monthContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  yearButton: {
    minWidth: 60,
    marginBottom: 8,
  },
  monthButton: {
    minWidth: 50,
    marginBottom: 8,
  },
  periodPreview: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  internetButton: {
    flex: 1,
    minWidth: 70,
  },
  checkboxContainer: {
    marginBottom: 16,
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
  photoButton: {
    marginBottom: 12,
  },
  photoCount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  photoHint: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
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
    justifyContent: "center",
    alignItems: "center",
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
