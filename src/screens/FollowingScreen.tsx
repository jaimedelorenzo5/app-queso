import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { SupabaseCheese } from '../types';
import { CheeseCard } from '../components/CheeseCard';

export const FollowingScreen: React.FC = () => {
  const [followingCheeses, setFollowingCheeses] = useState<SupabaseCheese[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFollowingCheeses();
  }, []);

  const loadFollowingCheeses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setFollowingCheeses([]);
        return;
      }

      // Obtener quesos guardados por el usuario
      const { data: savedData, error: savedError } = await supabase
        .from('saved_cheeses')
        .select('cheese_id')
        .eq('user_id', user.id);

      if (savedError) {
        console.error('Error loading saved cheeses:', savedError);
        return;
      }

      if (savedData && savedData.length > 0) {
        const cheeseIds = savedData.map(item => item.cheese_id);
        
        // Obtener detalles de los quesos guardados
        const { data: cheesesData, error: cheesesError } = await supabase
          .from('cheeses')
          .select('*')
          .in('id', cheeseIds)
          .order('name');

        if (cheesesError) {
          console.error('Error loading cheeses details:', cheesesError);
          return;
        }

        setFollowingCheeses(cheesesData || []);
      } else {
        setFollowingCheeses([]);
      }
    } catch (error) {
      console.error('Error in loadFollowingCheeses:', error);
      Alert.alert('Error', 'No se pudieron cargar los quesos seguidos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFollowingCheeses();
    setRefreshing(false);
  };

  const renderCheeseItem = ({ item }: { item: SupabaseCheese }) => (
    <CheeseCard cheese={item} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🧀 Cargando quesos seguidos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Mis Quesos Guardados</Text>
        <Text style={styles.subtitle}>
          {followingCheeses.length} quesos guardados
        </Text>
      </View>

      <FlatList
        data={followingCheeses}
        renderItem={renderCheeseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyTitle}>No tienes quesos guardados</Text>
            <Text style={styles.emptySubtitle}>
              Ve a explorar y guarda tus quesos favoritos
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
});
