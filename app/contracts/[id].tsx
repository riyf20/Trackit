import { View, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/utils/authStore';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { ThemedView } from '@/components/themed-view';
import { Divider, Progress, ProgressFilledTrack } from '@gluestack-ui/themed';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import PercentageText from '@/components/PercentageText';
import { ThemedText } from '@/components/themed-text';
import ContractPill from '@/components/ContractPill';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import FilterMenuOption from '@/components/FilterMenuOption';
import { contractDetailsIcons } from '@/constants/icons';

// [Detailed Contract Page] - Users can view in depth view of a specific contract 
const ContractDetails = () => {

    // Grabs all contract information
    const {contractDetails, theme} = useAuthStore()

    // Can use for later implementation
    // const {id} = useLocalSearchParams();
    
    // Calculates contract's completion percentage
    let percentage = ((contractDetails!.Streak / contractDetails!.Total_Days)*100)

    const progress = useSharedValue(0);
    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    // TO DO: Alter progress bar animation to make it smooother
    // Animates the progress bar
    useEffect(() => {
        progress.value = withDelay(
            300,
            withTiming(100, { duration: 1600 })
        );
    }, [percentage]);

    // Pressed state for the options icon for the contract details section [opens overlay with settings]
    const [iconPressed, setIconPressed] = useState(false);  

    // Gives visual and haptic feedback when pressing the settings icon
    const handleIconPressed = () => {
        setIconPressed(true)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Options overlay state
    const [contractDetailsOpen, setContractDetailsOpen] = useState(false)
    
    // TO DO: implement edit contract function
    const editContract = () => {
        console.log("implement edit function")
    }

    // TO DO: implement renew contract function
    const renewContract = () => {
        console.log("implement renew function")
    }

    // TO DO: implement give up contract function
    const giveUpContract = () => {
        console.log("implement give up function")
    }

    return (
        <ThemedView className='flex w-full h-full relative'>
           
            {/* TO DO: Make overlay options be more informative */}
            {/* Used as overlay to ensure any other presses closes the filter window */}
            { (contractDetailsOpen) &&
                    <>
                        <Pressable
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 1,
                                width: '100%',
                                height: '100%',
                                backgroundColor:
                                theme === 'dark'
                                    ? 'rgba(0,0,0,0.3)'
                                    : 'rgba(0,0,0,0.2)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                setContractDetailsOpen(false)
                            }}
                        >
                            {/* Container to hold the options */}
                            {isLiquidGlassAvailable() ?
                                <GlassView
                                    style={{
                                        borderRadius: 14,
                                        paddingVertical: 6,
                                        minWidth: 180,
                                        backgroundColor: 'transparent',
                                        bottom: 50,
                                    }}
                                    isInteractive={true}
                                    tintColor={theme === 'dark' ? 'gray' : 'white'}
                                >
                                    {/* Option selections */}
                                    {contractDetails?.Difficulty === 'Beginner' && 
                                        <FilterMenuOption icon={contractDetailsIcons[1]} label={'Edit'} onPress={() => editContract()} active={false} setMenuOpen={setContractDetailsOpen} />
                                    }
                                    <FilterMenuOption icon={contractDetailsIcons[2]} label={'Renew'} onPress={() => renewContract()} active={false} setMenuOpen={setContractDetailsOpen} />
                                    <FilterMenuOption icon={contractDetailsIcons[3]} label={'Give Up'} onPress={() => giveUpContract()} active={false} setMenuOpen={setContractDetailsOpen} />
                                            
                                </GlassView>
                                :
                                <BlurView
                                    style={{
                                        borderRadius: 14,
                                        paddingVertical: 6,
                                        minWidth: 180,
                                        backgroundColor: 'transparent',
                                        bottom: 50,
                                        overflow: 'hidden'
                                    }}
                                    tint={theme === 'dark' ? 'light' : 'dark'}
                                >
                                    {/* Option selections */}
                                    {contractDetails?.Difficulty === 'Beginner' && 
                                        <FilterMenuOption icon={contractDetailsIcons[1]} label={'Edit'} onPress={() => editContract()} active={false} setMenuOpen={setContractDetailsOpen} />
                                    }
                                    <FilterMenuOption icon={contractDetailsIcons[2]} label={'Renew'} onPress={() => renewContract()} active={false} setMenuOpen={setContractDetailsOpen} />
                                    <FilterMenuOption icon={contractDetailsIcons[3]} label={'Give Up'} onPress={() => giveUpContract()} active={false} setMenuOpen={setContractDetailsOpen} />
                                            
                                </BlurView>
                            }
                        </Pressable>
                    </>
                }
                
            {/* Scrollview with all contract details */}
            <ScrollView 
                contentContainerStyle={{display: 'flex', width: '100%', marginTop: 20, alignItems: 'center', paddingBottom: 50,}}
            >

                {isLiquidGlassAvailable() ?
                    <>
                        <GlassView style={{width: '88%', height: 100, borderRadius: 18, alignItems: 'center', justifyContent: 'center', zIndex: 10}} tintColor={theme === "dark" ? 'black' : 'gray'}>
                            <Progress value={percentage} style={{width: '90%', height: 52, backgroundColor: theme==="dark" ? 'gray' : 'darkgray', justifyContent: 'center'}}>
                                <Animated.View style={progressStyle}>
                                    <ProgressFilledTrack style={{height: 60}} />
                                </Animated.View>

                                <PercentageText percentage={percentage} streak={contractDetails!.Streak} total={contractDetails!.Total_Days} />
                                
                            </Progress>
                        </GlassView>
                        <GlassView style={{width: '87%', borderRadius: 18, justifyContent: 'center', paddingBottom: 20, paddingTop: 50, top: -30}} tintColor={theme === "dark" ? '#0F0F0F' : 'darkgray'}>
                            
                            <View className='mx-[30px] flex gap-[10px]'>
                                <ContractPill parent='Streak' value={contractDetails?.Streak} />
                                {/* TO DO: add log and verification connection once implemented */}
                                <ContractPill parent='Log' value={'Submitted'} /> 
                                <ContractPill parent='Verification' value={'Pending'} />
                            </View>

                        </GlassView>
                        
                        <GlassView style={{width: '88%', borderRadius: 18, alignItems: 'center',justifyContent: 'center', zIndex: 10, padding: 20, display: 'flex', flexDirection: 'row', gap: 6}} tintColor={theme === "dark" ? 'black' : 'gray'}>
                            <IconSymbol name='doc.text' size={22} color={theme==='dark' ? 'black' : 'white'} />
                            <Divider
                                orientation="vertical"
                                style={{backgroundColor: theme==='dark' ? 'white' : 'black', height: '100%'}}
                            />
                            <ThemedText type='onboardingMain' style={{marginRight: 'auto'}} >Logs</ThemedText>
                        </GlassView>
                        <GlassView style={{width: '87%', borderRadius: 18, justifyContent: 'center', paddingBottom: 20, paddingTop: 50, top: -30}} tintColor={theme === "dark" ? '#0F0F0F' : 'darkgray'}>
                            
                            <View className='mx-[30px] flex gap-[10px]'>
                                <ThemedText>Add connection to log later...</ThemedText>
                            </View>

                        </GlassView>
                        
                        <GlassView style={{width: '88%', height: 'auto', borderRadius: 18, alignItems: 'center',justifyContent: 'center', zIndex: 10, padding: 20, display: 'flex', flexDirection: 'row', gap: 6}} tintColor={theme === "dark" ? 'black' : 'gray'}>
                            <IconSymbol name='list.bullet.rectangle' size={22} color={theme==='dark' ? 'black' : 'white'} />
                            <Divider
                                orientation="vertical"
                                style={{backgroundColor: theme==='dark' ? 'white' : 'black', height: '100%'}}
                            />
                            <ThemedText type='onboardingMain' style={{marginRight: 'auto'}} >Contract Details</ThemedText>
                            <View className={` border-2 border-transparent rounded-full p-[4px] ${iconPressed ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } ${contractDetailsOpen && 'z-100'}`}>
                                {/* TO DO: Make hitbox for the icon larger */}
                                <Pressable
                                    onPressIn={handleIconPressed}
                                    onPressOut={() => {setIconPressed(false)}}
                                    onPress={() => {setContractDetailsOpen(true)}}
                                >
                                    <IconSymbol name='ellipsis' size={22} color={theme==='dark' ? 'black' : 'white'} style={{transform: [{ rotate: '90deg' }]}} />
                                </Pressable>
                            </View>
                        </GlassView>
                        <GlassView style={{width: '87%', borderRadius: 18, justifyContent: 'center', paddingBottom: 20, paddingTop: 50, top: -30}} tintColor={theme === "dark" ? '#0F0F0F' : 'darkgray'}>
                            
                            <View className='mx-[30px] flex gap-[10px]'>
                                <ThemedText>Penatly: None</ThemedText>
                                <ThemedText>Verification: Self</ThemedText>
                                <ThemedText>Contract Dates: {format(new Date(contractDetails!.$createdAt), 'MMM dd')} - {format(new Date(contractDetails!.Expiration), 'MMM dd')}</ThemedText>
                                <ThemedText>Difficulty: {contractDetails?.Difficulty}</ThemedText>
                            </View>

                        </GlassView>
                    </>
                    :
                    <>
                        <BlurView style={{width: '88%', height: 100, borderRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 10}} tint={theme === "dark" ? 'dark' : 'dark'} intensity={theme === "dark" ? 100 : 30}>
                            <Progress value={percentage} style={{width: '90%', height: 52, backgroundColor: theme==="dark" ? 'gray' : 'darkgray', justifyContent: 'center'}}>
                                <Animated.View style={progressStyle}>
                                    <ProgressFilledTrack style={{height: 60}} />
                                </Animated.View>

                                {/* Dynamic text based on progress completion */}
                                <PercentageText percentage={percentage} streak={contractDetails!.Streak} total={contractDetails!.Total_Days} />
                                
                            </Progress>
                        </BlurView>
                        <BlurView style={{width: '87%', height: 'auto', borderRadius: 18, justifyContent: 'center', paddingBottom: 20, paddingTop: 50, top: -30, overflow: 'hidden'}} tint={theme === "dark" ? 'light' : 'dark'} intensity={theme === "dark" ? 30 : 40}>
                            
                            <View className='mx-[30px] flex gap-[10px]'>
                                <ContractPill parent='Streak' value={contractDetails?.Streak} />
                                {/* TO DO: add log and verification connection once implemented */}
                                <ContractPill parent='Log' value={'Submitted'} /> 
                                <ContractPill parent='Verification' value={'Pending'} />
                            </View>

                        </BlurView>
                        
                        <BlurView style={{width: '88%', borderRadius: 18, alignItems: 'center',justifyContent: 'center', zIndex: 10, padding: 20, display: 'flex', flexDirection: 'row', gap: 6, overflow: 'hidden'}} tint={theme === "dark" ? 'dark' : 'dark'} intensity={theme === "dark" ? 100 : 30}>
                            <IconSymbol name='doc.text' size={22} color={theme} />
                            <Divider
                                orientation="vertical"
                                style={{backgroundColor: theme==='dark' ? 'white' : 'black', height: '100%'}}
                            />
                            <ThemedText type='onboardingMain' style={{marginRight: 'auto'}} >Logs</ThemedText>
                        </BlurView>
                        <BlurView style={{width: '87%', borderRadius: 18, justifyContent: 'center', paddingBottom: 20, paddingTop: 50, top: -30, overflow: 'hidden'}} tint={theme === "dark" ? 'light' : 'dark'} intensity={theme === "dark" ? 30 : 40}>
                            
                            <View className='mx-[30px] flex gap-[10px]'>
                                <ThemedText>Add connection to log later...</ThemedText>
                            </View>

                        </BlurView>
                        
                        <BlurView style={{width: '88%', height: 'auto', borderRadius: 18, alignItems: 'center',justifyContent: 'center', zIndex: 10, padding: 20, display: 'flex', flexDirection: 'row', gap: 6, overflow:'hidden'}} tint={theme === "dark" ? 'dark' : 'dark'} intensity={theme === "dark" ? 100 : 30}>
                            <IconSymbol name='list.bullet.rectangle' size={22} color={theme==='dark' ? 'black' : 'white'} />
                            <Divider
                                orientation="vertical"
                                style={{backgroundColor: theme==='dark' ? 'white' : 'black', height: '100%'}}
                            />
                            <ThemedText type='onboardingMain' style={{marginRight: 'auto'}} >Contract Details</ThemedText>
                            <View className={` border-2 border-transparent rounded-full p-[4px] ${iconPressed ? (theme==='dark' ? 'bg-white/20' : 'bg-black/20') : 'bg-transparent' } ${contractDetailsOpen && 'z-100'}`}>
                                {/* TO DO: Make hitbox for the icon larger */}
                                <Pressable
                                    onPressIn={handleIconPressed}
                                    onPressOut={() => {setIconPressed(false)}}
                                    onPress={() => {setContractDetailsOpen(true)}}
                                >
                                    <IconSymbol name='ellipsis' size={22} color={theme==='dark' ? 'black' : 'white'} style={{transform: [{ rotate: '90deg' }]}} />
                                </Pressable>
                            </View>
                        </BlurView>
                        <BlurView style={{width: '87%', borderRadius: 18, justifyContent: 'center', paddingBottom: 20, paddingTop: 50, top: -30, overflow: 'hidden'}} tint={theme === "dark" ? 'light' : 'dark'} intensity={theme === "dark" ? 30 : 40}>
                            
                            <View className='mx-[30px] flex gap-[10px]'>
                                <ThemedText>Penatly: None</ThemedText>
                                <ThemedText>Penatly: None</ThemedText>
                                <ThemedText>Contract Dates: {format(new Date(contractDetails!.$createdAt), 'MMM dd')} - {format(new Date(contractDetails!.Expiration), 'MMM dd')}</ThemedText>
                                <ThemedText>Difficulty: {contractDetails?.Difficulty}</ThemedText>
                            </View>

                        </BlurView>
                    </>
                }
            </ScrollView>
                
        </ThemedView>
  )
}

export default ContractDetails