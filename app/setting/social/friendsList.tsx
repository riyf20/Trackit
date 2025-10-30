import { View, Text } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color';

// Allows users to view their current friends
const friendsList = () => {

  const theme = useThemeColor({}, 'text');
  
  return (
    <ThemedView className='flex-1'>
                
      <View className='h-full flex items-center'>

        <ThemedText type='settingSubheading' className='mt-[10px]'>Your Friends</ThemedText> 
        {/* TO DO: make the friend count dynamic */}

        <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit py-[25px] mt-[12px] rounded-3xl items-center`} >
          <ThemedText className='align-middle'>You currently don't have any friends added.</ThemedText>
        </View>
        {/* TO DO: dynamically show list of all user's friends [appwrite or on device] */}

        <ThemedText type='settingSubheading' className='mt-[24px]'>Requested</ThemedText> 
        {/* TO DO: make the requested count dynamic */}

        <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit py-[25px] mt-[12px] rounded-3xl items-center`} >
          <ThemedText className='align-middle'>Your requested invites will be here.</ThemedText>
        </View>
          {/* TO DO: dynamically show list of requested invites [appwrite or on device] */}


        {/* TO DO: convert scrollview | what if user has alot of friends/requests */}

      </View>

    </ThemedView>
  )
}

export default friendsList