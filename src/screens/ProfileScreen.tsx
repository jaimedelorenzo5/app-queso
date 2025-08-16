import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Datos mock del usuario
  const user = {
    name: 'Usuario Demo',
    email: 'demo@cheeserate.com',
    bio: 'Amante de los quesos artesanales y las experiencias gastronómicas únicas.',
    location: 'Madrid, España',
    joinDate: 'Enero 2024',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  };

  const stats = [
    { label: 'Quesos Valorados', value: '24', icon: 'star' },
    { label: 'Fotos Subidas', value: '12', icon: 'camera' },
    { label: 'Quesos Guardados', value: '18', icon: 'heart' },
    { label: 'Reseñas', value: '8', icon: 'chatbubble' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header del perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              defaultSource={{ uri: 'https://via.placeholder.com/150' }}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons name="pencil" size={16} color="#A67C52" />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Guardar' : 'Editar Perfil'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name={stat.icon as any} size={24} color="#A67C52" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Información del perfil */}
        <View style={styles.profileInfo}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Sobre mí</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#6C757D" />
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#6C757D" />
              <Text style={styles.infoText}>Miembro desde {user.joinDate}</Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings-outline" size={20} color="#6C757D" />
              <Text style={styles.actionButtonText}>Configuración</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={20} color="#6C757D" />
              <Text style={styles.actionButtonText}>Ayuda</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="information-circle-outline" size={20} color="#6C757D" />
              <Text style={styles.actionButtonText}>Acerca de</Text>
            </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#A67C52',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#A67C52',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFF3E0',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#A67C52',
  },
  editButtonText: {
    fontSize: 16,
    color: '#A67C52',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#A67C52',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  profileInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#495057',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
});
