import { View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { systemSettingInformation } from '@/constants/settings'
import { ThemedText } from './themed-text'
import { IconSymbol } from './ui/icon-symbol'
import { useAuthStore } from '@/utils/authStore'

// System setting card component 
const SettingCard = ({title, index}:SettingCardProps) => {

  const {theme} = useAuthStore()

  const [pressed, setPressed] = useState(false);
  
  return (
    <>
    <Pressable onPressIn={() => {setPressed(true)}} onPressOut={() => {setPressed(false)}} onPress={() => console.log("redirect to next page")} 
    className={`mt-[12px] w-full p-4 rounded-3xl flex flex-row items-center ${theme==='dark' ? `${pressed ? 'bg-white/20' : 'bg-white/10'}` : `${pressed ? 'bg-black/20' : 'bg-black/10'}`} `} 
    >
      <ThemedText type='systemSettingOptions' className='ml-[12px] flex-1'>{title}</ThemedText>
      <View className='flex items-center'>
        <IconSymbol name='chevron.right' size={16} color={'gray'}/>
      </View>
    </Pressable>
    <ThemedText type='systemSettingSubtitle' className='mt-[6px] px-[16px]'>{systemSettingInformation[index]}</ThemedText>
  </>
  )
}

export default SettingCard