import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { CheeseDetailScreen } from '../screens/CheeseDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RootStackParamList } from '../types';
import { DesignSystem } from '../constants/designSystem';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
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
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheeseDetail"
        component={CheeseDetailScreen}
        options={{ 
          headerShown: false,
          tabBarVisible: false
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ 
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};
