import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstaller: React.FC = () => {
  // Banner deshabilitado completamente
  return null;
  
  // Código original comentado:
  /*
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado
    if (Platform.OS === 'web') {
      const checkIfInstalled = () => {
        // @ts-ignore
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
          setIsInstalled(true);
        }
      };
      
      checkIfInstalled();
      
      // Escuchar cambios en el modo de visualización
      // @ts-ignore
      if (window.matchMedia) {
        // @ts-ignore
        window.matchMedia('(display-mode: standalone)').addEventListener('change', checkIfInstalled);
      }
    }

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Escuchar evento appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      Alert.alert('¡Instalado!', 'CheeseRate se ha instalado correctamente en tu dispositivo');
    };

    if (Platform.OS === 'web') {
      // @ts-ignore
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      // @ts-ignore
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      if (Platform.OS === 'web') {
        // @ts-ignore
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        // @ts-ignore
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
      } else {
        console.log('Usuario rechazó instalar la PWA');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error al instalar PWA:', error);
      Alert.alert('Error', 'No se pudo instalar la aplicación');
    }
  };

  const handleManualInstall = () => {
    if (Platform.OS === 'web') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        Alert.alert(
          'Instalar en iOS',
          '1. Toca el botón compartir (📤)\n2. Selecciona "Añadir a pantalla de inicio"\n3. Toca "Añadir"',
          [{ text: 'Entendido' }]
        );
      } else {
        Alert.alert(
          'Instalar en Android',
          '1. Toca el menú (⋮)\n2. Selecciona "Instalar app"\n3. Toca "Instalar"',
          [{ text: 'Entendido' }]
        );
      }
    }
  };

  // No mostrar si ya está instalado o no es instalable
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.content}>
          <Text style={styles.title}>📱 Instala CheeseRate</Text>
          <Text style={styles.subtitle}>
            Para una mejor experiencia, instala la app en tu dispositivo
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.installButton} onPress={handleInstallClick}>
            <Text style={styles.installButtonText}>Instalar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.manualInstallButton} onPress={handleManualInstall}>
            <Text style={styles.manualInstallButtonText}>📱</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  */

  useEffect(() => {
    // Verificar si ya está instalado
    if (Platform.OS === 'web') {
      const checkIfInstalled = () => {
        // @ts-ignore
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
          setIsInstalled(true);
        }
      };
      
      checkIfInstalled();
      
      // Escuchar cambios en el modo de visualización
      // @ts-ignore
      if (window.matchMedia) {
        // @ts-ignore
        window.matchMedia('(display-mode: standalone)').addEventListener('change', checkIfInstalled);
      }
    }

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Escuchar evento appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      Alert.alert('¡Instalado!', 'CheeseRate se ha instalado correctamente en tu dispositivo');
    };

    if (Platform.OS === 'web') {
      // @ts-ignore
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      // @ts-ignore
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      if (Platform.OS === 'web') {
        // @ts-ignore
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        // @ts-ignore
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
      } else {
        console.log('Usuario rechazó instalar la PWA');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error al instalar PWA:', error);
      Alert.alert('Error', 'No se pudo instalar la aplicación');
    }
  };

  const handleManualInstall = () => {
    if (Platform.OS === 'web') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        Alert.alert(
          'Instalar en iOS',
          '1. Toca el botón compartir (📤)\n2. Selecciona "Añadir a pantalla de inicio"\n3. Toca "Añadir"',
          [{ text: 'Entendido' }]
        );
      } else {
        Alert.alert(
          'Instalar en Android',
          '1. Toca el menú (⋮)\n2. Selecciona "Instalar aplicación"\n3. Toca "Instalar"',
          [{ text: 'Entendido' }]
        );
      }
    }
  };

  // No mostrar si ya está instalado o no es web
  if (isInstalled || Platform.OS !== 'web') {
    return null;
  }

  // Solo mostrar en la pantalla principal, no en detalles
  if (window.location.pathname !== '/' && !window.location.pathname.includes('explore')) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.content}>
          <Ionicons name="phone-portrait" size={24} color="#A67C52" />
          <Text style={styles.text}>
            Instala CheeseRate en tu dispositivo para una mejor experiencia
          </Text>
        </View>
        
        {isInstallable ? (
          <TouchableOpacity style={styles.installButton} onPress={handleInstallClick}>
            <Ionicons name="download" size={20} color="#FFFFFF" />
            <Text style={styles.installButtonText}>Instalar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.manualButton} onPress={handleManualInstall}>
            <Ionicons name="information-circle" size={20} color="#A67C52" />
            <Text style={styles.manualButtonText}>Cómo instalar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, // Dar espacio para la barra de estado
  },
  banner: {
    backgroundColor: '#FFFDF8',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
    flex: 1,
  },
  installButton: {
    backgroundColor: '#A67C52',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  manualButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A67C52',
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#A67C52',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
