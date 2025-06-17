import { ICTReport, School } from "@/types";

// Function to generate CSV content for a report
export const generateReportCSV = (
  report: ICTReport,
  school: School
): string => {
  // Create CSV header
  let csv = "School ICT Report\n\n";

  // School information
  csv += "SCHOOL INFORMATION\n";
  csv += `School Name,${school.name}\n`;
  csv += `District,${school.district}\n`;
  csv += `Sub-County,${school.subCounty}\n`;
  csv += `School Type,${school.type}\n`;
  csv += `Environment,${school.environment}\n`;
  csv += `Total Students,${school.enrollmentData.totalStudents}\n`;
  csv += `Male Students,${school.enrollmentData.maleStudents}\n`;
  csv += `Female Students,${school.enrollmentData.femaleStudents}\n`;
  csv += `Head Teacher,${school.contactInfo.headTeacher}\n`;
  csv += `Contact Email,${school.contactInfo.email}\n`;
  csv += `Contact Phone,${school.contactInfo.phone}\n\n`;

  // Report information
  csv += "REPORT INFORMATION\n";
  csv += `Period,${report.period}\n`;
  csv += `Date,${report.date}\n\n`;

  // Infrastructure
  csv += "INFRASTRUCTURE\n";
  csv += `Computers,${report.infrastructure.computers}\n`;
  csv += `Tablets,${report.infrastructure.tablets}\n`;
  csv += `Projectors,${report.infrastructure.projectors}\n`;
  csv += `Printers,${report.infrastructure.printers}\n`;
  csv += `Functional Devices,${report.infrastructure.functionalDevices}\n`;
  csv += `Working Rate,${Math.round(
    (report.infrastructure.functionalDevices /
      (report.infrastructure.computers + report.infrastructure.tablets)) *
      100
  )}%\n`;
  csv += `Internet Connection,${report.infrastructure.internetConnection}\n`;

  if (report.infrastructure.internetConnection !== "None") {
    csv += `Internet Speed,${report.infrastructure.internetSpeedMbps} Mbps\n`;
  }

  csv += `Power Sources,${report.infrastructure.powerSource.join(", ")}\n`;
  csv += `Power Backup,${
    report.infrastructure.powerBackup ? "Available" : "Not Available"
  }\n\n`;

  // Usage
  csv += "USAGE\n";
  csv += `Teachers Using ICT,${report.usage.teachersUsingICT}\n`;
  csv += `Total Teachers,${report.usage.totalTeachers}\n`;
  csv += `Teacher ICT Usage Rate,${Math.round(
    (report.usage.teachersUsingICT / report.usage.totalTeachers) * 100
  )}%\n`;
  csv += `Weekly Computer Lab Hours,${report.usage.weeklyComputerLabHours}\n`;
  csv += `Student Digital Literacy Rate,${report.usage.studentDigitalLiteracyRate}%\n\n`;

  // Software
  csv += "SOFTWARE\n";
  csv += `Operating Systems,${report.software.operatingSystems.join(", ")}\n`;
  csv += `Educational Software,${
    report.software.educationalSoftware.length > 0
      ? report.software.educationalSoftware.join(", ")
      : "None"
  }\n`;
  csv += `Office Applications,${
    report.software.officeApplications ? "Available" : "Not Available"
  }\n\n`;

  // Capacity
  csv += "CAPACITY\n";
  csv += `ICT Trained Teachers,${report.capacity.ictTrainedTeachers}\n`;
  csv += `Teacher Training Rate,${Math.round(
    (report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 100
  )}%\n`;
  csv += `ICT Support Staff,${report.capacity.supportStaff}\n\n`;

  // Report metadata
  csv += "METADATA\n";
  csv += `Report ID,${report.id}\n`;
  csv += `Last Updated,${new Date(report.lastUpdated).toLocaleString()}\n`;
  csv += `Sync Status,${report.synced ? "Synced" : "Not Synced"}\n`;

  return csv;
};

// Function to generate CSV content for all reports of a school
export const generateSchoolReportsCSV = (
  school: School,
  reports: ICTReport[]
): string => {
  if (reports.length === 0) {
    return "No reports available for this school.";
  }

  // Create CSV header
  let csv = `School ICT Reports - ${school.name}\n\n`;

  // School information
  csv += "SCHOOL INFORMATION\n";
  csv += `School Name,${school.name}\n`;
  csv += `District,${school.district}\n`;
  csv += `Sub-County,${school.subCounty}\n`;
  csv += `School Type,${school.type}\n`;
  csv += `Environment,${school.environment}\n`;
  csv += `Total Students,${school.enrollmentData.totalStudents}\n\n`;

  // Reports header
  csv += "REPORTS\n";
  csv +=
    "Period,Date,Computers,Tablets,Functional Devices,Working Rate,Internet,Speed (Mbps),Teachers Using ICT,Total Teachers,ICT Usage Rate,Literacy Rate\n";

  // Add each report as a row
  reports.forEach((report) => {
    const workingRate = Math.round(
      (report.infrastructure.functionalDevices /
        (report.infrastructure.computers + report.infrastructure.tablets)) *
        100
    );

    const teacherUsageRate = Math.round(
      (report.usage.teachersUsingICT / report.usage.totalTeachers) * 100
    );

    csv += `${report.period},${report.date},${report.infrastructure.computers},${report.infrastructure.tablets},`;
    csv += `${report.infrastructure.functionalDevices},${workingRate}%,${report.infrastructure.internetConnection},`;
    csv += `${report.infrastructure.internetSpeedMbps},${report.usage.teachersUsingICT},${report.usage.totalTeachers},`;
    csv += `${teacherUsageRate}%,${report.usage.studentDigitalLiteracyRate}%\n`;
  });

  return csv;
};

// Function to generate CSV content for all schools
export const generateAllSchoolsCSV = (schools: School[]): string => {
  if (schools.length === 0) {
    return "No schools available.";
  }

  // Create CSV header
  let csv = "All Schools\n\n";

  // Schools header
  csv +=
    "Name,District,Sub-County,Type,Environment,Total Students,Male Students,Female Students,Head Teacher,Contact\n";

  // Add each school as a row
  schools.forEach((school) => {
    csv += `${school.name},${school.district},${school.subCounty},${school.type},${school.environment},`;
    csv += `${school.enrollmentData.totalStudents},${school.enrollmentData.maleStudents},${school.enrollmentData.femaleStudents},`;
    csv += `${school.contactInfo.headTeacher},${school.contactInfo.phone}\n`;
  });

  return csv;
};
