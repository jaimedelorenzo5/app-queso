import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CheeseCard } from '../components/CheeseCard';
import { getCheeseById, auth, signOutUser } from '../services/firebase';
import { Cheese, RootStackParamList } from '../types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [favorites, setFavorites] = useState<Cheese[]>([]);
  const [reviewHistory, setReviewHistory] = useState<Cheese[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Simulación de datos del usuario - en producción esto vendría de Firestore
      const mockFavorites = [
        {
          id: 'c1',
          name: 'Manchego Curado',
          producer: 'Quesería de La Mancha',
          country: 'Spain',
          region: 'Castilla-La Mancha',
          milkType: 'Sheep' as const,
          maturation: 'Cured' as const,
          flavorProfile: ['Nutty', 'Savory', 'Buttery'],
          photoUrl: 'https://example.com/manchego.jpg',
          pairings: ['Tempranillo wine', 'Membrillo', 'Sourdough bread'],
          avgRating: 4.7,
        },
        {
          id: 'c2',
          name: 'Brie de Meaux',
          producer: 'Fromagerie X',
          country: 'France',
          region: 'Île-de-France',
          milkType: 'Cow' as const,
          maturation: 'Soft' as const,
          flavorProfile: ['Creamy', 'Buttery', 'Mild'],
          photoUrl: 'https://example.com/brie.jpg',
          pairings: ['Champagne', 'Baguette', 'Strawberries'],
          avgRating: 4.5,
        },
      ];

      const mockHistory = [
        {
          id: 'c3',
          name: 'Parmigiano Reggiano',
          producer: 'Consorzio del Formaggio',
          country: 'Italy',
          region: 'Emilia-Romagna',
          milkType: 'Cow' as const,
          maturation: 'Cured' as const,
          flavorProfile: ['Nutty', 'Salty', 'Complex'],
          photoUrl: 'https://example.com/parmigiano.jpg',
          pairings: ['Chianti', 'Balsamic', 'Pasta'],
          avgRating: 4.8,
        },
      ];

      setFavorites(mockFavorites);
      setReviewHistory(mockHistory);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutUser();
              // Navegar a pantalla de login o home
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const handleCheesePress = (cheese: Cheese) => {
    navigation.navigate('CheeseDetail', { cheeseId: cheese.id });
  };

  const renderCheeseItem = ({ item }: { item: Cheese }) => (
    <CheeseCard cheese={item} onPress={handleCheesePress} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {auth.currentUser?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {auth.currentUser?.displayName || 'Usuario'}
          </Text>
          <Text style={styles.userEmail}>
            {auth.currentUser?.email || 'usuario@example.com'}
          </Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            ❤️ Favoritos ({favorites.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            📝 Historial ({reviewHistory.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const data = activeTab === 'favorites' ? favorites : reviewHistory;
  const emptyText = activeTab === 'favorites' 
    ? 'No tienes quesos favoritos aún' 
    : 'No has reseñado quesos aún';

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderCheeseItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyText}</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreButtonText}>Explorar Quesos</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
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
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  signOutButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
