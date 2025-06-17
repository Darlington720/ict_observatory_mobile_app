import Button from '@/components/Button';
import Card from '@/components/Card';
import SyncIndicator from '@/components/SyncIndicator';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { syncAll } from '@/utils/sync';
import { Clock, Database, RefreshCw } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

export default function SyncScreen() {
  const { 
    getUnsyncedSchools, 
    getUnsyncedReports, 
    syncLogs,
    autoSync,
    toggleAutoSync
  } = useSchoolStore();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  
  const unsyncedSchools = getUnsyncedSchools();
  const unsyncedReports = getUnsyncedReports();
  
  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const results = await syncAll();
      setLastSyncTime(new Date().toISOString());
      
      Alert.alert(
        'Sync Complete',
        `Successfully synced ${results.schools.success} schools and ${results.reports.success} reports.\n\n` +
        `Failed: ${results.schools.failed} schools, ${results.reports.failed} reports.`
      );
    } catch (error) {
      Alert.alert('Sync Error', 'An error occurred during synchronization.');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <View style={styles.container}>
      <Card variant="elevated" style={styles.syncCard}>
        <View style={styles.syncHeader}>
          <Database size={24} color={colors.primary} />
          <Text style={styles.syncTitle}>Sync Status</Text>
        </View>
        
        <View style={styles.syncInfo}>
          <View style={styles.syncItem}>
            <Text style={styles.syncLabel}>Unsynced Schools:</Text>
            <Text style={styles.syncValue}>{unsyncedSchools.length}</Text>
          </View>
          
          <View style={styles.syncItem}>
            <Text style={styles.syncLabel}>Unsynced Reports:</Text>
            <Text style={styles.syncValue}>{unsyncedReports.length}</Text>
          </View>
          
          <View style={styles.syncItem}>
            <Text style={styles.syncLabel}>Last Sync:</Text>
            <Text style={styles.syncValue}>
              {lastSyncTime ? formatDate(lastSyncTime) : 'Never'}
            </Text>
          </View>
        </View>
        
        <View style={styles.syncActions}>
          <Button
            title="Sync Now"
            onPress={handleSync}
            loading={isSyncing}
            icon={<RefreshCw size={18} color={colors.card} />}
            style={styles.syncButton}
          />
          
          <Button
            title={autoSync ? "Auto Sync: ON" : "Auto Sync: OFF"}
            onPress={toggleAutoSync}
            variant="outline"
            style={styles.autoSyncButton}
          />
        </View>
      </Card>
      
      <Text style={styles.sectionTitle}>Sync History</Text>
      
      <FlatList
        data={syncLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.logCard}>
            <View style={styles.logHeader}>
              <View style={styles.logType}>
                <Text style={styles.logTypeText}>
                  {item.type === 'school' ? 'School' : 'Report'}
                </Text>
              </View>
              <SyncIndicator status={item.status} />
            </View>
            
            <View style={styles.logTime}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={styles.logTimeText}>{formatDate(item.timestamp)}</Text>
            </View>
            
            {item.message && (
              <Text style={styles.logMessage}>{item.message}</Text>
            )}
          </Card>
        )}
        contentContainerStyle={styles.logsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No sync history yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  syncCard: {
    marginBottom: 24,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  syncTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  syncInfo: {
    marginBottom: 20,
  },
  syncItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  syncLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  syncValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  syncActions: {
    flexDirection: 'row',
    gap: 12,
  },
  syncButton: {
    flex: 1,
  },
  autoSyncButton: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  logsList: {
    paddingBottom: 20,
  },
  logCard: {
    marginBottom: 8,
    padding: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logType: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  logTypeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  logTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  logTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
});