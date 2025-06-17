import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "inspector" | "officer" | "headteacher" | "administrator";
  district: string;
  region?: string;
  avatar?: string;
  lastLogin?: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: number | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => void;
  resetLoginAttempts: () => void;
}

// Mock user database for demo
const DEMO_USERS = [
  {
    id: "1",
    name: "John Kamau",
    email: "john.kamau@education.go.ug",
    role: "inspector" as const,
    district: "Kampala",
    region: "Central",
    permissions: ["view_schools", "add_schools", "edit_schools", "view_reports", "add_reports"],
  },
  {
    id: "2",
    name: "Sarah Nakato",
    email: "sarah.nakato@education.go.ug",
    role: "officer" as const,
    district: "Wakiso",
    region: "Central",
    permissions: ["view_schools", "add_schools", "view_reports", "add_reports"],
  },
  {
    id: "3",
    name: "David Okello",
    email: "david.okello@school.edu.ug",
    role: "headteacher" as const,
    district: "Gulu",
    region: "Northern",
    permissions: ["view_schools", "view_reports"],
  },
];

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginAttempts: 0,
      lastLoginAttempt: null,

      login: async (email, password) => {
        const state = get();
        
        // Check if user is locked out
        if (state.loginAttempts >= MAX_LOGIN_ATTEMPTS && state.lastLoginAttempt) {
          const timeSinceLastAttempt = Date.now() - state.lastLoginAttempt;
          if (timeSinceLastAttempt < LOCKOUT_DURATION) {
            const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
            set({
              error: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
            });
            return;
          } else {
            // Reset attempts after lockout period
            set({ loginAttempts: 0, lastLoginAttempt: null });
          }
        }

        set({ isLoading: true, error: null });

        try {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Validate credentials
          if (password !== "password") {
            throw new Error("Invalid email or password. Please check your credentials and try again.");
          }

          // Find user by email or create demo user
          let user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            // Create a demo user for any valid email
            const emailParts = email.split('@');
            const name = emailParts[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            user = {
              id: Math.random().toString(36).substring(2, 15),
              name,
              email: email.toLowerCase(),
              role: "officer",
              district: "Demo District",
              region: "Central",
              permissions: ["view_schools", "add_schools", "view_reports", "add_reports"],
            };
          }

          // Successful login
          const authenticatedUser: User = {
            ...user,
            lastLogin: new Date().toISOString(),
          };

          set({
            user: authenticatedUser,
            isAuthenticated: true,
            isLoading: false,
            loginAttempts: 0,
            lastLoginAttempt: null,
          });

        } catch (error) {
          const newAttempts = state.loginAttempts + 1;
          set({
            error: (error as Error).message,
            isLoading: false,
            loginAttempts: newAttempts,
            lastLoginAttempt: Date.now(),
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          loginAttempts: 0,
          lastLoginAttempt: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      resetLoginAttempts: () => {
        set({
          loginAttempts: 0,
          lastLoginAttempt: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist sensitive data like login attempts
      }),
    }
  )
);