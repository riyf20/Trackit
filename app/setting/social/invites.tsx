import { View, Text } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color';

// Allows users to view incoming friend invites
const invites = () => {

  const theme = useThemeColor({}, 'text');

  return (
    <ThemedView className='flex-1'>
                
      <View className='h-full flex items-center'>

        <ThemedText type='settingSubheading' className='mt-[10px]'>Your Invites (0)</ThemedText> 
        {/* TO DO: make the invites count dynamic */}

        <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit py-[25px] mt-[12px] rounded-3xl items-center`} >
          <ThemedText className='align-middle'>You currently don't have any friend invites.</ThemedText>
        </View>
        {/* TO DO: dynamically show list of incoming invites [appwrite or on device] */}


        {/* TO DO: convert scrollview | what if user has alot of invites */}


      </View>
    </ThemedView>
  )
}

export default invites