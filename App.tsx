import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthProvider } from './src/components/AuthProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { PWAInstaller } from './src/components/PWAInstaller';

export default function App() {
  // El Service Worker ya se registra en el index.html personalizado

  return (
    <AuthProvider>
      <StatusBar style="light" />
      {Platform.OS === 'web' && <PWAInstaller />}
      <AppNavigator />
    </AuthProvider>
  );
}
