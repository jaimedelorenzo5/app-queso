import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { createReview } from '../../lib/supabase';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  cheeseId: string;
  cheeseName: string;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  cheeseId,
  cheeseName,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Error', 'Por favor selecciona una valoración válida');
      return;
    }

    setSubmitting(true);
    try {
      // Usar usuario demo por ahora
      const demoUserId = '550e8400-e29b-41d4-a716-446655440000';
      
      const { error } = await createReview({
        cheese_id: cheeseId,
        user_id: demoUserId,
        stars: rating,
        note: note.trim() || null,
        photo_url: null, // Por ahora sin foto
      });

      if (error) {
        Alert.alert('Error', 'No se pudo guardar la reseña');
        console.error('Error creating review:', error);
      } else {
        Alert.alert('Éxito', '¡Tu reseña ha sido guardada!');
        setRating(5);
        setNote('');
        onReviewSubmitted?.();
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      console.error('Error in handleSubmit:', error);
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
            <Text style={[styles.star, star <= rating && styles.starFilled]}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
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
          <Text style={styles.title}>Valorar {cheeseName}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Valoración</Text>
            {renderStars()}
            <Text style={styles.ratingText}>{rating} estrellas</Text>
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
              maxLength={500}
            />
            <Text style={styles.charCount}>{note.length}/500</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Guardando...' : 'Guardar Reseña'}
              </Text>
            </TouchableOpacity>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
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
  ratingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
    color: '#E9ECEF',
  },
  starFilled: {
    color: '#FF6B35',
  },
  ratingText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  noteSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'right',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CED4DA',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
