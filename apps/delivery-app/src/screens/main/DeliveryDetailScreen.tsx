import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DeliveryDetailScreen({ route }: any) {
  const { delivery } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Order Number</Text>
        <Text style={styles.value}>{delivery.orderNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Delivery Address</Text>
        <Text style={styles.value}>{delivery.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{delivery.status.replace('_', ' ').toUpperCase()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  secondaryButtonText: {
    color: '#4ECDC4',
  },
});

