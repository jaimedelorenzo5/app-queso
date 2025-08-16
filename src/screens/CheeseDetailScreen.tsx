import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { UnifiedCheese, RootStackParamList } from '../types';

type CheeseDetailRouteProp = RouteProp<RootStackParamList, 'CheeseDetail'>;

export const CheeseDetailScreen: React.FC = () => {
  const route = useRoute<CheeseDetailRouteProp>();
  const navigation = useNavigation();
  const { cheeseId, cheese: passedCheese } = route.params;
  
  const [cheese, setCheese] = useState<UnifiedCheese | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheeseDetails();
  }, [cheeseId]);

  const loadCheeseDetails = async () => {
    try {
      setLoading(true);
      
      // Si ya tenemos el queso pasado directamente
      if (passedCheese) {
        console.log('🧀 Usando queso pasado directamente:', passedCheese.name);
        setCheese(passedCheese);
        return;
      }
      
      // Si no, crear un queso mock basado en el ID
      if (cheeseId) {
        console.log('🧀 Creando queso mock para ID:', cheeseId);
        const mockCheese: UnifiedCheese = {
          id: cheeseId,
          name: 'Queso Mock',
          producer: 'Productor Mock',
          country: 'País Mock',
          region: 'Región Mock',
          milk_type: 'Cow',
          maturation: 'Cured',
          flavor_profile: ['Sabroso', 'Intenso'],
          pairings: ['Vino', 'Pan'],
          designation: 'IGP',
          source: 'supabase',
          image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
        };
        setCheese(mockCheese);
      }

    } catch (error) {
      console.error('Error in loadCheeseDetails:', error);
      Alert.alert('Error', 'Error inesperado al cargar los detalles');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.errorText}>Queso no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Queso</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Imagen del queso */}
        <View style={styles.imageContainer}>
          {cheese.image_url ? (
            <Image
              source={{ uri: cheese.image_url }}
              style={styles.cheeseImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cheeseImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>🧀</Text>
            </View>
          )}
        </View>

        {/* Información del queso */}
        <View style={styles.infoContainer}>
          <Text style={styles.cheeseName}>{cheese.name}</Text>
          <Text style={styles.cheeseProducer}>{cheese.producer}</Text>
          <Text style={styles.cheeseLocation}>
            {cheese.region}, {cheese.country}
          </Text>
          
          {cheese.designation && (
            <View style={styles.designationContainer}>
              <Text style={styles.designationText}>{cheese.designation}</Text>
            </View>
          )}

          {/* Características */}
          <View style={styles.characteristicsContainer}>
            <View style={styles.characteristic}>
              <Text style={styles.characteristicLabel}>Tipo de leche:</Text>
              <Text style={styles.characteristicValue}>{cheese.milk_type}</Text>
            </View>
            <View style={styles.characteristic}>
              <Text style={styles.characteristicLabel}>Maduración:</Text>
              <Text style={styles.characteristicValue}>{cheese.maturation}</Text>
            </View>
          </View>

          {/* Perfil de sabor */}
          {cheese.flavor_profile && cheese.flavor_profile.length > 0 && (
            <View style={styles.flavorContainer}>
              <Text style={styles.sectionTitle}>Perfil de Sabor</Text>
              <View style={styles.flavorTags}>
                {cheese.flavor_profile.map((flavor, index) => (
                  <View key={index} style={styles.flavorTag}>
                    <Text style={styles.flavorTagText}>{flavor}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Maridajes */}
          {cheese.pairings && cheese.pairings.length > 0 && (
            <View style={styles.pairingsContainer}>
              <Text style={styles.sectionTitle}>Maridajes Recomendados</Text>
              <View style={styles.pairingsTags}>
                {cheese.pairings.map((pairing, index) => (
                  <View key={index} style={styles.pairingTag}>
                    <Text style={styles.pairingTagText}>{pairing}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color="#A67C52" />
              <Text style={styles.actionButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="star-outline" size={20} color="#A67C52" />
              <Text style={styles.actionButtonText}>Valorar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="camera-outline" size={20} color="#A67C52" />
              <Text style={styles.actionButtonText}>Foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
  cheeseImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 100,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cheeseName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  cheeseProducer: {
    fontSize: 18,
    color: '#6C757D',
    marginBottom: 4,
  },
  cheeseLocation: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 12,
  },
  designationContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  designationText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  characteristicsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  characteristic: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  characteristicLabel: {
    fontSize: 16,
    color: '#6C757D',
  },
  characteristicValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  flavorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  flavorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flavorTag: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  flavorTagText: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
  pairingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pairingsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pairingTag: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pairingTagText: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
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
  errorText: {
    fontSize: 18,
    color: '#6C757D',
    textAlign: 'center',
  },
});
