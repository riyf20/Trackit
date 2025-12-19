import { View, Text } from 'react-native'
import React from 'react'
import { ThemedText } from '../themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { BlurView } from 'expo-blur';

// [Create Contract | Page 4] - Review page of all contract information
const Page4 = ({selectedEmoji, habitName, frequency, count, duration, endDate}:Page4Props) => {

    const theme = useThemeColor({}, 'text');
    
  return (
    <View className='w-[80%] items-center mt-[6%]'>

        {/* Review and confirm title */}
        <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='#ECEDEE' ? 'bg-black' : 'bg-gray-600'} z-10`}>
            <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Review and Confirm</ThemedText>
        </View>

        {/* Row of all contract information */}
        <View className={`w-full flex items-center h-[300px] rounded-xl top-[-22px] ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-gray-400'} `}>
            <View className='w-[90%] mt-[40px]'>
                <ThemedText type='difficultyTitle'>Your habit and icon </ThemedText>
                    <View className='flex flex-row ml-[16px] my-[12px] gap-[12px] items-center '>

                        <View
                            className='overflow-hidden rounded-2xl'
                        >
                            <BlurView
                                intensity={100} 
                                tint={`${theme==='#ECEDEE' ? 'dark' : 'light'}`}
                                className='w-[50px] h-[50px] justify-center items-center'
                            >
                                <Text className='text-[28px]'>{selectedEmoji}</Text>
                            </BlurView>   
                        </View>
                            
                        <ThemedText>{habitName+ ' '}{frequency==='Weekly' ? count+'x/week' : 'daily'}</ThemedText>
                    </View>
                    

                <ThemedText type='difficultyTitle' >Your duration and end date</ThemedText>
                    <View className='flex ml-[16px] my-[12px] gap-[12px]'>
                        <ThemedText type='difficultyTitle'>Duration: <ThemedText type='difficultySubtitle'>{duration}</ThemedText></ThemedText>
                        <ThemedText type='difficultyTitle'>End Date: <ThemedText type='difficultySubtitle'>{endDate}</ThemedText></ThemedText>
                    </View>

                <ThemedText type='difficultyTitle' >Your difficulty</ThemedText>
                    <View className='flex ml-[16px] my-[12px]'>
                        <ThemedText type='difficultyTitle'>Difficulty: <ThemedText type='difficultySubtitle'>Beginner</ThemedText></ThemedText>
                    </View>
            </View>
        </View>
    </View> 
  )
}

export default Page4