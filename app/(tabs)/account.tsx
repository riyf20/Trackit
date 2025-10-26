import { View, Text, Button, Pressable } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/utils/authStore'

const account = () => {

  const theme = useThemeColor({}, 'text');
  const {logOut} = useAuthStore()
  
  return (
    <ThemedView className='h-full'>
      
      <View>
        <ThemedText type='title' className='items-left justify-start absolute ml-[30px] mt-[75px]'>Account</ThemedText>
        
        <View className='items-right justify-end absolute top-[75px] right-0 mr-[30px]'>
          <Pressable
            onPress={() => {logOut()}}
          >
            <IconSymbol name='gear' size={35} color={theme}/>
          </Pressable>
        </View> 
      </View>



    </ThemedView>
    

  )
}

export default account