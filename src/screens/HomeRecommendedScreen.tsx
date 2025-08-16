import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Cheese, RootStackParamList, SupabaseCheese } from '../types';
import { getCheeses, getCheesePhotos } from '../../lib/supabase';
import { CheeseImage } from '../components/CheeseImage';

type HomeRecommendedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CheeseDetail'>;

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 48) / numColumns;

interface CheeseWithPhoto extends Omit<Cheese, 'photoUrl'> {
  photoUrl?: string;
}

export const HomeRecommendedScreen: React.FC = () => {
  const navigation = useNavigation<HomeRecommendedScreenNavigationProp>();
  const [recommendedCheeses, setRecommendedCheeses] = useState<CheeseWithPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendedCheeses = async () => {
      try {
        setLoading(true);
        const result = await getCheeses(8, 0);
        
        if (result.error) {
          console.error('Error loading cheeses:', result.error);
          return;
        }
        
        if (result.data) {
          const cheesesWithPhotos = await Promise.all(
            result.data.map(async (cheese: SupabaseCheese) => {
              
              const { data: photosData } = await getCheesePhotos(cheese.id);
              const photoUrl = photosData && photosData.length > 0 ? photosData[0].url : undefined;
              
              return {
                id: cheese.id,
                name: cheese.name,
                producer: cheese.producer || 'Desconocido',
                country: cheese.country,
                region: cheese.region || 'Desconocida',
                milkType: cheese.milk_type as 'Cow' | 'Goat' | 'Sheep' | 'Mix',
                maturation: cheese.maturation as 'Fresh' | 'Semi' | 'Cured' | 'Soft',
                flavorProfile: cheese.flavor_profile,
                pairings: cheese.pairings,
                avgRating: 4.2,
                photoUrl,
                designation: cheese.designation,
              };
            })
          );
          

          setRecommendedCheeses(cheesesWithPhotos);
        }
      } catch (error) {
        console.error('Error general:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedCheeses();
  }, []);

  const handleCheesePress = (cheese: CheeseWithPhoto) => {
    try {
      navigation.navigate('CheeseDetail', { cheeseId: cheese.id });
    } catch (error) {
      console.error('Error en navegación:', error);
    }
  };

  const renderCheeseCard = ({ item }: { item: CheeseWithPhoto }) => {
    return (
      <TouchableOpacity
        style={styles.cheeseCard}
        onPress={() => handleCheesePress(item)}
        activeOpacity={0.8}
      >
        <CheeseImage
          source={item.photoUrl ? { uri: item.photoUrl } : null}
          style={styles.cheeseImage}
          cheeseName={item.name}
        />
        <View style={styles.cheeseInfo}>
          <Text style={styles.cheeseName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cheeseCountry}>
            {item.country} • {item.milkType}
          </Text>
          
          {/* MARIDAJES */}
          {item.pairings && item.pairings.length > 0 && (
            <Text style={styles.cheesePairings} numberOfLines={1}>
              🍷 {item.pairings.slice(0, 2).join(', ')}
              {item.pairings.length > 2 && '...'}
            </Text>
          )}
          
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>
              {'★'.repeat(Math.floor(item.avgRating))}
              {'☆'.repeat(5 - Math.floor(item.avgRating))}
            </Text>
            <Text style={styles.rating}>{item.avgRating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Cargando quesos recomendados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Para ti</Text>
        <Text style={styles.subtitle}>Quesos recomendados según tus gustos</Text>
        <Text style={styles.cheeseCount}>
          Quesos cargados: {recommendedCheeses.length}
        </Text>
      </View>
      
      <FlatList
        data={recommendedCheeses}
        renderItem={renderCheeseCard}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay quesos disponibles</Text>
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
  header: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 8,
  },
  cheeseCount: {
    fontSize: 12,
    color: '#28A745',
    fontStyle: 'italic',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cheeseCard: {
    width: itemWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cheeseImage: {
    width: '100%',
    height: itemWidth * 0.6,
    backgroundColor: '#E9ECEF',
  },
  cheeseInfo: {
    padding: 12,
  },
  cheeseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  cheeseCountry: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  cheesePairings: {
    fontSize: 11,
    color: '#28A745',
    marginBottom: 4,
    fontStyle: 'italic',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stars: {
    fontSize: 12,
    color: '#FF6B35',
  },
  rating: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
  },
});
