import { View, Image, Pressable, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '@/constants/images'
import { ThemedText } from '@/components/themed-text'
import { useAuthStore } from '@/utils/authStore';
import { router, useFocusEffect } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';

// Account card component to show user data
const AccountCard = ({setExpanded}:AccountCardProps) => {

  // Checks OS version to use compatible components
  const iosVersion = Platform.Version;
  const iosVersionNumber = typeof iosVersion === 'string' ? parseInt(iosVersion, 10) : iosVersion;
  const [useGlass, setUseGlass] = useState(typeof iosVersionNumber === 'number' && iosVersionNumber >= 26);

  // Saved state variables
  const {username, profilePictureFileId, profilePictureFileUrl, defaultPicture, getDefaultPicture, getProfileFileId, getProfileFileUrl} = useAuthStore()

  // Id and url of user
  const[id, setId] = useState<String | null>("")
  const[url, setUrl] = useState<String | null>("")

  // State is base picture should be used
  const [basePicture, setBasePicture] = useState(true);

  useEffect(() => {
    // Checks against stored data
    if(!defaultPicture) {
      // If user has a profile picture
      if(profilePictureFileId.trim() && profilePictureFileUrl.trim()) {

        // Sets the id and url of picture
        setId(profilePictureFileId)
        setUrl(profilePictureFileUrl)
        setBasePicture(false);
      } else {
        setBasePicture(true);
      }
    } else {
      setBasePicture(true);
    }

  }, [profilePictureFileId])


  // On focus will refresh data from device storage
  useFocusEffect(
    useCallback(() => {
      router.reload
      if(!getDefaultPicture()) {

        if(getProfileFileId().trim() && getProfileFileUrl().trim()) {
          setBasePicture(true);
          setId(getProfileFileId())
          setUrl(getProfileFileUrl())
          setBasePicture(false);
        } else {
          setBasePicture(true);
        }

      } else {
        setBasePicture(true)
      }

    }, [])
  );

  // Animation for statistics card 
  const information = useSharedValue(0);
  const informationStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: information.value }
    ],
  }));

  // State if card has expanded
  const [expand, setExpand] = useState(false);
  
  // Moves the card
  const showInformation = () => {
    if(expand) {
      information.value = withTiming(0, { duration: 700 });
    } else {
      information.value = withTiming(135, { duration: 700 });
    }
    setExpand(!expand);
    setExpanded(!expand);
  }
    
  return (
    <View className='w-[90%] shadow-lg shadow-black/40'>
        {/* Pressable for the stat card */}
        <Pressable className='shadow-lg shadow-black/40' onPress={showInformation}>
        
        {useGlass ?
          // Uses glass if on ios 26 
          <GlassView
            style={{borderRadius: 16, marginTop: 8,}}
          >
            <Image
              source={basePicture ? images.profile : {uri: url}}
              className='w-[125px] h-[125px] rounded-full self-center my-[12px]'
              resizeMode="cover"
            />
            <ThemedText type='title' className='self-center my-[12px]'>{username}</ThemedText> 
          </GlassView>

        :
          // Will use a gradient on other software
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={{borderRadius: 16, marginTop: 8,}}
            start={{x:0, y:1}}
            end={{x:1, y:0}}
          >
            <Image
              source={basePicture ? images.profile : {uri: url}}
              className='w-[125px] h-[125px] rounded-full self-center my-[12px]'
              resizeMode="cover"
            />
            <ThemedText type='title' className='self-center my-[12px]'>{username}</ThemedText> 
          </LinearGradient>
        }
        </Pressable>
        
        <Animated.View style={informationStyle} className='bg-slate-600 h-[44%] rounded-[16px] relative top-[-44%] -z-10 shadow-lg shadow-black/40'>

        </Animated.View>
        {/* TO DO: Add the statistics section */}
        {/* 
        <View className='bg-slate-600 h-[125px] rounded-[16px] relative top-[-32px] -z-10 shadow-lg shadow-black/40'>
        </View> 
        */}
    </View>
  )
}

export default AccountCard