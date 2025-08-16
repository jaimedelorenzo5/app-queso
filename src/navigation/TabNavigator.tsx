import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { DesignSystem } from '../constants/designSystem';
import { HomeRecommendedScreen } from '../screens/HomeRecommendedScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { FollowingScreen } from '../screens/FollowingScreen';
import { MyCheesesScreen } from '../screens/MyCheesesScreen';
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
        name="Following" 
        component={FollowingScreen}
        options={{ title: 'Siguiendo' }}
      />
      <Tab.Screen 
        name="MyCheeses" 
        component={MyCheesesScreen}
        options={{ title: 'Mis quesos' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: DesignSystem.theme.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.theme.secondaryColor,
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
    shadowColor: DesignSystem.shadows.medium.color,
    shadowOffset: {
      width: DesignSystem.shadows.medium.offset[0],
      height: DesignSystem.shadows.medium.offset[1],
    },
    shadowOpacity: 0.1,
    shadowRadius: DesignSystem.shadows.medium.radius,
    elevation: 8,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    color: DesignSystem.navigation.tabs[0].inactiveColor,
    marginBottom: 4,
  },
  tabIconFocused: {
    color: DesignSystem.navigation.tabs[0].activeColor,
  },
  tabLabel: {
    fontSize: 10,
    color: DesignSystem.navigation.tabs[0].inactiveColor,
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: DesignSystem.navigation.tabs[0].activeColor,
  },
  cameraTab: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignSystem.theme.secondaryColor,
    borderRadius: 25,
    width: 50,
    height: 50,
    marginTop: -10,
  },
  cameraTabFocused: {
    backgroundColor: DesignSystem.theme.primaryColor,
  },
  cameraIcon: {
    fontSize: 24,
    color: DesignSystem.theme.primaryColor,
    marginBottom: 2,
  },
  cameraIconFocused: {
    color: DesignSystem.theme.backgroundColor,
  },
  cameraLabel: {
    fontSize: 8,
    color: DesignSystem.theme.primaryColor,
    fontWeight: '600',
  },
  cameraLabelFocused: {
    color: DesignSystem.theme.backgroundColor,
  },
});
