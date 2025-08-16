import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { StarRating } from '../components/StarRating';
import { getCheeseById, addReview, uploadImage, auth } from '../services/firebase';
import { Cheese, RootStackParamList } from '../types';

type AddReviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddReview'>;
type AddReviewScreenRouteProp = RouteProp<RootStackParamList, 'AddReview'>;

export const AddReviewScreen: React.FC = () => {
  const navigation = useNavigation<AddReviewScreenNavigationProp>();
  const route = useRoute<AddReviewScreenRouteProp>();
  const { cheeseId } = route.params;

  const [cheese, setCheese] = useState<Cheese | null>(null);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCheese();
  }, [cheeseId]);

  const loadCheese = async () => {
    try {
      const cheeseData = await getCheeseById(cheeseId);
      setCheese(cheeseData);
    } catch (error) {
      console.error('Error loading cheese:', error);
      Alert.alert('Error', 'No se pudo cargar la información del queso');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const removePhoto = () => {
    setPhotoUri(null);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor califica el queso');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'Debes estar conectado para agregar una reseña');
      return;
    }

    try {
      setSubmitting(true);

      let photoUrl: string | undefined;
      if (photoUri) {
        const fileName = `reviews/${cheeseId}/${Date.now()}.jpg`;
        photoUrl = await uploadImage(photoUri, fileName);
      }

      const review = {
        cheeseId,
        userId: auth.currentUser.uid,
        rating,
        note: note.trim() || undefined,
        photoUrl,
      };

      await addReview(review);

      Alert.alert(
        '¡Reseña agregada!',
        'Tu reseña ha sido publicada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'No se pudo publicar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cheese) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Queso no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Agregar Reseña</Text>
          <View style={styles.cheeseInfo}>
            <Image source={{ uri: cheese.photoUrl }} style={styles.cheeseImage} />
            <View style={styles.cheeseDetails}>
              <Text style={styles.cheeseName}>{cheese.name}</Text>
              <Text style={styles.cheeseProducer}>{cheese.producer}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Calificación</Text>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size={32}
            />
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.sectionTitle}>Nota (opcional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Comparte tu experiencia con este queso..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Foto (opcional)</Text>
            {photoUri ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
                  <Text style={styles.removePhotoText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                <Text style={styles.addPhotoText}>📷 Agregar foto</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || submitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={rating === 0 || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Publicar Reseña</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  cheeseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cheeseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cheeseDetails: {
    flex: 1,
  },
  cheeseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cheeseProducer: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  ratingSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  noteSection: {
    marginBottom: 24,
  },
  noteInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 100,
  },
  photoSection: {
    marginBottom: 32,
  },
  addPhotoButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '500',
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
