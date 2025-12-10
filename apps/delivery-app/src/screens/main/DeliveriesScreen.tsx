import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function DeliveriesScreen({ navigation }: any) {
  const mockDeliveries = [
    { id: '1', orderNumber: 'ORD-001', address: '123 Main St', status: 'assigned' },
    { id: '2', orderNumber: 'ORD-002', address: '456 Oak Ave', status: 'picked_up' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={mockDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DeliveryDetail', { delivery: item })}
          >
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.status}>{item.status.replace('_', ' ').toUpperCase()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No deliveries assigned</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  status: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});

