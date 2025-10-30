import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color';
import { Input, InputField, InputIcon, InputSlot, SearchIcon } from '@gluestack-ui/themed';

// Allows users to add friends
const addFriends = () => {

  const theme = useThemeColor({}, 'text');

  // Hold's user's search query
  const [query, setQuery] = useState('');

  return (
    <ThemedView className='flex-1'>
                
      <View className='h-full flex items-center'>

        <View className='flex w-[90%] mt-[12px]'>
          <Input
            variant='rounded' size='md' className={`mt-[8px] ${theme==='#ECEDEE' ? 'bg-white/90' : 'bg-black/20'} `}
          >
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField placeholder={'Search...'} value={query} className='' 
              onChangeText={(text) => {
                setQuery(text);
              }}
            />
          </Input>
        </View>

        <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit py-[25px] mt-[12px] rounded-3xl items-center`} >
          <ThemedText>No query made</ThemedText>
        </View>

        {/* TO DO: convert to scrollview | what if there are many results */}
        {/* TO DO: connect to appwrite to search active users */}

      </View>

    </ThemedView>
  )
}

export default addFriends