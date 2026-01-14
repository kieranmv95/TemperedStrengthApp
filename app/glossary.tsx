import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GlossaryItem } from "@/src/components/brief/GlossaryItem";
import { glossary, GlossaryTerm, searchGlossary } from "@/src/data/brief";

type CategoryFilter = "All" | GlossaryTerm["category"];

const CATEGORY_FILTERS: CategoryFilter[] = [
  "All",
  "Training",
  "Movements",
  "Nutrition",
  "Equipment",
  "General",
];

export default function GlossaryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const filteredTerms = useMemo(() => {
    let results = searchQuery ? searchGlossary(searchQuery) : glossary;

    if (activeCategory !== "All") {
      results = results.filter((term) => term.category === activeCategory);
    }

    // Sort alphabetically
    return results.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, activeCategory]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terminology</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search terms..."
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={CATEGORY_FILTERS}
          keyExtractor={(item) => item || "All"}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = activeCategory === item;
            const count =
              item === "All"
                ? glossary.length
                : glossary.filter((t) => t.category === item).length;

            return (
              <TouchableOpacity
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveCategory(item)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {item || "All"}
                </Text>
                <Text
                  style={[
                    styles.filterCount,
                    isActive && styles.filterCountActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results */}
      {filteredTerms.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color="#333" />
          <Text style={styles.emptyTitle}>No Terms Found</Text>
          <Text style={styles.emptyDescription}>
            Try adjusting your search or filter.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTerms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GlossaryItem term={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {filteredTerms.length} {filteredTerms.length === 1 ? "term" : "terms"}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  filterList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: "#c9b072",
    borderColor: "#c9b072",
  },
  filterTabText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  filterTabTextActive: {
    color: "#121212",
  },
  filterCount: {
    color: "#666",
    fontSize: 11,
    fontWeight: "600",
  },
  filterCountActive: {
    color: "#121212",
    opacity: 0.7,
  },
  listContent: {
    padding: 16,
  },
  resultsCount: {
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});

