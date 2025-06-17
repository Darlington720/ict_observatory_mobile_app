import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import ProfileHeader from "@/components/ProfileHeader";
import SchoolCard from "@/components/SchoolCard";
import { colors } from "@/constants/Colors";
import { useSchoolStore } from "@/store/schoolStore";
import { useRouter } from "expo-router";
import { Plus, School as SchoolIcon } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

export default function SchoolsScreen() {
  const router = useRouter();
  const { schools } = useSchoolStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleAddSchool = () => {
    router.push("/schools/add");
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader />

      {schools.length === 0 ? (
        <EmptyState
          title="No Schools Yet"
          message="Add your first school to start collecting ICT data."
          buttonTitle="Add School"
          onButtonPress={handleAddSchool}
          icon={<SchoolIcon size={48} color={colors.primary} />}
        />
      ) : (
        <FlatList
          data={schools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SchoolCard school={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <View style={styles.fabContainer}>
        <Button
          title="Add School"
          onPress={handleAddSchool}
          icon={<Plus size={20} color={colors.card} />}
          style={styles.fab}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  fab: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
