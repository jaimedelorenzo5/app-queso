import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { DesignSystem } from '../src/constants/designSystem';
import { saveRating, getRating } from '../lib/storage';
import { addActivity } from '../lib/storage';

interface RateModalProps {
  visible: boolean;
  cheese: any;
  onClose: () => void;
  onRatingSaved: () => void;
}

export const RateModal: React.FC<RateModalProps> = ({
  visible,
  cheese,
  onClose,
  onRatingSaved,
}) => {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);

  useEffect(() => {
    if (visible && cheese) {
      loadExistingRating();
    }
  }, [visible, cheese]);

  const loadExistingRating = async () => {
    try {
      const existing = await getRating(cheese.id);
      if (existing) {
        setRating(existing.rating);
        setNote(existing.note || '');
        setExistingRating(existing);
      } else {
        setRating(0);
        setNote('');
        setExistingRating(null);
      }
    } catch (error) {
      console.error('Error loading existing rating:', error);
    }
  };

  const handleStarPress = (starRating: number) => {
    setRating(starRating);
  };

  const handleSave = async () => {
    if (rating === 0) {
      Alert.alert('Valoración requerida', 'Por favor selecciona una valoración de estrellas.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await saveRating(cheese.id, rating, note);
      
      if (success) {
        // Agregar actividad
        await addActivity({
          type: 'rating',
          cheeseId: cheese.id,
          cheeseName: cheese.name,
          rating: rating,
          note: note,
        });

        Alert.alert(
          'Valoración guardada',
          existingRating ? 'Tu valoración ha sido actualizada.' : '¡Gracias por tu valoración!',
          [
            {
              text: 'OK',
              onPress: () => {
                onRatingSaved();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo guardar la valoración. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la valoración.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (rating > 0 || note.trim()) {
      Alert.alert(
        'Descartar cambios',
        '¿Estás seguro de que quieres descartar los cambios?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: onClose },
        ]
      );
    } else {
      onClose();
    }
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Muy malo';
      case 2: return 'Malo';
      case 3: return 'Regular';
      case 4: return 'Bueno';
      case 5: return 'Excelente';
      default: return 'Selecciona una valoración';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {existingRating ? 'Editar valoración' : 'Valorar queso'}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSubmitting || rating === 0}
            style={[styles.saveButton, (isSubmitting || rating === 0) && styles.saveButtonDisabled]}
          >
            <Text style={[styles.saveButtonText, (isSubmitting || rating === 0) && styles.saveButtonTextDisabled]}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.cheeseInfo}>
            <Text style={styles.cheeseName}>{cheese?.name}</Text>
            <Text style={styles.cheeseDetails}>
              {cheese?.country} • {cheese?.milkType} • {cheese?.maturation}
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Tu valoración</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  style={styles.starButton}
                >
                  <Text style={[
                    styles.star,
                    star <= rating ? styles.starFilled : styles.starEmpty
                  ]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>{getRatingText()}</Text>
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Nota (opcional)</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Comparte tu experiencia con este queso..."
              placeholderTextColor={DesignSystem.typography.textColorSecondary}
              multiline
              maxLength={240}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{note.length}/240</Text>
          </View>

          {existingRating && (
            <View style={styles.existingRatingInfo}>
              <Text style={styles.existingRatingText}>
                Valoración anterior: {existingRating.rating} estrellas
              </Text>
              {existingRating.note && (
                <Text style={styles.existingNoteText}>
                  Nota: "{existingRating.note}"
                </Text>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.theme.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DesignSystem.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.theme.secondaryColor,
  },
  cancelButton: {
    padding: DesignSystem.spacing.small,
  },
  cancelButtonText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
  },
  title: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
  },
  saveButton: {
    backgroundColor: DesignSystem.theme.primaryColor,
    paddingHorizontal: DesignSystem.spacing.large,
    paddingVertical: DesignSystem.spacing.small,
    borderRadius: DesignSystem.cornerRadius.medium,
  },
  saveButtonDisabled: {
    backgroundColor: DesignSystem.theme.secondaryColor,
  },
  saveButtonText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.theme.backgroundColor,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: DesignSystem.typography.textColorSecondary,
  },
  content: {
    flex: 1,
    padding: DesignSystem.spacing.large,
  },
  cheeseInfo: {
    marginBottom: DesignSystem.spacing.xlarge,
    padding: DesignSystem.spacing.large,
    backgroundColor: DesignSystem.theme.secondaryColor,
    borderRadius: DesignSystem.cornerRadius.medium,
  },
  cheeseName: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    marginBottom: DesignSystem.spacing.small,
  },
  cheeseDetails: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
  },
  ratingSection: {
    marginBottom: DesignSystem.spacing.xlarge,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    marginBottom: DesignSystem.spacing.medium,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: DesignSystem.spacing.medium,
  },
  starButton: {
    padding: DesignSystem.spacing.small,
  },
  star: {
    fontSize: 40,
    marginHorizontal: DesignSystem.spacing.small,
  },
  starFilled: {
    color: DesignSystem.components.ratingStars.filledColor,
  },
  starEmpty: {
    color: DesignSystem.components.ratingStars.emptyColor,
  },
  ratingText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    fontWeight: '500',
  },
  noteSection: {
    marginBottom: DesignSystem.spacing.large,
  },
  noteLabel: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    marginBottom: DesignSystem.spacing.medium,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: DesignSystem.theme.secondaryColor,
    borderRadius: DesignSystem.cornerRadius.medium,
    padding: DesignSystem.spacing.medium,
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: DesignSystem.typography.caption.size,
    color: DesignSystem.typography.textColorSecondary,
    textAlign: 'right',
    marginTop: DesignSystem.spacing.small,
  },
  existingRatingInfo: {
    padding: DesignSystem.spacing.medium,
    backgroundColor: DesignSystem.theme.secondaryColor,
    borderRadius: DesignSystem.cornerRadius.medium,
  },
  existingRatingText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    marginBottom: DesignSystem.spacing.small,
  },
  existingNoteText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    fontStyle: 'italic',
  },
});
