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
      style={styles.card}
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  defaultImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImageText: {
    fontSize: 64,
    color: '#6C757D',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
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
  saveButtonActive: {
    backgroundColor: '#FF6B35',
  },
  countryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
    lineHeight: 24,
  },
  producer: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  milkType: {
    fontSize: 12,
    color: '#495057',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  maturation: {
    fontSize: 12,
    color: '#495057',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  designationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  designationText: {
    fontSize: 12,
    color: '#212529',
    fontWeight: '600',
  },
});
