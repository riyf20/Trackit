import { View, Text, Pressable, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, 
  withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import { Textarea, TextareaInput } from '@gluestack-ui/themed'
import { BlurView } from 'expo-blur'
import { IconSymbol } from '@/components/ui/icon-symbol'
import ContractSelector from '@/components/CreateLogComponents/ContractSelector'
import { format } from 'date-fns';
import { Button, ButtonText, Divider} from '@gluestack-ui/themed'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics';
import CreateConfirmationPage from '@/components/CreateConfirmationPage'
import Bottom from '@/components/Bottom'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from "expo-image-picker";
import { addUsersLogTable, updateUserLogCount, updateUserLogMediaArray } from '@/services/appwriteDatabase'
import { useAuthStore } from '@/utils/authStore'
import AlertModal from '@/components/AlertModal'
import { addUsersLogMedia } from '@/services/appwriteStorageWeb'
import SettingSwitch from '@/components/SettingSwitch'

// [Create Logs Page] - Users can submit log for specified contract
const createLog = () => {

  // On device variables
  const {theme, userId, hideOptional} = useAuthStore()

  const bottomRef = useRef<BottomSheetHandle>(null);
  
  // Notes input field
  const [notes, setNotes] = useState('')

  // State for actionsheet [user can select desired contract]
  const [contractSelectorOpen, setContractSelectorOpen] = useState(false)

  // Hold the specified contract
  const [selectedContract, setSelectedContract] = useState<ContractOption | null>(null)

  // Shows contracts name and count otherwise default
  const contractLabel = 
    selectedContract === null 
      ? 'Tap to select a contract'
      : `${selectedContract.Name} ${
            selectedContract.Count === 7 
              ? 'daily' 
              : selectedContract.Count + 'x/week' 
        }`

  // Shows associated streak count for selected contract
  const contractStreak = 
      selectedContract === null
      ? '----'
      : `${selectedContract.Streak}`

  // Shows todays date
  const currentDate = new Date();
  
  // TO DO: Allow for entering/submitted past dates 

  // Page/step of form
  const [page, setPage] = useState(1)

  // Overlay to dim background when imagepicker is open
  const [backdrop, setBackdrop] = useState(false)

  // Opens bottom and overlay
  const handleBottomSheet = () => {
    bottomRef.current?.open()
    setBackdrop(true)
  }

  // Closes bottom and overlay
  const handleCloseBottomSheet = () => {
    bottomRef.current?.close()
    setBackdrop(false)
  }

  // Holds user's selected media | thumbnail for video items
  const [selectedItems, setSelectedItems] = useState<ImagePicker.ImagePickerAsset[]>([])
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  
  // Counter for picture and video items
  const [pictureCount, setPictureCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  
  // Recalculates counts if items were changed
  useEffect(() => {
    let pics = 0
    let vids = 0
    selectedItems.forEach((asset) => {
      if(asset.type === 'image') {
        pics++
      } else if(asset.type === 'video') {
        vids++
      } 
    })
    setPictureCount(pics)
    setVideoCount(vids)
  },[selectedItems])

  // Animations for the `+1` next to streak
  const pulseOpacity = useSharedValue(0)
  const pulseScale = useSharedValue(0.8)
  
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [
      {scale: pulseScale.value},
    ]
  }));


  // Will trigger animation once contract is selected
  useEffect(() => {
    if (selectedContract !== null) {
      // Resets
      pulseOpacity.value = 0;
      pulseScale.value = 0.85;

      // Opacity loop
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400 }),
          withDelay(400, withTiming(0, { duration: 200 }))
        ),
        -1,
        false
      );

      // Scale loop
      pulseScale.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 12 }),
          withTiming(1.3, { duration: 200 })
        ),
        -1,
        false
      );

    } else {
      // Stops animation
      pulseOpacity.value = withTiming(0);
    }
  }, [selectedContract]);

  // Loading modal + state
  const [modal, setModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Submits the form
  const handleSubmitLog = async () => {
    try {
      // Will show loading modal
      setIsLoading(true)
      setModal(true)

      // Grabs date
      let date = currentDate.toISOString()

      // Submits the log
      const log = await addUsersLogTable(userId,selectedContract?.Id!, date, (selectedContract?.Streak! +1), notes, selectedItems.length, selectedContract?.Difficulty!)
      
      // Updates streak count for selected contract
      const update = await updateUserLogCount(selectedContract?.Id!, (selectedContract?.Streak! +1))

      // Will upload media if user selected any
      if(selectedItems.length > 0) {
        try {

          // Loops through the media array, adds them based on log's id created above, holds onto the id of uploaded media
          const media = await Promise.all(
            selectedItems.map(item => addUsersLogMedia(log.$id, item))
          )

          try {
            
            // Will update the log by storing the media[] of all the ids
            const resonseUpdate = await updateUserLogMediaArray(log.$id, media)

            // Closes modal and redirects to confirmation page (if there was media)
            setModal(false)
            setPage(3)

          } catch (error:any) {
            console.log("[createLog.tsx] : Error during mediaId[] update")
            console.log(error)
            console.log(error.message)
          }
          
        } catch (error:any) {
          console.log("[createLog.tsx] : Error during media upload")
          console.log(error)
          console.log(error.message)
        }
      }

      // Closes modal and redirects to confirmation page (no media)
      setModal(false)
      setPage(3)
    } catch (error:any) {
      console.log("[createLog.tsx] : Error during log submission")
      console.log(error)
      console.log(error.message)
    }
  }

  // TO DO: animate other fields in 
  // TO DO: add toggle to hide optional fields  
  return (
    <GestureHandlerRootView>
      
      <ThemedView className='flex flex-1 items-center '>

        {/* All input fields */}
        {page ===1 ?
          <ScrollView
            style={{
              width: '100%'
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              display: 'flex',
              alignItems: 'center',
              paddingBottom: selectedItems.length > 0 ? 120 : 0,
            }}
          >
              <View className='w-[80%] items-center mt-[6%] z-[0]'>
                  {/* First block | Contract Selector */}
                  <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='dark' ? 'bg-black' : 'bg-gray-600'} z-[1] `}>
                      <Animated.View entering={FadeIn.duration(1000)} >
                          <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Select Habit</ThemedText>
                      </Animated.View>
                      <TouchableOpacity onPress={() => {setContractSelectorOpen(true)}} style={{marginTop: 10, backgroundColor: 'dimgray', paddingHorizontal: 12, width: '96%', alignSelf: 'center', borderRadius: 20, height: 'auto', paddingVertical: 10}} >
                        <Animated.View entering={FadeIn.duration(1200)} className='flex flex-row items-center' >
                          <BlurView style={{width: 50, height: 50, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}} intensity={100} tint={`${theme==='dark' ? 'dark' : 'light'}`}>
                            {selectedContract!==null &&
                              <Text className='text-3xl'>{selectedContract.Icon}</Text>
                            }
                          </BlurView>
                          <ThemedText type='difficultyTitle' className='ml-[12px]' lightColor='white'>{contractLabel}</ThemedText>
                        </Animated.View>
                      </TouchableOpacity>
                      
                  </View>
                  {/* First block details | Log and streak counter */}
                  <Animated.View style={null} className={`w-full flex items-center rounded-xl top-[-22px] ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'}`}>
                      <Animated.View style={null} className='w-[90%] mt-[30px] p-[12px] gap-[4px]'>
                          <View className='flex flex-row'>
                            <ThemedText type='difficultyTitle' lightColor='white'>Log Date</ThemedText>
                            <ThemedText className='ml-auto' lightColor='white'>{format(new Date(currentDate), 'MMM dd, yyyy')}</ThemedText>
                          </View>
                          <View className='flex flex-row'>
                            <ThemedText type='difficultyTitle' lightColor='white'>Streak</ThemedText>
                            
                            < ThemedText className='ml-auto' lightColor='white'>
                              {contractStreak} 
                              
                              {selectedContract !== null &&
                                <Animated.Text style={[pulseStyle, {color: theme==='dark' ? 'lightgreen' : 'green', fontSize: 18}]} > +1</Animated.Text>
                              }
                            </ThemedText>
                            
                          </View>
                      </Animated.View>
                  </Animated.View>
              </View>
            
              {hideOptional ?
                <View className='w-[80%] items-center z-[0]'>
                  <View className={`flex ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'} w-full p-[16px] rounded-xl`}>
                    
                    <View className='flex-row bg-[slategray] p-[6px] gap-[6px] w-[50%] items-center justify-evenly rounded-2xl'>
                      <IconSymbol name={'text.alignleft'} size={32} color={'white'} />
                      <IconSymbol name={'photo.fill'} size={40} color={'white'} />
                      <IconSymbol name={'video.fill'} size={40} color={'white'} />
                    </View>

                    <ThemedText type='onboarding' lightColor='white' className='ml-[4px] mt-[8px]'>Optional Fields</ThemedText> 
                    <ThemedText type='systemSettingSubtitle' lightColor='gray' darkColor='lightgray' className='ml-[4px]'>Want to add notes or media? Turn on optional fields to add more detail to your logs.</ThemedText> 
                  

                    <Divider style={{backgroundColor: 'black', marginVertical: 12, height: 3, borderRadius: 10}} />

                    <SettingSwitch title={'Logs Optional Fields'} index={-1}/>
                  </View>
                  
                </View>
              :
              (<>
                <View className='w-[80%] items-center z-[0]'>
                  {/* Second block | Notes input field */}
                  <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='dark' ? 'bg-black' : 'bg-gray-600'} z-[1]`}>
                      <Animated.View entering={FadeIn.duration(1000)} >
                          <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Notes <ThemedText type='systemSettingSubtitle' darkColor='gray' lightColor='gray'>(Optional)</ThemedText> </ThemedText>
                      </Animated.View>
                  </View>

                  <Animated.View style={null} className={`w-full flex  rounded-xl top-[-22px] ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'} `}>
                      <Animated.View style={null} className='w-full mt-[20px] p-[16px] gap-[4px]'>
                        <Textarea
                          size='md' className=' bg-white/30 border-transparent' style={{borderRadius: 20, height: 80}}
                        >
                          <TextareaInput placeholder={"Add notes here..."} value={notes} className='bg-slate-50' style={{borderRadius: 18}}
                            onChangeText={(text) => {
                              setNotes(text);
                            }}
                          />
                        </Textarea>
                      </Animated.View>
                  </Animated.View>
                </View>
              
                <View className='w-[80%] items-center z-[0]'>
                    {/* Third block | Media field */}
                    <View className={`w-full py-[14px] px-[8px] items-start rounded-2xl ${theme==='dark' ? 'bg-black' : 'bg-gray-600'} z-[1]`}>
                        <Animated.View entering={FadeIn.duration(1000)} >
                            <ThemedText type='onboarding' lightColor='white' className='ml-[4px]'>Pictures | Videos <ThemedText type='systemSettingSubtitle' darkColor='gray' lightColor='gray'>(Optional)</ThemedText> </ThemedText>
                        </Animated.View>
                    </View>

                    <Animated.View style={null} className={`w-full flex  rounded-xl top-[-22px] ${theme==='dark' ? 'bg-white/20' : 'bg-gray-400'} `}>
                        
                        <Animated.View style={null} className='w-full mt-[20px] p-[12px] gap-[4px] items-center'>

                          {selectedItems.length > 0 &&
                            // Shows thumbnail view of selected media
                            <>
                              <ScrollView
                                horizontal={true}
                                style={{width: '100%' }}
                                contentContainerStyle={{gap: 12, marginLeft: 10}}
                                showsHorizontalScrollIndicator={false}
                              >
                                {selectedItems.map((item:ImagePicker.ImagePickerAsset, index:number) => (
                                  item.type==='image' ? (
                                    <Image
                                      source={{uri: item.uri}}
                                      className='w-[50px] h-[50px] rounded-xl '
                                      resizeMode="cover"
                                      key={item.assetId}
                                    />
                                  ) : (
                                    <View key={item.assetId}>
                                      <Image 
                                        source={{uri: videoThumbnails[item.uri]}} 
                                        className='w-[50px] h-[50px] rounded-xl '
                                        resizeMode="cover"
                                      />
                                      <View className="absolute inset-0 items-center justify-center bg-black/30 rounded-xl" >
                                        <IconSymbol name="play.circle.fill" size={20} color={'white'} />
                                      </View>
                                    </View>
                                      
                                  )
                                  ))}
                                </ScrollView>
                                <Divider style={{backgroundColor: 'black', marginVertical: 6, height: 3, borderRadius: 10}} />
                              </>
                            }
                            
                            <View className='flex flex-row justify-evenly w-full items-center'>                            
                              <View className='w-[50px] h-[50px] flex items-center justify-center bg-[dimgray] rounded-xl'>
                                <IconSymbol name={'photo.fill'} size={32} color={'white'} />
                              </View>
                              <ThemedText lightColor='white'>{pictureCount} {pictureCount > 1 || pictureCount === 0 ? 'Pictures' :  'Picture'}</ThemedText>
                              
                              <View className='w-[50px] h-[50px] flex items-center justify-center bg-[dimgray] rounded-xl'>
                                <IconSymbol name={'video.fill'} size={32} color={'white'} />
                              </View>
                              <ThemedText lightColor='white'>{videoCount} {videoCount > 1 || videoCount === 0 ? 'Videos' :  'Video'}</ThemedText>
                            </View>

                            <TouchableOpacity style={{width: '60%', height: 40, backgroundColor: '#0088FF', borderRadius: 10, marginVertical: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12}} onPress={() => {handleBottomSheet()}}>
                              <IconSymbol name={'plus.rectangle.fill.on.rectangle.fill'} size={32} color={'white'} />
                              <ThemedText lightColor='white'>Add Items</ThemedText>
                            </TouchableOpacity>
                            
                        </Animated.View>
                    </Animated.View>
                </View>
                </>)
              }
              <ContractSelector selectorOpen={contractSelectorOpen} setSelectorOpen={setContractSelectorOpen} setSelectedContract={setSelectedContract} />
          </ScrollView>
          :
          <CreateConfirmationPage parent={'Logs'} />
        }

        {/* Bottom buttons */}
        {page === 1 &&
          <View className='absolute bottom-[40px] w-[80%] flex flex-row'>
            <Button action='secondary' variant='outline' onPress={() => {router.back()}} onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}>
              <IconSymbol name='chevron.left' size={14} color={theme==='dark' ? 'white' : 'black'} />
              <ButtonText color={theme==='dark' ? 'white' : 'black'} className='ml-[6px]'>Cancel</ButtonText>
            </Button>

            <Button className='ml-auto' onPress={handleSubmitLog} action={'primary'} onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}} isDisabled={selectedContract===null}>
                <ButtonText className='mr-[6px]'>Submit</ButtonText>
            </Button>

          </View>
        }

        {/* Backdrop overlay + Bottom sheet component */}
        {backdrop && <Pressable className='absolute w-full h-full bg-black/40 z-[1]]' onPress={() => {handleCloseBottomSheet()}}/> }
        <Bottom ref={bottomRef} parent={'createLogs'} backdrop={setBackdrop} selectedItems={selectedItems} setSelectedItems={setSelectedItems} videoThumbnails={videoThumbnails} setVideoThumbnails={setVideoThumbnails} />

        {/* Loading modal */}
        <AlertModal modalOpened={modal} confirmFunction={() => {}} setModalOpened={setModal} isLoading={isLoading} />
      </ThemedView>
      
    </GestureHandlerRootView>
  )
}

export default createLog