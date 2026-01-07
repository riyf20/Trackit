import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ThemedText } from '../themed-text';
import { Input, InputField, Button, ButtonText } from '@gluestack-ui/themed';
import { IconSymbol } from '../ui/icon-symbol';
import EmojiPicker, { emojiData } from '@hiraku-ai/react-native-emoji-picker';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/utils/authStore';


// [Create Contract | Page 1] - Allows users to customize Habit name and icon
const Page1 = ({page, shown, habitName, setHabitName, selectedEmoji, setSelectedEmoji}:Page1Props) => {

    {/* TO DO: Message alerting users to make informative habit names */}
    const {theme} = useAuthStore()

    // Imported emoji picker component 
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

    // [Block 1 Animation variables]
    // Height of the block underneath habit name title
    const block1 = useSharedValue(shown ? 100 : 0);
    const block1Style = useAnimatedStyle(() => ({
        height: block1.value,
    }));
    // Opacity of the habit name input field
    const block1Input = useSharedValue(shown ? 1 : 0);
    const block1InputStyle = useAnimatedStyle(() => ({
        opacity: block1Input.value,
    }));

    // [Block 2 Animation variables]
    // Height of the block underneath habit icon title
    const block2 = useSharedValue(shown ? 200 : 0);
    const block2Style = useAnimatedStyle(() => ({
        height: block2.value,
    }));
    // Opacity of the Icon Square
    const block2Icon = useSharedValue(shown ? 1 : 0);
    const block2IconStyle = useAnimatedStyle(() => ({
        opacity: block2Icon.value,
    }));
    // Opacity of the edit button 
    const block2Button = useSharedValue(shown ? 1 : 0);
    const block2ButtonStyle = useAnimatedStyle(() => ({
        opacity: block2Button.value,
    }));


    // On the first render will animate the heights and opacitys above
    useEffect(() => {
        if(page === 1 && !shown){
            block1.value = withTiming(100, { duration: 800 }, (finished) => {
                block1Input.value = withTiming(1, { duration: 600 })
            })
            block2.value = withTiming(200, { duration: 800 }, (finished) => {
                block2Icon.value = withTiming(1, { duration: 600 })
                block2Button.value = withTiming(1, { duration: 800 })
            })
        }

    }, [])

  return (
    <>
        {/* Page 1  */}
        <View className='w-[80%] items-center mt-[6%]'>
            {/* First block | Habit name and input field */}
            <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='dark' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                <Animated.View entering={FadeIn.duration(1000)} >
                    <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Your Habit</ThemedText>
                </Animated.View>
            </View>
            <Animated.View style={block1Style} className={`w-full flex items-center rounded-xl top-[-22px] ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'} `}>
                <Animated.View style={block1InputStyle} className='w-[90%] mt-[30px]'>
                    <Input
                        variant='rounded' size='md' className='mt-[8px] bg-white/30 border-transparent'
                    >
                        <InputField placeholder={"Ex. Go to the gym"} value={habitName} className='bg-slate-50' 
                        onChangeText={(text) => {
                            setHabitName(text);
                        }}
                        />
                    </Input>
                </Animated.View>
            </Animated.View>
        </View>
        
        <View className='w-[80%] items-center mt-[6%]'>
            {/* Second block | Habit icon and edit button */}
            <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='dark' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                <Animated.View entering={FadeIn.duration(1200)} >
                    <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Your Habit Icon</ThemedText>
                </Animated.View>
            </View>
            <Animated.View style={block2Style} className={`w-full flex items-center rounded-xl top-[-22px] ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'} `}>
                <View className='w-[90%] mt-[40px] flex items-center justify-center'>
                    <Animated.View style={block2IconStyle}>

                        <View className='w-[75px] h-[75px] rounded-2xl justify-center items-center overflow-hidden'>
                            <BlurView
                                intensity={100} 
                                tint={`${theme==='dark' ? 'dark' : 'light'}`}
                                className='flex flex-1 h-full w-full items-center justify-center'
                            >
                                <Text className='text-[48px]'>{selectedEmoji}</Text>
                            </BlurView>
                        </View>

                    </Animated.View>
                    <Animated.View style={block2ButtonStyle}>
                        <Button className='mt-[12px] flex gap-[2px]' onPress={() => setEmojiPickerVisible(true)} onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>
                            <IconSymbol name={'square.and.pencil'} size={22} color={'white'}/>
                            <ButtonText>Edit</ButtonText>
                        </Button>
                    </Animated.View>
                    {/* TO DO: Optimize picker opening to improve performance */}
                    {/* Edit button triggers EmojiPicker component */}
                    <EmojiPicker
                        onEmojiSelect={(emoji) => {
                            setSelectedEmoji(emoji);
                            setEmojiPickerVisible(false);
                        }}
                        emojis={emojiData}
                        visible={isEmojiPickerVisible}
                        onClose={() => setEmojiPickerVisible(false)}
                        showHistoryTab={false}
                        showSearchBar={true}
                        showTabs={false}
                        darkMode={theme==='dark' ? true : false}
                    />
                </View>
            </Animated.View>
        </View>
    </>
  )
}

export default Page1