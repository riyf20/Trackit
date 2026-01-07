import { View, Platform, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/utils/authStore';
import ToastAlert from './ToastAlert';


// Dynamic header for main tab pages
const Header = ({parent}:HeaderProps) => {

    const {updateContractCard, contractCardCompact, logsCardCompact, updateLogsCard, theme} = useAuthStore()

    // Pressed state for the setting icon at header [redirects to systems setting page]
    const [iconPressed, setIconPressed] = useState(false);  

    // Gives visual and haptic feedback when pressing the settings icon
    const handleIconPressed = () => {
        setIconPressed(true)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Header's title 
    const [title, setTitle] = useState(parent)

    // View of the contract cards
    const [compact, setCompact] = useState(parent==='Contracts' ? contractCardCompact : parent==='Logs' ? logsCardCompact : true);
    const [detailed, setDetailed] = useState(parent==='Contracts' ? !contractCardCompact : parent==='Logs' ? !logsCardCompact : false);

    const [activeView, setActiveView] = useState( (contractCardCompact) || (logsCardCompact) ? 'compact' : 'detailed')

    // Effect handler for contract card view
    const handleCompactSwitch = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCompact(true);
        setDetailed(false);
        setActiveView('compact')
    }
    const handleDetailedSwitch = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setDetailed(true);
        setCompact(false);
        setActiveView('detailed')
    }

    // Makes sure to save the card preferance
    useEffect(() => {
        
        if (parent==='Contracts') {
            updateContractCard(compact);
        } else if (parent==='Logs') {
            updateLogsCard(compact)
        }
        // Stores only the truthy value of compact
    }, [compact, detailed])

  
    // TO DO: Animate compact/detailed button being switched
  return (

    isLiquidGlassAvailable() ? 
    
    <GlassView 
        style={{
        height: '13%',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        justifyContent: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden',
        // backgroundColor: '#ECEDEE'
        }}
        glassEffectStyle={'clear'}
    >
        <ThemedText type='title' className='items-left justify-start absolute ml-[30px] mt-[75px]'>{title}</ThemedText>
        
        <View className={`items-right justify-end absolute top-[74px] right-0 mr-[30px] border-2 border-transparent rounded-full p-[3px] ${iconPressed ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } `}>
        {parent === 'Account' ?
            <Pressable
                onPressIn={handleIconPressed}
                onPressOut={() => {setIconPressed(false)}}
                onPress={() => {router.push('/setting/systemSetting')}}
            >
                <IconSymbol name='gear' size={35} color={theme==='dark' ? 'white' : 'black'}/>
            </Pressable>

            : parent === 'Contracts' || parent==='Logs' ?
                <View className={`flex flex-row absolute top-[-4px] right-[0px] ${theme==='dark' ? 'bg-white/20' : 'bg-black/20'} py-[2px] px-[2px] gap-[4px] rounded-full`}>
                    <Pressable 
                        className={`border-2 border-transparent rounded-full p-[5px] ${compact ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } `}
                        onPress={handleCompactSwitch}    
                    >
                        <IconSymbol name={compact ? 'rectangle.fill' : 'rectangle'} size={28} color={theme==='dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Pressable 
                        className={`border-2 border-transparent rounded-full p-[5px] ${detailed ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } `}
                        onPress={handleDetailedSwitch}
                    >
                        <IconSymbol name={detailed ? 'rectangle.stack.fill' : 'rectangle.stack'} size={28} color={theme==='dark' ? 'white' : 'black'} style={{transform: [{rotate: '180deg'}]}}/>
                    </Pressable>
                    <ToastAlert parent={parent} card={activeView}/>
                </View>
            :
            <></>
        }
        </View> 
    </GlassView>
    :
    <BlurView
        intensity={30} 
        tint={`${theme==='dark' ? 'dark' : 'light'}`}
        className='h-[15%] absolute top-0 left-0 w-full flex justify-center rounded-b-3xl'
    >
        <ThemedText type='title' className='items-left justify-start absolute ml-[30px] mt-[75px]'>{title}</ThemedText>
        
        <View className={`items-right justify-end absolute top-[78px] right-0 mr-[30px] border-2 border-transparent rounded-full p-[3px] ${iconPressed ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } `}>
        {parent === 'Account' ?
            <Pressable
                onPressIn={handleIconPressed}
                onPressOut={() => {setIconPressed(false)}}
                onPress={() => {router.push('/setting/systemSetting')}}
            >
                <IconSymbol name='gear' size={35} color={theme==='dark' ? 'white' : 'black'}/>
            </Pressable>
            : parent === 'Contracts' || parent==='Logs' ?
                <View className={`flex flex-row absolute top-[-4px] right-[0px] ${theme==='dark' ? 'bg-white/20' : 'bg-black/20'}  py-[2px] px-[2px] gap-[4px] rounded-full`}>
                    <Pressable 
                        className={`border-2 border-transparent rounded-full p-[5px] ${compact ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } `}
                        onPress={handleCompactSwitch}    
                    >
                        <IconSymbol name={compact ? 'rectangle.fill' : 'rectangle'} size={28} color={theme==='dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Pressable 
                        className={`border-2 border-transparent rounded-full p-[5px] ${detailed ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } `}
                        onPress={handleDetailedSwitch}
                    >
                        <IconSymbol name={detailed ? 'rectangle.stack.fill' : 'rectangle.stack'} size={28} color={theme==='dark' ? 'white' : 'black'} style={{transform: [{rotate: '180deg'}]}}/>
                    </Pressable>
                    <ToastAlert parent={parent} card={activeView}/>
                </View>
            :
            <></>
        }
        </View> 
    </BlurView>
    
  )
}

export default Header


