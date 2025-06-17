import { useSchoolStore } from '@/store/schoolStore';

// Simulate API endpoints
const API_URL = 'https://api.example.com';

// Mock API call with timeout and random success/failure
const mockApiCall = async (endpoint: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 90% success rate
      if (Math.random() > 0.1) {
        resolve({ success: true, data });
      } else {
        reject(new Error('Network error or server unavailable'));
      }
    }, 500 + Math.random() * 1000); // Random delay between 500-1500ms
  });
};

// Sync a single school
export const syncSchool = async (school: any) => {
  try {
    const endpoint = school.id ? `${API_URL}/schools/${school.id}` : `${API_URL}/schools`;
    const method = school.id ? 'PUT' : 'POST';
    
    // In a real app, this would be a fetch call
    const response = await mockApiCall(endpoint, { method, body: JSON.stringify(school) });
    
    // Mark as synced in store
    useSchoolStore.getState().markAsSync('school', school.id, true);
    return { success: true, data: response };
  } catch (error) {
    useSchoolStore.getState().markAsSync('school', school.id, false, (error as Error).message);
    return { success: false, error };
  }
};

// Sync a single report
export const syncReport = async (report: any) => {
  try {
    const endpoint = report.id ? `${API_URL}/reports/${report.id}` : `${API_URL}/reports`;
    const method = report.id ? 'PUT' : 'POST';
    
    // In a real app, this would be a fetch call
    const response = await mockApiCall(endpoint, { method, body: JSON.stringify(report) });
    
    // Mark as synced in store
    useSchoolStore.getState().markAsSync('report', report.id, true);
    return { success: true, data: response };
  } catch (error) {
    useSchoolStore.getState().markAsSync('report', report.id, false, (error as Error).message);
    return { success: false, error };
  }
};

// Sync all unsynced data
export const syncAll = async () => {
  const store = useSchoolStore.getState();
  const unsyncedSchools = store.getUnsyncedSchools();
  const unsyncedReports = store.getUnsyncedReports();
  
  const results = {
    schools: { success: 0, failed: 0 },
    reports: { success: 0, failed: 0 },
  };
  
  // Sync schools first
  for (const school of unsyncedSchools) {
    const result = await syncSchool(school);
    if (result.success) {
      results.schools.success++;
    } else {
      results.schools.failed++;
    }
  }
  
  // Then sync reports
  for (const report of unsyncedReports) {
    const result = await syncReport(report);
    if (result.success) {
      results.reports.success++;
    } else {
      results.reports.failed++;
    }
  }
  
  return results;
};

// Generate a unique ID (in a real app, use a proper UUID library)
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};