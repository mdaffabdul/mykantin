import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOPPING_OPTIONS = [
  {
    name: "Extra Cheddar Cheese",
    price: 1.5,
    description: "Keju cheddar cair",
  },
  { name: "Organic Soft Egg", price: 2.0, description: "Telur setengah matang" },
  { name: "Sliced Avocado", price: 2.5, description: "Alpukat segar iris" },
  {
    name: "House Fried Garlic",
    price: 0.75,
    description: "Bawang putih goreng renyah",
  },
];

export const DetailSheet = ({
  visible,
  item,
  onClose,
  onAddToCart,
}) => {
  const insets = useSafeAreaInsets();
  const [spiceLevel, setSpiceLevel] = useState("Sedang");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset values when item changes or modal opens
  useEffect(() => {
    if (visible && item) {
      setSpiceLevel("Sedang");
      setSelectedToppings([]);
      setQuantity(1);
      setNotes("");
      setIsSubmitting(false);
    }
  }, [visible, item]);

  if (!item) return null;

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.name === topping.name);
      if (exists) {
        return prev.filter((t) => t.name !== topping.name);
      } else {
        return [...prev, topping];
      }
    });
  };

  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const singleItemPrice = item.price + toppingsTotal;
  const totalPrice = singleItemPrice * quantity;

  const handleAddToBasketAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onAddToCart({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
        spiceLevel: item.spiceLevels ? spiceLevel : undefined,
        selectedToppings: selectedToppings.map((t) => ({
          name: t.name,
          price: t.price,
        })),
        notes,
        itemTotal: totalPrice,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.container}>
          {/* Header Image Section */}
          <View style={styles.imageHeader}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.gradientOverlay} />
            
            <TouchableOpacity
              onPress={onClose}
              style={[styles.backButton, { top: insets.top || 16 }]}
            >
              <Ionicons name="arrow-back" size={20} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* Details Section */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mainInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#ff6b00" style={styles.starIcon} />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewsText}>
                {item.reviewsCount} review mahasiswa terverifikasi
              </Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            {/* Spice Levels */}
            {item.spiceLevels && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tingkat Kepedasan</Text>
                <View style={styles.gridSpice}>
                  {["Biasa", "Sedang", "Pedas"].map((level) => {
                    const isActive = spiceLevel === level;
                    let iconName = "thermometer-outline";
                    let iconColor = "#94a3b8";

                    if (level === "Biasa") {
                      iconName = "thermometer-outline";
                      iconColor = isActive ? "#ff6b00" : "#64748b";
                    } else if (level === "Sedang") {
                      iconName = "flame";
                      iconColor = isActive ? "#ff6b00" : "#64748b";
                    } else if (level === "Pedas") {
                      iconName = "flame-sharp";
                      iconColor = isActive ? "#ef4444" : "#64748b";
                    }

                    return (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setSpiceLevel(level)}
                        style={[
                          styles.spiceButton,
                          isActive && styles.spiceButtonActive,
                        ]}
                      >
                        <Ionicons name={iconName} size={16} color={iconColor} />
                        <Text
                          style={[
                            styles.spiceButtonText,
                            isActive && styles.spiceButtonTextActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Toppings Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Topping Tambahan</Text>
                <Text style={styles.sectionOptional}>PILIHAN</Text>
              </View>
              <View style={styles.toppingsList}>
                {TOPPING_OPTIONS.map((topping) => {
                  const isChecked = selectedToppings.some(
                    (t) => t.name === topping.name
                  );
                  return (
                    <TouchableOpacity
                      key={topping.name}
                      onPress={() => toggleTopping(topping)}
                      activeOpacity={0.7}
                      style={[
                        styles.toppingItem,
                        isChecked && styles.toppingItemChecked,
                      ]}
                    >
                      <View style={styles.toppingLeft}>
                        <View
                          style={[
                            styles.checkbox,
                            isChecked && styles.checkboxChecked,
                          ]}
                        >
                          {isChecked && (
                            <Ionicons name="checkmark" size={12} color="#fff" />
                          )}
                        </View>
                        <View style={styles.toppingDetails}>
                          <Text style={styles.toppingName}>{topping.name}</Text>
                          <Text style={styles.toppingDesc}>
                            {topping.description}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.toppingPrice}>
                        +Rp {(topping.price * 1000).toLocaleString("id-ID")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Notes Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Catatan / Alergi</Text>
              </View>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Contoh: gak pake bawang goreng, kurangi kecap, dsb..."
                style={styles.notesInput}
                multiline
                numberOfLines={3}
                maxLength={140}
              />
            </View>
          </ScrollView>

          {/* Action Bar (Sticky Bottom) */}
          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity((prev) => Math.min(20, prev + 1))}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAddToBasketAction}
              disabled={isSubmitting}
              style={styles.addButton}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="cart" size={18} color="#fff" style={styles.btnIcon} />
                  <Text style={styles.addButtonText}>
                    Tambah (Rp {(totalPrice * 1000).toLocaleString("id-ID")})
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageHeader: {
    height: 250,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backButton: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  mainInfo: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
    flex: 1,
    paddingRight: 12,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ff6b00",
  },
  reviewsText: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionOptional: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  gridSpice: {
    flexDirection: "row",
    gap: 10,
  },
  spiceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  spiceButtonActive: {
    borderColor: "#ff6b00",
    backgroundColor: "#fff7ed",
  },
  spiceButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  spiceButtonTextActive: {
    color: "#ff6b00",
    fontWeight: "800",
  },
  toppingsList: {
    gap: 8,
  },
  toppingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  toppingItemChecked: {
    borderColor: "#ff6b00",
    backgroundColor: "#fff7ed",
  },
  toppingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    borderColor: "#ff6b00",
    backgroundColor: "#ff6b00",
  },
  toppingDetails: {
    flex: 1,
  },
  toppingName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
  },
  toppingDesc: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 2,
  },
  toppingPrice: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ff6b00",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    height: 70,
    textAlignVertical: "top",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    padding: 16,
    gap: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6b00",
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    width: 24,
    textAlign: "center",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnIcon: {
    marginRight: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
