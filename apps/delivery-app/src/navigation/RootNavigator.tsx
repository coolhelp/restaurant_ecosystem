import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import DeliveriesScreen from '../screens/main/DeliveriesScreen';
import DeliveryDetailScreen from '../screens/main/DeliveryDetailScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen 
            name="Deliveries" 
            component={DeliveriesScreen}
            options={{ title: 'My Deliveries' }}
          />
          <Stack.Screen 
            name="DeliveryDetail" 
            component={DeliveryDetailScreen}
            options={{ title: 'Delivery Details' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

