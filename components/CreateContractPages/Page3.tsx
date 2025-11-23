import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { ThemedText } from '../themed-text'
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '../ui/icon-symbol';
import Animated, { FadeIn } from 'react-native-reanimated';

// [Create Contract | Page 3] - Allows users to select difficulty level // Only beginner is being tested for now
{/* TO DO: Implement higher difficuly tiers once testing is complete */}
const Page3 = () => {

    const theme = useThemeColor({}, 'text');

  return (
    <>
        <View className='w-[80%] items-center mt-[6%]'>
            <View className={`w-full py-[14px] px-[8px] items-center rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                {/* Difficulty level title */}
                <Animated.View entering={FadeIn.duration(800)}>
                    <ThemedText type='onboardingMain' lightColor='limegreen' darkColor='limegreen' className='ml-[4px]'>Beginner</ThemedText>
                </Animated.View>
                <Animated.View entering={FadeIn.duration(800).delay(200)}>
                <ThemedText type='systemSettingSubtitle' lightColor='gray' darkColor='gray' className='ml-[4px]'>Self-paced, no penalties</ThemedText>
                </Animated.View>
            </View>
            <LinearGradient
                colors={['#06901C', '#248534', '#46784E', '#58725C', '#6A6A6A']}
                style={{width: '100%', display: 'flex', alignItems: 'center', height: 480, borderRadius: 12, top: -22, backgroundColor: theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'}}
                start={{x:-1, y:1}}
                end={{x:2, y:1}}
            >
                <View className='w-full mt-[22px]'>
                    
                    {/* Row 1 */}
                    <View className='flex-row items-center justify-evenly mt-[12px]'>
                        {/* Penalty */}
                        <View className='flex w-[44%]'>
                            <View className={`w-full py-[14px] px-[8px] items-center rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                                <ThemedText type='difficultyTitle' lightColor='white' className='ml-[4px]'>Penatly</ThemedText>
                            </View>
                            <View className={`w-full flex items-center h-[90px] rounded-xl top-[-22px] ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'} `}>
                                <View className='w-[90%] mt-[30px] items-center'>
                                    <IconSymbol name='nosign' size={24} color='white'/>
                                    <ThemedText type='difficultySubtitle' lightColor='white' className='ml-[4px] mt-[4px]'>None</ThemedText>
                                </View>
                            </View>
                        </View>

                        {/* Logs */}
                        <View className='flex w-[44%]'>
                            <View className={`w-full py-[14px] px-[8px] items-center rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                                <ThemedText type='difficultyTitle' lightColor='white' className='ml-[4px]'>Logs</ThemedText>
                            </View>
                            <View className={`w-full flex items-center h-[90px] rounded-xl top-[-22px] ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'} `}>
                                <View className='w-[90%] mt-[30px] items-center'>
                                    <View className='flex flex-row gap-2'>
                                        <IconSymbol name='camera' size={24} color='white'/>
                                        <IconSymbol name='textbox' size={24} color='white'/>
                                    </View>
                                    <ThemedText type='difficultySubtitle' lightColor='white' className='ml-[4px] mt-[4px]'>Optional</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Row 2 */}
                    <View className='flex-row items-center justify-evenly mt-[6px]'>
                        {/* Verification */}
                        <View className='flex w-[44%]'>
                            <View className={`w-full py-[14px] px-[8px] items-center rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                                <ThemedText type='difficultyTitle' lightColor='white' className='ml-[4px]'>Verification</ThemedText>
                            </View>
                            <View className={`w-full flex items-center h-[90px] rounded-xl top-[-22px] ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'} `}>
                                <View className='w-[90%] mt-[30px] items-center'>
                                    <IconSymbol name='person' size={24} color='white'/>
                                    <ThemedText type='difficultySubtitle' lightColor='white' className='ml-[4px] mt-[4px]'>Self-Check</ThemedText>
                                </View>
                            </View>
                        </View>
                        
                        {/* Late Logs */}
                        <View className='flex w-[44%]'>
                            <View className={`w-full py-[14px] px-[8px] items-center rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                                <ThemedText type='difficultyTitle' lightColor='white' className='ml-[4px]'>Late Logs</ThemedText>
                            </View>
                            <View className={`w-full flex items-center h-[90px] rounded-xl top-[-22px] ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'} `}>
                                <View className='w-[90%] mt-[30px] items-center'>
                                    <IconSymbol name='checkmark.circle' size={24} color='white'/>
                                    <ThemedText type='difficultySubtitle' lightColor='white' className='ml-[4px] mt-[4px]'>Allowed</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Row 3 */}
                    <View className='flex-row items-center justify-evenly mt-[6px]'>
                        <View className='flex w-[44%]'>
                            <View className={`w-full py-[14px] px-[8px] items-center rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                                <ThemedText type='difficultyTitle' lightColor='white' className='ml-[4px]'>Retries</ThemedText>
                            </View>
                            <View className={`w-full flex items-center h-[90px] rounded-xl top-[-22px] ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'} `}>
                                <View className='w-[90%] mt-[30px] items-center'>
                                    <IconSymbol name='arrow.2.circlepath' size={24} color='white'/>
                                    <ThemedText type='difficultySubtitle' lightColor='white' className='ml-[4px] mt-[4px]'>Unlimited</ThemedText>
                                </View>
                            </View>
                        </View>

                        <View className='flex w-[44%]'>
                            <View className={`w-full py-[14px] px-[8px] items-center rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                                <ThemedText type='difficultyTitle' lightColor='white' className='ml-[4px]'>Back-out</ThemedText>
                            </View>
                            <View className={`w-full flex items-center h-[90px] rounded-xl top-[-22px] ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'} `}>
                                <View className='w-[90%] mt-[30px] items-center'>
                                    <IconSymbol name='checkmark.circle' size={24} color='white'/>
                                    <ThemedText type='difficultySubtitle' lightColor='white' className='ml-[4px] mt-[4px]'>No Penalty</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </LinearGradient>
        </View>
        
        {/* Button bar to go back and forth levels */}
        <View className='flex justify-center items-center w-[80%]'>
            
            <View className={`flex flex-row items-center justify-between ${theme==='#ECEDEE' ? 'bg-white/60' : 'bg-black/40'} rounded-xl p-2 w-[80%]`}>
                <Pressable className='ml-[12px]'>
                    <IconSymbol name={'arrow.left.circle'} size={40} color={'gray'}/>
                </Pressable>

                <View className=''>
                    <Text className='text-[18px] font-bold w-[40px] text-center'>...</Text>
                    {/* TODO: Add pagination once other levels are made */}
                </View>

                <Pressable className='mr-[12px]'>
                    <IconSymbol name={'arrow.right.circle'} size={40} color={'black'}/>
                </Pressable>
            </View>

        </View>
    </>
  )
}

export default Page3