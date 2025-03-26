import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { getStockPrices } from '../services/stockService';

// Add this type for our stock data
type StockItem = {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
};

type StockListProps = {
  stocks: StockItem[];
  onDeleteStock: (symbol: string) => void;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
};

const StockList = ({ stocks, onDeleteStock, isLoading, onRefresh }: StockListProps) => {
  const renderRightActions = (symbol: string) => {
    return (
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDeleteStock(symbol)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: StockItem }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.symbol)}
      rightThreshold={40}
    >
      <View style={styles.stockItem}>
        <View style={styles.stockInfo}>
          <Text style={styles.symbolText}>{item.symbol}</Text>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <View style={styles.priceInfo}>
          {item.price !== undefined ? (
            <>
              <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
              {item.changePercent !== undefined && (
                <Text style={[
                  styles.changeText,
                  { color: item.change && item.change >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  {item.change && item.change >= 0 ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </Text>
              )}
            </>
          ) : (
            <ActivityIndicator size="small" />
          )}
        </View>
      </View>
    </Swipeable>
  );

  return (
    <FlatList
      data={stocks}
      renderItem={renderItem}
      keyExtractor={item => item.symbol}
      refreshing={isLoading}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stockInfo: {
    flex: 1,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  symbolText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 14,
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StockList; 