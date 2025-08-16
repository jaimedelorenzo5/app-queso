import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DesignSystem } from '../constants/designSystem';

interface PlaceholderSVGProps {
  width?: number;
  height?: number;
  text?: string;
  style?: any;
}

export const PlaceholderSVG: React.FC<PlaceholderSVGProps> = ({
  width = 200,
  height = 200,
  text = '🧀',
  style,
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{text}</Text>
        </View>
        <View style={styles.pattern}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.dot, { opacity: 0.1 + (i * 0.1) }]} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DesignSystem.theme.secondaryColor,
    borderRadius: DesignSystem.cornerRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    zIndex: 2,
  },
  icon: {
    fontSize: 48,
    color: DesignSystem.theme.primaryColor,
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DesignSystem.theme.primaryColor,
    margin: 4,
  },
});
