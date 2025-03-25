import { Text, View, FlatList, StyleSheet } from "react-native";

export default function Index() {
  // Define your initial portfolio
  const portfolioStocks = [
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "TSLA", name: "Tesla, Inc." },
  ];

  // Render each stock item
  const renderStockItem = ({ item }) => (
    <View style={styles.stockItem}>
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Portfolio</Text>
      <FlatList
        data={portfolioStocks}
        renderItem={renderStockItem}
        keyExtractor={item => item.symbol}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stockItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  symbol: {
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
    color: '#666',
  },
});
