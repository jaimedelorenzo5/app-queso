import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface PhotoUploaderProps {
  onPhotosSelected: (photos: string[]) => void;
  maxPhotos?: number;
  existingPhotos?: string[];
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotosSelected,
  maxPhotos = 5,
  existingPhotos = [],
}) => {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a la cámara y galería para subir fotos de quesos.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (!(await requestPermissions())) return;
    if (photos.length >= maxPhotos) {
      Alert.alert('Límite alcanzado', `Puedes subir máximo ${maxPhotos} fotos.`);
      return;
    }

    try {
      setUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...photos, result.assets[0].uri];
        setPhotos(newPhotos);
        onPhotosSelected(newPhotos);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setUploading(false);
    }
  };

  const pickFromGallery = async () => {
    if (!(await requestPermissions())) return;
    if (photos.length >= maxPhotos) {
      Alert.alert('Límite alcanzado', `Puedes subir máximo ${maxPhotos} fotos.`);
      return;
    }

    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: maxPhotos - photos.length,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newPhotos = [...photos, ...result.assets.map(asset => asset.uri)];
        setPhotos(newPhotos);
        onPhotosSelected(newPhotos);
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosSelected(newPhotos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Fotos del Queso</Text>
      
      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cameraButton]}
          onPress={takePhoto}
          disabled={uploading || photos.length >= maxPhotos}
        >
          <Ionicons name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Cámara</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.galleryButton]}
          onPress={pickFromGallery}
          disabled={uploading || photos.length >= maxPhotos}
        >
          <Ionicons name="images" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Galería</Text>
        </TouchableOpacity>
      </View>

      {/* Contador de fotos */}
      <Text style={styles.photoCount}>
        {photos.length} / {maxPhotos} fotos
      </Text>

      {/* Grid de fotos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(index)}
            >
              <Ionicons name="close-circle" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Placeholder para añadir más fotos */}
        {photos.length < maxPhotos && (
          <TouchableOpacity
            style={styles.addPhotoPlaceholder}
            onPress={pickFromGallery}
            disabled={uploading}
          >
            <Ionicons name="add" size={32} color="#6C757D" />
            <Text style={styles.addPhotoText}>Añadir</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#FF6B35',
  },
  galleryButton: {
    backgroundColor: '#6C757D',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  photoCount: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 12,
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  addPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
});
