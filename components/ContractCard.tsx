import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { ThemedText } from './themed-text'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { BlurView } from 'expo-blur'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Progress, ProgressFilledTrack } from '@gluestack-ui/themed'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useAuthStore } from '@/utils/authStore'
import PercentageText from './PercentageText'

// Card view of user's contract
const ContractCard = ({contract}:ContractCardProps) => {

    // Preferance state compact/detailed view
    const {contractCardCompact} = useAuthStore()

    const theme = useThemeColor({}, 'text');

    // Computes percentage version of completion
    let percentage = ((contract.Streak / contract.Total_Days)*100)
    
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

    // Expands or collapses based on user's preference | updates margin as well
    useEffect(() => {
        if(contractCardCompact) {
            card.value = withTiming(0, { duration: 700 });
            cardSpacing.value = 0;
        } else {
            card.value = withTiming(50, { duration: 700 });
            cardSpacing.value = 50;
        }
    }, [contractCardCompact])

    
    
  return (
    <Animated.View style={cardSpacingStyle}>
        {/* Utilizes Liquid Glass if compatible otherwise Blurview */}
        {isLiquidGlassAvailable() ?
            <GlassView style={{width: '100%', borderRadius: 20, marginBottom: 12, zIndex: 10}} tintColor={theme === "#ECEDEE" ? 'black' : '#D9D9D9'}>
                <View className='m-[20px] flex flex-row'>
                    <GlassView 
                        style={{width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center'}}
                        tintColor={theme === "#ECEDEE" ? 'gray' : 'darkgray'}
                    >
                        <Text className='text-[28px]'>{contract.Habit_Icon}</Text>
                    </GlassView>

                    <View>
                        <ThemedText className='ml-[12px]' type='onboardingMain' >{contract.Habit_Name} {contract.Frequency==='Daily' ? 'daily' : contract.Count+'x/Week' }</ThemedText>
                        <View className='flex flex-row ml-[12px] mt-[2px]'>
                            <ThemedText className='font-light' >Length: </ThemedText>
                            <ThemedText className='font-thin' >{contract.Duration} | </ThemedText>
                            <ThemedText className='font-light' >Difficulty: </ThemedText>
                            <ThemedText className='font-thin' >{contract.Difficulty}</ThemedText>
                        </View>
                    </View>
                </View>

                <View className='mx-[20px] mb-[20px] flex flex-row'>
                    <Progress value={percentage} style={{width: '100%', height: 26, backgroundColor: theme==="#ECEDEE" ? 'gray' : 'darkgray'}}>
                        <ProgressFilledTrack style={{height: 30}} />

                        {/* Dynamic text based on progress completion */}
                        <PercentageText percentage={percentage} streak={contract.Streak} total={contract.Total_Days} />
                        
                    </Progress>
                </View>
            </GlassView>
        :
            <BlurView style={{width: '100%', borderRadius: 20, marginBottom: 12, zIndex: 10, overflow: 'hidden'}} tint={theme === "#ECEDEE" ? 'dark' : 'light'} intensity={100}>
                <View className='m-[20px] flex flex-row'>

                    <View
                        className='overflow-hidden rounded-2xl'
                    >
                        <BlurView
                            intensity={20} 
                            tint={`${theme==='#ECEDEE' ? 'light' : 'dark'}`}
                            className='w-[50px] h-[50px] justify-center items-center'
                        >
                            <Text className='text-[28px]'>{contract.Habit_Icon}</Text>
                        </BlurView>   
                    </View>
                    
                    <View>
                        <ThemedText className='ml-[12px]' type='onboardingMain' >{contract.Habit_Name} {contract.Frequency==='Daily' ? 'daily' : contract.Count+'x/Week' }</ThemedText>
                        <View className='flex flex-row ml-[12px] mt-[2px]'>
                            <ThemedText className='font-light' >Length: </ThemedText>
                            <ThemedText className='font-thin' >{contract.Duration} | </ThemedText>
                            <ThemedText className='font-light' >Difficulty: </ThemedText>
                            <ThemedText className='font-thin' >{contract.Difficulty}</ThemedText>
                        </View>
                    </View>
                </View>

                <View className='mx-[20px] mb-[20px] flex flex-row'>
                    <Progress value={percentage} style={{width: '100%', height: 26, backgroundColor: theme==="#ECEDEE" ? 'gray' : 'darkgray'}}>
                        <ProgressFilledTrack style={{height: 30}} />
                        
                        {/* Dynamic text based on progress completion */}
                        <PercentageText percentage={percentage} streak={contract.Streak} total={contract.Total_Days} />

                    </Progress>
                </View>

            </BlurView>
        }

        <Animated.View style={cardStyle}>
            {/* Underlying card details */}
            {/* TO DO: Animate the text in */}
            {/* TO DO: Alter the other data to show different information (eg. log status/verification) */}

            {isLiquidGlassAvailable() ?
                <GlassView style={{width: '100%', borderRadius: 20, position: "absolute", top: -126}} tintColor={theme === "#ECEDEE" ? 'gray' : 'darkgray'}>
                    
                    <View className='flex flex-row items-center justify-center pt-[50px]'>

                        <View className='flex flex-row pt-[20px] pb-[10px]'>
                            <ThemedText className='font-medium' >Length: </ThemedText>
                            <ThemedText className='font-extralight' >{contract.Duration} | </ThemedText>
                            <ThemedText className='font-medium' >Difficulty: </ThemedText>
                            <ThemedText className='font-extralight' >{contract.Difficulty}</ThemedText>
                        </View>

                    </View>

                </GlassView>
            : 
                <BlurView style={{width: '100%', borderRadius: 20, position: "absolute", top: -126, overflow: 'hidden'}} tint={theme === "#ECEDEE" ? 'light' : 'dark'} intensity={30}>
                    <View className='flex flex-row items-center justify-center pt-[50px]'>

                        <View className='flex flex-row pt-[20px] pb-[10px]'>
                            <ThemedText className='font-medium' >Length: </ThemedText>
                            <ThemedText className='font-extralight' >{contract.Duration} | </ThemedText>
                            <ThemedText className='font-medium' >Difficulty: </ThemedText>
                            <ThemedText className='font-extralight' >{contract.Difficulty}</ThemedText>
                        </View>

                    </View>
                </BlurView>
            }
        </Animated.View>
    </Animated.View>
  )
}

export default ContractCard
