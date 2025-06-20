import { ICTReport, School, SyncLog } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SchoolState {
  schools: School[];
  reports: ICTReport[];
  syncLogs: SyncLog[];
  isLoading: boolean;
  autoSync: boolean;

  // School actions
  addSchool: (school: School) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (id: string) => void;
  getSchoolById: (id: string) => School | undefined;

  // Report actions
  addReport: (report: ICTReport) => void;
  updateReport: (report: ICTReport) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => ICTReport | undefined;
  getReportsBySchool: (schoolId: string) => ICTReport[];

  // Sync actions
  addSyncLog: (log: SyncLog) => void;
  markAsSync: (
    type: "school" | "report",
    id: string,
    success: boolean,
    message?: string
  ) => void;
  getUnsyncedSchools: () => School[];
  getUnsyncedReports: () => ICTReport[];
  toggleAutoSync: () => void;

  // Hydration action
  hydrateSchoolsAndReports: (incomingSchools: School[], incomingReports: ICTReport[]) => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      schools: [],
      reports: [],
      syncLogs: [],
      isLoading: false,
      autoSync: true,

      // School actions
      addSchool: (school) => {
        set((state) => ({
          schools: [
            ...state.schools,
            { ...school, synced: false, lastUpdated: new Date().toISOString() },
          ],
        }));
      },

      updateSchool: (school) => {
        set((state) => ({
          schools: state.schools.map((s) =>
            s.id === school.id
              ? {
                  ...school,
                  synced: false,
                  lastUpdated: new Date().toISOString(),
                }
              : s
          ),
        }));
      },

      deleteSchool: (id) => {
        set((state) => ({
          schools: state.schools.filter((s) => s.id !== id),
          reports: state.reports.filter((r) => r.schoolId !== id),
        }));
      },

      getSchoolById: (id) => {
        return get().schools.find((s) => s.id === id);
      },

      // Report actions
      addReport: (report) => {
        set((state) => ({
          reports: [
            ...state.reports,
            { ...report, synced: false, lastUpdated: new Date().toISOString() },
          ],
        }));
      },

      updateReport: (report) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === report.id
              ? {
                  ...report,
                  synced: false,
                  lastUpdated: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
        }));
      },

      getReportById: (id) => {
        return get().reports.find((r) => r.id === id);
      },

      getReportsBySchool: (schoolId) => {
        return get().reports.filter((r) => r.schoolId === schoolId);
      },

      // Sync actions
      addSyncLog: (log) => {
        set((state) => ({
          syncLogs: [log, ...state.syncLogs].slice(0, 100), // Keep only the last 100 logs
        }));
      },

      markAsSync: (type, id, success, message) => {
        const timestamp = new Date().toISOString();
        const status = success ? "synced" : "failed";

        // Add sync log
        get().addSyncLog({
          id: `${type}-${id}-${timestamp}`,
          timestamp,
          type,
          itemId: id,
          status,
          message,
        });

        // Update sync status
        if (type === "school") {
          set((state) => ({
            schools: state.schools.map((s) =>
              s.id === id
                ? { ...s, synced: success, lastUpdated: timestamp }
                : s
            ),
          }));
        } else {
          set((state) => ({
            reports: state.reports.map((r) =>
              r.id === id
                ? { ...r, synced: success, lastUpdated: timestamp }
                : r
            ),
          }));
        }
      },

      getUnsyncedSchools: () => {
        return get().schools.filter((s) => !s.synced);
      },

      getUnsyncedReports: () => {
        return get().reports.filter((r) => !r.synced);
      },

      toggleAutoSync: () => {
        set((state) => ({
          autoSync: !state.autoSync,
        }));
      },

      // Hydration action with merge logic
      hydrateSchoolsAndReports: (incomingSchools, incomingReports) => {
        set((state) => {
          // Create maps for efficient lookup and merging
          const schoolsMap = new Map<string, School>();
          const reportsMap = new Map<string, ICTReport>();

          // First, add all existing schools and reports to the maps
          // This preserves all current data, including unsynced items
          state.schools.forEach(school => {
            schoolsMap.set(school.id, school);
          });

          state.reports.forEach(report => {
            reportsMap.set(report.id, report);
          });

          // Then, merge incoming synced data
          // This will overwrite existing entries with the same ID, but only with synced data
          incomingSchools.forEach(school => {
            const existingSchool = schoolsMap.get(school.id);
            
            // If the existing school is unsynced (has local changes), preserve it
            // Otherwise, update with the incoming synced data
            if (!existingSchool || existingSchool.synced) {
              schoolsMap.set(school.id, {
                ...school,
                synced: true, // Mark incoming data as synced
                lastUpdated: school.lastUpdated || new Date().toISOString(),
              });
            }
            // If existing school is unsynced, we keep the local version
          });

          incomingReports.forEach(report => {
            const existingReport = reportsMap.get(report.id);
            
            // If the existing report is unsynced (has local changes), preserve it
            // Otherwise, update with the incoming synced data
            if (!existingReport || existingReport.synced) {
              reportsMap.set(report.id, {
                ...report,
                synced: true, // Mark incoming data as synced
                lastUpdated: report.lastUpdated || new Date().toISOString(),
              });
            }
            // If existing report is unsynced, we keep the local version
          });

          // Convert maps back to arrays
          const mergedSchools = Array.from(schoolsMap.values());
          const mergedReports = Array.from(reportsMap.values());

          return {
            schools: mergedSchools,
            reports: mergedReports,
          };
        });
      },
    }),
    {
      name: "school-ict-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);