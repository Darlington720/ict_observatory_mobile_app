import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import ReportCard from '@/components/ReportCard';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { useRouter } from 'expo-router';
import { BarChart3, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

export default function ReportsScreen() {
  const router = useRouter();
  const { reports, schools } = useSchoolStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleAddReport = () => {
    router.push('/reports/add');
  };
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  // Get school name for each report
  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Unknown School';
  };
  
  if (reports.length === 0) {
    return (
      <EmptyState
        title="No Reports Yet"
        message="Add your first ICT report to start tracking school technology."
        buttonTitle="Add Report"
        onButtonPress={handleAddReport}
        icon={<BarChart3 size={48} color={colors.primary} />}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard 
            report={item} 
            schoolName={getSchoolName(item.schoolId)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      <View style={styles.fabContainer}>
        <Button
          title="Add Report"
          onPress={handleAddReport}
          icon={<Plus size={20} color={colors.card} />}
          style={styles.fab}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});