import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { PWAInstaller } from './src/components/PWAInstaller';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {Platform.OS === 'web' && <PWAInstaller />}
      <AppNavigator />
    </NavigationContainer>
  );
}



