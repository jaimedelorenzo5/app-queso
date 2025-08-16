import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { searchCheesePhotos, downloadAndProcessPhoto, PhotoSource, CheesePhoto } from '../lib/photoSources';
import { DesignSystem } from '../constants/designSystem';

interface PhotoSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotoSelected: (photo: CheesePhoto) => void;
  cheeseId: string;
  cheeseName: string;
}

export const PhotoSearchModal: React.FC<PhotoSearchModalProps> = ({
  visible,
  onClose,
  onPhotoSelected,
  cheeseId,
  cheeseName,
}) => {
  const [photos, setPhotos] = useState<PhotoSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoSource | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (visible && cheeseId) {
      searchPhotos();
    }
  }, [visible, cheeseId]);

  const searchPhotos = async () => {
    setLoading(true);
    try {
      const results = await searchCheesePhotos(cheeseId, cheeseName);
      setPhotos(results);
    } catch (error) {
      console.error('Error searching photos:', error);
      Alert.alert('Error', 'No se pudieron cargar las fotos');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = async (photo: PhotoSource) => {
    setSelectedPhoto(photo);
    setDownloading(true);
    
    try {
      const cheesePhoto = await downloadAndProcessPhoto(photo, cheeseId);
      onPhotoSelected(cheesePhoto);
      onClose();
    } catch (error) {
      console.error('Error downloading photo:', error);
      Alert.alert('Error', 'No se pudo descargar la foto');
    } finally {
      setDownloading(false);
    }
  };

  const renderPhotoItem = ({ item }: { item: PhotoSource }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => handlePhotoSelect(item)}
      disabled={downloading}
    >
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: item.url }}
          style={styles.photo}
          resizeMode="cover"
        />
        <View style={styles.photoOverlay}>
          <Text style={styles.photoTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.photoSource}>
            {item.author || 'Fuente desconocida'}
          </Text>
          <Text style={styles.photoLicense}>
            Licencia: {item.license}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Buscar fotos de {cheeseName}</Text>
      <Text style={styles.subtitle}>
        Selecciona una foto de fuentes legales y éticas
      </Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No se encontraron fotos</Text>
      <Text style={styles.emptySubtext}>
        Intenta con otros términos de búsqueda
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={searchPhotos}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={DesignSystem.theme.primaryColor} />
            <Text style={styles.loadingText}>Buscando fotos...</Text>
          </View>
        ) : (
          <FlatList
            data={photos}
            renderItem={renderPhotoItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
          />
        )}

        {downloading && (
          <View style={styles.downloadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.downloadingText}>Descargando foto...</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.theme.backgroundColor,
  },
  header: {
    padding: DesignSystem.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.theme.secondaryColor,
    position: 'relative',
  },
  title: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    marginBottom: DesignSystem.spacing.small,
  },
  subtitle: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    top: DesignSystem.spacing.large,
    right: DesignSystem.spacing.large,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DesignSystem.theme.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: DesignSystem.typography.textColorPrimary,
  },
  listContainer: {
    padding: DesignSystem.spacing.medium,
  },
  photoItem: {
    flex: 1,
    margin: DesignSystem.spacing.small,
  },
  photoContainer: {
    borderRadius: DesignSystem.cornerRadius.medium,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: DesignSystem.shadows.soft.color,
    shadowOffset: {
      width: DesignSystem.shadows.soft.offset[0],
      height: DesignSystem.shadows.soft.offset[1],
    },
    shadowOpacity: 0.1,
    shadowRadius: DesignSystem.shadows.soft.radius,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: 150,
  },
  photoOverlay: {
    padding: DesignSystem.spacing.medium,
  },
  photoTitle: {
    fontSize: DesignSystem.typography.body.size,
    fontWeight: '600',
    color: DesignSystem.typography.textColorPrimary,
    marginBottom: DesignSystem.spacing.xsmall,
  },
  photoSource: {
    fontSize: DesignSystem.typography.caption.size,
    color: DesignSystem.typography.textColorSecondary,
    marginBottom: DesignSystem.spacing.xsmall,
  },
  photoLicense: {
    fontSize: DesignSystem.typography.caption.size,
    color: DesignSystem.theme.primaryColor,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DesignSystem.spacing.xlarge,
  },
  emptyText: {
    fontSize: DesignSystem.typography.heading.sizeMedium,
    fontWeight: DesignSystem.typography.heading.weight,
    color: DesignSystem.typography.heading.color,
    marginBottom: DesignSystem.spacing.small,
  },
  emptySubtext: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorSecondary,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.large,
  },
  retryButton: {
    backgroundColor: DesignSystem.theme.primaryColor,
    paddingHorizontal: DesignSystem.spacing.large,
    paddingVertical: DesignSystem.spacing.medium,
    borderRadius: DesignSystem.cornerRadius.medium,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: DesignSystem.typography.body.size,
    fontWeight: '600',
  },
  downloadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadingText: {
    color: '#fff',
    fontSize: DesignSystem.typography.body.size,
    marginTop: DesignSystem.spacing.medium,
  },
});
