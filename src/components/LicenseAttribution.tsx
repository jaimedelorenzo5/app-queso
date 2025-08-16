import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LicenseAttributionProps {
  source: 'openfoodfacts' | 'supabase' | 'user';
  compact?: boolean;
  showIcon?: boolean;
}

export const LicenseAttribution: React.FC<LicenseAttributionProps> = ({
  source,
  compact = false,
  showIcon = true
}) => {
  const handleOpenWebsite = () => {
    if (source === 'openfoodfacts') {
      Linking.openURL('https://world.openfoodfacts.org');
    }
  };

  if (source === 'openfoodfacts') {
    return (
      <View style={[styles.container, compact && styles.compact]}>
        {showIcon && (
          <Ionicons 
            name="information-circle-outline" 
            size={compact ? 12 : 14} 
            color="#6C757D" 
            style={styles.icon}
          />
        )}
        <Text style={[styles.text, compact && styles.compactText]}>
          Foto y datos: 
          <Text style={styles.link} onPress={handleOpenWebsite}>
            Open Food Facts
          </Text>
          {' '}— CC-BY-SA 4.0
        </Text>
      </View>
    );
  }

  if (source === 'user') {
    return (
      <View style={[styles.container, compact && styles.compact]}>
        {showIcon && (
          <Ionicons 
            name="camera-outline" 
            size={compact ? 12 : 14} 
            color="#28A745" 
            style={styles.icon}
          />
        )}
        <Text style={[styles.text, compact && styles.compactText]}>
          Foto: Usuario
        </Text>
      </View>
    );
  }

  // Supabase o fuente desconocida
  return (
    <View style={[styles.container, compact && styles.compact]}>
      {showIcon && (
        <Ionicons 
          name="database-outline" 
          size={compact ? 12 : 14} 
          color="#6C757D" 
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, compact && styles.compactText]}>
        Datos: CheeseRate
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  compactText: {
    fontSize: 10,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
