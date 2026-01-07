import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from './themed-text'
import { BlurView } from 'expo-blur'
import { Progress, ProgressFilledTrack } from '@gluestack-ui/themed'
import Animated, { FadeInDown, FadeOutUp, Layout, runOnJS, 
    useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useAuthStore } from '@/utils/authStore'
import PercentageText from './PercentageText'
import { IconSymbol } from './ui/icon-symbol'
import { router } from 'expo-router'

// Card view of user's contract
const ContractCard = ({contract}:ContractCardProps) => {

    // Preferance state compact/detailed view
    const {contractCardCompact, updateContractDetails, theme} = useAuthStore()

    // Computes percentage version of completion
    let percentage = ((contract.Streak / contract.Total_Days)*100)

    const progress = useSharedValue(0);
    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    useEffect(() => {
        progress.value = withDelay(
            300,
            withTiming(100, { duration: 1600 })
        );
    }, [percentage]);
    
    // Underlying Card Animation Variables
    // Y placement of card
    const card = useSharedValue(0);
    const cardStyle = useAnimatedStyle(() => ({
       transform: [
         { translateY: card.value }
       ],
    }));

    // Card's margin spacing (adjusts based on compact/detailed)
    const cardSpacing = useSharedValue(contractCardCompact ? 0 : 50);
    const cardSpacingStyle = useAnimatedStyle(() => ({
        marginBottom: withTiming(cardSpacing.value, { duration: 700 }),
    }));
    
    
    const compactSubsection = useSharedValue(contractCardCompact ? 1 : 0);
    const compactSubsectionStyle = useAnimatedStyle(() => ({
        opacity: compactSubsection.value,
    }));

    const compactData = useSharedValue(contractCardCompact ? 1 : 0);
    const compactDataStyle = useAnimatedStyle(() => ({
        opacity: compactData.value,
    }));

    const [expand, setExpand] = useState(contractCardCompact);
    
    // Expands or collapses based on user's preference | updates margin as well
    useEffect(() => {
        if(contractCardCompact) {
            card.value = withTiming(0, { duration: 700 });
            cardSpacing.value = 0;

            compactSubsection.value = withTiming(0, { duration: 350 })
            compactData.value = withTiming(0, {duration: 350}, (finished) => {
                runOnJS(setExpand)(true);
                compactSubsection.value = withTiming(1, { duration: 350 });
                compactData.value = withTiming(1, {duration: 750})
            });
        } else {
            card.value = withTiming(50, { duration: 700 });
            cardSpacing.value = 50;

            compactSubsection.value = withTiming(0, { duration: 350 })
            compactData.value = withTiming(0, {duration: 350}, (finished) => {
                runOnJS(setExpand)(false);
                compactSubsection.value = withTiming(1, { duration: 350 });
                compactData.value = withTiming(1, {duration: 750})
            });

        }
    }, [contractCardCompact])

    const handleContractTransfer = () => {
        updateContractDetails(contract)
        router.push(`/contracts/${contract.$id}`)
    }


  return (
        <TouchableOpacity style={{display: 'flex', width: '100%'}} onPress={() => handleContractTransfer()}>

            <Animated.View style={[{width: '88%', overflow: 'visible',}, cardSpacingStyle]} layout={Layout.springify()} entering={FadeInDown.duration(200)} exiting={FadeOutUp.duration(150)}>

                <BlurView style={{width: '100%', borderRadius: 20, marginBottom: 12, zIndex: 10, overflow: 'hidden', backgroundColor: theme === "dark" ? 'black' : 'slategray'}} tint={theme === "dark" ? 'dark' : 'light'} intensity={theme === "dark" ? 50 : 50}>
                    <View className='m-[20px] flex flex-row'>

                        <View
                            className='overflow-hidden rounded-2xl'
                        >
                            <BlurView
                                intensity={20} 
                                tint={`${theme==='dark' ? 'light' : 'dark'}`}
                                className='w-[50px] h-[50px] justify-center items-center'
                            >
                                <Text className='text-[28px]'>{contract.Habit_Icon}</Text>
                            </BlurView>   
                        </View>
                        
                        <View className='flex flex-1'>
                            <ThemedText className='ml-[12px]' type='onboardingMain' >{contract.Habit_Name} {contract.Frequency==='Daily' ? 'daily' : contract.Count+'x/Week' }</ThemedText>
                            
                            <Animated.View style={compactSubsectionStyle}>
                                {expand ? 
                                    <Animated.View  className='flex flex-row ml-[12px] mt-[2px]'>
                                        <ThemedText className='font-light' >Length: </ThemedText>
                                        <ThemedText className='font-thin' >{contract.Duration} | </ThemedText>
                                        <ThemedText className='font-light' >Difficulty: </ThemedText>
                                        <ThemedText className='font-thin' >{contract.Difficulty}</ThemedText>
                                    </Animated.View>
                                :
                                    <Animated.View className='ml-[12px] mt-[6px]'>
                                        <Progress value={percentage} style={{height: 14, backgroundColor: theme==="dark" ? 'gray' : 'darkgray'}}>
                                            <Animated.View style={progressStyle}>
                                                <ProgressFilledTrack style={{height: 18}} />
                                            </Animated.View>

                                            {/* Dynamic text based on progress completion */}
                                            {/* <PercentageText percentage={percentage} streak={contract.Streak} total={contract.Total_Days} /> */}
                                            
                                        </Progress>
                                    </Animated.View>
                                }
                            </Animated.View>
                        </View>
                    </View>

                    <Animated.View style={compactDataStyle} className='mx-[20px] mb-[20px] flex flex-row'>
                        {!expand ? 
                            <View className='w-full h-[26px] items-center justify-evenly'>

                                <View className='absolute flex flex-row gap-[10px]'>
                                    {/* TO DO: Add connection similar to contractPill to show dynamic information [do this after logs implementation] */}
                                    <View className='flex flex-row gap-[6px] p-[6px] px-[12px] bg-green-700 opacity-85 rounded-3xl items-center'>
                                        <IconSymbol name={'checkmark.circle'} size={22} color={theme==='dark' ? 'white' : 'black'}/>
                                        <ThemedText>Log: Sept 20</ThemedText>
                                    </View>
                                    <View className='flex flex-row gap-[6px] p-[6px] px-[12px] bg-yellow-800 opacity-85 rounded-3xl items-center'>
                                        <IconSymbol name={'hourglass'} size={22} color={theme==='dark' ? 'white' : 'black'}/>
                                        <ThemedText>Approval: Pending</ThemedText>
                                    </View>
                                </View>

                            </View>
                        :
                        
                            <Progress value={percentage} style={{width: '100%', height: 26, backgroundColor: theme==="dark" ? 'gray' : 'darkgray'}}>
                                <Animated.View style={progressStyle}>
                                    <ProgressFilledTrack style={{height: 30}} />
                                </Animated.View>

                                {/* Dynamic text based on progress completion */}
                                <PercentageText percentage={percentage} streak={contract.Streak} total={contract.Total_Days} />
                                
                            </Progress>
                        }
                    </Animated.View>

                </BlurView>

                <Animated.View style={cardStyle}>
                    {/* Underlying card details */}

                    <BlurView style={{width: '100%', borderRadius: 20, position: "absolute", top: -126, overflow: 'hidden'}} tint={theme === "dark" ? 'light' : 'dark'} intensity={30}>
                        <View className='flex flex-row items-center justify-center pt-[50px]'>

                            <View className='flex flex-row pt-[20px] pb-[10px]'>
                                <ThemedText className='font-medium' >Length: </ThemedText>
                                <ThemedText className='font-extralight' >{contract.Duration} | </ThemedText>
                                <ThemedText className='font-medium' >Difficulty: </ThemedText>
                                <ThemedText className='font-extralight' >{contract.Difficulty}</ThemedText>
                            </View>

                        </View>
                    </BlurView>
                </Animated.View>
            </Animated.View>

        </TouchableOpacity>
  )
}

export default ContractCard
