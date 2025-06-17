import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export const unstable_settings = {
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
          headerShown: false
        }}
      >
         <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
                animation: 'fade',
              }} 
            />
            <Stack.Screen
              name="schools/[id]"
              options={{
                title: "School Details",
                headerBackTitle: "Schools",
                presentation: 'card',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="schools/add"
              options={{
                title: "Add School",
                headerBackTitle: "Schools",
                presentation: 'modal',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="schools/edit/[id]"
              options={{
                title: "Edit School",
                headerBackTitle: "Details",
                presentation: 'card',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="reports/[id]"
              options={{
                title: "Report Details",
                headerBackTitle: "Reports",
                presentation: 'card',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="reports/add"
              options={{
                title: "Add Report",
                headerBackTitle: "Back",
                presentation: 'modal',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="reports/add/[schoolId]"
              options={{
                title: "Add School Report",
                headerBackTitle: "School",
                presentation: 'card',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="reports/edit/[id]"
              options={{
                title: "Edit Report",
                headerBackTitle: "Details",
                presentation: 'card',
                headerShown: true,
              }}
            />
      </Stack.Protected>
      
      </Stack>
    </>
  );
}