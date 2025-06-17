import Button from '@/components/Button';
import Card from '@/components/Card';
import SyncIndicator from '@/components/SyncIndicator';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { generateReportCSV } from '@/utils/export';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    BookOpen,
    Calendar,
    Camera,
    Download,
    Edit3,
    Laptop,
    Share2,
    Trash2,
    Users,
    Wifi,
    Zap
} from 'lucide-react-native';
import React from 'react';
import { Alert, Platform, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

export default function ReportDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getReportById, getSchoolById, deleteReport } = useSchoolStore();
  
  const report = getReportById(id);
  
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
  
  const handleEdit = () => {
    router.push(`/reports/edit/${id}`);
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteReport(id);
            router.replace('/reports');
          }
        },
      ]
    );
  };
  
  const handleDownload = async () => {
    if (!school) return;
    
    try {
      const csvContent = generateReportCSV(report, school);
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `ICT_Report_${school.name}_${report.period}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For mobile, share the CSV content
        await Share.share({
          message: csvContent,
          title: `ICT Report - ${school.name} - ${report.period}`,
        });
      }
      
      Alert.alert('Success', 'Report exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export report');
      console.error('Export error:', error);
    }
  };
  
  // Format date
  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{report.period} Report</Text>
          <SyncIndicator status={report.synced ? 'synced' : 'pending'} />
        </View>
        
        {school && (
          <Text style={styles.schoolName}>{school.name}</Text>
        )}
        
        <View style={styles.dateContainer}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        <View style={styles.actions}>
          <Button
            title="Edit"
            onPress={handleEdit}
            variant="outline"
            icon={<Edit3 size={16} color={colors.primary} />}
            style={styles.actionButton}
          />
          <Button
            title="Download"
            onPress={handleDownload}
            variant="outline"
            icon={<Download size={16} color={colors.primary} />}
            style={styles.actionButton}
          />
          <Button
            title="Delete"
            onPress={handleDelete}
            variant="danger"
            icon={<Trash2 size={16} color={colors.card} />}
            style={styles.actionButton}
          />
        </View>
      </View>
      
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Laptop size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Infrastructure</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Computers</Text>
            <Text style={styles.infoValue}>{report.infrastructure.computers}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tablets</Text>
            <Text style={styles.infoValue}>{report.infrastructure.tablets}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Projectors</Text>
            <Text style={styles.infoValue}>{report.infrastructure.projectors}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Printers</Text>
            <Text style={styles.infoValue}>{report.infrastructure.printers}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Functional Devices</Text>
            <Text style={styles.infoValue}>{report.infrastructure.functionalDevices}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Working Rate</Text>
            <Text style={styles.infoValue}>
              {Math.round((report.infrastructure.functionalDevices / 
                (report.infrastructure.computers + report.infrastructure.tablets)) * 100)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.subsection}>
          <View style={styles.subsectionHeader}>
            <Wifi size={18} color={colors.primary} />
            <Text style={styles.subsectionTitle}>Internet Connection</Text>
          </View>
          
          <Text style={styles.infoText}>
            Connection: <Text style={styles.infoHighlight}>{report.infrastructure.internetConnection}</Text>
          </Text>
          
          {report.infrastructure.internetConnection !== 'None' && (
            <Text style={styles.infoText}>
              Speed: <Text style={styles.infoHighlight}>{report.infrastructure.internetSpeedMbps} Mbps</Text>
            </Text>
          )}
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.subsection}>
          <View style={styles.subsectionHeader}>
            <Zap size={18} color={colors.primary} />
            <Text style={styles.subsectionTitle}>Power</Text>
          </View>
          
          <Text style={styles.infoText}>
            Sources: <Text style={styles.infoHighlight}>{report.infrastructure.powerSource.join(', ')}</Text>
          </Text>
          
          <Text style={styles.infoText}>
            Backup: <Text style={styles.infoHighlight}>{report.infrastructure.powerBackup ? 'Available' : 'Not Available'}</Text>
          </Text>
        </View>
      </Card>
      
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Usage</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teachers Using ICT</Text>
            <Text style={styles.infoValue}>{report.usage.teachersUsingICT}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Teachers</Text>
            <Text style={styles.infoValue}>{report.usage.totalTeachers}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teacher ICT Usage</Text>
            <Text style={styles.infoValue}>
              {Math.round((report.usage.teachersUsingICT / report.usage.totalTeachers) * 100)}%
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weekly Lab Hours</Text>
            <Text style={styles.infoValue}>{report.usage.weeklyComputerLabHours}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Student Digital Literacy Rate</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${report.usage.studentDigitalLiteracyRate}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressValue}>{report.usage.studentDigitalLiteracyRate}%</Text>
        </View>
      </Card>
      
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <BookOpen size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Software</Text>
        </View>
        
        <Text style={styles.infoSubtitle}>Operating Systems</Text>
        <View style={styles.tagContainer}>
          {report.software.operatingSystems.map((os, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{os}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.infoSubtitle}>Educational Software</Text>
        {report.software.educationalSoftware.length > 0 ? (
          <View style={styles.tagContainer}>
            {report.software.educationalSoftware.map((software, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{software}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No educational software reported</Text>
        )}
        
        <View style={styles.divider} />
        
        <Text style={styles.infoText}>
          Office Applications: <Text style={styles.infoHighlight}>
            {report.software.officeApplications ? 'Available' : 'Not Available'}
          </Text>
        </Text>
      </Card>
      
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Capacity</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ICT Trained Teachers</Text>
            <Text style={styles.infoValue}>{report.capacity.ictTrainedTeachers}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Training Rate</Text>
            <Text style={styles.infoValue}>
              {Math.round((report.capacity.ictTrainedTeachers / report.usage.totalTeachers) * 100)}%
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Support Staff</Text>
            <Text style={styles.infoValue}>{report.capacity.supportStaff}</Text>
          </View>
        </View>
      </Card>
      
      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Camera size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Photos</Text>
        </View>
        
        {report.photos.length > 0 ? (
          <Text style={styles.photoCount}>{report.photos.length} photos attached</Text>
        ) : (
          <Text style={styles.emptyText}>No photos attached to this report</Text>
        )}
      </Card>
      
      <View style={styles.shareContainer}>
        <Button
          title="Share Report"
          onPress={() => {
            if (school) {
              Share.share({
                title: `ICT Report - ${school.name} - ${report.period}`,
                message: `ICT Report for ${school.name} (${report.period}): ${report.infrastructure.computers} computers, ${report.infrastructure.tablets} tablets, ${report.infrastructure.functionalDevices} functional devices.`,
              });
            }
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
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  date: {
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
  section: {
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
  subsection: {
    marginVertical: 8,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  infoSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  infoHighlight: {
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
  photoCount: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  shareContainer: {
    padding: 16,
    marginBottom: 24,
  },
  shareButton: {
    backgroundColor: colors.secondary,
  },
});