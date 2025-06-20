import Button from '@/components/Button';
import Card from '@/components/Card';
import PDFDownloadButton from '@/components/PDFDownloadButton';
import ReportCard from '@/components/ReportCard';
import SyncIndicator from '@/components/SyncIndicator';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { SchoolPDFGenerator, downloadPDF } from '@/utils/pdfGenerator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Building, Calendar, Camera, LocationEdit as Edit3, Globe, GraduationCap, HardDrive, Heart, Chrome as Home, Laptop, Mail, MapPin, Monitor, Phone, Plus, School as SchoolIcon, Settings, Share2, Shield, Trash2, TrendingUp, User, Users, Wifi, Zap } from 'lucide-react-native';
import React from 'react';
import { 
  Alert, 
  ScrollView, 
  Share, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View
} from 'react-native';

export default function SchoolDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSchoolById, getReportsBySchool, deleteSchool } = useSchoolStore();
  
  const school = getSchoolById(id);
  const reports = getReportsBySchool(id);
  
  if (!school) {
    return (
      <View style={styles.notFound}>
        <SchoolIcon size={48} color={colors.textSecondary} />
        <Text style={styles.notFoundText}>School not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
      </View>
    );
  }
  
  const handleEdit = () => {
    router.push(`/schools/edit/${id}`);
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete School',
      'Are you sure you want to delete this school? All associated reports will also be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteSchool(id);
            router.replace('/');
          }
        },
      ]
    );
  };
  
  const handleAddReport = () => {
    router.push(`/reports/add/${id}`);
  };
  
  const handleDownloadProfile = async () => {
    const generator = new SchoolPDFGenerator();
    const pdfData = generator.generateSchoolProfile(school);
    const filename = `School_Profile_${school.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    
    await downloadPDF(pdfData, filename);
  };

  const handleDownloadReports = async () => {
    if (reports.length === 0) {
      Alert.alert('No Reports', 'There are no reports to download for this school.');
      return;
    }

    const generator = new SchoolPDFGenerator();
    const pdfData = generator.generateSchoolReports(school, reports);
    const filename = `School_Reports_${school.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    
    await downloadPDF(pdfData, filename);
  };

  // Calculate some statistics
  const totalDevices = school.ictInfrastructure.studentComputers + 
                      school.ictInfrastructure.teacherComputers + 
                      school.ictInfrastructure.tablets + 
                      school.ictInfrastructure.laptops;

  const teacherTrainingRate = school.humanCapacity.totalTeachers > 0 
    ? ((school.humanCapacity.ictTrainedTeachers / school.humanCapacity.totalTeachers) * 100).toFixed(1)
    : '0';

  const femaleEnrollmentRate = school.enrollmentData.totalStudents > 0 
    ? ((school.enrollmentData.femaleStudents / school.enrollmentData.totalStudents) * 100).toFixed(1)
    : '0';
  
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.schoolIcon}>
            <SchoolIcon size={24} color={colors.primary} />
          </View>
          <View style={styles.titleInfo}>
            <Text style={styles.title}>{school.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={styles.location}>
                {school.district}, {school.subCounty}
              </Text>
            </View>
          </View>
          <SyncIndicator status={school.synced ? 'synced' : 'pending'} />
        </View>
        
        <View style={styles.actions}>
          <Button
            title="Edit"
            onPress={handleEdit}
            variant="outline"
            icon={<Edit3 size={16} color={colors.primary} />}
            style={styles.actionButton}
            size="small"
          />
          <PDFDownloadButton
            title="Profile"
            onDownload={handleDownloadProfile}
            variant="outline"
            style={styles.actionButton}
            size="small"
          />
          <Button
            title="Delete"
            onPress={handleDelete}
            variant="danger"
            icon={<Trash2 size={16} color={colors.card} />}
            style={styles.actionButton}
            size="small"
          />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={20} color={colors.primary} />
          <Text style={styles.statNumber}>{school.enrollmentData.totalStudents}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Laptop size={20} color={colors.secondary} />
          <Text style={styles.statNumber}>{totalDevices}</Text>
          <Text style={styles.statLabel}>ICT Devices</Text>
        </View>
        <View style={styles.statCard}>
          <GraduationCap size={20} color={colors.success} />
          <Text style={styles.statNumber}>{teacherTrainingRate}%</Text>
          <Text style={styles.statLabel}>ICT Trained</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color={colors.warning} />
          <Text style={styles.statNumber}>{femaleEnrollmentRate}%</Text>
          <Text style={styles.statLabel}>Female</Text>
        </View>
      </View>

      {/* Basic Information */}
      <Card style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <Building size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Basic Information</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{school.type}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Environment</Text>
            <Text style={styles.infoValue}>{school.environment}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ownership</Text>
            <Text style={styles.infoValue}>{school.ownershipType}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{school.schoolCategory}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>EMIS Number</Text>
            <Text style={styles.infoValue}>{school.emisNumber || 'Not provided'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Year Established</Text>
            <Text style={styles.infoValue}>{school.yearEstablished || 'Not specified'}</Text>
          </View>
        </View>

        {school.signatureProgram && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Signature Program:</Text>
              <Text style={styles.infoHighlight}>{school.signatureProgram}</Text>
            </View>
          </>
        )}
      </Card>

      {/* Contact Information */}
      <Card style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <User size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{school.contactInfo.headTeacher}</Text>
          <Text style={styles.contactTitle}>Head Teacher</Text>
          
          <View style={styles.contactItem}>
            <Phone size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{school.contactInfo.phone}</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Mail size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{school.contactInfo.email}</Text>
          </View>
        </View>
      </Card>

      {/* ICT Infrastructure */}
      <Card style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <Laptop size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>ICT Infrastructure</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Student Computers</Text>
            <Text style={styles.infoValue}>{school.ictInfrastructure.studentComputers}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teacher Computers</Text>
            <Text style={styles.infoValue}>{school.ictInfrastructure.teacherComputers}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tablets</Text>
            <Text style={styles.infoValue}>{school.ictInfrastructure.tablets}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Laptops</Text>
            <Text style={styles.infoValue}>{school.ictInfrastructure.laptops}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Projectors</Text>
            <Text style={styles.infoValue}>{school.ictInfrastructure.projectors}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Smart Boards</Text>
            <Text style={styles.infoValue}>{school.ictInfrastructure.smartBoards}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.facilitiesGrid}>
          <View style={styles.facilityItem}>
            <Monitor size={16} color={school.ictInfrastructure.hasComputerLab ? colors.success : colors.error} />
            <Text style={styles.facilityText}>Computer Lab</Text>
            {school.ictInfrastructure.hasComputerLab && (
              <Text style={styles.facilityCondition}>({school.ictInfrastructure.labCondition})</Text>
            )}
          </View>
          <View style={styles.facilityItem}>
            <Home size={16} color={school.ictInfrastructure.hasICTRoom ? colors.success : colors.error} />
            <Text style={styles.facilityText}>ICT Room</Text>
          </View>
          <View style={styles.facilityItem}>
            <Zap size={16} color={school.ictInfrastructure.hasElectricity ? colors.success : colors.error} />
            <Text style={styles.facilityText}>Electricity</Text>
          </View>
          <View style={styles.facilityItem}>
            <Shield size={16} color={school.ictInfrastructure.hasSecureRoom ? colors.success : colors.error} />
            <Text style={styles.facilityText}>Secure Room</Text>
          </View>
        </View>

        {school.ictInfrastructure.powerBackup.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Power Backup:</Text>
              <Text style={styles.infoValue}>{school.ictInfrastructure.powerBackup.join(', ')}</Text>
            </View>
          </>
        )}
      </Card>

      {/* Internet Connectivity */}
      <Card style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <Wifi size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Internet Connectivity</Text>
        </View>
        
        <View style={styles.connectivityInfo}>
          <View style={styles.connectivityMain}>
            <Text style={styles.connectivityType}>{school.internetConnectivity.connectionType}</Text>
            {school.internetConnectivity.connectionType !== 'None' && (
              <>
                <Text style={styles.connectivitySpeed}>
                  {school.internetConnectivity.bandwidthMbps} Mbps
                </Text>
                <Text style={styles.connectivityProvider}>
                  via {school.internetConnectivity.provider}
                </Text>
              </>
            )}
          </View>
          
          {school.internetConnectivity.connectionType !== 'None' && (
            <>
              <View style={styles.connectivityDetails}>
                <View style={styles.connectivityItem}>
                  <Text style={styles.connectivityLabel}>Stability:</Text>
                  <Text style={[
                    styles.connectivityValue,
                    { color: school.internetConnectivity.stability === 'High' ? colors.success : 
                             school.internetConnectivity.stability === 'Medium' ? colors.warning : colors.error }
                  ]}>
                    {school.internetConnectivity.stability}
                  </Text>
                </View>
                <View style={styles.connectivityItem}>
                  <Text style={styles.connectivityLabel}>Usage Policy:</Text>
                  <Text style={styles.connectivityValue}>
                    {school.internetConnectivity.hasUsagePolicy ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>
              
              {school.internetConnectivity.wifiCoverage.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.infoLabel}>WiFi Coverage Areas:</Text>
                  <View style={styles.tagContainer}>
                    {school.internetConnectivity.wifiCoverage.map((area, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{area}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </Card>

      {/* Software & Digital Resources */}
      <Card style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <HardDrive size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Software & Digital Resources</Text>
        </View>
        
        <View style={styles.softwareGrid}>
          <View style={styles.softwareItem}>
            <BookOpen size={16} color={school.software.hasLMS ? colors.success : colors.error} />
            <Text style={styles.softwareText}>Learning Management System</Text>
            {school.software.hasLMS && school.software.lmsName && (
              <Text style={styles.softwareDetail}>({school.software.lmsName})</Text>
            )}
          </View>
          <View style={styles.softwareItem}>
            <Settings size={16} color={school.software.hasLicensedSoftware ? colors.success : colors.error} />
            <Text style={styles.softwareText}>Licensed Software</Text>
          </View>
          <View style={styles.softwareItem}>
            <Globe size={16} color={school.software.hasDigitalLibrary ? colors.success : colors.error} />
            <Text style={styles.softwareText}>Digital Library</Text>
          </View>
          <View style={styles.softwareItem}>
            <HardDrive size={16} color={school.software.hasLocalContent ? colors.success : colors.error} />
            <Text style={styles.softwareText}>Local Content</Text>
          </View>
        </View>

        {school.software.licensedSoftware.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.infoLabel}>Licensed Software:</Text>
            <View style={styles.tagContainer}>
              {school.software.licensedSoftware.map((software, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{software}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {school.software.productivitySuite.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.infoLabel}>Productivity Suite:</Text>
            <View style={styles.tagContainer}>
              {school.software.productivitySuite.map((suite, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{suite}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </Card>

      {/* Human Capacity */}
      <Card style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <GraduationCap size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Human Capacity</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Teachers</Text>
            <Text style={styles.infoValue}>{school.humanCapacity.totalTeachers}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ICT Trained</Text>
            <Text style={styles.infoValue}>{school.humanCapacity.ictTrainedTeachers}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Male Teachers</Text>
            <Text style={styles.infoValue}>{school.humanCapacity.maleTeachers}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Female Teachers</Text>
            <Text style={styles.infoValue}>{school.humanCapacity.femaleTeachers}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Support Staff</Text>
            <Text style={styles.infoValue}>{school.humanCapacity.supportStaff}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Competency Level</Text>
            <Text style={styles.infoValue}>{school.humanCapacity.teacherCompetencyLevel}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ICT Training Rate:</Text>
          <Text style={[styles.infoHighlight, { 
            color: parseFloat(teacherTrainingRate) > 50 ? colors.success : 
                   parseFloat(teacherTrainingRate) > 25 ? colors.warning : colors.error 
          }]}>
            {teacherTrainingRate}%
          </Text>
        </View>
      </Card>

      {/* Performance Metrics */}
      <Card style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Performance</Text>
        </View>
        
        <View style={styles.performanceGrid}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>PLE Pass Rate (Latest)</Text>
            <Text style={styles.performanceValue}>{school.performance.plePassRateYear1}%</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Digital Literacy</Text>
            <Text style={styles.performanceValue}>{school.studentEngagement.digitalLiteracyLevel}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Student Feedback</Text>
            <Text style={styles.performanceValue}>{school.studentEngagement.studentFeedbackRating}/5</Text>
          </View>
        </View>

        {(school.performance.innovations || school.performance.uniqueAchievements) && (
          <>
            <View style={styles.divider} />
            {school.performance.innovations && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Innovations:</Text>
                <Text style={styles.infoValue}>{school.performance.innovations}</Text>
              </View>
            )}
            {school.performance.uniqueAchievements && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Achievements:</Text>
                <Text style={styles.infoValue}>{school.performance.uniqueAchievements}</Text>
              </View>
            )}
          </>
        )}
      </Card>

      {/* ICT Reports Section */}
      <View style={styles.reportsSection}>
        <View style={styles.reportsSectionHeader}>
          <Text style={styles.reportsSectionTitle}>ICT Reports ({reports.length})</Text>
          <View style={styles.reportActions}>
            <PDFDownloadButton
              title="Download All"
              onDownload={handleDownloadReports}
              variant="outline"
              style={styles.downloadButton}
              size="small"
              disabled={reports.length === 0}
            />
            <Button
              title="Add Report"
              onPress={handleAddReport}
              icon={<Plus size={16} color={colors.card} />}
              size="small"
            />
          </View>
        </View>
        
        {reports.length === 0 ? (
          <Card style={styles.emptyReports}>
            <Calendar size={48} color={colors.textSecondary} />
            <Text style={styles.emptyReportsTitle}>No ICT Reports Yet</Text>
            <Text style={styles.emptyReportsText}>
              Add your first report to track technology infrastructure and usage over time.
            </Text>
            <Button
              title="Add First Report"
              onPress={handleAddReport}
              style={styles.emptyReportsButton}
              icon={<Plus size={16} color={colors.card} />}
            />
          </Card>
        ) : (
          reports
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(report => (
              <ReportCard key={report.id} report={report} />
            ))
        )}
      </View>
      
      {/* Share Section */}
      <View style={styles.shareContainer}>
        <Button
          title="Share School Profile"
          onPress={() => {
            Share.share({
              title: `School Profile - ${school.name}`,
              message: `${school.name}\n${school.district}, ${school.subCounty}\n${school.type} • ${school.environment}\n${school.enrollmentData.totalStudents} students\nContact: ${school.contactInfo.phone}`,
            });
          }}
          icon={<Share2 size={18} color={colors.card} />}
          style={styles.shareButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  schoolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoHighlight: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  contactTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    color: colors.text,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  facilityText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  facilityCondition: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  connectivityInfo: {
    alignItems: 'center',
  },
  connectivityMain: {
    alignItems: 'center',
    marginBottom: 16,
  },
  connectivityType: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  connectivitySpeed: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  connectivityProvider: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  connectivityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  connectivityItem: {
    alignItems: 'center',
  },
  connectivityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  connectivityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  softwareGrid: {
    gap: 12,
  },
  softwareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  softwareText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  softwareDetail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  performanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reportsSection: {
    padding: 16,
    paddingTop: 0,
  },
  reportsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadButton: {
    borderColor: colors.primary,
  },
  emptyReports: {
    padding: 32,
    alignItems: 'center',
  },
  emptyReportsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyReportsText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyReportsButton: {
    minWidth: 150,
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
    marginTop: 16,
    marginBottom: 16,
  },
  backButton: {
    minWidth: 120,
  },
  shareContainer: {
    padding: 16,
    marginBottom: 24,
  },
  shareButton: {
    backgroundColor: colors.secondary,
  },
});