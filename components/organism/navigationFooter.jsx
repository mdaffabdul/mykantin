import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";

export const NavigationFooter = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();
  const { cart } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: "Menu", icon: "restaurant-menu" },
    { label: "Cart", icon: "shopping-cart" },
    { label: "History", icon: "history" },
    { label: "Profile", icon: "person" },
  ];

  return (
    <View style={[styles.footer, { height: 64 + insets.bottom, paddingBottom: insets.bottom }]}>
      {navItems.map((item) => {
        const isActive = activeTab === item.label;
        const isCart = item.label === "Cart";

        return (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => onTabChange(item.label)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && styles.iconContainerActive,
              ]}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={isActive ? "#ff6b00" : "#9ca3af"}
              />
              {isCart && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    zIndex: 40,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconContainerActive: {
    backgroundColor: "#fff7ed",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff6b00",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelActive: {
    color: "#ff6b00",
  },
});
