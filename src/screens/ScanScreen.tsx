import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CheeseCard } from '../components/CheeseCard';
import { MLService } from '../services/mlService';
import { Cheese, RootStackParamList } from '../types';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

export const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<Cheese[]>([]);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        processImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      setProcessing(true);
      setResults([]);
      
      const matches = await MLService.processCheeseImage(imageUri);
      setResults(matches);
      
      if (matches.length === 0) {
        Alert.alert(
          'No se encontraron coincidencias',
          'Intenta con una foto más clara de la etiqueta del queso'
        );
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'No se pudo procesar la imagen');
    } finally {
      setProcessing(false);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setResults([]);
  };

  const handleCheesePress = (cheese: Cheese) => {
    navigation.navigate('CheeseDetail', { cheeseId: cheese.id });
  };

  const renderCheeseItem = ({ item }: { item: Cheese }) => (
    <CheeseCard cheese={item} onPress={handleCheesePress} />
  );

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Solicitando permisos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Sin acceso a la cámara</Text>
          <Text style={styles.errorSubtext}>
            Necesitas permitir el acceso a la cámara para escanear etiquetas
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Camera style={styles.preview} type={type} ref={cameraRef}>
            <View style={styles.previewOverlay}>
              <View style={styles.previewImageContainer}>
                <Camera style={styles.previewImage} type={type} />
              </View>
            </View>
          </Camera>
          
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
              <Text style={styles.retakeButtonText}>🔄 Volver a tomar</Text>
            </TouchableOpacity>
          </View>

          {processing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.processingText}>Analizando etiqueta...</Text>
            </View>
          )}

          {!processing && results.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Quesos encontrados:</Text>
              <FlatList
                data={results}
                renderItem={renderCheeseItem}
                keyExtractor={(item) => item.id}
                style={styles.resultsList}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={styles.corner} />
              <View style={styles.corner} />
              <View style={styles.corner} />
              <View style={styles.corner} />
            </View>
            <Text style={styles.instructions}>
              Coloca la etiqueta del queso dentro del marco
            </Text>
          </View>
        </Camera>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 12,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FF6B35',
    borderWidth: 3,
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  preview: {
    flex: 1,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImageContainer: {
    width: 300,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewControls: {
    padding: 20,
    backgroundColor: '#fff',
  },
  retakeButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  processingContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  resultsList: {
    flex: 1,
  },
});
