import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnifiedCheese, RootStackParamList } from '../types';
import { LicenseAttribution } from './LicenseAttribution';
import { DesignSystem } from '../constants/designSystem';

type CheeseCardNavigationProp = StackNavigationProp<RootStackParamList, 'CheeseDetail'>;

interface CheeseCardProps {
  cheese: UnifiedCheese;
}

export const CheeseCard: React.FC<CheeseCardProps> = ({ cheese }) => {
  const navigation = useNavigation<CheeseCardNavigationProp>();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Verificar si el queso ya está guardado
  useEffect(() => {
    checkIfSaved();
  }, [cheese.id]);

  const checkIfSaved = async () => {
    try {
      // Obtener quesos guardados de AsyncStorage
      const savedCheesesString = await AsyncStorage.getItem('savedCheeses');
      if (savedCheesesString) {
        const savedCheeses = JSON.parse(savedCheesesString);
        // Verificar si este queso está en la lista
        if (savedCheeses.includes(cheese.id)) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Error checking if saved:', error);
    }
  };

  const toggleSave = async () => {
    try {
      setSaving(true);
      
      // Obtener quesos guardados actuales
      const savedCheesesString = await AsyncStorage.getItem('savedCheeses');
      let savedCheeses: string[] = savedCheesesString ? JSON.parse(savedCheesesString) : [];
      
      if (isSaved) {
        // Remover de guardados
        savedCheeses = savedCheeses.filter(id => id !== cheese.id);
        await AsyncStorage.setItem('savedCheeses', JSON.stringify(savedCheeses));
        
        setIsSaved(false);
        Alert.alert('Eliminado', 'Queso removido de tus guardados');
      } else {
        // Agregar a guardados
        savedCheeses.push(cheese.id);
        await AsyncStorage.setItem('savedCheeses', JSON.stringify(savedCheeses));
        
        setIsSaved(true);
        Alert.alert('Guardado', 'Queso añadido a tus guardados');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'No se pudo guardar el queso');
    } finally {
      setSaving(false);
    }
  };

  const handleCheesePress = () => {
    console.log('🖱️  CheeseCard presionado, navegando a:', cheese.id);
    // Pasar el queso completo para quesos de OFF
    if (cheese.source === 'openfoodfacts') {
      navigation.navigate('CheeseDetail', { cheese: cheese });
    } else {
      navigation.navigate('CheeseDetail', { cheeseId: cheese.id });
    }
  };

  const getImageSource = () => {
    console.log('🖼️ CheeseCard - getImageSource para:', cheese.name);
    console.log('  - image_url:', cheese.image_url);
    console.log('  - imageUrl:', cheese.imageUrl);
    console.log('  - source:', cheese.source);
    
    if (cheese.image_url) {
      console.log('✅ Usando image_url:', cheese.image_url);
      return { uri: cheese.image_url };
    }
    if (cheese.imageUrl) {
      console.log('✅ Usando imageUrl:', cheese.imageUrl);
      return { uri: cheese.imageUrl };
    }
    console.log('⚠️ No hay imagen, usando emoji por defecto');
    // Usar emoji como imagen por defecto
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCheesePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {(cheese.image_url || cheese.imageUrl) ? (
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
        
        {/* Botón de guardar */}
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonActive]}
          onPress={toggleSave}
          disabled={saving}
        >
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={20}
            color={isSaved ? '#FFFFFF' : '#FF6B35'}
          />
        </TouchableOpacity>

        {/* Badge de país */}
        <View style={styles.countryBadge}>
          <Text style={styles.countryText}>{cheese.country}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {cheese.name}
        </Text>
        
        <Text style={styles.producer} numberOfLines={1}>
          {cheese.producer || 'Productor no especificado'}
        </Text>
        
        <View style={styles.details}>
          <Text style={styles.milkType}>
            🥛 {cheese.milk_type}
          </Text>
          <Text style={styles.maturation}>
            ⏰ {cheese.maturation}
          </Text>
        </View>

        {cheese.designation && (
          <View style={styles.designationBadge}>
            <Text style={styles.designationText}>
              🏆 {cheese.designation}
            </Text>
          </View>
        )}
        
        {/* Atribución de licencia */}
        {cheese.source && (
          <LicenseAttribution 
            source={cheese.source} 
            compact={true} 
            showIcon={false}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignSystem.theme.surfaceColor,
    borderRadius: DesignSystem.cornerRadius.medium,
    marginBottom: DesignSystem.spacing.medium,
    shadowColor: DesignSystem.shadows.medium.color,
    shadowOffset: { width: DesignSystem.shadows.medium.offset[0], height: DesignSystem.shadows.medium.offset[1] },
    shadowOpacity: 1,
    shadowRadius: DesignSystem.shadows.medium.radius,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  defaultImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: DesignSystem.theme.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImageText: {
    fontSize: 64,
    color: DesignSystem.theme.textColorSecondary,
  },
  saveButton: {
    position: 'absolute',
    top: DesignSystem.spacing.small,
    right: DesignSystem.spacing.small,
    backgroundColor: DesignSystem.theme.surfaceColor,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DesignSystem.shadows.soft.color,
    shadowOffset: { width: DesignSystem.shadows.soft.offset[0], height: DesignSystem.shadows.soft.offset[1] },
    shadowOpacity: 1,
    shadowRadius: DesignSystem.shadows.soft.radius,
    elevation: 3,
  },
  saveButtonActive: {
    backgroundColor: DesignSystem.theme.accentColor,
  },
  countryBadge: {
    position: 'absolute',
    bottom: DesignSystem.spacing.small,
    left: DesignSystem.spacing.small,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: DesignSystem.spacing.small,
    paddingVertical: DesignSystem.spacing.xsmall,
    borderRadius: DesignSystem.cornerRadius.small,
  },
  countryText: {
    color: DesignSystem.theme.surfaceColor,
    fontSize: DesignSystem.typography.caption.size,
    fontWeight: '600',
  },
  content: {
    padding: DesignSystem.spacing.medium,
  },
  name: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.theme.textColorPrimary,
    marginBottom: DesignSystem.spacing.xsmall,
    lineHeight: 28,
  },
  producer: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.theme.textColorSecondary,
    marginBottom: DesignSystem.spacing.small,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DesignSystem.spacing.small,
  },
  milkType: {
    fontSize: DesignSystem.typography.caption.size,
    color: DesignSystem.theme.textColorSecondary,
    backgroundColor: DesignSystem.theme.secondaryColor,
    paddingHorizontal: DesignSystem.spacing.small,
    paddingVertical: DesignSystem.spacing.xsmall,
    borderRadius: DesignSystem.cornerRadius.small,
  },
  maturation: {
    fontSize: DesignSystem.typography.caption.size,
    color: DesignSystem.theme.textColorSecondary,
    backgroundColor: DesignSystem.theme.secondaryColor,
    paddingHorizontal: DesignSystem.spacing.small,
    paddingVertical: DesignSystem.spacing.xsmall,
    borderRadius: DesignSystem.cornerRadius.small,
  },
  designationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: DesignSystem.theme.highlightColor,
    paddingHorizontal: DesignSystem.spacing.small,
    paddingVertical: DesignSystem.spacing.xsmall,
    borderRadius: DesignSystem.cornerRadius.small,
  },
  designationText: {
    fontSize: DesignSystem.typography.caption.size,
    color: DesignSystem.theme.textColorPrimary,
    fontWeight: '600',
  },
});
