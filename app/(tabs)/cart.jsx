import { NavigationFooter } from "@/components/organism/navigationFooter";
import { CartItemRow } from "@/components/molecules/CartItemRow";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, updateCartQuantity, removeFromCart, checkout, user } = useApp();

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

  const totalCost = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalCostIDR = totalCost * 1000;

  const handleCheckout = () => {
    if (!user) {
      Alert.alert("Perhatian", "Silakan login terlebih dahulu untuk memesan makanan.");
      router.replace("/login");
      return;
    }

    Alert.alert(
      "Konfirmasi Pemesanan",
      `Apakah Anda yakin ingin memesan dengan total Rp ${totalCostIDR.toLocaleString("id-ID")}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Pesan",
          onPress: () => {
            const res = checkout();
            if (res.success) {
              Alert.alert(
                "Pesanan Berhasil",
                "Pesanan Anda telah diproses! Silakan ambil di konter kantin.",
                [
                  {
                    text: "Lihat Riwayat",
                    onPress: () => router.replace("/(tabs)/history"),
                  },
                ]
              );
            } else {
              Alert.alert("Gagal", res.message || "Terjadi kesalahan saat checkout.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="cart" size={28} color="#ff6b00" />
          <Text style={styles.title}>Keranjang Belanja</Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
            <Text style={styles.emptyText}>
              Tambahkan item favorit Anda dari menu untuk mulai berbelanja
            </Text>
          </View>
        ) : (
          <View style={styles.cartList}>
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Ringkasan Pembayaran</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Item ({cart.reduce((s, i) => s + i.quantity, 0)})</Text>
                <Text style={styles.summaryValue}>Rp {totalCostIDR.toLocaleString("id-ID")}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Biaya Layanan</Text>
                <Text style={styles.summaryValue}>Rp 0</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Pembayaran</Text>
                <Text style={styles.totalValue}>Rp {totalCostIDR.toLocaleString("id-ID")}</Text>
              </View>
            </View>

            {/* User Balance Hint */}
            {user ? (
              <View style={styles.balanceBox}>
                <Text style={styles.balanceText}>
                  Saldo Anda saat ini:{" "}
                  <Text style={styles.balanceAmount}>
                    Rp {user.balance.toLocaleString("id-ID")}
                  </Text>
                </Text>
              </View>
            ) : null}

            {/* Checkout Button */}
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutBtnText}>Pesan Sekarang</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <NavigationFooter
        activeTab="Cart"
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
    paddingVertical: 24,
    paddingBottom: 80,
    minHeight: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
  cartList: {
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ff6b00",
  },
  balanceBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 12,
    color: "#475569",
  },
  balanceAmount: {
    fontWeight: "800",
    color: "#ff6b00",
  },
  checkoutBtn: {
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
