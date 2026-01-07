import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '../themed-text'
import { Select, SelectTrigger, SelectInput, SelectIcon, 
    ChevronDownIcon, SelectPortal, SelectBackdrop, SelectContent, 
    SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@gluestack-ui/themed';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn } from 'react-native-reanimated';
import { addWeeks, addMonths, format } from 'date-fns';
import { useAuthStore } from '@/utils/authStore';

// [Create Contract | Page 2] - Allows users to set frequency, count, and duration
const Page2 = ({page, shown, frequency, setFrequency, count, setCount, duration, setDuration, endDate, setEndDate }:Page2Props) => {

    const {theme} = useAuthStore()

    // Min and Max limits for the counter
    const [minLimit, setMinLimit] = useState(true)
    const [maxLimit, setMaxLimit] = useState(false)

    // Ensures counter is valid
    useEffect(() => {
        if(count === 1) {
            setMinLimit(true)
            setMaxLimit(false)
        } else if (count === 6) {
            setMaxLimit(true)
            setMinLimit(false)
        } else {
            setMaxLimit(false)
            setMinLimit(false)
        }
    }, [count])

    // [Block 1 Animation variables]
    // Height of block underneath frequency title
    const block1 = useSharedValue(frequency==='Weekly' ? 180 : shown ? 100 : 0); // Weekly expands to show counter
    const block1Style = useAnimatedStyle(() => ({
        height: block1.value,
    }));
    // Opacity of frequency selector
    const block1Input = useSharedValue(shown ? 1 : 0);
    const block1InputStyle = useAnimatedStyle(() => ({
        opacity: block1Input.value,
    }));
    // Opacity of frequency counter if weekly was chosen
    const block1Count = useSharedValue(frequency==='Weekly' ? 1 : 0);
    const block1CountStyle = useAnimatedStyle(() => ({
        opacity: block1Count.value,
    }));


    // [Block 2 Animation variables]
    // Height of block underneath duration title
    const block2 = useSharedValue(shown ? 100 : 0);
    const block2Style = useAnimatedStyle(() => ({
        height: block2.value,
    }));
    // Opacity of duration selector
    const block2Input = useSharedValue(shown ? 1 : 0);
    const block2InputStyle = useAnimatedStyle(() => ({
        opacity: block2Input.value,
    }));

    // On first render will animate the heights and opacitys above 
    useEffect(() => {
        if(page === 2 && !shown){
           block1.value = withTiming(100, { duration: 800 }, (finished) => {
            setTimeout(() => {
                block1Input.value = withTiming(1, { duration: 600 })
            }, 600) 
        })
            block2.value = withTiming(100, { duration: 800 }, (finished) => {
                block2Input.value = withTiming(1, { duration: 400 })
            })
        }

    }, [])

    // Hides or shows the counter
    useEffect(() => {

        // Expands if weekly is chosen
        if(frequency==='Weekly'){
            block1.value = withTiming(180, { duration: 600 }, (finished) => {
                block1Count.value = withTiming(1, { duration: 400 })
            })
        } else {
            // Collapses to hide counter if daily is chosen
            block1Count.value = withTiming(0, { duration: 200 })
            block1.value = withTiming(100, { duration: 600 })
        }
    }, [frequency])

    // Expands duration block to show End Date
    useEffect(() => {
      if(duration.trim()) {
        block2.value = withTiming(120, { duration: 800 })
      }
    }, [duration])

    // Calculates end date once duration is selected
    useEffect(() => {
        if (!duration) return;

        const now = new Date();
        let date: Date | undefined;

        if (duration === "1 Week") {
            date = addWeeks(now, 1);
        } else if (duration === "1 Month") {
            date = addMonths(now, 1);
        } else if (duration === "3 Months") {
            date = addMonths(now, 3);
        }

        if(!date) return;
        // Formats and stores end date
        setEndDate(date.toISOString())
    }, [duration]);
    
    
  return (
    <>
        {/* Page 2 */}
        <View className='w-[80%] items-center mt-[6%]'>
            {/* First block | Habit frequency and counter */}
            <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='dark' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                <Animated.View entering={FadeIn.duration(1000)} >
                    <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Frequency</ThemedText>
                </Animated.View>
            </View>
            <Animated.View style={block1Style} className={`w-full flex items-center rounded-xl top-[-22px] ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'} `}>
                <View className='w-[90%] mt-[40px]'>
                    
                    <Animated.View style={block1InputStyle}>
                        <Select 
                            className='bg-gray-100 rounded-full'
                            selectedValue={frequency}
                            onValueChange={(value) => setFrequency(value)}
                        >
                            <SelectTrigger variant="outline" size="md" style={{borderRadius: 999}}>
                                <SelectInput placeholder="Select a Frequency" />
                                <SelectIcon style={{marginRight: 12}} className="mr-[3px]" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent className='pb-[75px] h-[200px]'>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label="Daily" value="Daily" />
                                    <SelectItem label="Weekly" value="Weekly" />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Animated.View>

                    <Animated.View style={block1CountStyle}>
                        <ThemedText type='settingSuboptions' className='mt-[18px]'>How many times a week?</ThemedText>

                        <View className='flex justify-center items-center'>
                            <View className='flex flex-row justify-center items-center bg-white rounded-xl p-2 mt-[6px] w-[40%]'>
                                <Pressable onPress={() => setCount(count-1)} disabled={minLimit}>
                                    <Text className={`text-[18px] px-3 ${minLimit && 'text-gray-300' }`}>{'−'}</Text>
                                </Pressable>

                                <Text className='text-[18px] font-bold w-[40px] text-center'>{count}</Text>

                                <Pressable onPress={() => setCount(count+1)} disabled={maxLimit} >
                                    <Text className={`text-[18px] px-3 ${maxLimit && 'text-gray-300' }`}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>

                </View>
            </Animated.View>
        </View>
        
        <View className='w-[80%] items-center mt-[6%]'>
            {/* Second block | Habit Duration and selector */}
            <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='dark' ? 'bg-black' : 'bg-gray-600'} z-10`}>
                <Animated.View entering={FadeIn.duration(1000)}>
                    <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Contract Duration</ThemedText>
                </Animated.View>
            </View>
            <Animated.View style={block2Style} className={`w-full flex items-center rounded-xl top-[-22px] ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'} `}>
                <Animated.View style={block2InputStyle} className='w-[90%] mt-[40px]'>
                    <Select 
                        className='bg-gray-100 rounded-full'
                        selectedValue={duration}
                        onValueChange={(value) => setDuration(value)}
                    >
                        <SelectTrigger variant="outline" size="md" style={{borderRadius: 999}}>
                            <SelectInput placeholder="Select a Duration" />
                            <SelectIcon style={{marginRight: 12}} as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent className='pb-[75px] h-[200px]'>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectItem label="1 Week" value="1 Week" isDisabled={frequency==='Weekly'}/>
                                <SelectItem label="1 Month" value="1 Month" />
                                <SelectItem label="3 Months" value="3 Months" />
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                    {/* Animated end date */}
                    { endDate &&
                        <Animated.View entering={FadeIn.delay(400).duration(400)}>
                            <ThemedText className='mt-[6px] ml-[6px]' type='defaultSemiBold'>Est. End Date: <ThemedText type='subtitle'>{format(new Date(endDate), 'MMM dd, yyyy')}</ThemedText></ThemedText>
                        </Animated.View>
                    }
                </Animated.View>
            </Animated.View>
        </View> 
    </>
  )
}

export default Page2