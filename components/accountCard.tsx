import { View, Image, Pressable, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { images } from '@/constants/images'
import { ThemedText } from '@/components/themed-text'
import { useAuthStore } from '@/utils/authStore';
import { router, useFocusEffect } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

// Account card component to show user data
const AccountCard = ({setExpanded}:AccountCardProps) => {

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
          <BlurView
            style={{borderRadius: 16, marginTop: 8, overflow: 'hidden'}}
          >
            <Pressable className='shadow-lg shadow-black/40' onPress={showInformation}>
              <Image
                source={basePicture ? images.profile : {uri: url}}
                className='w-[125px] h-[125px] rounded-full self-center my-[12px]'
                resizeMode="cover"
              />
              <ThemedText type='title' className='self-center my-[12px]'>{username}</ThemedText> 
            </Pressable>
          </BlurView>

        
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