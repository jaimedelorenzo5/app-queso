import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, getCheese } from '../lib/supabase';
import { SupabaseCheese, UnifiedCheese, RootStackParamList, CheeseReview } from '../types';
import { getCheeseRecommendations, CheeseRecommendation } from '../lib/recommendations';
import { CheeseCard } from '../components/CheeseCard';
import { ReviewForm } from '../components/ReviewForm';
import { PhotoUploader } from '../components/PhotoUploader';

type CheeseDetailRouteProp = RouteProp<RootStackParamList, 'CheeseDetail'>;

export const CheeseDetailScreen: React.FC = () => {
  const route = useRoute<CheeseDetailRouteProp>();
  const navigation = useNavigation();
  const { cheeseId, cheese: passedCheese } = route.params;
  
  const [cheese, setCheese] = useState<UnifiedCheese | null>(null);
  const [recommendations, setRecommendations] = useState<CheeseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Estado para reseñas y fotos
  const [reviews, setReviews] = useState<CheeseReview[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);

  useEffect(() => {
    loadCheeseDetails();
  }, [cheeseId]);

  const loadCheeseDetails = async () => {
    try {
      setLoading(true);
      
      // Si ya tenemos el queso pasado directamente (quesos de OFF)
      if (passedCheese) {
        console.log('🧀 Usando queso pasado directamente:', passedCheese.name);
        setCheese(passedCheese);
        await checkIfSaved(passedCheese.id);
        // Para quesos de OFF, no cargamos recomendaciones por ahora
        setRecommendations([]);
        return;
      }
      
      // Si no, buscar en Supabase por ID
      if (!cheeseId) {
        console.error('No hay cheeseId ni queso pasado');
        Alert.alert('Error', 'No se pudo identificar el queso');
        return;
      }
      
      const { data: cheeseData, error: cheeseError } = await getCheese(cheeseId);

      if (cheeseError) {
        console.error('Error loading cheese:', cheeseError);
        Alert.alert('Error', `No se pudo cargar el queso: ${cheeseError.message}`);
        return;
      }

      if (!cheeseData) {
        console.error('No se encontró el queso con ID:', cheeseId);
        Alert.alert('Error', 'Queso no encontrado en la base de datos');
        return;
      }

      // Convertir a UnifiedCheese
      const unifiedCheese: UnifiedCheese = {
        ...cheeseData,
        source: 'supabase' as const
      };
      
      setCheese(unifiedCheese);

      // Verificar si está guardado
      await checkIfSaved(unifiedCheese.id);

      // Cargar recomendaciones
      if (cheeseId) {
        const recs = await getCheeseRecommendations(cheeseId, 3);
        setRecommendations(recs);
      }

    } catch (error) {
      console.error('Error in loadCheeseDetails:', error);
      Alert.alert('Error', 'Error inesperado al cargar los detalles');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async (id: string | undefined) => {
    if (!id) return;
    try {
      // Obtener quesos guardados de AsyncStorage
      const savedCheesesString = await AsyncStorage.getItem('savedCheeses');
      if (savedCheesesString) {
        const savedCheeses = JSON.parse(savedCheesesString);
        // Verificar si este queso está en la lista
        if (savedCheeses.includes(id)) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Error checking if saved:', error);
    }
  };

  const toggleSave = async () => {
    try {
      // Obtener quesos guardados actuales
      const savedCheesesString = await AsyncStorage.getItem('savedCheeses');
      let savedCheeses: string[] = savedCheesesString ? JSON.parse(savedCheesesString) : [];
      
      if (!cheeseId) return;
      
      if (isSaved) {
        // Remover de guardados
        savedCheeses = savedCheeses.filter(id => id !== cheeseId);
        await AsyncStorage.setItem('savedCheeses', JSON.stringify(savedCheeses));
        
        setIsSaved(false);
        Alert.alert('Eliminado', 'Queso removido de tus guardados');
      } else {
        // Agregar a guardados
        savedCheeses.push(cheeseId);
        await AsyncStorage.setItem('savedCheeses', JSON.stringify(savedCheeses));
        
        setIsSaved(true);
        Alert.alert('Guardado', 'Queso añadido a tus guardados');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'No se pudo guardar el queso');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCheeseDetails();
    setRefreshing(false);
  };

  // Funciones para reseñas y fotos
  const handleReviewSubmit = async (reviewData: {
    rating: number;
    comment: string;
    photos: string[];
  }) => {
    try {
      // Aquí normalmente guardarías en la base de datos
      const newReview: CheeseReview = {
        id: Date.now().toString(),
        cheeseId: cheese?.id || '',
        userId: 'user123', // ID del usuario actual
        userName: 'Tú',
        rating: reviewData.rating,
        comment: reviewData.comment,
        photos: reviewData.photos,
        createdAt: new Date(),
        helpfulCount: 0,
        commentCount: 0,
      };

      setReviews(prev => [newReview, ...prev]);
      setShowReviewModal(false);
      Alert.alert('¡Éxito!', 'Tu reseña se ha publicado correctamente');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'No se pudo publicar la reseña');
    }
  };

  const handlePhotosSelected = (photos: string[]) => {
    setUserPhotos(photos);
    setShowPhotoModal(false);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  const getUserRating = () => {
    const userReview = reviews.find(review => review.userName === 'Tú');
    return userReview?.rating || 0;
  };

  const getImageSource = () => {
    if (cheese?.image_url) {
      return { uri: cheese.image_url };
    }
    if (cheese?.imageUrl) {
      return { uri: cheese.imageUrl };
    }
    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando queso...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cheese) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🧀</Text>
          <Text style={styles.errorTitle}>Queso no encontrado</Text>
          <Text style={styles.errorText}>
            No se pudo cargar la información del queso
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCheeseDetails}>
            <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header estilo Vivino */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.cheeseName}>{cheese?.name || 'Cargando...'}</Text>
          <Text style={styles.cheeseSubtitle}>
            {cheese?.producer && `${cheese.producer} • `}
            {cheese?.country}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen del queso - Estilo Vivino */}
        {cheese && (
          <View style={styles.imageContainer}>
            {getImageSource() ? (
              <Image
                source={getImageSource()!}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.defaultImageContainer}>
                <Text style={styles.defaultImageText}>🧀</Text>
              </View>
            )}
            
            {/* Botones de acción sobre la imagen */}
            <View style={styles.imageActions}>
              <TouchableOpacity
                style={[styles.saveButton, isSaved && styles.saveButtonActive]}
                onPress={toggleSave}
              >
                <Ionicons
                  name={isSaved ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isSaved ? '#FFFFFF' : '#FF6B35'}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Sección de Valoración - Estilo Vivino */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingNumber}>{getAverageRating()}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= getAverageRating() ? 'star' : 'star-outline'}
                  size={20}
                  color={star <= getAverageRating() ? '#FFD700' : '#E0E0E0'}
                />
              ))}
            </View>
            <Text style={styles.totalRatings}>
              {reviews.length} valoración{reviews.length !== 1 ? 'es' : ''}
            </Text>
          </View>

          {/* Valoración del usuario */}
          {getUserRating() > 0 ? (
            <View style={styles.userRating}>
              <Text style={styles.userRatingText}>Lo has valorado</Text>
              <View style={styles.userRatingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= getUserRating() ? 'star' : 'star-outline'}
                    size={16}
                    color={star <= getUserRating() ? '#FFD700' : '#E0E0E0'}
                  />
                ))}
                <Text style={styles.userRatingNumber}>{getUserRating()}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => setShowReviewModal(true)}
            >
              <Ionicons name="star-outline" size={20} color="#FF6B35" />
              <Text style={styles.rateButtonText}>Valóralo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botones de acción principales */}
        <View style={styles.mainActions}>
          <TouchableOpacity
            style={styles.mainActionButton}
            onPress={() => setShowReviewModal(true)}
          >
            <Ionicons name="star-outline" size={20} color="#FF6B35" />
            <Text style={styles.mainActionButtonText}>
              {getUserRating() > 0 ? 'Editar valoración' : 'Valóralo'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mainActionButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#6C757D" />
            <Text style={styles.mainActionButtonText}>Acciones</Text>
          </TouchableOpacity>
        </View>

        {/* Información del queso */}
        <View style={styles.cheeseInfo}>
          <Text style={styles.cheeseInfoTitle}>{cheese?.name}</Text>
          <Text style={styles.cheeseInfoSubtitle}>
            {cheese?.producer && `${cheese.producer} • `}
            {cheese?.country}
            {cheese?.milk_type && ` • ${cheese.milk_type}`}
          </Text>
          
          {/* Badges de características */}
          <View style={styles.cheeseBadges}>
            {cheese?.milk_type && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🥛 {cheese.milk_type}</Text>
              </View>
            )}
            {cheese?.maturation && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>⏰ {cheese.maturation}</Text>
              </View>
            )}
            {cheese?.designation && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🏆 {cheese.designation}</Text>
              </View>
            )}
          </View>
          
          {/* Botón para subir fotos */}
          <TouchableOpacity
            style={styles.uploadPhotosButton}
            onPress={() => setShowPhotoModal(true)}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.uploadPhotosButtonText}>📸 Subir fotos de este queso</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de fotos del usuario */}
        {userPhotos.length > 0 && (
          <View style={styles.userPhotosSection}>
            <Text style={styles.sectionTitle}>📸 Tus fotos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {userPhotos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.userPhoto} />
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.addMorePhotosButton}
              onPress={() => setShowPhotoModal(true)}
            >
              <Ionicons name="add" size={20} color="#FF6B35" />
              <Text style={styles.addMorePhotosText}>Añadir más fotos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sección de reseñas */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Comentarios</Text>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => setShowReviewModal(true)}
            >
              <Text style={styles.addReviewButtonText}>Agregar reseña</Text>
            </TouchableOpacity>
          </View>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {review.userName.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.reviewUserName}>{review.userName}</Text>
                      <Text style={styles.reviewDate}>
                        {review.createdAt.toLocaleDateString('es-ES')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= review.rating ? 'star' : 'star-outline'}
                        size={16}
                        color={star <= review.rating ? '#FFD700' : '#E0E0E0'}
                      />
                    ))}
                  </View>
                </View>
                
                <Text style={styles.reviewComment}>{review.comment}</Text>
                
                {review.photos.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {review.photos.map((photo, index) => (
                      <Image key={index} source={{ uri: photo }} style={styles.userPhoto} />
                    ))}
                  </ScrollView>
                )}
                
                <View style={styles.reviewActions}>
                  <TouchableOpacity style={styles.reviewAction}>
                    <Ionicons name="thumbs-up-outline" size={16} color="#6C757D" />
                    <Text style={styles.reviewActionText}>{review.helpfulCount}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reviewAction}>
                    <Ionicons name="chatbubble-outline" size={16} color="#6C757D" />
                    <Text style={styles.reviewActionText}>{review.commentCount}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsText}>
                Sé el primero en dejar una reseña para este queso
              </Text>
            </View>
          )}
        </View>

        {/* Sección de recomendaciones */}
        {recommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Quesos Similares</Text>
            <Text style={styles.sectionSubtitle}>
              Basado en tus preferencias y características similares
            </Text>
            
            {recommendations.map((rec, index) => (
              <View key={rec.cheese.id} style={styles.recommendationItem}>
                <CheeseCard cheese={{
                  ...rec.cheese,
                  source: 'supabase' as const
                }} />
                <View style={styles.recommendationReasons}>
                  <Text style={styles.reasonsTitle}>Por qué te puede gustar:</Text>
                  {rec.reasons.map((reason, reasonIndex) => (
                    <Text key={reasonIndex} style={styles.reasonText}>
                      • {reason}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal para escribir reseñas */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowReviewModal(false)}
            >
              <Ionicons name="close" size={24} color="#6C757D" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Escribir Reseña</Text>
          </View>
          <ReviewForm
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowReviewModal(false)}
            initialRating={getUserRating()}
          />
        </SafeAreaView>
      </Modal>

      {/* Modal para subir fotos */}
      <Modal
        visible={showPhotoModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPhotoModal(false)}
            >
              <Ionicons name="close" size={24} color="#6C757D" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Subir Fotos</Text>
          </View>
          <PhotoUploader
            onPhotosSelected={handlePhotosSelected}
            maxPhotos={5}
            existingPhotos={userPhotos}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FF6B35',
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  cheeseName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  cheeseSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonActive: {
    backgroundColor: '#FF6B35',
  },
  shareButton: {
    backgroundColor: '#6C757D',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  defaultImageText: {
    fontSize: 100,
  },
  ratingSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  ratingHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  totalRatings: {
    fontSize: 16,
    color: '#6C757D',
  },
  userRating: {
    alignItems: 'center',
  },
  userRatingText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  userRatingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userRatingNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 8,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  rateButtonText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  mainActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mainActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mainActionButtonText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  cheeseInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cheeseInfoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  cheeseInfoSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 16,
  },
  cheeseBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  badgeText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  userPhotosSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  addMorePhotosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  addMorePhotosText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  reviewsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addReviewButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 20,
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  reviewDate: {
    fontSize: 14,
    color: '#6C757D',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 24,
    marginBottom: 12,
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewActionText: {
    fontSize: 14,
    color: '#6C757D',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recommendationsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 20,
    textAlign: 'center',
  },
  recommendationItem: {
    marginBottom: 20,
  },
  recommendationReasons: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6C757D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 8,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  uploadPhotosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  uploadPhotosButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
