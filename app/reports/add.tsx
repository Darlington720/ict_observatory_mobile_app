import Button from '@/components/Button';
import Card from '@/components/Card';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import { useRouter } from 'expo-router';
import { ChevronRight, School } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddReportScreen() {
  const router = useRouter();
  const { schools } = useSchoolStore();
  
  // If there are no schools, show a message
  if (schools.length === 0) {
    return (
      <View style={styles.noSchoolsContainer}>
        <School size={48} color={colors.primary} />
        <Text style={styles.noSchoolsTitle}>No Schools Available</Text>
        <Text style={styles.noSchoolsMessage}>
          You need to add a school before you can create an ICT report.
        </Text>
        <Button
          title="Add School"
          onPress={() => router.push('/schools/add')}
          style={styles.noSchoolsButton}
        />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select a School</Text>
      <Text style={styles.subtitle}>Choose a school to create an ICT report for:</Text>
      
      {schools.map(school => (
        <TouchableOpacity 
          key={school.id}
          onPress={() => router.push(`/reports/add/${school.id}`)}
          activeOpacity={0.7}
        >
          <Card style={styles.schoolCard}>
            <View style={styles.schoolInfo}>
              <School size={20} color={colors.primary} />
              <View style={styles.schoolTextContainer}>
                <Text style={styles.schoolName}>{school.name}</Text>
                <Text style={styles.schoolLocation}>
                  {school.district}, {school.subCounty}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  schoolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  schoolTextContainer: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  schoolLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noSchoolsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noSchoolsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noSchoolsMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  noSchoolsButton: {
    minWidth: 150,
  },
});