import React, { useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { DesignSystem } from '../constants/designSystem';

interface SafeImageProps {
  source: { uri: string };
  style?: any;
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ 
  source, 
  style, 
  fallbackText = '🧀' 
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      onError={() => setHasError(true)}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: DesignSystem.theme.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 32,
    color: DesignSystem.theme.primaryColor,
  },
});
