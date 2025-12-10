import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '../../contexts/CartContext';

export default function CartScreen() {
  const { items, total, itemCount } = useCart();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <Text style={styles.text}>Items: {itemCount}</Text>
      <Text style={styles.text}>Total: ${total.toFixed(2)}</Text>
      {itemCount === 0 && (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});

