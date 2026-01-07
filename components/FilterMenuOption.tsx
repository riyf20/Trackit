import { Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import * as Haptics from 'expo-haptics';
import { IconSymbol } from './ui/icon-symbol';

// Specific option for the filter menu
const FilterMenuOption = ({icon, label, onPress, active, setMenuOpen, logs, count}:FilterMenuOptionProps) => {

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
        {logs ?
            <Text className='text-3xl'>{icon}</Text>
        :
            <IconSymbol name={icon} size={22} color={'black'} />
        }
        <Text className='text-lg font-semibold'>{label} {logs && (count === 7 ? 'daily' : count + 'x/week' )}</Text>
    </Pressable>
  )
}

export default FilterMenuOption