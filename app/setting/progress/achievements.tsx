import { View, Text } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { GlassView } from 'expo-glass-effect';

// Allows users to view their achievements 
{/* TO DO: Implement fully later on */}
const achievements = () => {
  return (
   <ThemedView
        className="flex-1 items-center justify-center">
        <ThemedText>achievements</ThemedText>
        <GlassView
          style={{width: 200, height: 200,}}
          glassEffectStyle='clear'
        >

        </GlassView>
    </ThemedView>
  )
}

export default achievements