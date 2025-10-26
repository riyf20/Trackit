import { View, Text } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'

const contracts = () => {
  return (
    <ThemedView
      className="flex-1 items-center justify-center">
      <ThemedText>contracts</ThemedText>
    </ThemedView>
  )
}

export default contracts