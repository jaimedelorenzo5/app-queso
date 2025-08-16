import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import cheeseData from '../../assets/data/cheese_dataset_seed.json';
import { Cheese, RootStackParamList } from '../types';
import { DesignSystem } from '../constants/designSystem';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [cheeses, setCheeses] = useState<Cheese[]>([]);
  const [filteredCheeses, setFilteredCheeses] = useState<Cheese[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheeses();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = cheeses.filter(cheese =>
        cheese.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cheese.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cheese.milkType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCheeses(filtered);
    } else {
      setFilteredCheeses(cheeses);
    }
  }, [searchTerm, cheeses]);

  const loadCheeses = () => {
    try {
      setLoading(true);
      setCheeses(cheeseData);
      setFilteredCheeses(cheeseData);
    } catch (error) {
      console.error('Error loading cheeses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheesePress = (cheese: Cheese) => {
    navigation.navigate('CheeseDetail', { cheeseId: cheese.id });
  };



  const renderCheeseItem = ({ item }: { item: Cheese }) => (
    <TouchableOpacity
      style={styles.cheeseItem}
      onPress={() => handleCheesePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cheeseInfo}>
        <Text style={styles.cheeseName}>{item.name}</Text>
        <Text style={styles.cheeseDetails}>
          {item.country} • {item.milkType}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>🧀 CheeseRate</Text>
      <Text style={styles.subtitle}>Descubre quesos del mundo</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, país o tipo de leche..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={DesignSystem.components.searchBar.placeholderColor}
        />
      </View>
    </View>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Cargando quesos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredCheeses}
        renderItem={renderCheeseItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchTerm.length > 0 
                ? 'No se encontraron quesos' 
                : 'No hay quesos disponibles'
              }
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.theme.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: DesignSystem.spacing.medium,
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
  },
  listContainer: {
    paddingBottom: DesignSystem.spacing.large,
  },
  header: {
    padding: DesignSystem.spacing.large,
    backgroundColor: DesignSystem.theme.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.theme.secondaryColor,
  },
  title: {
    fontSize: DesignSystem.typography.heading.sizeLarge,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.xsmall,
  },
  subtitle: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.large,
  },
  searchContainer: {
    marginBottom: DesignSystem.spacing.medium,
  },
  searchInput: {
    backgroundColor: DesignSystem.components.searchBar.backgroundColor,
    borderRadius: DesignSystem.cornerRadius.large,
    paddingHorizontal: DesignSystem.spacing.large,
    paddingVertical: DesignSystem.spacing.medium,
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.components.searchBar.textColor,
  },
  cheeseItem: {
    backgroundColor: DesignSystem.components.productCard.backgroundColor,
    marginHorizontal: DesignSystem.spacing.medium,
    marginVertical: DesignSystem.spacing.small,
    padding: DesignSystem.spacing.medium,
    borderRadius: DesignSystem.cornerRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: DesignSystem.shadows.soft.color,
    shadowOffset: {
      width: DesignSystem.shadows.soft.offset[0],
      height: DesignSystem.shadows.soft.offset[1],
    },
    shadowOpacity: 0.1,
    shadowRadius: DesignSystem.shadows.soft.radius,
    elevation: 3,
  },
  cheeseInfo: {
    flex: 1,
  },
  cheeseName: {
    fontSize: DesignSystem.components.productCard.titleStyle.size,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.components.productCard.titleStyle.color,
    marginBottom: DesignSystem.spacing.xsmall,
  },
  cheeseDetails: {
    fontSize: DesignSystem.components.productCard.subtitleStyle.size,
    color: DesignSystem.components.productCard.subtitleStyle.color,
  },
  arrow: {
    fontSize: 20,
    color: DesignSystem.theme.primaryColor,
    marginLeft: DesignSystem.spacing.medium,
  },
  emptyContainer: {
    padding: DesignSystem.spacing.xlarge,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    textAlign: 'center',
  },
});
