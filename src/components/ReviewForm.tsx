import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PhotoUploader } from './PhotoUploader';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    comment: string;
    photos: string[];
  }) => void;
  onCancel: () => void;
  initialRating?: number;
  initialComment?: string;
  initialPhotos?: string[];
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialRating = 0,
  initialComment = '',
  initialPhotos = [],
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Valoración requerida', 'Por favor, selecciona una valoración con estrellas.');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Comentario muy corto', 'Por favor, escribe al menos 10 caracteres en tu comentario.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        rating,
        comment: comment.trim(),
        photos,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'No se pudo enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? '#FFD700' : '#E0E0E0'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>⭐ Escribe tu Reseña</Text>
      
      {/* Valoración con estrellas */}
      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>Tu valoración</Text>
        {renderStars()}
        <Text style={styles.ratingText}>
          {rating > 0 ? `${rating} estrella${rating > 1 ? 's' : ''}` : 'Toca las estrellas para valorar'}
        </Text>
      </View>

      {/* Comentario */}
      <View style={styles.commentSection}>
        <Text style={styles.sectionTitle}>Tu comentario</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Cuéntanos qué te pareció este queso... (mínimo 10 caracteres)"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.characterCount}>
          {comment.length}/500 caracteres
        </Text>
      </View>

      {/* Subir fotos */}
      <PhotoUploader
        onPhotosSelected={setPhotos}
        maxPhotos={5}
        existingPhotos={photos}
      />

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={submitting || rating === 0 || comment.trim().length < 10}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Enviando...' : 'Enviar Reseña'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginVertical: 20,
  },
  ratingSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  commentSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'right',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
