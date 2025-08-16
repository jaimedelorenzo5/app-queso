export const DesignSystem = {
  theme: {
    mode: 'light' as const,
    primaryColor: '#8B4513', // Marrón más rico
    secondaryColor: '#F5F5DC', // Beige más suave
    accentColor: '#D2691E', // Naranja cálido
    highlightColor: '#FFD700', // Dorado para destacar
    textColorPrimary: '#2F2F2F', // Negro más suave
    textColorSecondary: '#5A5A5A', // Gris más legible
    backgroundColor: '#FAFAFA', // Blanco más cálido
    surfaceColor: '#FFFFFF', // Blanco puro para tarjetas
    borderColor: '#E0E0E0', // Gris claro para bordes
  },
  typography: {
    fontFamily: {
      heading: 'System', // Usar fuente del sistema para mejor rendimiento
      body: 'System',
    },
    heading: {
      sizeLarge: 28, // Más grande para mejor jerarquía
      sizeMedium: 22,
      weight: '700',
      color: '#2F2F2F',
    },
    body: {
      size: 16, // Más grande para mejor legibilidad
      weight: '500',
      color: '#5A5A5A',
    },
    caption: {
      size: 14, // Más grande para mejor legibilidad
      weight: '400',
      color: '#8B4513',
    },
  },
  spacing: {
    xsmall: 6, // Un poco más grande
    small: 12, // Más espaciado
    medium: 20, // Más espaciado
    large: 32, // Más espaciado
    xlarge: 40, // Más espaciado
  },
  cornerRadius: {
    small: 8, // Más redondeado
    medium: 16, // Más redondeado
    large: 24, // Más redondeado
  },
  shadows: {
    soft: {
      color: 'rgba(0,0,0,0.08)', // Sombra más visible
      offset: [0, 2],
      radius: 8,
    },
    medium: {
      color: 'rgba(0,0,0,0.15)', // Sombra más visible
      offset: [0, 6],
      radius: 16,
    },
    strong: {
      color: 'rgba(0,0,0,0.25)', // Sombra fuerte para modales
      offset: [0, 10],
      radius: 20,
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
