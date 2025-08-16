import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const { signIn, signUp, loading, error } = useAuthContext();

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      if (onConfirm) {
        const result = window.confirm(`${title}\n\n${message}`);
        if (result && onConfirm) {
          onConfirm();
        }
      } else {
        window.alert(`${title}\n\n${message}`);
      }
    } else {
      if (onConfirm) {
        Alert.alert(title, message, [
          { text: 'OK', onPress: onConfirm }
        ]);
      } else {
        Alert.alert(title, message);
      }
    }
  };

  const handleSubmit = async () => {
    console.log('🔍 LoginScreen: handleSubmit llamado');
    console.log('🔍 LoginScreen: Estado actual:', { email, password, name, isLogin, loading });
    
    // Validar campos
    if (!email || !password || (!isLogin && !name)) {
      console.log('🔍 LoginScreen: Campos incompletos');
      showAlert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    console.log('🔍 LoginScreen: Campos válidos, procediendo...');
    
    try {
      if (isLogin) {
        console.log('🔍 LoginScreen: Intentando login...');
        const result = await signIn(email, password);
        
        if (result.error) {
          console.log('🔍 LoginScreen: Error en login:', result.error);
          showAlert('Error de Login', result.error);
        } else {
          console.log('🔍 LoginScreen: Login exitoso');
          showAlert('¡Éxito!', 'Has iniciado sesión correctamente');
        }
      } else {
        console.log('🔍 LoginScreen: Intentando registro...');
        const result = await signUp(email, password, name);
        
        if (result.error) {
          console.log('🔍 LoginScreen: Error en registro:', result.error);
          showAlert('Error de Registro', result.error);
        } else {
          console.log('🔍 LoginScreen: Registro exitoso');
          showAlert('¡Éxito!', 'Cuenta creada correctamente. Revisa tu email para confirmar.');
        }
      }
    } catch (error) {
      console.error('🔍 LoginScreen: Error inesperado:', error);
      showAlert('Error', 'Ha ocurrido un error inesperado');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🧀</Text>
          <Text style={styles.appName}>CheeseRate</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre completo"
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Tu contraseña"
              secureTextEntry
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.toggleButtonText}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A67C52',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#721C24',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#A67C52',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#6C757D',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  toggleButtonText: {
    color: '#A67C52',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
