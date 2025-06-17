import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { 
  Database, 
  Lock, 
  School, 
  Eye, 
  EyeOff, 
  Mail, 
  CircleAlert as AlertCircle, 
  CircleCheck as CheckCircle2 
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AccessibilityInfo,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Types
interface FormErrors {
  email?: string;
  password?: string;
}

interface AnimationRefs {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  logoScale: Animated.Value;
}

// Constants
const ANIMATION_DURATION = {
  FADE: 800,
  SLIDE: 600,
  SPRING_TENSION: 100,
  SPRING_FRICTION: 8,
} as const;

const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  ERROR_DISPLAY_DURATION: 5000,
} as const;

const DEMO_CREDENTIALS = {
  PASSWORD: "password",
} as const;

export default function LoginScreen() {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Store
  const { login, isLoading, error, clearError } = useAuthStore();

  // Animation values
  const animationRefs = useMemo<AnimationRefs>(() => ({
    fadeAnim: new Animated.Value(0),
    slideAnim: new Animated.Value(50),
    logoScale: new Animated.Value(0.8),
  }), []);

  // Effects
  useEffect(() => {
    startEntranceAnimations();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, VALIDATION_RULES.ERROR_DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Animation functions
  const startEntranceAnimations = useCallback(() => {
    const { fadeAnim, slideAnim, logoScale } = animationRefs;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.FADE,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION.SLIDE,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: ANIMATION_DURATION.SPRING_TENSION,
        friction: ANIMATION_DURATION.SPRING_FRICTION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationRefs]);

  // Validation functions
  const validateEmail = useCallback((email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  }, []);

  const validatePassword = useCallback((password: string): string | undefined => {
    if (!password.trim()) {
      return "Password is required";
    }
    if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`;
    }
    return undefined;
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password, validateEmail, validatePassword]);

  // Event handlers
  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [formErrors.email]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [formErrors.password]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      AccessibilityInfo.announceForAccessibility("Please fix the form errors");
      return;
    }

    clearError();
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      AccessibilityInfo.announceForAccessibility("Login failed. Please try again.");
    }
  }, [validateForm, clearError, login, email, password]);

  const handleForgotPassword = useCallback(() => {
    if (!email.trim()) {
      Alert.alert(
        "Email Required", 
        "Please enter your email address first, then tap 'Forgot Password' to receive reset instructions.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Password Reset", 
      `Password reset instructions have been sent to ${email}`,
      [{ text: "OK" }]
    );
  }, [email]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Render functions
  const renderErrorMessage = useCallback(() => {
    if (!error) return null;

    return (
      <Animated.View 
        style={[
          styles.errorContainer,
          {
            opacity: animationRefs.fadeAnim,
            transform: [{ translateY: animationRefs.slideAnim }],
          }
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <AlertCircle size={16} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          onPress={clearError} 
          style={styles.errorClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss error"
        >
          <Text style={styles.errorCloseText}>×</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [error, animationRefs, clearError]);

  const renderDemoInfo = useCallback(() => (
    <View style={styles.demoContainer}>
      <View style={styles.demoCard}>
        <CheckCircle2 size={20} color={colors.success} />
        <View style={styles.demoTextContainer}>
          <Text style={styles.demoTitle}>Demo Account</Text>
          <Text style={styles.demoText}>
            Use any email with password: {" "}
            <Text style={styles.demoPassword}>{DEMO_CREDENTIALS.PASSWORD}</Text>
          </Text>
        </View>
      </View>
    </View>
  ), []);

  const renderInputField = useCallback((
    type: 'email' | 'password',
    value: string,
    onChangeText: (text: string) => void,
    focused: boolean,
    onFocus: () => void,
    onBlur: () => void,
    error?: string
  ) => {
    const isEmail = type === 'email';
    const isPassword = type === 'password';
    
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          {isEmail ? 'Email Address' : 'Password'}
        </Text>
        <View style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}>
          <View style={styles.inputIcon}>
            {isEmail ? (
              <Mail size={20} color={focused ? colors.primary : colors.textSecondary} />
            ) : (
              <Lock size={20} color={focused ? colors.primary : colors.textSecondary} />
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder={isEmail ? "Enter your email" : "Enter your password"}
            placeholderTextColor={colors.placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            autoCapitalize={isEmail ? "none" : "none"}
            keyboardType={isEmail ? "email-address" : "default"}
            autoComplete={isEmail ? "email" : "password"}
            textContentType={isEmail ? "emailAddress" : "password"}
            secureTextEntry={isPassword && !showPassword}
            accessibilityLabel={isEmail ? "Email input" : "Password input"}
            accessibilityHint={isEmail ? "Enter your email address" : "Enter your password"}
          />
          {isPassword && (
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text style={styles.fieldError} accessibilityRole="text">
            {error}
          </Text>
        )}
      </View>
    );
  }, [showPassword, togglePasswordVisibility]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.primary, "#2A6BBF", "#1E5AA8"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Animated Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: animationRefs.fadeAnim,
              transform: [
                { translateY: animationRefs.slideAnim },
                { scale: animationRefs.logoScale }
              ],
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <School size={48} color="white" />
          </View>
          <Text style={styles.title}>ICT4Primary</Text>
          <Text style={styles.subtitle}>School ICT Data Collection Platform</Text>
          <View style={styles.headerDivider} />
        </Animated.View>

        {/* Form Container */}
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: animationRefs.fadeAnim,
              transform: [{ translateY: animationRefs.slideAnim }],
            }
          ]}
        >
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>Sign in to continue data collection</Text>

            {renderErrorMessage()}

            {/* Email Input */}
            {renderInputField(
              'email',
              email,
              handleEmailChange,
              emailFocused,
              () => setEmailFocused(true),
              () => setEmailFocused(false),
              formErrors.email
            )}

            {/* Password Input */}
            {renderInputField(
              'password',
              password,
              handlePasswordChange,
              passwordFocused,
              () => setPasswordFocused(true),
              () => setPasswordFocused(false),
              formErrors.password
            )}

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonLoading,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              accessibilityState={{ disabled: isLoading }}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.loadingText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {renderDemoInfo()}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Empowering Schools Through Technology
            </Text>
            <View style={styles.footerDivider} />
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.5, 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  header: {
    height: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  headerDivider: {
    width: 50,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  formContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.error}10`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 13,
    marginLeft: 8,
    fontWeight: "500",
  },
  errorClose: {
    padding: 4,
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorCloseText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    minHeight: 50,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputIcon: {
    paddingLeft: 14,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 14,
    paddingRight: 14,
  },
  passwordToggle: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldError: {
    color: colors.error,
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: "500",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonLoading: {
    backgroundColor: colors.disabled,
  },
  loginButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  demoContainer: {
    marginTop: 6,
  },
  demoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.success}08`,
    borderWidth: 1,
    borderColor: `${colors.success}20`,
    borderRadius: 10,
    padding: 14,
  },
  demoTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.success,
    marginBottom: 3,
  },
  demoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  demoPassword: {
    fontWeight: "600",
    color: colors.text,
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  footer: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
  },
  footerText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  footerDivider: {
    width: 35,
    height: 2,
    backgroundColor: `${colors.primary}30`,
    borderRadius: 1,
    marginVertical: 10,
  },
  versionText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});