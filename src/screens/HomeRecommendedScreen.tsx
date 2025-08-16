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
  ScrollView,
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

// Datos mock para desarrollo
const mockCheeses: CheeseWithPhoto[] = [
  {
    id: '1',
    name: 'Manchego Curado',
    producer: 'Quesos La Mancha',
    country: 'España',
    region: 'Castilla-La Mancha',
    milkType: 'Sheep',
    maturation: 'Cured',
    flavorProfile: ['Intenso', 'Sabroso'],
    pairings: ['Vino tinto', 'Membrillo'],
    avgRating: 4.5,
    photoUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
    designation: 'DOP',
  },
  {
    id: '2',
    name: 'Brie de Meaux',
    producer: 'Fromagerie de Meaux',
    country: 'Francia',
    region: 'Île-de-France',
    milkType: 'Cow',
    maturation: 'Soft',
    flavorProfile: ['Cremoso', 'Suave'],
    pairings: ['Champagne', 'Frutas'],
    avgRating: 4.3,
    photoUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    designation: 'AOP',
  },
  {
    id: '3',
    name: 'Parmigiano Reggiano',
    producer: 'Consorzio del Formaggio',
    country: 'Italia',
    region: 'Emilia-Romagna',
    milkType: 'Cow',
    maturation: 'Cured',
    flavorProfile: ['Salado', 'Complejo'],
    pairings: ['Vino tinto', 'Pasta'],
    avgRating: 4.7,
    photoUrl: 'https://images.unsplash.com/photo-1589884629108-85e9b0d7c636?w=400&h=300&fit=crop',
    designation: 'DOP',
  },
  {
    id: '4',
    name: 'Gouda Joven',
    producer: 'Quesos Holandeses',
    country: 'Países Bajos',
    region: 'Holanda del Sur',
    milkType: 'Cow',
    maturation: 'Semi',
    flavorProfile: ['Suave', 'Cremoso'],
    pairings: ['Cerveza', 'Pan'],
    avgRating: 4.1,
    photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    designation: 'IGP',
  },
  {
    id: '5',
    name: 'Roquefort',
    producer: 'Société des Caves',
    country: 'Francia',
    region: 'Occitania',
    milkType: 'Sheep',
    maturation: 'Cured',
    flavorProfile: ['Intenso', 'Picante'],
    pairings: ['Vino dulce', 'Nueces'],
    avgRating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1542834292980-6c2075d0e7b5?w=400&h=300&fit=crop',
    designation: 'AOP',
  },
  {
    id: '6',
    name: 'Mozzarella di Bufala',
    producer: 'Consorzio di Tutela',
    country: 'Italia',
    region: 'Campania',
    milkType: 'Cow',
    maturation: 'Fresh',
    flavorProfile: ['Suave', 'Húmedo'],
    pairings: ['Tomate', 'Albahaca'],
    avgRating: 4.2,
    photoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    designation: 'DOP',
  },
];

// Datos mock para "Siguiendo"
const mockFollowingCheeses: CheeseWithPhoto[] = [
  {
    id: 'following-1',
    name: 'Stilton Blue',
    producer: 'Stilton Cheese Makers',
    country: 'Reino Unido',
    region: 'Derbyshire',
    milkType: 'Cow',
    maturation: 'Cured',
    flavorProfile: ['Intenso', 'Azul'],
    pairings: ['Vino de postre', 'Nueces'],
    avgRating: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1589884629108-85e9b0d7c636?w=400&h=300&fit=crop',
    designation: 'PDO',
  },
  {
    id: 'following-2',
    name: 'Comté AOP',
    producer: 'Fromageries Comtoises',
    country: 'Francia',
    region: 'Franco Condado',
    milkType: 'Cow',
    maturation: 'Cured',
    flavorProfile: ['Complejo', 'Nuez'],
    pairings: ['Vino blanco', 'Pan rústico'],
    avgRating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
    designation: 'AOP',
  },
];

export const HomeRecommendedScreen: React.FC = () => {
  const navigation = useNavigation<HomeRecommendedScreenNavigationProp>();
  const [recommendedCheeses, setRecommendedCheeses] = useState<CheeseWithPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendedCheeses = async () => {
      try {
        setLoading(true);
        console.log('🔍 HomeRecommendedScreen: Cargando quesos...');
        
        // Por ahora, usar datos mock en lugar de Supabase
        // TODO: Implementar carga real cuando tengamos Supabase funcionando
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
        
        console.log('🔍 HomeRecommendedScreen: Usando datos mock');
        setRecommendedCheeses(mockCheeses);
        
        // Código original comentado para cuando tengamos Supabase:
        /*
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
        */
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
      console.log('🧀 HomeRecommendedScreen: Navegando a queso:', cheese.name);
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
          <Text style={styles.cheeseName}>{item.name}</Text>
          <Text style={styles.cheeseCountry}>{item.country}</Text>
          <Text style={styles.cheesePairings}>
            {item.pairings.join(' • ')}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>{'⭐'.repeat(Math.floor(item.avgRating))}</Text>
            <Text style={styles.rating}>{item.avgRating}</Text>
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
        <Text style={styles.subtitle}>
          Quesos recomendados basados en tus preferencias
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección de Quesos Recomendados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧀 Quesos Recomendados</Text>
          <Text style={styles.sectionSubtitle}>
            {recommendedCheeses.length} quesos seleccionados para ti
          </Text>
          
          <View style={styles.cheeseGrid}>
            {recommendedCheeses.map((cheese) => (
              <TouchableOpacity
                key={cheese.id}
                style={styles.cheeseCard}
                onPress={() => handleCheesePress(cheese)}
                activeOpacity={0.8}
              >
                <CheeseImage
                  source={cheese.photoUrl ? { uri: cheese.photoUrl } : null}
                  style={styles.cheeseImage}
                  cheeseName={cheese.name}
                />
                <View style={styles.cheeseInfo}>
                  <Text style={styles.cheeseName}>{cheese.name}</Text>
                  <Text style={styles.cheeseCountry}>{cheese.country}</Text>
                  <Text style={styles.cheesePairings}>
                    {cheese.pairings.join(' • ')}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.stars}>{'⭐'.repeat(Math.floor(cheese.avgRating))}</Text>
                    <Text style={styles.rating}>{cheese.avgRating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sección de Siguiendo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Siguiendo</Text>
          <Text style={styles.sectionSubtitle}>
            Quesos de usuarios que sigues
          </Text>
          
          <View style={styles.cheeseGrid}>
            {mockFollowingCheeses.map((cheese) => (
              <View key={cheese.id} style={styles.cheeseCard}>
                <CheeseImage
                  source={cheese.photoUrl ? { uri: cheese.photoUrl } : null}
                  style={styles.cheeseImage}
                  cheeseName={cheese.name}
                />
                <View style={styles.cheeseInfo}>
                  <Text style={styles.cheeseName}>{cheese.name}</Text>
                  <Text style={styles.cheeseCountry}>{cheese.country}</Text>
                  <Text style={styles.cheesePairings}>
                    {cheese.pairings.join(' • ')}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.stars}>{'⭐'.repeat(Math.floor(cheese.avgRating))}</Text>
                    <Text style={styles.rating}>{cheese.avgRating}</Text>
                  </View>
                </View>
              </View>
            ))}
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
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 16,
  },
  cheeseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    marginBottom: 16,
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
});
