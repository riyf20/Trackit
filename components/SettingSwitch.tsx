import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Switch } from "react-native-switch-ios";
import { useThemeColor } from '@/hooks/use-theme-color';
import { systemSettingInformation } from '@/constants/settings';
import { ThemedText } from './themed-text';
import * as Haptics from 'expo-haptics';

// System setting switch component 
const SettingSwitch = ({title, index}:SettingSwitchProps) => {

  const theme = useThemeColor({}, 'text');
  const [toggle, setToggle] = useState(false);
    
  return (
    <>
    <View className={`mt-[12px] w-full p-4 rounded-3xl flex flex-row items-center ${theme==='#ECEDEE' ? 'bg-white/10' : 'bg-black/10'} `}>
        <ThemedText type='systemSettingOptions' className='ml-[12px] flex-1'>{title}</ThemedText>
            <Switch
              inactiveBgColor="#7d7d7d"
              activeBgColor="#34c759"
              isOn={toggle}
              onToggle={() => {
                setToggle((prev) => !prev)
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }} 
            />  
    </View>
    <ThemedText type='systemSettingSubtitle' className='mt-[8px] px-[16px] mb-[12px]'>{systemSettingInformation[index]}</ThemedText>
  </>
  )
}

export default SettingSwitch