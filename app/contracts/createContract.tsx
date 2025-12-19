import { View} from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Button, ButtonText} from '@gluestack-ui/themed'
import { useThemeColor } from '@/hooks/use-theme-color'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { router } from 'expo-router'
import Page1 from '@/components/CreateContractPages/Page1'
import Page2 from '@/components/CreateContractPages/Page2'
import Page3 from '@/components/CreateContractPages/Page3'
import Page4 from '@/components/CreateContractPages/Page4'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'
import { useAuthStore } from '@/utils/authStore'
import { addUserContract } from '@/services/appwriteDatabase'
import * as Haptics from 'expo-haptics';


{/* TO DO: Add modal confirming if users hit back button (at top) or cancel if they want to lose changes */}
// [Create Contract Page] - Users can make new habit contracts
const createContract = () => {

    // On device variables
    const {username, userId} = useAuthStore()

    const theme = useThemeColor({}, 'text');
    
    // Page/step of the form
    const [page, setPage] = useState(1);

    // Moves to next page
    const handleContinue = () => {
        if(page === 5) {
            return
        } else{
            setPage(page+1)
        }
    }
    
    // States if the page was shown or not | Used for animations
    const [page1Shown, setPage1Shown] = useState(false);
    const [page2Shown, setPage2Shown] = useState(false);

    // Changes the shown state
    useEffect(() => {
        if(page===1) {
            setPage1Shown(true)
        } else if(page===2) {
            setPage2Shown(true)
        } 
    }, [page])

    
    // Page 1 data variables
    const [habitName, setHabitName] = useState('')
    const [selectedEmoji, setSelectedEmoji] = useState('');
    
    // Page 2 data variables
    const [frequency, setFrequency] = useState('');
    const [count, setCount] = useState(1);
    const [duration, setDuration] = useState('')
    const [endDate, setEndDate] = useState('')
    
    // Disables continue button if all fields were not entered
    const [page1Disabled, setPage1Disabled] = useState(true);
    const [page2Disabled, setPage2Disabled] = useState(true);

    // Checks all fields of page 1 and disables if not filled
    useEffect(() => {
      if(!habitName.trim() || !selectedEmoji.trim()) {
        setPage1Disabled(true)
      } else if (habitName.trim() && selectedEmoji.trim()) {
        setPage1Disabled(false);
      }
    }, [habitName, selectedEmoji])

    // Checks all fields of page 2 and disables if not filled
    useEffect(() => {
      if(!frequency.trim() || !duration.trim()) {
        setPage2Disabled(true)
      } else if (frequency.trim() && duration.trim()) {
        setPage2Disabled(false);
      }
    }, [frequency, duration])


    // Checks and submits the new form
    const handleSubmit = async () => {

        // Calculates total days of contract
        let totalDays = frequency==='Weekly' ? count : 7;

        if(duration==='1 Month') {
            totalDays *=4
        } else if (duration==='3 Months') {
            totalDays *=12
        }
       
        try {
            const response = await addUserContract(
                username, userId, habitName, selectedEmoji, 
                frequency, frequency==='Weekly' ? count : 7, duration, endDate, 'Beginner',
                totalDays
            )
            
            // Page 5 is a confirmation page | Redirects to the homepage
            setPage(5)
        } catch (error:any) {
            console.log("[createContract.tsx] : Error during contract submission")
            console.log(error)
            console.log(error.message)
        }

    }
    
  return (
    <ThemedView
      className='h-full flex flex-1 items-center'
    >
        {/* All pages and their variables linked as props */}
        {page===1 ? 
            <Page1 page={page} shown={page1Shown} habitName={habitName} setHabitName={setHabitName} selectedEmoji={selectedEmoji} setSelectedEmoji={setSelectedEmoji}/>
        : page===2 ? 
            <Page2 page={page} shown={page2Shown} frequency={frequency} setFrequency={setFrequency} count={count} setCount={setCount} duration={duration} setDuration={setDuration} endDate={endDate} setEndDate={setEndDate} />
        : page===3 ?
            <Page3 />
        : page===4 ?
            <Page4 selectedEmoji={selectedEmoji} habitName={habitName} frequency={frequency} count={count} duration={duration} endDate={endDate} />
        : page===5 ?
        
            <View className='flex h-[70%] justify-center items-center'>
                <Animated.View entering={FadeIn.springify().duration(1200)}>
                    {/* Confirmation modal | Renders Liquid Glass is compatible otherwise Blurview */}
                        <View className='overflow-hidden rounded-2xl'>
                            <BlurView
                                className='flex p-[28px]'
                                intensity={20} 
                                tint={`${theme==='#ECEDEE' ? 'light' : 'dark'}`}
                            >
                                <Animated.View entering={FadeInUp.springify().duration(1400)}>
                                    <ThemedText type="title" className="mb-[12px]">Congratulations!</ThemedText>
                                </Animated.View>

                                <Animated.View entering={FadeIn.springify().delay(150).duration(1600)}>
                                    <ThemedText type="defaultSemiBold" darkColor="gray">
                                        The new you is one step closer.
                                    </ThemedText>
                                </Animated.View>

                                <Animated.View entering={FadeIn.springify().delay(300).duration(1800)}>
                                    <ThemedText type="defaultSemiBold" darkColor="gray">
                                        Let's get started!
                                    </ThemedText>
                                </Animated.View>
                            </BlurView>
                        </View>
                </Animated.View>
                {/* Button redirecting to contracts page */}
                <Animated.View entering={FadeInDown.springify().delay(1600).duration(800)}>
                    <Button className='mt-[24px] flex gap-[10px]' onPress={() => {router.back()}}>
                        <IconSymbol name='chevron.left' size={16} color={'white'}/>
                        <ButtonText>Contracts</ButtonText>
                    </Button>
                </Animated.View>
            </View>
        : 
        <></>
        
        }
         
        {page!==5 &&

        <>
            {/* Pagination for all pages 1-4 */}
            <View className=' absolute bottom-[100px] w-[80%] flex flex-row h-[6px] justify-between'>
                <View className={`${page>=1 ? 'bg-[#0088FF]' : 'bg-[#686868]'} w-[20%] h-full rounded-full`}/>
                <View className={`${page>=2 ? 'bg-[#0088FF]' : 'bg-[#686868]'} w-[20%] h-full rounded-full`}/>
                <View className={`${page>=3 ? 'bg-[#0088FF]' : 'bg-[#686868]'} w-[20%] h-full rounded-full`}/>
                <View className={`${page>=4 ? 'bg-[#0088FF]' : 'bg-[#686868]'} w-[20%] h-full rounded-full`}/>
            </View>        

            {/* Bottom buttons */}
            <View className='absolute bottom-[40px] w-[80%] flex flex-row'>
                {page===1 ? 
                    // Page 1 renders 'Cancel' | Goes back to contracts page
                    <Button action='secondary' variant='outline' onPress={() => {router.back()}} onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>
                        <IconSymbol name='chevron.left' size={14} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                        <ButtonText color={theme==='#ECEDEE' ? 'white' : 'black'} className='ml-[6px]'>Cancel</ButtonText>
                    </Button>
                    :
                    // Page 2-4 renders 'Back' | Goes back a page
                    <Button action='secondary' variant='outline' onPress={() => {setPage(page-1)}} onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>
                        <IconSymbol name='chevron.left' size={14} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                        <ButtonText color={theme==='#ECEDEE' ? 'white' : 'black'} className='ml-[6px]'>Back</ButtonText>
                    </Button>
                }
                {page===4 ? 
                    // Page 4 renders 'Submit' | Sends contract to backend
                    <Button className='ml-auto' onPress={handleSubmit} action={'primary'} onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>
                        <ButtonText className='mr-[6px]'  >Submit</ButtonText>
                    </Button>
                :
                    // Page 1-3 renders 'Continue' |  Goes to next page if not disabled
                    <Button 
                        className='ml-auto' onPress={handleContinue} disabled={page===1 ? (page1Disabled) : page===2 ? (page2Disabled) : false} action={ (page===1 && page1Disabled) || (page===2 && page2Disabled) ? 'secondary' : 'primary'}
                        onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
                    >
                        <ButtonText className='mr-[6px]'  >Continue</ButtonText>
                        <IconSymbol name='chevron.right' size={14} color='white'/>
                    </Button>
                }
            </View>
        </>
        }

    </ThemedView>
  )
}

export default createContract
