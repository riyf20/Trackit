import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Toast, ToastTitle, useToast, Button, ButtonText, Icon, Divider } from '@gluestack-ui/themed'
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BlurView } from 'expo-blur';

// Dynamic alert message to inform users on specific changes
const ToastAlert = ({card}:ToastAlertProps) => {  

    // Current possible parents [contractHeader ]

    const theme = useThemeColor({}, 'text');
    
    const toast = useToast();

    // Ensures that it wont display right as the app is opened
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleToast();
    }, [card]);
    

    const handleToast = () => {
        toast.show({
            placement: 'top',
            duration: 2500,
            // duration: null, used for debugging only
            render: ({ id }) => {
                const toastId = 'toast-' + id;
                return (
                    
                        <Toast
                            nativeID={toastId}
                            className="shadow-soft-1"
                            style={{borderRadius: 16, backgroundColor: 'transparent'}}
                        >
                            <View className='overflow-hidden rounded-2xl w-full'>
                                <BlurView style={{display: 'flex', flexDirection: 'row', padding: 16, borderRadius: 20, gap: 6, width: '100%',}} intensity={theme==='#ECEDEE' ? 20 : 14} tint={`${theme==='#ECEDEE' ? 'light' : 'light'}`}>
                                    <IconSymbol name={card==='compact' ? 'rectangle' : 'rectangle.stack'} size={20} color={theme==='#ECEDEE' ? 'white' : 'black'}/>
                                    
                                    <Divider
                                        orientation="vertical"
                                        className="h-[30px] bg-outline-200"
                                        style={{backgroundColor: theme==='#ECEDEE' ? 'white' : 'black'}}
                                    />
                                    <ToastTitle size="sm" color={theme==='#ECEDEE' ? 'white' : 'black'}>Switched to {card} view</ToastTitle>
                                </BlurView>
                            </View>
                            
                        </Toast>
                    
                );
            },
        })
    }
  
    return (
        <></>
    );

}

export default ToastAlert