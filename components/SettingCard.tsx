import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { systemSettingInformation } from '@/constants/settings'
import { ThemedText } from './themed-text'
import { IconSymbol } from './ui/icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color';

// System setting card component 
const SettingCard = ({title, index}:SettingCardProps) => {

  const theme = useThemeColor({}, 'text');
  
  return (
    <>
    {/* TO DO: add the press in effect to the pressable */}
    <Pressable onPress={() => console.log("redirect to next page")} className={`mt-[12px] w-full p-4 rounded-3xl flex flex-row items-center ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/20'} `}>
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