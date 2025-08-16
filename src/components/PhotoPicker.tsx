import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PhotoPickerProps {
  onPhotoSelected: (photoUri: string) => void;
  onClose: () => void;
  visible: boolean;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  onPhotoSelected,
  onClose,
  visible,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Necesitamos acceso a la cámara y galería para tomar fotos de quesos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const confirmPhoto = () => {
    if (selectedPhoto) {
      onPhotoSelected(selectedPhoto);
      setSelectedPhoto(null);
      onClose();
    }
  };

  const retakePhoto = () => {
    setSelectedPhoto(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📸 Foto del Queso</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {!selectedPhoto ? (
            // Pantalla de selección
            <View style={styles.selectionContainer}>
              <Text style={styles.subtitle}>
                ¿Cómo quieres añadir la foto?
              </Text>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={takePhoto}
              >
                <Text style={styles.optionIcon}>📷</Text>
                <Text style={styles.optionTitle}>Tomar Foto</Text>
                <Text style={styles.optionDescription}>
                  Usar la cámara para tomar una foto del queso
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={pickFromGallery}
              >
                <Text style={styles.optionIcon}>🖼️</Text>
                <Text style={styles.optionTitle}>Galería</Text>
                <Text style={styles.optionDescription}>
                  Seleccionar una foto existente de tu galería
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Pantalla de preview
            <View style={styles.previewContainer}>
              <Text style={styles.subtitle}>Vista previa de la foto</Text>
              
              <Image
                source={{ uri: selectedPhoto }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              
              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={retakePhoto}
                >
                  <Text style={styles.retakeButtonText}>🔄 Volver a tomar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={confirmPhoto}
                >
                  <Text style={styles.confirmButtonText}>✅ Usar esta foto</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6C757D',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6C757D',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 24,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  retakeButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  retakeButtonText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
