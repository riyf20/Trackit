import { Stack } from "expo-router";
import "./globals.css";
import { GluestackUIProvider } from '@gluestack-ui/themed';
// Adjust the path below if your config file is in a different location
import config from '../gluestack-ui.config'; 

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/utils/authStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  const colorScheme = useColorScheme();

  const {loggedin, onboarding} = useAuthStore();

  return (
    <>

      {/* Link to use Gluestack component library */}
      <GluestackUIProvider config={config}>
        
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

          <Stack>
            
            <Stack.Protected guard={loggedin && !onboarding}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
            
            <Stack.Protected guard={!loggedin && onboarding}>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={!loggedin && !onboarding}>
              <Stack.Screen name="onboardingMain" options={{ headerShown: false }} />
            </Stack.Protected>
            
          </Stack>

          <StatusBar style="auto" />


        </ThemeProvider>

      </GluestackUIProvider>
    </>
  );
}