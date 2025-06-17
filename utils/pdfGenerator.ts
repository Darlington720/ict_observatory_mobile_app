import jsPDF from 'jspdf';
import { School, ICTReport } from '@/types';
import { Platform } from 'react-native';

// PDF generation utility for school data
export class SchoolPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private lineHeight: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
    this.lineHeight = 6;
  }

  private addNewPageIfNeeded(requiredSpace: number = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private addTitle(text: string, fontSize: number = 16) {
    this.addNewPageIfNeeded(15);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += fontSize * 0.8;
    this.addLine();
  }

  private addSubtitle(text: string, fontSize: number = 12) {
    this.addNewPageIfNeeded(12);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += fontSize * 0.8;
  }

  private addText(label: string, value: string | number | boolean, fontSize: number = 10) {
    this.addNewPageIfNeeded(8);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${label}:`, this.margin, this.currentY);
    
    this.doc.setFont('helvetica', 'normal');
    const labelWidth = this.doc.getTextWidth(`${label}: `);
    const valueStr = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
    
    // Handle long text wrapping
    const maxWidth = this.pageWidth - this.margin - labelWidth - 10;
    const lines = this.doc.splitTextToSize(valueStr, maxWidth);
    
    this.doc.text(lines, this.margin + labelWidth, this.currentY);
    this.currentY += lines.length * this.lineHeight;
  }

  private addArray(label: string, items: string[], fontSize: number = 10) {
    if (items.length === 0) {
      this.addText(label, 'None');
      return;
    }
    
    this.addNewPageIfNeeded(8);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${label}:`, this.margin, this.currentY);
    this.currentY += this.lineHeight;
    
    this.doc.setFont('helvetica', 'normal');
    items.forEach(item => {
      this.addNewPageIfNeeded(6);
      this.doc.text(`• ${item}`, this.margin + 10, this.currentY);
      this.currentY += this.lineHeight;
    });
  }

  private addLine() {
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 8;
  }

  private addSpace(space: number = 8) {
    this.currentY += space;
  }

  private addSection(title: string, content: () => void) {
    this.addSubtitle(title);
    this.addSpace(4);
    content();
    this.addSpace(12);
  }

  generateSchoolProfile(school: School): Uint8Array {
    // Header
    this.addTitle(`School Profile: ${school.name}`, 18);
    this.addSpace(8);

    // Basic Information
    this.addSection('Basic Information', () => {
      this.addText('School Name', school.name);
      this.addText('Region', school.region);
      this.addText('District', school.district);
      this.addText('Sub-County', school.subCounty);
      this.addText('School Type', school.type);
      this.addText('Environment', school.environment);
      this.addText('EMIS Number', school.emisNumber);
      this.addText('UPI Code', school.upiCode);
      this.addText('Ownership Type', school.ownershipType);
      this.addText('School Category', school.schoolCategory);
      this.addText('Signature Program', school.signatureProgram || 'None');
      this.addText('Year Established', school.yearEstablished || 'Not specified');
    });

    // Location
    this.addSection('Location', () => {
      this.addText('Latitude', school.location.latitude.toFixed(6));
      this.addText('Longitude', school.location.longitude.toFixed(6));
    });

    // Enrollment Data
    this.addSection('Enrollment Data', () => {
      this.addText('Total Students', school.enrollmentData.totalStudents);
      this.addText('Male Students', school.enrollmentData.maleStudents);
      this.addText('Female Students', school.enrollmentData.femaleStudents);
      const genderRatio = school.enrollmentData.totalStudents > 0 
        ? ((school.enrollmentData.femaleStudents / school.enrollmentData.totalStudents) * 100).toFixed(1)
        : '0';
      this.addText('Female Enrollment Rate', `${genderRatio}%`);
    });

    // Contact Information
    this.addSection('Contact Information', () => {
      this.addText('Head Teacher', school.contactInfo.headTeacher);
      this.addText('Email', school.contactInfo.email);
      this.addText('Phone', school.contactInfo.phone);
    });

    // ICT Infrastructure
    this.addSection('ICT Infrastructure', () => {
      this.addText('Student Computers', school.ictInfrastructure.studentComputers);
      this.addText('Teacher Computers', school.ictInfrastructure.teacherComputers);
      this.addText('Projectors', school.ictInfrastructure.projectors);
      this.addText('Smart Boards', school.ictInfrastructure.smartBoards);
      this.addText('Tablets', school.ictInfrastructure.tablets);
      this.addText('Laptops', school.ictInfrastructure.laptops);
      this.addText('Has Computer Lab', school.ictInfrastructure.hasComputerLab);
      if (school.ictInfrastructure.hasComputerLab) {
        this.addText('Lab Condition', school.ictInfrastructure.labCondition);
      }
      this.addArray('Power Backup', school.ictInfrastructure.powerBackup);
      this.addText('Has ICT Room', school.ictInfrastructure.hasICTRoom);
      this.addText('Has Electricity', school.ictInfrastructure.hasElectricity);
      this.addText('Has Secure Room', school.ictInfrastructure.hasSecureRoom);
      this.addText('Has Furniture', school.ictInfrastructure.hasFurniture);
    });

    // Internet Connectivity
    this.addSection('Internet Connectivity', () => {
      this.addText('Connection Type', school.internetConnectivity.connectionType);
      if (school.internetConnectivity.connectionType !== 'None') {
        this.addText('Bandwidth (Mbps)', school.internetConnectivity.bandwidthMbps);
        this.addText('Provider', school.internetConnectivity.provider);
        this.addText('Stability', school.internetConnectivity.stability);
        this.addText('Is Stable', school.internetConnectivity.isStable);
        this.addArray('WiFi Coverage', school.internetConnectivity.wifiCoverage);
        this.addText('Has Usage Policy', school.internetConnectivity.hasUsagePolicy);
      }
    });

    // Software and Digital Resources
    this.addSection('Software and Digital Resources', () => {
      this.addText('Has Learning Management System', school.software.hasLMS);
      if (school.software.hasLMS) {
        this.addText('LMS Name', school.software.lmsName);
      }
      this.addText('Has Licensed Software', school.software.hasLicensedSoftware);
      this.addArray('Licensed Software', school.software.licensedSoftware);
      this.addText('Has Productivity Suite', school.software.hasProductivitySuite);
      this.addArray('Productivity Suite', school.software.productivitySuite);
      this.addText('Has Digital Library', school.software.hasDigitalLibrary);
      this.addText('Has Local Content', school.software.hasLocalContent);
      this.addText('Content Source', school.software.contentSource || 'None');
    });

    // Human Capacity
    this.addSection('Human Capacity and ICT Competency', () => {
      this.addText('ICT Trained Teachers', school.humanCapacity.ictTrainedTeachers);
      this.addText('Total Teachers', school.humanCapacity.totalTeachers);
      this.addText('Male Teachers', school.humanCapacity.maleTeachers);
      this.addText('Female Teachers', school.humanCapacity.femaleTeachers);
      this.addText('P5 to P7 Teachers', school.humanCapacity.p5ToP7Teachers);
      this.addText('Support Staff', school.humanCapacity.supportStaff);
      this.addText('Monthly Trainings', school.humanCapacity.monthlyTrainings);
      this.addText('Teacher Competency Level', school.humanCapacity.teacherCompetencyLevel);
      this.addText('Has Capacity Building', school.humanCapacity.hasCapacityBuilding);
      
      if (school.humanCapacity.totalTeachers > 0) {
        const trainingRate = ((school.humanCapacity.ictTrainedTeachers / school.humanCapacity.totalTeachers) * 100).toFixed(1);
        this.addText('ICT Training Rate', `${trainingRate}%`);
      }
    });

    // Pedagogical ICT Usage
    this.addSection('Pedagogical ICT Usage', () => {
      this.addText('ICT Integrated Lessons', school.pedagogicalUsage.ictIntegratedLessons);
      this.addText('Uses ICT Assessments', school.pedagogicalUsage.usesICTAssessments);
      this.addText('Has Student Projects', school.pedagogicalUsage.hasStudentProjects);
      this.addText('Uses Blended Learning', school.pedagogicalUsage.usesBlendedLearning);
      this.addText('Has Assistive Technology', school.pedagogicalUsage.hasAssistiveTech);
      this.addText('Digital Tool Usage Frequency', school.pedagogicalUsage.digitalToolUsageFrequency);
      this.addText('Has Digital Content', school.pedagogicalUsage.hasDigitalContent);
      this.addText('Has Peer Support', school.pedagogicalUsage.hasPeerSupport);
    });

    // ICT Governance and Policy
    this.addSection('ICT Governance and Policy', () => {
      this.addText('Has ICT Policy', school.governance.hasICTPolicy);
      this.addText('Aligned with National Strategy', school.governance.alignedWithNationalStrategy);
      this.addText('Has ICT Committee', school.governance.hasICTCommittee);
      this.addText('Has ICT Budget', school.governance.hasICTBudget);
      this.addText('Has Monitoring System', school.governance.hasMonitoringSystem);
      this.addText('Has Active SMC', school.governance.hasActiveSMC);
      this.addText('Has Active PTA', school.governance.hasActivePTA);
      this.addText('Has Local Leader Engagement', school.governance.hasLocalLeaderEngagement);
    });

    // Student Engagement
    this.addSection('Students\' Digital Literacy and Engagement', () => {
      this.addText('Digital Literacy Level', school.studentEngagement.digitalLiteracyLevel);
      this.addText('Has ICT Club', school.studentEngagement.hasICTClub);
      this.addText('Uses Online Platforms', school.studentEngagement.usesOnlinePlatforms);
      this.addText('Student Feedback Rating', `${school.studentEngagement.studentFeedbackRating}/5`);
      this.addText('Students Using Digital Content', school.studentEngagement.studentsUsingDigitalContent);
    });

    // Community Engagement
    this.addSection('Community and Parental Engagement', () => {
      this.addText('Has Parent Portal', school.communityEngagement.hasParentPortal);
      this.addText('Has Community Outreach', school.communityEngagement.hasCommunityOutreach);
      this.addText('Has Industry Partners', school.communityEngagement.hasIndustryPartners);
      this.addArray('Partner Organizations', school.communityEngagement.partnerOrganizations);
      this.addArray('NGO Support', school.communityEngagement.ngoSupport);
      this.addArray('Community Contributions', school.communityEngagement.communityContributions);
    });

    // Security & Safety
    this.addSection('Security & Safety', () => {
      this.addText('Is Fenced', school.security.isFenced);
      this.addText('Has Security Guard', school.security.hasSecurityGuard);
      this.addText('Has Recent Incidents', school.security.hasRecentIncidents);
      if (school.security.hasRecentIncidents) {
        this.addText('Incident Details', school.security.incidentDetails);
      }
      this.addText('Has Toilets', school.security.hasToilets);
      this.addText('Has Water Source', school.security.hasWaterSource);
    });

    // Accessibility
    this.addSection('Accessibility', () => {
      this.addText('Distance from HQ (km)', school.accessibility.distanceFromHQ);
      this.addText('Accessible All Year', school.accessibility.isAccessibleAllYear);
      this.addText('Is Inclusive', school.accessibility.isInclusive);
      this.addText('Serves Girls', school.accessibility.servesGirls);
      this.addText('Serves PWDs', school.accessibility.servesPWDs);
      this.addText('Serves Refugees', school.accessibility.servesRefugees);
      this.addText('Only School in Area', school.accessibility.isOnlySchoolInArea);
    });

    // School Facilities
    this.addSection('School Facilities & Environment', () => {
      this.addText('Permanent Classrooms', school.facilities.permanentClassrooms);
      this.addText('Semi-Permanent Classrooms', school.facilities.semiPermanentClassrooms);
      this.addText('Temporary Classrooms', school.facilities.temporaryClassrooms);
      this.addText('Pupil-Classroom Ratio', school.facilities.pupilClassroomRatio);
      this.addText('Boys Toilets', school.facilities.boysToilets);
      this.addText('Girls Toilets', school.facilities.girlsToilets);
      this.addText('Staff Toilets', school.facilities.staffToilets);
      this.addText('Water Access', school.facilities.waterAccess);
      this.addArray('Security Infrastructure', school.facilities.securityInfrastructure);
      this.addText('School Accessibility', school.facilities.schoolAccessibility);
      this.addText('Nearby Health Facility', school.facilities.nearbyHealthFacility);
      this.addText('Health Facility Distance (km)', school.facilities.healthFacilityDistance);
    });

    // Performance
    this.addSection('Performance', () => {
      this.addText('PLE Pass Rate Year 1 (%)', school.performance.plePassRateYear1);
      this.addText('PLE Pass Rate Year 2 (%)', school.performance.plePassRateYear2);
      this.addText('PLE Pass Rate Year 3 (%)', school.performance.plePassRateYear3);
      this.addText('Literacy Trends', school.performance.literacyTrends || 'Not specified');
      this.addText('Numeracy Trends', school.performance.numeracyTrends || 'Not specified');
      this.addText('Innovations', school.performance.innovations || 'None');
      this.addText('Unique Achievements', school.performance.uniqueAchievements || 'None');
    });

    // Footer
    this.addNewPageIfNeeded(30);
    this.addLine();
    this.addText('Generated on', new Date().toLocaleString());
    this.addText('Sync Status', school.synced ? 'Synced' : 'Not Synced');
    this.addText('Last Updated', new Date(school.lastUpdated).toLocaleString());

    return this.doc.output('arraybuffer');
  }

  generateSchoolReports(school: School, reports: ICTReport[]): Uint8Array {
    // Header
    this.addTitle(`ICT Reports: ${school.name}`, 18);
    this.addSpace(8);

    // School Summary
    this.addSection('School Information', () => {
      this.addText('School Name', school.name);
      this.addText('District', school.district);
      this.addText('Sub-County', school.subCounty);
      this.addText('Type', school.type);
      this.addText('Total Students', school.enrollmentData.totalStudents);
    });

    if (reports.length === 0) {
      this.addText('Reports', 'No reports available for this school');
      return this.doc.output('arraybuffer');
    }

    // Reports Summary
    this.addSection('Reports Summary', () => {
      this.addText('Total Reports', reports.length);
      this.addText('Date Range', `${reports[reports.length - 1]?.date} to ${reports[0]?.date}`);
    });

    // Individual Reports
    reports.forEach((report, index) => {
      this.addTitle(`Report ${index + 1}: ${report.period}`, 14);
      
      this.addSection('Report Details', () => {
        this.addText('Period', report.period);
        this.addText('Date', new Date(report.date).toLocaleDateString());
      });

      this.addSection('Infrastructure', () => {
        this.addText('Computers', report.infrastructure.computers);
        this.addText('Tablets', report.infrastructure.tablets);
        this.addText('Projectors', report.infrastructure.projectors);
        this.addText('Printers', report.infrastructure.printers);
        this.addText('Functional Devices', report.infrastructure.functionalDevices);
        
        const totalDevices = report.infrastructure.computers + report.infrastructure.tablets;
        const workingRate = totalDevices > 0 ? ((report.infrastructure.functionalDevices / totalDevices) * 100).toFixed(1) : '0';
        this.addText('Working Rate', `${workingRate}%`);
        
        this.addText('Internet Connection', report.infrastructure.internetConnection);
        if (report.infrastructure.internetConnection !== 'None') {
          this.addText('Internet Speed (Mbps)', report.infrastructure.internetSpeedMbps);
        }
        this.addArray('Power Sources', report.infrastructure.powerSource);
        this.addText('Power Backup', report.infrastructure.powerBackup);
      });

      this.addSection('Usage', () => {
        this.addText('Teachers Using ICT', report.usage.teachersUsingICT);
        this.addText('Total Teachers', report.usage.totalTeachers);
        
        const teacherUsageRate = report.usage.totalTeachers > 0 
          ? ((report.usage.teachersUsingICT / report.usage.totalTeachers) * 100).toFixed(1)
          : '0';
        this.addText('Teacher ICT Usage Rate', `${teacherUsageRate}%`);
        
        this.addText('Weekly Computer Lab Hours', report.usage.weeklyComputerLabHours);
        this.addText('Student Digital Literacy Rate', `${report.usage.studentDigitalLiteracyRate}%`);
      });

      this.addSection('Software', () => {
        this.addArray('Operating Systems', report.software.operatingSystems);
        this.addArray('Educational Software', report.software.educationalSoftware);
        this.addText('Office Applications', report.software.officeApplications);
      });

      this.addSection('Capacity', () => {
        this.addText('ICT Trained Teachers', report.capacity.ictTrainedTeachers);
        this.addText('Support Staff', report.capacity.supportStaff);
        
        const trainingRate = report.usage.totalTeachers > 0 
          ? ((report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 100).toFixed(1)
          : '0';
        this.addText('Teacher Training Rate', `${trainingRate}%`);
      });

      this.addSpace(16);
    });

    // Footer
    this.addNewPageIfNeeded(20);
    this.addLine();
    this.addText('Generated on', new Date().toLocaleString());

    return this.doc.output('arraybuffer');
  }
}

// Helper function to download PDF
export const downloadPDF = async (
  pdfData: Uint8Array, 
  filename: string
): Promise<void> => {
  if (Platform.OS === 'web') {
    // Web download
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Mobile - would need expo-file-system and expo-sharing
    console.log('PDF generation completed for mobile - implement file system save');
  }
};