import { View, Text } from 'react-native'
import React from 'react'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { ThemedText } from './themed-text'
import { IconSymbol } from './ui/icon-symbol'
import { Button, ButtonText} from '@gluestack-ui/themed'
import { useAuthStore } from '@/utils/authStore'


const CreateConfirmationPage = ({parent}:CreateConfirmationPageProps) => {

    const {theme} = useAuthStore()
        
  return (
    <View className='flex h-[70%] justify-center items-center'>
        <Animated.View entering={FadeIn.springify().duration(1200)}>
            {/* Confirmation modal */}
                <View className='overflow-hidden rounded-2xl'>
                    <BlurView
                        className='flex p-[28px]'
                        intensity={20} 
                        tint={`${theme==='dark' ? 'light' : 'dark'}`}
                    >
                        <Animated.View entering={FadeInUp.springify().duration(1400)}>
                            <ThemedText type="title" className="mb-[12px]">{parent==='Logs' ? 'Good Job!' : 'Congratulations!'}</ThemedText>
                        </Animated.View>

                        <Animated.View entering={FadeIn.springify().delay(150).duration(1600)}>
                            <ThemedText type="defaultSemiBold" darkColor="gray" lightColor='gray'>
                                {parent==='Logs' ? 'Each log entered is one step closer.' : 'The new you is one step closer.'}
                            </ThemedText>
                        </Animated.View>

                        <Animated.View entering={FadeIn.springify().delay(300).duration(1800)}>
                            <ThemedText type="defaultSemiBold" darkColor="gray" lightColor='gray'>
                               {parent==='Logs' ? "Keep the streak going!" :  "Let's get started!"}
                            </ThemedText>
                        </Animated.View>
                    </BlurView>
                </View>
        </Animated.View>
        {/* Button redirecting to contracts page */}
        <Animated.View entering={FadeInDown.springify().delay(1600).duration(800)}>
            <Button className='mt-[24px] flex gap-[10px]' onPress={() => {router.back()}}>
                <IconSymbol name='chevron.left' size={16} color={theme==='dark' ? 'white' : 'black'}/>
                <ButtonText color={theme==='dark' ? 'white' : 'black'} >{parent}</ButtonText>
            </Button>
        </Animated.View>
    </View>
  )
}

export default CreateConfirmationPage