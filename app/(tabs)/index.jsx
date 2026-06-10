import { NavigationFooter } from "@/components/organism/navigationFooter";
import { DetailSheet } from "@/components/organism/DetailSheet";
import { MENU_ITEMS } from "@/constants/menu";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";

export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart } = useApp();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const handleTabChange = (tab) => {
    const routes = {
      Menu: "/(tabs)",
      Cart: "/(tabs)/cart",
      History: "/(tabs)/history",
      Profile: "/(tabs)/profile",
    };
    if (routes[tab]) {
      router.replace(routes[tab]);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsDetailVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="restaurant" size={28} color="#ff6b00" />
          <Text style={styles.title}>Menu</Text>
        </View>

        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleSelectItem(item)}
            >
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <View style={styles.menuContent}>
                <View>
                  <Text style={styles.menuName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.menuCategory}>{item.category}</Text>
                </View>
                <View style={styles.menuFooter}>
                  <Text style={styles.menuPrice}>
                    Rp {(item.price * 1000).toLocaleString("id-ID")}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="star" size={14} color="#ff9f00" />
                    <Text style={styles.menuRating}>{item.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Detail Customize Modal */}
      <DetailSheet
        visible={isDetailVisible}
        item={selectedItem}
        onClose={() => setIsDetailVisible(false)}
        onAddToCart={addToCart}
      />

      <NavigationFooter
        activeTab="Menu"
        onTabChange={handleTabChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
  },
  headerIcon: {
    fontSize: 32,
  },
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  menuImage: {
    width: 100,
    height: 100,
  },
  menuContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  menuName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  menuCategory: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  menuFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ff6b00",
  },
  menuRating: {
    fontSize: 12,
    color: "#f97316",
  },
});
