import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 24,
  readonly = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarPress = (starIndex: number) => {
    if (!readonly) {
      onRatingChange(starIndex + 1);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const currentRating = hoverRating || rating;
    const isFilled = starValue <= currentRating;
    const isHalf = !isFilled && starValue - 0.5 <= currentRating;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(index)}
        disabled={readonly}
        style={styles.starContainer}
      >
        <Text
          style={[
            styles.star,
            { fontSize: size },
            isFilled ? styles.filledStar : isHalf ? styles.halfStar : styles.emptyStar,
          ]}
        >
          {isFilled ? '★' : isHalf ? '☆' : '☆'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => renderStar(index))}
      </View>
      {!readonly && (
        <Text style={styles.ratingText}>
          {rating > 0 ? `${rating}/5` : 'Toca para calificar'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    marginHorizontal: 2,
  },
  star: {
    fontWeight: 'bold',
  },
  filledStar: {
    color: '#FFD700',
  },
  halfStar: {
    color: '#FFD700',
  },
  emptyStar: {
    color: '#E0E0E0',
  },
  ratingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
