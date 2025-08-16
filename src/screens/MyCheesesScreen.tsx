import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { UnifiedCheese } from '../types';
import { CheeseImage } from '../components/CheeseImage';

// Datos mock para quesos guardados
const mockSavedCheeses: UnifiedCheese[] = [
  {
    id: 'saved-1',
    name: 'Manchego Curado',
    producer: 'Quesos La Mancha',
    country: 'España',
    region: 'Castilla-La Mancha',
    milk_type: 'Sheep',
    maturation: 'Cured',
    flavor_profile: ['Intenso', 'Sabroso'],
    pairings: ['Vino tinto', 'Membrillo'],
    designation: 'DOP',
    source: 'supabase',
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
  },
  {
    id: 'saved-2',
    name: 'Brie de Meaux',
    producer: 'Fromagerie de Meaux',
    country: 'Francia',
    region: 'Île-de-France',
    milk_type: 'Cow',
    maturation: 'Soft',
    flavor_profile: ['Cremoso', 'Suave'],
    pairings: ['Champagne', 'Frutas'],
    designation: 'AOP',
    source: 'supabase',
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
  },
  {
    id: 'saved-3',
    name: 'Parmigiano Reggiano',
    producer: 'Consorzio del Formaggio',
    country: 'Italia',
    region: 'Emilia-Romagna',
    milk_type: 'Cow',
    maturation: 'Cured',
    flavor_profile: ['Salado', 'Complejo'],
    pairings: ['Vino tinto', 'Pasta'],
    designation: 'DOP',
    source: 'supabase',
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
  },
];

export const MyCheesesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [savedCheeses, setSavedCheeses] = useState<UnifiedCheese[]>([]);

  useEffect(() => {
    // Por ahora, usar datos mock
    setSavedCheeses(mockSavedCheeses);
  }, []);

  const handleCheesePress = (cheese: UnifiedCheese) => {
    try {
      console.log('🧀 MyCheesesScreen: Navegando a queso:', cheese.name);
      // @ts-ignore - Ignorar error de tipos por ahora
      navigation.navigate('CheeseDetail', { cheeseId: cheese.id });
    } catch (error) {
      console.error('Error en navegación:', error);
    }
  };

  const renderCheeseItem = ({ item }: { item: UnifiedCheese }) => (
    <TouchableOpacity
      style={styles.cheeseCard}
      onPress={() => handleCheesePress(item)}
      activeOpacity={0.8}
    >
      <CheeseImage
        source={item.image_url ? { uri: item.image_url } : null}
        style={styles.cheeseImage}
        cheeseName={item.name}
      />
      <View style={styles.cheeseInfo}>
        <Text style={styles.cheeseName}>{item.name}</Text>
        <Text style={styles.cheeseCountry}>{item.country}</Text>
        <Text style={styles.cheesePairings}>
          {item.pairings?.join(' • ') || 'Sin maridajes'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Quesos</Text>
        <Text style={styles.subtitle}>
          {savedCheeses.length} quesos guardados
        </Text>
      </View>

      {savedCheeses.length > 0 ? (
        <FlatList
          data={savedCheeses}
          renderItem={renderCheeseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          getItemLayout={(data, index) => ({
            length: 200,
            offset: 200 * index,
            index,
          })}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🧀</Text>
          <Text style={styles.emptyTitle}>No tienes quesos guardados</Text>
          <Text style={styles.emptySubtitle}>
            Guarda tus quesos favoritos para encontrarlos fácilmente
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  listContainer: {
    padding: 16,
  },
  cheeseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cheeseImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E9ECEF',
  },
  cheeseInfo: {
    padding: 16,
  },
  cheeseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  cheeseCountry: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  cheesePairings: {
    fontSize: 12,
    color: '#28A745',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
