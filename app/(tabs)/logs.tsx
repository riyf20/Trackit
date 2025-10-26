import { View, Text } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

const logs = () => {
  return (
    <ThemedView
      className='flex-1 items-center justify-center'
    >
      <ThemedText>logs</ThemedText>
    </ThemedView>
  )
}

export default logs