export interface ThemeColors {
  background: string;
  secondaryBackground: string;
  groupedBackground: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  separator: string;
  tint: string;
  success: string;
  warning: string;
  danger: string;
  cardShadow: string;
  fill: string;
}

export const palette: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: '#F2F2F7',
    secondaryBackground: '#FFFFFF',
    groupedBackground: '#FFFFFF',
    label: '#000000',
    secondaryLabel: '#6C6C70',
    tertiaryLabel: '#AEAEB2',
    separator: '#E5E5EA',
    tint: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    cardShadow: 'rgba(0,0,0,0.06)',
    fill: '#E9E9EE',
  },
  dark: {
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    groupedBackground: '#1C1C1E',
    label: '#FFFFFF',
    secondaryLabel: '#A1A1A6',
    tertiaryLabel: '#6C6C70',
    separator: '#38383A',
    tint: '#0A84FF',
    success: '#30D158',
    warning: '#FF9F0A',
    danger: '#FF453A',
    cardShadow: 'rgba(0,0,0,0.4)',
    fill: '#2C2C2E',
  },
};
