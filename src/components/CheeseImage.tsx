import React, { useState } from 'react';
import { Image, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface CheeseImageProps {
  source: { uri: string } | null;
  style?: any;
  cheeseName: string;
}

export const CheeseImage: React.FC<CheeseImageProps> = ({ 
  source, 
  style, 
  cheeseName 
}) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  console.log('🖼️ CheeseImage recibió:', { source, cheeseName });

  if (!source || !source.uri) {
    console.log('🖼️ No hay source o URI, mostrando fallback con 🧀');
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.fallbackText}>🧀</Text>
        <Text style={styles.fallbackName}>{cheeseName}</Text>
      </View>
    );
  }

  if (hasError) {
    console.log('🖼️ Error cargando imagen, mostrando fallback con 📷');
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.fallbackText}>📷</Text>
        <Text style={styles.fallbackName}>{cheeseName}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FF6B35" />
        </View>
      )}
      
      <Image
        source={source}
        style={[styles.image, style]}
        onLoadStart={() => {
          console.log('🖼️ Iniciando carga de imagen:', source.uri);
          setLoading(true);
        }}
        onLoadEnd={() => {
          console.log('🖼️ Imagen cargada exitosamente:', source.uri);
          setLoading(false);
        }}
        onError={(error) => {
          console.log('🖼️ Error cargando imagen:', source.uri, error);
          setHasError(true);
          setLoading(false);
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    zIndex: 1,
  },
  fallback: {
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fallbackText: {
    fontSize: 32,
    marginBottom: 8,
  },
  fallbackName: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    fontWeight: '500',
  },
});
