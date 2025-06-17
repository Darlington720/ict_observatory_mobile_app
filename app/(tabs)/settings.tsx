import Button from '@/components/Button';
import Card from '@/components/Card';
import { colors } from '@/constants/Colors';
import { useSchoolStore } from '@/store/schoolStore';
import {
    Database,
    HardDrive,
    Info
} from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { autoSync, toggleAutoSync } = useSchoolStore();
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all schools and reports? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, we would clear the store here
            Alert.alert('Data Cleared', 'All data has been deleted.');
          }
        },
      ]
    );
  };
  
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This would export all your data to a CSV file in a real app.',
      [{ text: 'OK' }]
    );
  };
  
  const handleAbout = () => {
    Alert.alert(
      'About School ICT Data Collection',
      'Version 1.0.0\n\nThis app allows education officers to collect and manage ICT infrastructure data from schools, even in offline environments.',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Database size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Data Synchronization</Text>
        </View>
        
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Auto Sync</Text>
              <Text style={styles.settingDescription}>
                Automatically sync data when internet is available
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={toggleAutoSync}
              trackColor={{ false: colors.disabled, true: `${colors.primary}80` }}
              thumbColor={autoSync ? colors.primary : colors.card}
            />
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <HardDrive size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Storage</Text>
        </View>
        
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Export all data to a CSV file
              </Text>
            </View>
            <Button
              title="Export"
              onPress={handleExportData}
              variant="outline"
              size="small"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Clear All Data</Text>
              <Text style={styles.settingDescription}>
                Delete all schools and reports
              </Text>
            </View>
            <Button
              title="Clear"
              onPress={handleClearData}
              variant="danger"
              size="small"
            />
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Info size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>App Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>About This App</Text>
              <Text style={styles.settingDescription}>
                Learn more about School ICT Data Collection
              </Text>
            </View>
            <Button
              title="About"
              onPress={handleAbout}
              variant="outline"
              size="small"
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
});