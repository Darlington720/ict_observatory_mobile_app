import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
          // headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="schools/[id]"
              options={{
                title: "School Details",
                headerBackTitle: "Schools",
              }}
            />
            <Stack.Screen
              name="schools/add"
              options={{
                title: "Add School",
                headerBackTitle: "Schools",
              }}
            />
            <Stack.Screen
              name="schools/edit/[id]"
              options={{
                title: "Edit School",
                headerBackTitle: "Details",
              }}
            />
            <Stack.Screen
              name="reports/[id]"
              options={{
                title: "Report Details",
                headerBackTitle: "Reports",
              }}
            />
            <Stack.Screen
              name="reports/add"
              options={{
                title: "Add Report",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="reports/add/[schoolId]"
              options={{
                title: "Add School Report",
                headerBackTitle: "School",
              }}
            />
            <Stack.Screen
              name="reports/edit/[id]"
              options={{
                title: "Edit Report",
                headerBackTitle: "Details",
              }}
            />
          </>
        )}
      </Stack>
    </>
  );
}
