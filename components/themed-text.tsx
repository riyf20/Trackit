import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'onboarding' | 'onboardingMain' | 'settingSubheading' | 'settingSuboptions';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'onboarding' ? styles.onboarding : undefined,
        type === 'onboardingMain' ? styles.onboardingMain : undefined,
        type === 'settingSubheading' ? styles.settingSubheading: undefined,
        type === 'settingSuboptions' ? styles.settingSuboptions: undefined,
        style,
      ]}
      {...rest}
    />
  );
}


// Expanding off the Expo template | integrated custom version
const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'light',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  // Custom versions
  onboarding: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  onboardingMain: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingSubheading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingSuboptions: {
    fontSize: 18,
  }
});
