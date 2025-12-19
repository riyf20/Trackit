import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SFSymbols6_0 } from 'sf-symbols-typescript';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

// Specific option for the filter menu
const FilterMenuOption = ({icon, label, onPress, active, setMenuOpen}:FilterMenuOptionProps) => {

    const [pressed, setPressed] = useState(false);
            
  return (
        <Pressable
            onPress={() => {
                Haptics.selectionAsync();
                onPress();
                setMenuOpen(false);
            }}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            className={`flex-row items-center gap-2 px-3 py-2 rounded-md ${(active || pressed) && 'bg-white/40'} `}
        >
            <IconSymbol name={icon} size={18} color={'black'} />
            <Text>{label}</Text>
        </Pressable>
  )
}

export default FilterMenuOption