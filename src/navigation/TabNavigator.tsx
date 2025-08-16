import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { DesignSystem } from '../constants/designSystem';
import { HomeRecommendedScreen } from '../screens/HomeRecommendedScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { FollowingScreen } from '../screens/FollowingScreen';
import { MyCheesesScreen } from '../screens/MyCheesesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ 
  name, 
  focused, 
  isCamera = false 
}: { 
  name: string; 
  focused: boolean; 
  isCamera?: boolean;
}) => {
  const getIcon = () => {
    switch (name) {
      case 'HomeRecommended': return '🏠';
      case 'Explore': return '🔍';
      case 'Camera': return '📷';
      case 'Following': return '👥';
      case 'MyCheeses': return '🧀';
      case 'Profile': return '👤';
      default: return '📱';
    }
  };

  const getLabel = () => {
    switch (name) {
      case 'HomeRecommended': return 'Para ti';
      case 'Explore': return 'Explorar';
      case 'Camera': return 'Cámara';
      case 'Following': return 'Siguiendo';
      case 'MyCheeses': return 'Mis quesos';
      case 'Profile': return 'Perfil';
      default: return name;
    }
  };

  if (isCamera) {
    return (
      <View style={[
        styles.cameraTab,
        focused && styles.cameraTabFocused
      ]}>
        <Text style={[
          styles.cameraIcon,
          focused && styles.cameraIconFocused
        ]}>
          {getIcon()}
        </Text>
        <Text style={[
          styles.cameraLabel,
          focused && styles.cameraLabelFocused
        ]}>
          {getLabel()}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <Text style={[
        styles.tabIcon,
        focused && styles.tabIconFocused
      ]}>
        {getIcon()}
      </Text>
      <Text style={[
        styles.tabLabel,
        focused && styles.tabLabelFocused
      ]}>
        {getLabel()}
      </Text>
    </View>
  );
};

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon 
            name={route.name} 
            focused={focused} 
            isCamera={route.name === 'Camera'}
          />
        ),
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeRecommended" 
        component={HomeRecommendedScreen}
        options={{ title: 'Para ti' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ title: 'Explorar' }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{ title: 'Cámara' }}
      />
      <Tab.Screen 
        name="MyCheeses" 
        component={MyCheesesScreen}
        options={{ title: 'Mis quesos' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: DesignSystem.theme.surfaceColor,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.theme.borderColor,
    paddingTop: DesignSystem.spacing.small,
    paddingBottom: DesignSystem.spacing.small,
    height: 85,
    shadowColor: DesignSystem.shadows.medium.color,
    shadowOffset: {
      width: DesignSystem.shadows.medium.offset[0],
      height: DesignSystem.shadows.medium.offset[1],
    },
    shadowOpacity: 1,
    shadowRadius: DesignSystem.shadows.medium.radius,
    elevation: 8,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    color: DesignSystem.theme.textColorSecondary,
    marginBottom: DesignSystem.spacing.xsmall,
  },
  tabIconFocused: {
    color: DesignSystem.theme.primaryColor,
  },
  tabLabel: {
    fontSize: 11,
    color: DesignSystem.theme.textColorSecondary,
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: DesignSystem.theme.primaryColor,
  },
  cameraTab: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignSystem.theme.primaryColor,
    borderRadius: 28,
    width: 56,
    height: 56,
    marginTop: -12,
    shadowColor: DesignSystem.shadows.medium.color,
    shadowOffset: {
      width: DesignSystem.shadows.medium.offset[0],
      height: DesignSystem.shadows.medium.offset[1],
    },
    shadowOpacity: 1,
    shadowRadius: DesignSystem.shadows.medium.radius,
    elevation: 6,
  },
  cameraTabFocused: {
    backgroundColor: DesignSystem.theme.accentColor,
  },
  cameraIcon: {
    fontSize: 26,
    color: DesignSystem.theme.surfaceColor,
    marginBottom: 2,
  },
  cameraIconFocused: {
    color: DesignSystem.theme.surfaceColor,
  },
  cameraLabel: {
    fontSize: 9,
    color: DesignSystem.theme.surfaceColor,
    fontWeight: '600',
  },
  cameraLabelFocused: {
    color: DesignSystem.theme.surfaceColor,
  },
});
