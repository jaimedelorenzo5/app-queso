import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UnifiedCheese } from '../types';
import { CheeseCard } from '../components/CheeseCard';
import { DesignSystem } from '../constants/designSystem';

// Datos mock para desarrollo
const mockCheeses: UnifiedCheese[] = [
  {
    id: '1',
    name: 'Manchego Curado',
    producer: 'Quesos La Mancha',
    country: 'España',
    region: 'Castilla-La Mancha',
    milk_type: 'Sheep',
    maturation: 'Cured',
    flavor_profile: ['Intenso', 'Sabroso'],
    pairings: ['Vino tinto', 'Membrillo'],
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
    designation: 'DOP',
    source: 'supabase',
  },
  {
    id: '2',
    name: 'Brie de Meaux',
    producer: 'Fromagerie de Meaux',
    country: 'Francia',
    region: 'Île-de-France',
    milk_type: 'Cow',
    maturation: 'Soft',
    flavor_profile: ['Cremoso', 'Suave'],
    pairings: ['Champagne', 'Frutas'],
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    designation: 'AOP',
    source: 'supabase',
  },
  {
    id: '3',
    name: 'Parmigiano Reggiano',
    producer: 'Consorzio del Formaggio',
    country: 'Italia',
    region: 'Emilia-Romagna',
    milk_type: 'Cow',
    maturation: 'Cured',
    flavor_profile: ['Salado', 'Complejo'],
    pairings: ['Vino tinto', 'Pasta'],
    image_url: 'https://images.unsplash.com/photo-1589884629108-85e9b0d7c636?w=400&h=300&fit=crop',
    designation: 'DOP',
    source: 'supabase',
  },
  {
    id: 'off-1',
    name: 'Cheddar Extra Mature',
    producer: 'Various',
    country: 'Reino Unido',
    region: 'Inglaterra',
    milk_type: 'Cow',
    maturation: 'Cured',
    flavor_profile: ['Intenso', 'Salado'],
    pairings: ['Cerveza', 'Manzana'],
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    designation: 'IGP',
    source: 'openfoodfacts',
  },
  {
    id: 'off-2',
    name: 'Gouda Aged',
    producer: 'Dutch Masters',
    country: 'Países Bajos',
    region: 'Holanda del Sur',
    milk_type: 'Cow',
    maturation: 'Cured',
    flavor_profile: ['Suave', 'Cremoso'],
    pairings: ['Vino blanco', 'Pan'],
    image_url: 'https://images.unsplash.com/photo-1542834292980-6c2075d0e7b5?w=400&h=300&fit=crop',
    designation: 'IGP',
    source: 'openfoodfacts',
  },
];

export const ExploreScreen: React.FC = () => {
  const [cheeses, setCheeses] = useState<UnifiedCheese[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('🚀 ExploreScreen montado');
    loadCheeses();
  }, []);

  const loadCheeses = async () => {
    try {
      setLoading(true);
      console.log('🔍 ExploreScreen: Cargando quesos...');
      
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔍 ExploreScreen: Usando datos mock');
      setCheeses(mockCheeses);
    } catch (error) {
      console.error('Error in loadCheeses:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCheeses();
    setRefreshing(false);
  };

  const renderCheeseItem = ({ item }: { item: UnifiedCheese }) => (
    <CheeseCard cheese={item} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignSystem.theme.primaryColor} />
          <Text style={styles.loadingText}>Cargando quesos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Quesos</Text>
        <Text style={styles.subtitle}>
          Descubre quesos de todo el mundo
        </Text>
        <Text style={styles.cheeseCount}>
          {cheeses.length} quesos disponibles
        </Text>
      </View>

      <FlatList
        data={cheeses}
        renderItem={renderCheeseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.5}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 280,
          offset: 280 * index,
          index,
        })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧀</Text>
            <Text style={styles.emptyTitle}>No se encontraron quesos</Text>
            <Text style={styles.emptySubtitle}>
              Intenta recargar la página
            </Text>
          </View>
        }
      />
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
  cheeseCount: {
    fontSize: 12,
    color: '#28A745',
    fontStyle: 'italic',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
});
