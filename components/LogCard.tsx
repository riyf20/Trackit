import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from './themed-text'
import { BlurView } from 'expo-blur'
import Animated, { FadeInDown, FadeOutUp, Layout, runOnJS, 
    useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useAuthStore } from '@/utils/authStore'
import { IconSymbol } from './ui/icon-symbol'
import { format } from 'date-fns'
import CircularProgress from 'react-native-circular-progress-indicator';
import { getUserPicture } from '@/services/appwriteStorage'
import { verificationIcons } from '@/constants/icons'


// Card view of user's contract
const LogCard = ({log, contract}: LogCardProps) => {

    // Preferance state compact/detailed view
    const { logsCardCompact, theme} = useAuthStore()

    // Computes percentage version of completion
    let percentage = ((log.Logged_Streak) / contract?.Total) * 100
    
    // Underlying Card Animation Variables
    const cardValueCompact = 
        (log.Notes.trim() && log.Media_Count > 0) || (log.Media_Count > 0) ? -80
            : log.Notes.trim() ? -50
            : 0

    const cardValueDetailed = 
        (log.Notes.trim() && log.Media_Count > 0) || (log.Notes.trim()) ? 20
            : log.Media_Count > 0 ? 30
            : 0

    const cardSpacingCompact = 0

    const cardSpacingDetailed = 
        log.Notes.trim() && log.Media_Count > 0 ? 170
            : log.Notes.trim() ? 70
            : log.Media_Count > 0 ? 110
            : 0
    
    // Y placement of card
    const card = useSharedValue(logsCardCompact ? cardValueCompact : cardValueDetailed);

    const cardScale = useSharedValue(logsCardCompact ? 0.2 : 1);

    // Y placement of card
    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: card.value},
            {scale: cardScale.value,}
       ],
    }));

    // Card's margin spacing (adjusts based on compact/detailed)
    const cardSpacing = useSharedValue(logsCardCompact ? cardSpacingCompact : cardSpacingDetailed);
    const cardSpacingStyle = useAnimatedStyle(() => ({
        marginBottom: withTiming(cardSpacing.value, { duration: 700 }),
    }));
    
    
    // Expands or collapses based on user's preference | updates margin as well
    useEffect(() => {

        if(log.Notes.trim() || log.Media_Count > 0) {
            if(logsCardCompact) {
     
                card.value = withTiming(cardValueCompact, { duration: 700 },);
                
                cardScale.value = withDelay(125, withTiming(0.4, {duration: 600}))
    
                cardSpacing.value = cardSpacingCompact;
                
            } else {
                cardScale.value = withTiming(1, {duration: 600})
                card.value = withTiming(cardValueDetailed, { duration: 700 });

                cardSpacing.value = cardSpacingDetailed;
            
            }
        }
    }, [logsCardCompact])

    const handleLogTransfer = () => {
        // updateContractDetails(contract)
        // router.push(`/contracts/${contract.$id}`)
        // TO DO: make dedicated log page 
        console.log("save to authstore and pass over")
    }

    // Streak variable
    const [streak, setStreak] = useState(-1)
    useEffect(() => {
      setStreak(log.Logged_Streak)
    }, [log.Logged_Streak])

    // Bar with media and notes icon
    const [showCompactBar, setShowCompactBar] = useState(logsCardCompact)

    const barOpacity = useSharedValue(1)
    const barStyle = useAnimatedStyle(() => ({
        opacity: barOpacity.value
    }))

    // Animates bar 
    useEffect(() => {
        barOpacity.value = withTiming(0, {duration: 250}, (finished) => {
            if(finished) {
                runOnJS(setShowCompactBar)(logsCardCompact)

                barOpacity.value = withDelay(50, withTiming(1, {duration: 300}))
            }
        })
    }, [logsCardCompact])

    // Links array for the log's images
    const [mediaLinks, setMediaLink] = useState<string[]>([])

    useEffect(() => {
      const links: string[] = log.Media_Ids
        .map((id:string) => (
            getUserPicture(id)
        ))

        setMediaLink(links)

    }, [log.Media_Ids])
    

  return (
        <TouchableOpacity style={{display: 'flex', width: '100%', alignItems: 'center'}} onPress={() => handleLogTransfer()} >

            <Animated.View style={[{width: '88%', overflow: 'visible'}, cardSpacingStyle]} layout={Layout.springify()} entering={FadeInDown.duration(200)} exiting={FadeOutUp.duration(150)}>

                <BlurView style={{width: '100%', borderRadius: 20, marginBottom: 12, zIndex: 10, overflow: 'hidden', backgroundColor: theme === "dark" ? 'black' : 'slategray'}} tint={theme === "dark" ? 'dark' : 'light'} intensity={theme === "dark" ? 50 : 50}>
                    <View className='m-[20px] flex flex-row '>

                        <View
                            className='overflow-hidden rounded-2xl'
                        >
                            <BlurView
                                intensity={20} 
                                tint={`${theme==='dark' ? 'light' : 'dark'}`}
                                className='w-[50px] h-[50px] justify-center items-center'
                            >
                                <Text className='text-[28px]'>{contract.Icon}</Text>
                            </BlurView>   
                        </View>
                        
                        <View className='flex flex-1 justify-center'>
                            <ThemedText className='ml-[12px]' type='onboardingMain' allowFontScaling={true} numberOfLines={2}>{contract.Name} {contract.Count === 7 ? 'daily' : contract.Count + 'x/week' }</ThemedText> 
                        </View>

                        <CircularProgress
                            value={percentage ?? 0}
                            radius={25}
                            activeStrokeWidth={8}
                            activeStrokeColor={'#6B4FA3'}
                            activeStrokeSecondaryColor={'#2465FD'}
                            inActiveStrokeColor={theme==='dark' ? 'black' : 'slategray'}
                            progressValueFontSize={14}
                            progressValueColor={theme==='dark' ? 'white' : 'black'}
                            allowFontScaling
                            progressFormatter={() => {
                                'worklet';
                                return `${streak}`
                            }}

                        />
                    </View>

                    <Animated.View style={barStyle} className='mx-[20px] mb-[20px]' >
                        {showCompactBar ? 
                            <View className='flex flex-row justify-evenly gap-[8px]'>
                                <View className='flex-1 border-2 border-green-800 bg-green-700 py-[4px] px-[12px] rounded-2xl flex-row gap-[8px] items-center justify-center'>
                                    <IconSymbol name={verificationIcons.approved} size={24} color={theme==='dark' ? 'white' : 'black'} />
                                    <ThemedText>
                                        {!log.Notes.trim() && log.Media_Count === 0 ? `Submitted ${format(new Date(log.Logged_Date), 'EEEE • MMM d')}` : format(new Date(log.Logged_Date), 'MMM dd')}
                                    </ThemedText>
                                </View>
                                
                                {log.Notes.trim()  &&
                                    <View className={`flex-1 border-[1px] ${theme==='dark' ? 'border-white bg-white/10' : 'border-gray bg-black/20'}  py-[4px] px-[12px] rounded-2xl flex-row gap-[8px] items-center justify-center`}>
                                        <IconSymbol name={'text.alignleft'} size={24} color={theme==='dark' ? 'white' : 'black'} />
                                        <ThemedText>
                                            Notes
                                        </ThemedText>
                                    </View>
                                }
                                {log.Media_Count > 0  &&
                                    <View className='flex-1 border-[1px] border-blue-400 bg-blue-600 py-[4px] px-[12px] rounded-2xl flex-row gap-[8px] items-center justify-center'>
                                        <IconSymbol name={'photo.fill'} size={24} color={theme==='dark' ? 'white' : 'black'} />
                                        <ThemedText>
                                            Media
                                        </ThemedText>
                                    </View>
                                }
                                {/* 
                                // TO DO: link to live data
                                //Styling for Pending and rejected icons
                                <View className='border-2 border-yellow-800 bg-yellow-700 py-[4px] px-[12px] rounded-2xl flex-row gap-[8px] items-center justify-center'>
                                    <IconSymbol name={verificationIcons.pending} size={20} color={'white'} />
                                    <ThemedText>
                                        {format(new Date(log.Logged_Date), 'MMM dd')}
                                    </ThemedText>
                                </View>
                                <View className='border-2 border-red-800 bg-red-700 py-[4px] px-[12px] rounded-2xl flex-row gap-[8px] items-center justify-center'>
                                    <IconSymbol name={verificationIcons.rejected} size={20} color={'white'} />
                                    <ThemedText>
                                        {format(new Date(log.Logged_Date), 'MMM dd')}
                                    </ThemedText>
                                </View> */}
                            </View>
                        :
                            <View className='flex flex-row justify-around gap-[8px]'>
                                <View className='flex-1 border-2 border-green-800 bg-green-700 py-[4px] px-[12px] rounded-2xl flex-row gap-[8px] items-center justify-center'>
                                    <IconSymbol name={verificationIcons.approved} size={24} color={'white'} />
                                    <ThemedText>
                                        Submitted: {format(new Date(log.Logged_Date), 'EEEE • MMM d')}
                                    </ThemedText>
                                </View>
                            </View>
                        }
                    </Animated.View>



                </BlurView>

                {/* Underlying card details */}
                {(log.Notes.trim() || log.Media_Count > 0) &&
                    <Animated.View style={cardStyle}>

                        <BlurView style={{width: '100%', borderRadius: 20, position: "absolute", top: -76, overflow: 'hidden'}} tint={theme === "dark" ? 'light' : 'dark'} intensity={30}>
                            <View className='flex flex-col items-center justify-center pt-[50px]'>

                                {log.Notes.trim() &&
                                    <View className='flex flex-row pt-[10px] w-[88%] pb-[20px]'>
                                        <ThemedText numberOfLines={2} ellipsizeMode='tail' type='subtitle'>{log.Notes}</ThemedText>
                                    </View>
                                }

                                {log.Media_Count > 0 &&
                                    <View className='flex flex-row w-[88%] pb-[20px]'>
                                        {mediaLinks.map((item:string, index:number) => (
                                                                                    
                                            (
                                                index < 4 ?
                                                    (<Image
                                                        source={{uri: item}}
                                                        className={`w-[75px] h-[75px] rounded-3xl`}
                                                        style={{
                                                            marginLeft: index === 0 ? 0 : -22
                                                        }}
                                                        resizeMode="cover"
                                                        key={index}
                                                    />)
                                                : index === 4 ?
                                                    
                                                    <View
                                                        className='w-[75px] h-[75px] rounded-3xl ml-[-22] bg-black items-center justify-center'
                                                        key={index}
                                                    >
                                                        <ThemedText type='title' lightColor='white'>+ {mediaLinks.length - 4}</ThemedText>
                                                    </View>
                                                : null
                                            )

                                        ))}
                                    </View>
                                }

                                
                            </View>
                        </BlurView>
                    </Animated.View>
                }

            </Animated.View>

        </TouchableOpacity>
  )
}

export default LogCard
