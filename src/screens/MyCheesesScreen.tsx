import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { SupabaseCheese } from '../types';
import { CheeseCard } from '../components/CheeseCard';

export const MyCheesesScreen: React.FC = () => {
  const [myCheeses, setMyCheeses] = useState<SupabaseCheese[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    loadMyCheeses();
  }, []);
  
  // Recargar datos cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      loadMyCheeses();
      return () => {
        // Cleanup opcional
      };
    }, [])
  );

  const loadMyCheeses = async () => {
    try {
      setLoading(true);
      
      // Obtener IDs de quesos guardados desde AsyncStorage
      const savedCheesesString = await AsyncStorage.getItem('savedCheeses');
      if (!savedCheesesString) {
        setMyCheeses([]);
        return;
      }
      
      const savedCheeseIds = JSON.parse(savedCheesesString) as string[];
      
      if (savedCheeseIds.length === 0) {
        setMyCheeses([]);
        return;
      }
      
      // Obtener detalles de los quesos guardados
      const { data: cheesesData, error: cheesesError } = await supabase
        .from('cheeses')
        .select('*')
        .in('id', savedCheeseIds)
        .order('name');

      if (cheesesError) {
        console.error('Error loading cheeses details:', cheesesError.message);
        return;
      }

      setMyCheeses(cheesesData || []);
    } catch (error) {
      console.error('Error in loadMyCheeses:', error);
      Alert.alert('Error', 'No se pudieron cargar tus quesos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyCheeses();
    setRefreshing(false);
  };

  const renderCheeseItem = ({ item }: { item: SupabaseCheese }) => (
    <CheeseCard cheese={item} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🧀 Cargando tus quesos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
              <View style={styles.header}>
          <Text style={styles.title}>🧀 Mis Quesos</Text>
          <Text style={styles.subtitle}>
            {myCheeses.length} {myCheeses.length === 1 ? 'queso' : 'quesos'} en tu colección
          </Text>
          
          {myCheeses.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{myCheeses.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {myCheeses.filter(c => c.country === 'España').length}
                </Text>
                <Text style={styles.statLabel}>Españoles</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {myCheeses.filter(c => c.milk_type === 'Vaca').length}
                </Text>
                <Text style={styles.statLabel}>De Vaca</Text>
              </View>
            </View>
          )}
        </View>

      <FlatList
        data={myCheeses}
        renderItem={renderCheeseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>Tu colección está vacía</Text>
            <Text style={styles.emptySubtitle}>
              Ve a explorar y guarda tus quesos favoritos para empezar tu colección
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
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
});
