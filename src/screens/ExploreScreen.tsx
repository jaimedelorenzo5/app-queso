import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { SupabaseCheese, UnifiedCheese } from '../types';
import { FilterBar, FilterOptions } from '../components/FilterBar';
import { CheeseCard } from '../components/CheeseCard';
import { searchOFFCheeses, OFFCheese, OFF_CONSTANTS } from '../lib/openFoodFacts';
import { LicenseAttribution } from '../components/LicenseAttribution';

export const ExploreScreen: React.FC = () => {
  const [cheeses, setCheeses] = useState<SupabaseCheese[]>([]);
  const [offCheeses, setOffCheeses] = useState<UnifiedCheese[]>([]);
  const [filteredCheeses, setFilteredCheeses] = useState<UnifiedCheese[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingOFF, setLoadingOFF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreOFF, setHasMoreOFF] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    countries: [],
    milkTypes: [],
    maturations: [],
    selectedCountries: [],
    selectedMilkTypes: [],
    selectedMaturations: [],
  });

  useEffect(() => {
    console.log('🚀 ExploreScreen montado');
    loadCheeses();
    loadOFFCheeses();
    loadFilterOptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, cheeses]);

  const loadCheeses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cheeses')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading cheeses:', error);
        Alert.alert('Error', 'No se pudieron cargar los quesos');
        return;
      }

      // Añadir source a los quesos de Supabase
      const cheesesWithSource = (data || []).map(cheese => ({
        ...cheese,
        source: 'supabase' as const
      }));

      setCheeses(cheesesWithSource);
    } catch (error) {
      console.error('Error in loadCheeses:', error);
      Alert.alert('Error', 'Error al cargar los quesos');
    } finally {
      setLoading(false);
    }
  };

  const loadOFFCheeses = async () => {
    try {
      console.log('🔄 Iniciando carga de quesos OFF...');
      setLoadingOFF(true);
      const result = await searchOFFCheeses(currentPage, 20);
      
      console.log('📊 Resultado de búsqueda OFF:', {
        total: result.total,
        page: result.page,
        dataLength: result.data.length
      });
      
      if (result.data.length > 0) {
        console.log('🧀 Primer queso OFF:', result.data[0]);
        
        // Transformar quesos OFF a formato unificado
        const unifiedOFFCheeses: UnifiedCheese[] = result.data.map(offCheese => {
          console.log('🔄 Transformando queso OFF:', {
            name: offCheese.name,
            imageUrl: offCheese.imageUrl,
            imageSmallUrl: offCheese.imageSmallUrl
          });
          
          return {
            id: offCheese.id,
            name: offCheese.name,
            producer: offCheese.brand,
            country: offCheese.country || 'Desconocido',
            region: undefined,
            milk_type: undefined,
            maturation: undefined,
            flavor_profile: [],
            pairings: [],
            designation: undefined,
            image_url: offCheese.imageUrl, // Usar imageUrl como image_url
            imageUrl: offCheese.imageUrl,
            description: offCheese.ingredients,
            source: 'openfoodfacts' as const,
            license: offCheese.license,
            brand: offCheese.brand,
            quantity: offCheese.quantity,
            categories: offCheese.categories || [],
            labels: offCheese.labels || [],
            ingredients: offCheese.ingredients,
            nutriscore: offCheese.nutriscore,
            novaGroup: offCheese.novaGroup
          };
        });

        console.log('✅ Quesos OFF transformados:', unifiedOFFCheeses.length);
        console.log('🖼️ Primer queso transformado:', {
          name: unifiedOFFCheeses[0].name,
          image_url: unifiedOFFCheeses[0].image_url,
          imageUrl: unifiedOFFCheeses[0].imageUrl,
          source: unifiedOFFCheeses[0].source
        });

        setOffCheeses(prev => {
          const newOffCheeses = [...prev, ...unifiedOFFCheeses];
          console.log('📱 Total de quesos OFF en estado:', newOffCheeses.length);
          console.log('🔄 Estado actualizado, forzando re-render...');
          return newOffCheeses;
        });
        
        // Forzar actualización del estado
        setTimeout(() => {
          console.log('⏰ Estado después de timeout:', offCheeses.length);
        }, 100);
        
        setHasMoreOFF(result.data.length === 20);
      } else {
        console.log('⚠️ No se encontraron quesos OFF');
      }
    } catch (error) {
      console.error('❌ Error loading OFF cheeses:', error);
    } finally {
      setLoadingOFF(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('cheeses')
        .select('country, milk_type, maturation');

      if (error) {
        console.error('Error loading filter options:', error);
        return;
      }

      if (data) {
        const countries = [...new Set(data.map(c => c.country))].sort();
        const milkTypes = [...new Set(data.map(c => c.milk_type))].sort();
        const maturations = [...new Set(data.map(c => c.maturation))].sort();

        setFilters(prev => ({
          ...prev,
          countries,
          milkTypes,
          maturations,
        }));
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const applyFilters = () => {
    console.log('🔍 Aplicando filtros...');
    console.log('📊 Quesos Supabase:', cheeses.length);
    console.log('📊 Quesos OFF:', offCheeses.length);
    
    // Combinar quesos de Supabase y Open Food Facts
    const allCheeses: UnifiedCheese[] = [
      ...cheeses.map(cheese => ({
        ...cheese,
        source: 'supabase' as const
      })),
      ...offCheeses
    ];

    console.log('🔄 Total de quesos combinados:', allCheeses.length);
    console.log('📸 Quesos con imágenes:', allCheeses.filter(c => c.image_url || c.imageUrl).length);
    console.log('🏷️ Quesos por fuente:', {
      supabase: allCheeses.filter(c => c.source === 'supabase').length,
      openfoodfacts: allCheeses.filter(c => c.source === 'openfoodfacts').length
    });

    let filtered = allCheeses;

    if (filters.selectedCountries.length > 0) {
      filtered = filtered.filter(cheese => 
        cheese.country && filters.selectedCountries.includes(cheese.country)
      );
    }

    if (filters.selectedMilkTypes.length > 0) {
      filtered = filtered.filter(cheese => 
        cheese.milk_type && filters.selectedMilkTypes.includes(cheese.milk_type)
      );
    }

    if (filters.selectedMaturations.length > 0) {
      filtered = filtered.filter(cheese => 
        cheese.maturation && filters.selectedMaturations.includes(cheese.maturation)
      );
    }

    setFilteredCheeses(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCheeses();
    setRefreshing(false);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const renderCheeseItem = ({ item }: { item: UnifiedCheese }) => {
    console.log('🧀 Renderizando queso en ExploreScreen:', item.id, item.name);
    return <CheeseCard cheese={item} />;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🧀 Cargando quesos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
              <View style={styles.header}>
          <Text style={styles.title}>🧀 Explorar Quesos</Text>
          <Text style={styles.subtitle}>
            {filteredCheeses.length} {filteredCheeses.length === 1 ? 'queso' : 'quesos'} encontrados
            {filters.selectedCountries.length > 0 || filters.selectedMilkTypes.length > 0 || filters.selectedMaturations.length > 0 && (
              <Text style={styles.filteredText}> (filtrados)</Text>
            )}
          </Text>
          
          {/* Banner de atribución de Open Food Facts */}
          <View style={styles.attributionBanner}>
            <Text style={styles.attributionText}>
              📸 Datos e imágenes de{' '}
              <Text 
                style={styles.attributionLink}
                onPress={() => Linking.openURL('https://world.openfoodfacts.org')}
              >
                Open Food Facts
              </Text>
              {' '}— CC-BY-SA 4.0
            </Text>
          </View>
          
          {/* Info de quesos cargados */}
          <Text style={styles.debugInfo}>
            Quesos Supabase: {cheeses.length} | Quesos OFF: {offCheeses.length}
          </Text>
          
          {/* Botón de debug */}
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => {
              console.log('🔧 Botón debug presionado');
              loadOFFCheeses();
            }}
          >
            <Text style={styles.debugButtonText}>🔄 Recargar OFF</Text>
          </TouchableOpacity>
        </View>

      <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />

      <FlatList
        data={filteredCheeses}
        renderItem={renderCheeseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (hasMoreOFF && !loadingOFF) {
            setCurrentPage(prev => prev + 1);
            loadOFFCheeses();
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => 
          loadingOFF ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#FF6B35" />
              <Text style={styles.loadingFooterText}>Cargando más quesos...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧀</Text>
            <Text style={styles.emptyTitle}>No se encontraron quesos</Text>
            <Text style={styles.emptySubtitle}>
              Intenta ajustar los filtros o recargar
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
  listContainer: {
    padding: 16,
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
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
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
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  filteredText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
  },
  loadingFooterText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6C757D',
  },
  attributionBanner: {
    backgroundColor: '#E8F5E8',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#28A745',
  },
  attributionText: {
    fontSize: 12,
    color: '#155724',
    textAlign: 'center',
  },
  attributionLink: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  debugButton: {
    backgroundColor: '#FF6B35',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'center',
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugInfo: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
