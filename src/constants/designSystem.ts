export const DesignSystem = {
  theme: {
    mode: 'light' as const,
    primaryColor: '#A67C52',
    secondaryColor: '#F4E8D0',
    accentColor: '#8B5E3C',
    highlightColor: '#C8A974',
    textColorPrimary: '#3B2F2F',
    textColorSecondary: '#6E5B4E',
    backgroundColor: '#FFFDF8',
  },
  typography: {
    fontFamily: {
      heading: 'Playfair Display, serif',
      body: 'Open Sans, sans-serif',
    },
    heading: {
      sizeLarge: 24,
      sizeMedium: 20,
      weight: '700',
      color: '#3B2F2F',
    },
    body: {
      size: 14,
      weight: '400',
      color: '#6E5B4E',
    },
    caption: {
      size: 12,
      weight: '400',
      color: '#A67C52',
    },
  },
  spacing: {
    xsmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  cornerRadius: {
    small: 6,
    medium: 12,
    large: 20,
  },
  shadows: {
    soft: {
      color: 'rgba(0,0,0,0.05)',
      offset: [0, 2],
      radius: 6,
    },
    medium: {
      color: 'rgba(0,0,0,0.1)',
      offset: [0, 4],
      radius: 10,
    },
  },
  layout: {
    grid: {
      columns: 2,
      gutter: 16,
      margin: 16,
    },
    header: {
      alignment: 'left',
      padding: 16,
      backgroundColor: '#FFFDF8',
    },
    footer: {
      alignment: 'center',
      padding: 12,
      backgroundColor: '#F4E8D0',
    },
  },
  navigation: {
    type: 'bottom-tab',
    tabs: [
      {
        name: 'Para ti',
        icon: 'heart',
        activeColor: '#A67C52',
        inactiveColor: '#CBB8A0',
      },
      {
        name: 'Explorar',
        icon: 'search',
        activeColor: '#A67C52',
        inactiveColor: '#CBB8A0',
      },
      {
        name: 'Cámara',
        icon: 'camera',
        activeColor: '#FFFFFF',
        inactiveColor: '#FFFFFF',
        backgroundColor: '#A67C52',
        size: 30,
        highlight: true,
      },
      {
        name: 'Siguiendo',
        icon: 'users',
        activeColor: '#A67C52',
        inactiveColor: '#CBB8A0',
      },
      {
        name: 'Mis quesos',
        icon: 'cheese',
        activeColor: '#A67C52',
        inactiveColor: '#CBB8A0',
      },
    ],
  },
  components: {
    productCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 'medium',
      shadow: 'soft',
      padding: 0,
      imageRatio: '4:3',
      imageBorderRadius: 'medium',
      titleStyle: {
        font: 'heading',
        size: 16,
        color: '#3B2F2F',
      },
      subtitleStyle: {
        font: 'body',
        size: 12,
        color: '#6E5B4E',
      },
    },
    detailHeader: {
      imageHeight: 300,
      overlayGradient: ['rgba(0,0,0,0.4)', 'transparent'],
      titleColor: '#FFFFFF',
      subtitleColor: '#F4E8D0',
    },
    gallery: {
      thumbnailSize: 80,
      spacing: 8,
      borderRadius: 'small',
    },
    searchBar: {
      backgroundColor: '#F4E8D0',
      textColor: '#3B2F2F',
      placeholderColor: '#A67C52',
      borderRadius: 'large',
      iconColor: '#A67C52',
    },
    ratingStars: {
      filledColor: '#C8A974',
      emptyColor: '#E0D6C3',
      size: 16,
    },
    button: {
      primary: {
        backgroundColor: '#A67C52',
        textColor: '#FFFFFF',
        borderRadius: 'medium',
        padding: [10, 20],
      },
      secondary: {
        backgroundColor: 'transparent',
        textColor: '#A67C52',
        border: '1px solid #A67C52',
        borderRadius: 'medium',
        padding: [10, 20],
      },
    },
    tag: {
      backgroundColor: '#F4E8D0',
      textColor: '#3B2F2F',
      padding: [4, 10],
      borderRadius: 'large',
      fontSize: 12,
    },
  },
  interactionPatterns: {
    navigation: 'bottom-tab',
    transition: 'fade-in',
    animationEasing: 'ease-in-out',
    tapFeedback: 'scale-down',
  },
} as const;
