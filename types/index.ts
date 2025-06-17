export type School = {
  id: string;
  name: string;
  region: string;
  district: string;
  subCounty: string;
  location: {
    latitude: number;
    longitude: number;
  };
  type: "Public" | "Private";
  environment: "Urban" | "Rural";
  emisNumber: string;
  upiCode: string;
  ownershipType: "Government" | "Government-aided" | "Community" | "Private";
  schoolCategory: "Mixed" | "Girls" | "Boys" | "Special Needs";
  signatureProgram: string;
  yearEstablished: number;

  enrollmentData: {
    totalStudents: number;
    maleStudents: number;
    femaleStudents: number;
  };

  contactInfo: {
    headTeacher: string;
    email: string;
    phone: string;
  };

  // ICT Infrastructure
  ictInfrastructure: {
    studentComputers: number;
    teacherComputers: number;
    projectors: number;
    smartBoards: number;
    tablets: number;
    laptops: number;
    hasComputerLab: boolean;
    labCondition: "Excellent" | "Good" | "Fair" | "Poor";
    powerBackup: string[];
    hasICTRoom: boolean;
    hasElectricity: boolean;
    hasSecureRoom: boolean;
    hasFurniture: boolean;
  };

  // Internet Connectivity
  internetConnectivity: {
    connectionType: "None" | "Fiber" | "Mobile Broadband" | "Satellite";
    bandwidthMbps: number;
    wifiCoverage: string[];
    stability: "High" | "Medium" | "Low";
    hasUsagePolicy: boolean;
    provider: string;
    isStable: boolean;
  };

  // ICT Software and Digital Resources
  software: {
    hasLMS: boolean;
    lmsName: string;
    hasLicensedSoftware: boolean;
    licensedSoftware: string[];
    hasProductivitySuite: boolean;
    productivitySuite: string[];
    hasDigitalLibrary: boolean;
    hasLocalContent: boolean;
    contentSource: string;
  };

  // Human Capacity and ICT Competency
  humanCapacity: {
    ictTrainedTeachers: number;
    totalTeachers: number;
    maleTeachers: number;
    femaleTeachers: number;
    p5ToP7Teachers: number;
    supportStaff: number;
    monthlyTrainings: number;
    teacherCompetencyLevel: "Basic" | "Intermediate" | "Advanced";
    hasCapacityBuilding: boolean;
  };

  // Pedagogical ICT Usage
  pedagogicalUsage: {
    ictIntegratedLessons: number;
    usesICTAssessments: boolean;
    hasStudentProjects: boolean;
    usesBlendedLearning: boolean;
    hasAssistiveTech: boolean;
    digitalToolUsageFrequency: "Daily" | "Weekly" | "Rarely" | "Never";
    hasDigitalContent: boolean;
    hasPeerSupport: boolean;
  };

  // ICT Governance and Policy
  governance: {
    hasICTPolicy: boolean;
    alignedWithNationalStrategy: boolean;
    hasICTCommittee: boolean;
    hasICTBudget: boolean;
    hasMonitoringSystem: boolean;
    hasActiveSMC: boolean;
    hasActivePTA: boolean;
    hasLocalLeaderEngagement: boolean;
  };

  // Students' Digital Literacy and Engagement
  studentEngagement: {
    digitalLiteracyLevel: "Basic" | "Intermediate" | "Advanced";
    hasICTClub: boolean;
    usesOnlinePlatforms: boolean;
    studentFeedbackRating: 1 | 2 | 3 | 4 | 5;
    studentsUsingDigitalContent: number;
  };

  // Community and Parental Engagement
  communityEngagement: {
    hasParentPortal: boolean;
    hasCommunityOutreach: boolean;
    hasIndustryPartners: boolean;
    partnerOrganizations: string[];
    ngoSupport: string[];
    communityContributions: string[];
  };

  // Security & Safety
  security: {
    isFenced: boolean;
    hasSecurityGuard: boolean;
    hasRecentIncidents: boolean;
    incidentDetails: string;
    hasToilets: boolean;
    hasWaterSource: boolean;
  };

  // Accessibility
  accessibility: {
    distanceFromHQ: number;
    isAccessibleAllYear: boolean;
    isInclusive: boolean;
    servesGirls: boolean;
    servesPWDs: boolean;
    servesRefugees: boolean;
    isOnlySchoolInArea: boolean;
  };

  // School Facilities & Environment
  facilities: {
    permanentClassrooms: number;
    semiPermanentClassrooms: number;
    temporaryClassrooms: number;
    pupilClassroomRatio: number;
    boysToilets: number;
    girlsToilets: number;
    staffToilets: number;
    waterAccess: "Borehole" | "Tap" | "Rainwater" | "None";
    securityInfrastructure: string[];
    schoolAccessibility: "All-Weather" | "Seasonal" | "Remote";
    nearbyHealthFacility: string;
    healthFacilityDistance: number;
  };

  // Performance
  performance: {
    plePassRateYear1: number;
    plePassRateYear2: number;
    plePassRateYear3: number;
    literacyTrends: string;
    numeracyTrends: string;
    innovations: string;
    uniqueAchievements: string;
  };

  synced: boolean;
  lastUpdated: string;
};

export type ICTReport = {
  id: string;
  schoolId: string;
  date: string;
  period: string;
  infrastructure: {
    computers: number;
    tablets: number;
    projectors: number;
    printers: number;
    internetConnection: "None" | "Slow" | "Medium" | "Fast";
    internetSpeedMbps: number;
    powerSource: Array<"NationalGrid" | "Solar" | "Generator">;
    powerBackup: boolean;
    functionalDevices: number;
  };
  usage: {
    teachersUsingICT: number;
    totalTeachers: number;
    weeklyComputerLabHours: number;
    studentDigitalLiteracyRate: number;
  };
  software: {
    operatingSystems: string[];
    educationalSoftware: string[];
    officeApplications: boolean;
  };
  capacity: {
    ictTrainedTeachers: number;
    supportStaff: number;
  };
  photos: string[];
  synced: boolean;
  lastUpdated: string;
};

export type SyncStatus = "pending" | "synced" | "failed";

export type SyncLog = {
  id: string;
  timestamp: string;
  type: "school" | "report";
  itemId: string;
  status: SyncStatus;
  message?: string;
};
