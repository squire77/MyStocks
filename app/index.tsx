import { View, StyleSheet } from "react-native";
import { useState, useEffect } from 'react';
import StockList from '../components/StockList';
import { getStockPrices } from '../services/stockService';

type StockItem = {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
};

export default function App() {
  const [stocks, setStocks] = useState<StockItem[]>([
    { symbol: "GOOGL", name: "Alphabbbet Inc.", price: 0.0, change: 0.0, changePercent: 0.0 },
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 0.0, change: 0.0, changePercent: 0.0 },
    { symbol: "MSFT", name: "Microsoft Corporation", price: 0.0, change: 0.0, changePercent: 0.0 },
    { symbol: "TSLA", name: "Tesla, Inc.", price: 0.0, change: 0.0, changePercent: 0.0 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Regular price updates
    updateStockPrices();
    const interval = setInterval(updateStockPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  const updateStockPrices = async () => {
    setIsLoading(true);
    try {
      const symbols = stocks.map(stock => stock.symbol);
      const stockPrices = await getStockPrices(symbols);
      
      if (stockPrices) {
        setStocks(currentStocks => 
          currentStocks.map(stock => {
            const priceData = stockPrices.find((p: { symbol: string; price?: number; change?: number; changePercent?: number }) => 
              p.symbol === stock.symbol
            );
            return {
              ...stock,
              price: priceData?.price,
              change: priceData?.change,
              changePercent: priceData?.changePercent,
            };
          })
        );
      }
    } catch (error) {
      console.error('Error updating stock prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStock = (symbol: string) => {
    setStocks(currentStocks => currentStocks.filter(stock => stock.symbol !== symbol));
  };

  return (
    <View style={styles.container}>
      <StockList
        stocks={stocks}
        onDeleteStock={handleDeleteStock}
        isLoading={isLoading}
        onRefresh={updateStockPrices}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  }
});
