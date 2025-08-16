import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { CheeseDetailScreen } from '../screens/CheeseDetailScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RootStackParamList } from '../types';
import { useAuth } from '../components/AuthProvider';
import { DesignSystem } from '../constants/designSystem';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: DesignSystem.theme.primaryColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: DesignSystem.typography.heading.sizeMedium,
          },
        }}
      >
        {session ? (
          // Authenticated stack
          <>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CheeseDetail"
              component={CheeseDetailScreen}
              options={{ 
                headerShown: false // Ocultar header nativo, usar el personalizado
              }}
            />
          </>
        ) : (
          // Auth stack
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
