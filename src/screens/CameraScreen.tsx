import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DesignSystem } from '../constants/designSystem';

export const CameraScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu galería para seleccionar fotos de quesos.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu cámara para tomar fotos de quesos.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Alert.alert(
          'Foto tomada',
          'Foto capturada exitosamente. Próximamente podrás escanear etiquetas de quesos.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Alert.alert(
          'Foto seleccionada',
          'Foto seleccionada exitosamente. Próximamente podrás escanear etiquetas de quesos.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Cámara</Text>
          <Text style={styles.subtitle}>
            Toma una foto o selecciona una imagen de la etiqueta del queso
          </Text>
        </View>

        <View style={styles.cameraContainer}>
          <View style={styles.cameraFrame}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.cameraText}>
              {selectedImage ? 'Foto seleccionada' : 'Apunta a la etiqueta del queso'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Text style={styles.cameraButtonIcon}>📸</Text>
            <Text style={styles.cameraButtonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Text style={styles.galleryButtonIcon}>🖼️</Text>
            <Text style={styles.galleryButtonText}>Seleccionar de Galería</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.infoText}>
            1. Toma una foto clara de la etiqueta del queso{'\n'}
            2. Nuestra IA analizará la imagen{'\n'}
            3. Te mostraremos información del queso{'\n'}
            4. Podrás calificarlo y guardarlo en tus favoritos
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.theme.backgroundColor,
  },
  content: {
    flex: 1,
    padding: DesignSystem.spacing.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xlarge,
  },
  title: {
    fontSize: DesignSystem.typography.heading.sizeLarge,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    marginBottom: DesignSystem.spacing.small,
  },
  subtitle: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xlarge,
  },
  cameraFrame: {
    width: 280,
    height: 280,
    backgroundColor: DesignSystem.theme.secondaryColor,
    borderRadius: DesignSystem.cornerRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DesignSystem.theme.primaryColor,
    borderStyle: 'dashed',
  },
  cameraIcon: {
    fontSize: 64,
    marginBottom: DesignSystem.spacing.medium,
  },
  cameraText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    textAlign: 'center',
    paddingHorizontal: DesignSystem.spacing.medium,
  },
  buttonContainer: {
    marginBottom: DesignSystem.spacing.xlarge,
  },
  cameraButton: {
    backgroundColor: DesignSystem.components.button.primary.backgroundColor,
    borderRadius: DesignSystem.cornerRadius.medium,
    paddingVertical: DesignSystem.spacing.medium,
    paddingHorizontal: DesignSystem.spacing.large,
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.medium,
    shadowColor: DesignSystem.shadows.soft.color,
    shadowOffset: {
      width: DesignSystem.shadows.soft.offset[0],
      height: DesignSystem.shadows.soft.offset[1],
    },
    shadowOpacity: 0.1,
    shadowRadius: DesignSystem.shadows.soft.radius,
    elevation: 3,
  },
  cameraButtonIcon: {
    fontSize: 24,
    marginBottom: DesignSystem.spacing.small,
  },
  cameraButtonText: {
    color: DesignSystem.components.button.primary.textColor,
    fontSize: DesignSystem.typography.body.size,
    fontWeight: '600',
  },
  galleryButton: {
    backgroundColor: DesignSystem.components.button.secondary.backgroundColor,
    borderWidth: 1,
    borderColor: DesignSystem.theme.primaryColor,
    borderRadius: DesignSystem.cornerRadius.medium,
    paddingVertical: DesignSystem.spacing.medium,
    paddingHorizontal: DesignSystem.spacing.large,
    alignItems: 'center',
    shadowColor: DesignSystem.shadows.soft.color,
    shadowOffset: {
      width: DesignSystem.shadows.soft.offset[0],
      height: DesignSystem.shadows.soft.offset[1],
    },
    shadowOpacity: 0.1,
    shadowRadius: DesignSystem.shadows.soft.radius,
    elevation: 2,
  },
  galleryButtonIcon: {
    fontSize: 24,
    marginBottom: DesignSystem.spacing.small,
  },
  galleryButtonText: {
    color: DesignSystem.components.button.secondary.textColor,
    fontSize: DesignSystem.typography.body.size,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: DesignSystem.theme.secondaryColor,
    borderRadius: DesignSystem.cornerRadius.medium,
    padding: DesignSystem.spacing.large,
  },
  infoTitle: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    marginBottom: DesignSystem.spacing.medium,
  },
  infoText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    lineHeight: 20,
  },
});
