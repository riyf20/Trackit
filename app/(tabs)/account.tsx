import { View, Pressable, ScrollView, Platform, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color';
import AccountCard from '@/components/AccountCard'
import { router, useFocusEffect } from 'expo-router'
import { details, detailsRoutes, social, socialRoutes, 
  progress, progressRoutes } from '@/constants/settings'
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useAuthStore } from '@/utils/authStore'
import { getUserById } from '@/services/appwriteDatabase'
import Header from '@/components/Header'

// [Account Tab] - User settings page
const account = () => {
  
  // On device variables
  const { userId, updateInvitescount, invitesCount } = useAuthStore();

  // Used to check if glass view (ios 26) can be used
  const iosVersion = Platform.Version;
  const iosVersionNumber = typeof iosVersion === 'string' ? parseInt(iosVersion, 10) : iosVersion;
  const [useGlass, setUseGlass] = useState(typeof iosVersionNumber === 'number' && iosVersionNumber >= 26);

  // Debug switch
  const debug = false;

  const theme = useThemeColor({}, 'text');

  // Used for account details section [details holds the title | detailsRoutes hold the linked pages | these hold the pressed state]
  const [account1, setAccount1] = useState(false);
  const [account2, setAccount2] = useState(false);

  const detailsStates = [account1, account2]
  const detailsStatesSetter = [setAccount1, setAccount2]

  // Used for friends and social section [social holds the title | socialRoutes hold the linked pages | these hold the pressed state]
  const [social1, setSocial1] = useState(false);
  const [social2, setSocial2] = useState(false);
  const [social3, setSocial3] = useState(false);

  const socialStates = [social1, social2, social3]
  const socialStatesSetter = [setSocial1, setSocial2, setSocial3]

  // Used for achievments and stats section [progress holds the title | progressRoutes holds the linked pages | these hold the pressed state]
  const [progress1, setProgress1] = useState(false);
  const [progress2, setProgress2] = useState(false);

  const progressStates = [progress1, progress2]
  const progressStatesSetter = [setProgress1, setProgress2]

  // Pressed state for the setting icon at header [redirects to systems setting page]
  const [iconPressed, setIconPressed] = useState(false);  

  // Gives visual and haptic feedback when pressing the settings icon
  const handleIconPressed = () => {
    setIconPressed(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  // State to hold if card was expanded
  const [expanded, setExpanded] = useState(false);

  // Animation variables to move page down if card was expanded
  const fullPage = useSharedValue(0);
  
  const fullPageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: fullPage.value }
    ],
  }));
  
  useEffect(() => {
    if(expanded){
      // Moves page down
      fullPage.value = withTiming(120, { duration: 700 });
    } else {
      // Resets
      fullPage.value = withTiming(0, { duration: 700 });
    }
  }, [expanded])

  // Number of invites user has
  const [numberOfInvites, setNumberOfInvites] = useState(0);
    
  // Fetches number of invites from database
  const fetchData = async () => {
    try {
      const response = await getUserById(userId);

      const inviteArray = (response.Invites || []);
      if(inviteArray.length > 0) {
        setNumberOfInvites(inviteArray.length)
      }

    } catch (error: any) {
      console.log("Error fetching user's invites");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateInvitescount(numberOfInvites);
  }, [numberOfInvites])

  // On focus will refresh data from device storage
  useFocusEffect(
    useCallback(() => {
      router.reload
      fetchData();
    }, [])
  );
    
  return (

    <ThemedView className='h-full flex flex-1 w-full'>

      {/* Scrollview of setting and user data */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: expanded ? 575 : 450, 
          marginTop: 120,}}
      >

        {/* TO DO: Implement a refetch once page is loaded back (refreshing user data) */}
        {/* Account card component */}
        <View
          className="flex h-[fit] items-center mt-[20px] mb-[-70%]"
        > 
          <AccountCard setExpanded={setExpanded} />
        </View>

        {/* List of other settings */}
        <Animated.View  style={fullPageStyle} className='w-[90%] self-center '>

          <ThemedText type='settingSubheading'>Account Details</ThemedText>
          {/* Maps over account details section [Title, Route, and pressed state] */}
          {details?.map((item:string, index) => (
            <View key={index} className={`p-[8px]  ${index==0 ? 'mt-[12px] rounded-t-[16px]' : index+1==details.length ? 'mb-[12px] rounded-b-[16px]' : ''} flex gap-6 py-[20px] backdrop-blur-md shadow-2xl shadow-black/90  ${theme==='#ECEDEE' ? `${detailsStates[index] ? 'bg-white/20' : 'bg-white/10'}` : `${detailsStates[index] ? 'bg-black/20' : 'bg-black/10'}`} `}>
              <Pressable className='flex flex-row items-center mr-[6px]' onPressIn={() => { detailsStatesSetter[index](true)} } onPressOut={() => {detailsStatesSetter[index](false)}} onPress={() => router.push(detailsRoutes[index] as any)}><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >{item}</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
            </View>
          ))}

          <ThemedText type='settingSubheading'>Friends and Social</ThemedText>
          {/* Maps over friends and social section [Title, Route, and pressed state] */}
          {social?.map((item:string, index) => (
            <View key={index} className={`p-[8px]  ${index==0 ? 'mt-[12px] rounded-t-[16px]' : index+1==social.length ? 'mb-[12px] rounded-b-[16px]' : ''} flex gap-6 py-[20px] backdrop-blur-md shadow-2xl shadow-black/40  ${theme==='#ECEDEE' ? `${socialStates[index] ? 'bg-white/20' : 'bg-white/10'}` : `${socialStates[index] ? 'bg-black/20' : 'bg-black/10'}`} `}>
              <Pressable className='flex flex-row items-center mr-[6px]' onPressIn={() => { socialStatesSetter[index](true)} } onPressOut={() => {socialStatesSetter[index](false)}} onPress={() => router.push(socialRoutes[index] as any)}><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' > {item} </ThemedText>
              {index===2 && invitesCount > 0 &&
                <View className='absolute right-[30px] align-middle bg-red-500 p-2 rounded-full' />
              }
                <IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
            </View>
          ))}
          
          <ThemedText type='settingSubheading'>Contracts and Progress</ThemedText>
          {/* Maps over achievements and progress section [Title, Route, and pressed state] */}
          {progress?.map((item:string, index) => (
            <View key={index} className={`p-[8px]  ${index==0 ? 'mt-[12px] rounded-t-[16px]' : index+1==progress.length ? 'mb-[12px] rounded-b-[16px]' : ''} flex gap-6 py-[20px] backdrop-blur-md shadow-2xl shadow-black/40  ${theme==='#ECEDEE' ? `${progressStates[index] ? 'bg-white/20' : 'bg-white/10'}` : `${progressStates[index] ? 'bg-black/20' : 'bg-black/10'}`} `}>
              <Pressable className='flex flex-row items-center mr-[6px]' onPressIn={() => { progressStatesSetter[index](true)} } onPressOut={() => {progressStatesSetter[index](false)}} onPress={() => router.push(progressRoutes[index] as any)}><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >{item}</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
            </View>
          ))}

        </Animated.View>

      </ScrollView>

      <Header parent={'Account'} />

    </ThemedView>
    
  )
}

export default account