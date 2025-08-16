import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export const TestScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧀 PANTALLA DE PRUEBA 🧀</Text>
        <Text style={styles.subtitle}>Si ves esto, la app funciona</Text>
        
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>✅ Estado de la aplicación:</Text>
          <Text style={styles.statusText}>• React Native funcionando</Text>
          <Text style={styles.statusText}>• Navegación funcionando</Text>
          <Text style={styles.statusText}>• Estilos funcionando</Text>
        </View>
        
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>🔍 Próximos pasos:</Text>
          <Text style={styles.statusText}>• Verificar conexión a Supabase</Text>
          <Text style={styles.statusText}>• Verificar carga de datos</Text>
          <Text style={styles.statusText}>• Verificar renderizado de componentes</Text>
        </View>
        
        <Text style={styles.debugInfo}>
          Versión de prueba - {new Date().toLocaleString()}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 40,
  },
  testSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#28A745',
    marginBottom: 8,
  },
  debugInfo: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
