import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Database, Lock, School } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    if (error) {
      Alert.alert("Login Failed", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    await login(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />

      <LinearGradient
        colors={[colors.primary, "#2A6BBF"]}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <School size={48} color="white" />
        </View>
        <Text style={styles.title}>ICT4Primary</Text>
        <Text style={styles.subtitle}>School ICT Data Collection</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Login to your account</Text>

          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Database size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Lock size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              For demo purposes, use any email with password: "password"
            </Text>
          </View> */}
        </View>

        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            ICT4Primary - Empowering Schools Through Technology
          </Text>
        </View> */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 310,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    flex: 1,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "white",
  },
  iconContainer: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: `${colors.primary}15`,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    color: colors.primary,
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    marginBottom: 30,
    alignItems: "center",
  },
  footerText: {
    color: colors.primary,
    fontSize: 12,
  },
});
