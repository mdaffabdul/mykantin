import { NavigationFooter } from "@/components/organism/navigationFooter";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderHistory } = useApp();

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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="receipt" size={28} color="#ff6b00" />
          <Text style={styles.title}>Riwayat Pesanan</Text>
        </View>

        {orderHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
            <Text style={styles.emptyText}>
              Pesanan Anda akan muncul di sini setelah Anda melakukan pemesanan
            </Text>
          </View>
        ) : (
          <View style={styles.orderList}>
            {orderHistory.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderItems}>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.itemName}>
                          {item.name}{" "}
                          <Text style={styles.itemQty}>x{item.quantity}</Text>
                        </Text>
                        {item.spiceLevel && (
                          <Text style={styles.itemDetails}>
                            Level: {item.spiceLevel}
                          </Text>
                        )}
                        {item.selectedToppings.length > 0 && (
                          <Text style={styles.itemDetails}>
                            Topping:{" "}
                            {item.selectedToppings.map((t) => t.name).join(", ")}
                          </Text>
                        )}
                        {item.notes ? (
                          <Text style={styles.itemNotes}>
                            Catatan: &quot;{item.notes}&quot;
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.itemPrice}>
                        Rp {(item.itemTotal * 1000).toLocaleString("id-ID")}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.orderFooter}>
                  <Text style={styles.totalLabel}>Total Pembayaran</Text>
                  <Text style={styles.totalAmount}>
                    Rp {(order.total * 1000).toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <NavigationFooter
        activeTab="History"
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
  orderList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
    color: "#64748b",
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803d",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  orderItems: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  itemQty: {
    fontWeight: "800",
    color: "#ff6b00",
  },
  itemDetails: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  itemNotes: {
    fontSize: 11,
    color: "#94a3b8",
    fontStyle: "italic",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ff6b00",
  },
});
