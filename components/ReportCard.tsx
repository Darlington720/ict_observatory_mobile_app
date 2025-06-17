import { colors } from '@/constants/Colors';
import { ICTReport } from '@/types';
import { useRouter } from 'expo-router';
import { Calendar, Laptop, Wifi, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from './Card';
import SyncIndicator from './SyncIndicator';

type ReportCardProps = {
  report: ICTReport;
  schoolName?: string;
};

export default function ReportCard({ report, schoolName }: ReportCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/reports/${report.id}`);
  };
  
  // Format date
  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Calendar size={18} color={colors.primary} />
            <Text style={styles.title}>{report.period}</Text>
          </View>
          <SyncIndicator status={report.synced ? 'synced' : 'pending'} size="small" />
        </View>
        
        {schoolName && (
          <Text style={styles.schoolName}>{schoolName}</Text>
        )}
        
        <Text style={styles.date}>{formattedDate}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Laptop size={16} color={colors.primary} />
            <Text style={styles.statText}>
              {report.infrastructure.computers + report.infrastructure.tablets} devices
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Wifi size={16} color={report.infrastructure.internetConnection === 'None' ? colors.error : colors.success} />
            <Text style={styles.statText}>
              {report.infrastructure.internetConnection}
              {report.infrastructure.internetConnection !== 'None' && ` (${report.infrastructure.internetSpeedMbps} Mbps)`}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Zap size={16} color={report.infrastructure.powerBackup ? colors.success : colors.warning} />
            <Text style={styles.statText}>
              {report.infrastructure.powerSource.join(', ')}
              {report.infrastructure.powerBackup ? ' + Backup' : ''}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statsContainer: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});