import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const CartItemRow = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Options details */}
        <View style={styles.optionsContainer}>
          {item.spiceLevel ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.spiceLevel}</Text>
            </View>
          ) : null}
          
          {item.selectedToppings.map((t) => (
            <View key={t.name} style={[styles.badge, styles.toppingBadge]}>
              <Text style={styles.toppingBadgeText}>+{t.name.replace("Extra ", "")}</Text>
            </View>
          ))}
        </View>

        {item.notes ? (
          <Text style={styles.notesText} numberOfLines={1}>
            “{item.notes}”
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <Text style={styles.price}>
            Rp {(item.itemTotal * 1000).toLocaleString("id-ID")}
          </Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.id, -1)}
              style={styles.quantityBtn}
            >
              <Ionicons name="remove" size={14} color="#ff6b00" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.id, 1)}
              style={styles.quantityBtn}
              disabled={item.quantity >= 99}
            >
              <Ionicons name="add" size={14} color="#ff6b00" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
    paddingRight: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#fff7ed",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#ff6b00",
    textTransform: "uppercase",
  },
  toppingBadge: {
    backgroundColor: "#f1f5f9",
  },
  toppingBadgeText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#475569",
  },
  notesText: {
    fontSize: 10,
    color: "#94a3b8",
    fontStyle: "italic",
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ff6b00",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 2,
  },
  quantityBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
    paddingHorizontal: 8,
    textAlign: "center",
  },
});
