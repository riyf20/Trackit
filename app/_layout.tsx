import { Stack } from "expo-router";
import "./globals.css";
import { GluestackUIProvider } from '@gluestack-ui/themed';
import config from '../gluestack-ui.config'; 
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/utils/authStore';
import { useThemeColor } from "@/hooks/use-theme-color";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  const colorScheme = useColorScheme();

  const {loggedin, onboarding} = useAuthStore();

  const theme = useThemeColor({}, 'text');

  return (
    <>

      {/* Link to use Gluestack component library */}
      <GluestackUIProvider config={config}>
        
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: theme },
            }}
          >
            
            <Stack.Protected guard={loggedin && !onboarding}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="setting/details/accountInformation" options={{ headerShown: true,  title: 'Change Account Information', headerBackButtonDisplayMode:"minimal", headerTitleStyle: {fontSize: 20}  }} />
              <Stack.Screen name="setting/details/accountPassword" options={{ headerShown: true,  title: 'Change Password', headerBackButtonDisplayMode:"minimal", headerTitleStyle: {fontSize: 20}  }} />

              <Stack.Screen name="setting/social/friendsList" options={{ headerShown: true, title: 'Friends List', headerBackButtonDisplayMode:"minimal", headerTitleStyle: {fontSize: 20} }} />
              <Stack.Screen name="setting/social/addFriends" options={{ headerShown: true, title: 'Add Friends', headerBackButtonDisplayMode:"minimal", headerTitleStyle: {fontSize: 20} }} />
              <Stack.Screen name="setting/social/invites" options={{ headerShown: true, title: 'Invites', headerBackButtonDisplayMode:"minimal", headerTitleStyle: {fontSize: 20} }} />

              <Stack.Screen name="setting/progress/achievements" options={{ headerShown: true, title: 'Achievements', headerBackButtonDisplayMode:"minimal", headerTitleStyle: {fontSize: 20} }} />
              <Stack.Screen name="setting/progress/stats" options={{ headerShown: true, title: 'Lifetime Stats', headerBackButtonDisplayMode:"minimal", headerTitleStyle: {fontSize: 20} }} />

              <Stack.Screen name="setting/systemSetting" options={{ headerShown: true, title: 'Settings', headerBackTitle: "Account", headerTitleStyle: {fontSize: 28} }} />
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