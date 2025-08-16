import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';

export interface FilterOptions {
  countries: string[];
  milkTypes: string[];
  maturations: string[];
  selectedCountries: string[];
  selectedMilkTypes: string[];
  selectedMaturations: string[];
}

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const handleFilterToggle = (
    filterType: 'countries' | 'milkTypes' | 'maturations',
    value: string
  ) => {
    const currentSelection = tempFilters[`selected${filterType.charAt(0).toUpperCase() + filterType.slice(1)}` as keyof FilterOptions] as string[];
    
    if (currentSelection.includes(value)) {
      // Remover filtro
      const newSelection = currentSelection.filter(item => item !== value);
      setTempFilters({
        ...tempFilters,
        [`selected${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`]: newSelection
      });
    } else {
      // Agregar filtro
      const newSelection = [...currentSelection, value];
      setTempFilters({
        ...tempFilters,
        [`selected${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`]: newSelection
      });
    }
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setModalVisible(false);
  };

  const resetFilters = () => {
    const resetFilters: FilterOptions = {
      ...filters,
      selectedCountries: [],
      selectedMilkTypes: [],
      selectedMaturations: [],
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.selectedCountries.length +
      filters.selectedMilkTypes.length +
      filters.selectedMaturations.length
    );
  };

  const renderFilterSection = (
    title: string,
    options: string[],
    selectedOptions: string[],
    filterType: 'countries' | 'milkTypes' | 'maturations'
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterOption,
              selectedOptions.includes(option) && styles.filterOptionSelected
            ]}
            onPress={() => handleFilterToggle(filterType, option)}
          >
            <Text style={[
              styles.filterOptionText,
              selectedOptions.includes(option) && styles.filterOptionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <>
      {/* Barra de filtros visible */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>🔍 Filtros</Text>
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {getActiveFiltersCount() > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={resetFilters}
          >
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de filtros */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {renderFilterSection(
              'Países',
              filters.countries,
              tempFilters.selectedCountries,
              'countries'
            )}
            
            {renderFilterSection(
              'Tipos de Leche',
              filters.milkTypes,
              tempFilters.selectedMilkTypes,
              'milkTypes'
            )}
            
            {renderFilterSection(
              'Maduración',
              filters.maturations,
              tempFilters.selectedMaturations,
              'maturations'
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reiniciar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#6C757D',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6C757D',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterOptionSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#495057',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
