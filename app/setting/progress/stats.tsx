import { View, Text } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

// Allows users to view all stats 
{/* TO DO: Implement fully later on */}
const stats = () => {
  return (
   <ThemedView
        className="flex-1 items-center justify-center">
        <ThemedText>stats</ThemedText>
    </ThemedView>
  )
}

export default stats