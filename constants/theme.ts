import { Platform } from 'react-native';

const tintColorLight = '#FF5733';
const tintColorDark = '#fff';
const error = "#EF4444"
//troquei as cores para poder visualizar como ficariaa ver lightmode, pois sempre começa com a dark
export const Colors = {
  light: {
    primary: '#FF5733',
    secondary: "#C70039",
    textTitle: '#09090B', 
    textPrimary: '#3F3F46', 
    textSecondary: '#71717A',  
    textTerciary: '#A1A1AA',  
    bgPrimary: '#fff',
    bgSecondary: '#eee ',
    bgTerciary: '#ddd',
    borderPrimary: "#ddd",
    tabActive: "#FFE3DD",
    tabTextActive: "#FF5733",
    tabInactive: "#bbb",
    tabTextInactive: "#888",
    tint: tintColorLight,
    icon: '#aaa',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    btnAccept: '#FFE2DC',
    btnDecline: '#FFD6E2',
    btnPlus: "#C70039",
    bgBtnPlus: "#fff",
    error: "#EF4444"
  },
  dark: {
    primary: '#FF5733',
    secondary: "#C70039",
    textTitle:   '#FAFAFA',    
    textPrimary: '#E4E4E7',   
    textSecondary: '#A1A1AA',  
    textTerciary:  '#71717A', 
    bgPrimary: '#151718',
    bgSecondary: '#333',
    bgTerciary: '#222',
    borderPrimary: "#333",
    tabActive: "#FF5733",
    tabTextActive: "#FFE3DD",
    tabInactive: "#888",
    tabTextInactive: "#bbb",
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    btnAccept: '#3D221D',
    btnDecline: '#3A1320',
    btnPlus: "#fff",
    bgBtnPlus: "#333",
    error: "#EF4444"
  },
};

export const Fonts = Platform.select({
   ios: {
    sans: 'Inter-Regular',
    sansSemiBold: 'Inter-SemiBold',
    sansBold: 'Inter-Bold',
  },
  android: {
    sans: 'Inter-Regular',
    sansSemiBold: 'Inter-SemiBold',
    sansBold: 'Inter-Bold',
  },
  default: {
    sans: 'Inter-Regular',
    sansSemiBold: 'Inter-SemiBold',
    sansBold: 'Inter-Bold',
  },
});
