import React from 'react';
import { Platform, View } from 'react-native';

interface WebScrollViewProps {
  children: React.ReactNode;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  refreshControl?: React.ReactNode;
  onScroll?: (event: any) => void;
  scrollEnabled?: boolean;
}

export const WebScrollView: React.FC<WebScrollViewProps> = ({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = true,
  refreshControl,
  onScroll,
  scrollEnabled = true,
}) => {
  if (Platform.OS === 'web') {
    return (
      <div 
        className="web-scroll-view"
        style={{
          flex: 1,
          overflowY: scrollEnabled ? 'auto' : 'hidden',
          WebkitOverflowScrolling: 'touch',
          ...style,
        }}
        onScroll={onScroll}
      >
        <div 
          className="web-scroll-content"
          style={{
            paddingBottom: '120px', // Espacio para tabbar
            ...contentContainerStyle,
          }}
        >
          {refreshControl}
          {children}
        </div>
      </div>
    );
  }

  // Fallback para React Native
  return (
    <View style={style}>
      {children}
    </View>
  );
};
