import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { DesignSystem } from '../constants/designSystem';

interface PhotoAttributionProps {
  author?: string;
  source_url?: string;
  license: string;
  onPress?: () => void;
}

export const PhotoAttribution: React.FC<PhotoAttributionProps> = ({
  author,
  source_url,
  license,
  onPress,
}) => {
  const handleSourcePress = () => {
    if (source_url) {
      Linking.openURL(source_url);
    }
  };

  const getLicenseText = (license: string) => {
    switch (license) {
      case 'CC-BY':
        return 'CC-BY (Atribución requerida)';
      case 'CC-BY-SA':
        return 'CC-BY-SA (Atribución + Compartir igual)';
      case 'CC0':
        return 'CC0 (Dominio público)';
      case 'Commercial':
        return 'Uso comercial permitido';
      default:
        return license;
    }
  };

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'CC-BY':
      case 'CC-BY-SA':
        return '#0066CC';
      case 'CC0':
        return '#00CC66';
      case 'Commercial':
        return '#CC6600';
      default:
        return DesignSystem.theme.primaryColor;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Créditos de imagen:</Text>
      
      <View style={styles.attributionContainer}>
        {author && (
          <Text style={styles.author}>
            Foto: {author}
          </Text>
        )}
        
        {source_url && (
          <TouchableOpacity onPress={handleSourcePress}>
            <Text style={styles.sourceLink}>
              Ver fuente original
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.licenseContainer}>
          <Text style={[styles.license, { color: getLicenseColor(license) }]}>
            {getLicenseText(license)}
          </Text>
        </View>
      </View>

      {onPress && (
        <TouchableOpacity style={styles.infoButton} onPress={onPress}>
          <Text style={styles.infoButtonText}>ℹ️ Más información</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: DesignSystem.spacing.medium,
    backgroundColor: DesignSystem.theme.secondaryColor,
    borderRadius: DesignSystem.cornerRadius.medium,
    marginVertical: DesignSystem.spacing.small,
  },
  label: {
    fontSize: DesignSystem.typography.caption.size,
    fontWeight: '600',
    color: DesignSystem.typography.textColorPrimary,
    marginBottom: DesignSystem.spacing.small,
  },
  attributionContainer: {
    gap: DesignSystem.spacing.xsmall,
  },
  author: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.typography.textColorPrimary,
    fontWeight: '500',
  },
  sourceLink: {
    fontSize: DesignSystem.typography.body.size,
    color: DesignSystem.theme.primaryColor,
    textDecorationLine: 'underline',
  },
  licenseContainer: {
    marginTop: DesignSystem.spacing.xsmall,
  },
  license: {
    fontSize: DesignSystem.typography.caption.size,
    fontWeight: '600',
  },
  infoButton: {
    marginTop: DesignSystem.spacing.small,
    paddingVertical: DesignSystem.spacing.small,
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: DesignSystem.typography.caption.size,
    color: DesignSystem.typography.textColorSecondary,
  },
});
