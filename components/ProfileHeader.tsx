import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { LogOut, User, Shield, MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

export default function ProfileHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: logout 
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "inspector":
        return colors.primary;
      case "officer":
        return colors.secondary;
      case "headteacher":
        return colors.success;
      case "administrator":
        return "#8B5CF6";
      default:
        return colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "inspector":
      case "administrator":
        return <Shield size={12} color={getRoleColor(role)} />;
      default:
        return <User size={12} color={getRoleColor(role)} />;
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <User size={24} color={colors.primary} />
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          
          <View style={styles.roleContainer}>
            {getRoleIcon(user.role)}
            <Text style={[styles.role, { color: getRoleColor(user.role) }]}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={12} color={colors.textSecondary} />
            <Text style={styles.location}>
              {user.district}{user.region && `, ${user.region}`}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        onPress={handleLogout} 
        style={styles.logoutButton}
        activeOpacity={0.7}
      >
        <LogOut size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: `${colors.primary}30`,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${colors.error}10`,
  },
});