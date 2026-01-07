import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Switch } from "react-native-switch-ios";
import { systemSettingInformation } from '@/constants/settings';
import { ThemedText } from './themed-text';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/utils/authStore';

// System setting switch component 
const SettingSwitch = ({title, index}:SettingSwitchProps) => {

  const {theme, updateTheme, hideOptional, updateHideOptional} = useAuthStore()

  const [toggle, setToggle] = useState( 
    (title==='Dark Mode' && theme==='dark') || ( (title==='Optional Fields' || title==='Logs Optional Fields') && hideOptional) ? true 
    : (title==='Dark Mode' && theme==='light') || ( (title==='Optional Fields' || title==='Logs Optional Fields') && !hideOptional)? false 
    : false
  );

  useEffect(() => {
    if(title === 'Dark Mode') {
      setToggle(theme==='dark' ? true : false)
    }
  }, [theme])
    
  return (
    <>
    <View className={` ${title!=='Logs Optional Fields' && 'mt-[12px]'} w-full p-4 rounded-3xl flex flex-row items-center ${theme==='dark' ? 'bg-white/10' : 'bg-black/10'} `}>
      {title==='Logs Optional Fields' ? 
      <ThemedText type='difficultySubtitle' className='flex-1'>Optional Fields</ThemedText>
      :
      <ThemedText type='systemSettingOptions' className='ml-[12px] flex-1'>{title}</ThemedText>
      }
        <Switch
          inactiveBgColor="#7d7d7d"
          activeBgColor="#34c759"
          isOn={toggle}
          onToggle={() => {
            const next = !toggle
            setToggle(next)
            if(title === 'Dark Mode') {
              updateTheme(next ? 'dark' : 'light')
            } else if (title==='Optional Fields' || title==='Logs Optional Fields') {
              updateHideOptional(next)
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }} 
        />  
    </View>
    {title!=='Logs Optional Fields' && 
      <ThemedText type='systemSettingSubtitle' className='mt-[8px] px-[16px] mb-[12px]'>{systemSettingInformation[index]}</ThemedText>
    }
  </>
  )
}

export default SettingSwitch