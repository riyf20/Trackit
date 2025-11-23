import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Welcome to Expo Router!</ThemedText>
      <ThemedText style={{ fontSize: 16, textAlign: 'center', marginBottom: 32 }}>
        This is a simple starter app to help you get started with Expo Router.
      </ThemedText>
    </ThemedView>
  )
}
