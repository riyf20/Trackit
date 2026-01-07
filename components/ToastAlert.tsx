import { View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Toast, ToastTitle, useToast, Divider } from '@gluestack-ui/themed'
import { IconSymbol } from './ui/icon-symbol';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/utils/authStore';

// Dynamic alert message to inform users on specific changes
const ToastAlert = ({card, parent, show}:ToastAlertProps) => {  

    // Current possible parents [contractHeader ]

    const {theme} = useAuthStore()
    
    const toast = useToast();

    // Ensures that it wont display right as the app is opened
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current && (parent === 'Contracts' || parent === 'Logs' )) {
            isFirstRender.current = false 
            return;
        }
        if(parent==='createLogs' && show) {
            handleToast();
        } else if (parent==='Contracts' || parent==='Logs') {
            handleToast();
        }
    }, [card, show]);
    

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
                        {parent==='Contracts' || parent==='Logs' ?
                            <View className='overflow-hidden rounded-2xl w-full'>
                                <BlurView style={{display: 'flex', flexDirection: 'row', padding: 16, borderRadius: 20, gap: 6, width: '100%',}} intensity={theme==='dark' ? 20 : 14} tint={`${theme==='dark' ? 'light' : 'light'}`}>
                                    <IconSymbol name={card==='compact' ? 'rectangle' : 'rectangle.stack'} size={20} color={theme==='dark' ? 'white' : 'black'}/>
                                    
                                    <Divider
                                        orientation="vertical"
                                        className="h-[30px] bg-outline-200"
                                        style={{backgroundColor: theme==='dark' ? 'white' : 'black'}}
                                    />
                                    <ToastTitle size="sm" color={theme==='dark' ? 'white' : 'black'}>{parent} switched to {card} view</ToastTitle>
                                </BlurView>
                            </View>
                            : parent==='createLogs' ?
                            <View className='overflow-hidden rounded-2xl w-full'>
                                <BlurView style={{display: 'flex', flexDirection: 'row', padding: 16, borderRadius: 20, gap: 6, width: '100%',}} intensity={theme==='dark' ? 20 : 14} tint={`${theme==='dark' ? 'light' : 'light'}`}>
                                    <IconSymbol name={'photo.on.rectangle'} size={20} color={theme==='dark' ? 'white' : 'black'}/>
                                    
                                    <Divider
                                        orientation="vertical"
                                        className="h-[30px] bg-outline-200"
                                        style={{backgroundColor: theme==='dark' ? 'white' : 'black'}}
                                    />
                                    <ToastTitle size="sm" color={theme==='dark' ? 'white' : 'black'}>Media added</ToastTitle>
                                </BlurView>
                            </View>
                            : null    
                        }
                        
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