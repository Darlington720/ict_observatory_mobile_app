import Button from '@/components/Button';
import Card from '@/components/Card';
import ReportCard from '@/components/ReportCard';
import SyncIndicator from '@/components/SyncIndicator';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { generateSchoolReportsCSV } from '@/utils/export';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Download,
    Edit3,
    Mail,
    MapPin,
    Phone,
    Plus,
    Share2,
    Trash2,
    User,
    Users
} from 'lucide-react-native';
import React from 'react';
import { Alert, Platform, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

export default function SchoolDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSchoolById, getReportsBySchool, deleteSchool } = useSchoolStore();
  
  const school = getSchoolById(id);
  const reports = getReportsBySchool(id);
  
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
  
  const handleDownloadReports = async () => {
    try {
      const csvContent = generateSchoolReportsCSV(school, reports);
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `School_Reports_${school.name}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For mobile, share the CSV content
        await Share.share({
          message: csvContent,
          title: `School Reports - ${school.name}`,
        });
      }
      
      Alert.alert('Success', 'Reports exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export reports');
      console.error('Export error:', error);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{school.name}</Text>
          <SyncIndicator status={school.synced ? 'synced' : 'pending'} />
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
            onPress={handleDownloadReports}
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
      
      <Card style={styles.infoCard}>
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MapPin size={18} color={colors.primary} />
            <Text style={styles.infoTitle}>Location</Text>
          </View>
          
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              {school.district}, {school.subCounty}
            </Text>
            <Text style={styles.infoText}>
              {school.environment} Environment
            </Text>
            <Text style={styles.infoText}>
              Coordinates: {school.location.latitude.toFixed(6)}, {school.location.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Users size={18} color={colors.primary} />
            <Text style={styles.infoTitle}>Enrollment</Text>
          </View>
          
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              Total Students: {school.enrollmentData.totalStudents}
            </Text>
            <Text style={styles.infoText}>
              Male: {school.enrollmentData.maleStudents} | Female: {school.enrollmentData.femaleStudents}
            </Text>
            <Text style={styles.infoText}>
              Type: {school.type}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <User size={18} color={colors.primary} />
            <Text style={styles.infoTitle}>Contact Information</Text>
          </View>
          
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              Principal: {school.contactInfo.principalName}
            </Text>
            
            <View style={styles.contactItem}>
              <Phone size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {school.contactInfo.phone}
              </Text>
            </View>
            
            <View style={styles.contactItem}>
              <Mail size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {school.contactInfo.email}
              </Text>
            </View>
          </View>
        </View>
      </Card>
      
      <View style={styles.reportsSection}>
        <View style={styles.reportsSectionHeader}>
          <Text style={styles.reportsSectionTitle}>ICT Reports</Text>
          <View style={styles.reportActions}>
            <Button
              title="Download All"
              onPress={handleDownloadReports}
              variant="outline"
              icon={<Download size={16} color={colors.primary} />}
              style={styles.downloadButton}
              size="small"
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
            <Text style={styles.emptyReportsText}>
              No ICT reports yet. Add your first report to track technology infrastructure.
            </Text>
          </Card>
        ) : (
          reports
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
            .map(report => (
              <ReportCard key={report.id} report={report} />
            ))
        )}
      </View>
      
      <View style={styles.shareContainer}>
        <Button
          title="Share School Profile"
          onPress={() => {
            Share.share({
              title: `School Profile - ${school.name}`,
              message: `School: ${school.name}\nDistrict: ${school.district}\nSub-County: ${school.subCounty}\nType: ${school.type}\nStudents: ${school.enrollmentData.totalStudents}\nContact: ${school.contactInfo.phone}`,
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
    paddingBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoContent: {
    paddingLeft: 4,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  reportsSection: {
    padding: 16,
    paddingTop: 0,
  },
  reportsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    padding: 16,
    alignItems: 'center',
  },
  emptyReportsText: {
    textAlign: 'center',
    color: colors.textSecondary,
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