import { colors } from "@/constants/Colors";
import { School } from "@/types";
import { useRouter } from "expo-router";
import { MapPin, School as SchoolIcon, Users } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "./Card";
import SyncIndicator from "./SyncIndicator";

type SchoolCardProps = {
  school: School;
};

export default function SchoolCard({ school }: SchoolCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/schools/${school.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <SchoolIcon size={18} color={colors.primary} />
            <Text style={styles.title}>{school.name}</Text>
          </View>
          <SyncIndicator
            status={school.synced ? "synced" : "pending"}
            size="small"
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {school.district}, {school.subCounty}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Users size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {school.enrollmentData.totalStudents} students
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{school.type}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{school.environment}</Text>
            </View>
            {school.ictInfrastructure?.hasComputerLab && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Computer Lab</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  infoContainer: {
    marginBottom: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
});
