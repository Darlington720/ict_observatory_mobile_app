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
    }),
    {
      name: "school-ict-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
