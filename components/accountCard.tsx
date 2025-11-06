import { View, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '@/constants/images'
import { ThemedText } from '@/components/themed-text'
import { useAuthStore } from '@/utils/authStore';
import { getUserProfilePicture } from '@/services/appwriteStorage';
import { router, useFocusEffect } from 'expo-router';
import { getItem } from 'expo-secure-store';
// May switch to glassview later on
// import { GlassView } from 'expo-glass-effect';

// Account card component to show user data
const AccountCard = () => {

  const {username, profilePictureFileId, profilePictureFileUrl, defaultPicture, getDefaultPicture, getProfileFileId, getProfileFileUrl} = useAuthStore()
  //

  const[id, setId] = useState<String | null>("")
  const[url, setUrl] = useState<String | null>("")

  const [basePicture, setBasePicture] = useState(true);

  useEffect(() => {
    if(!defaultPicture) {
      if(profilePictureFileId.trim() && profilePictureFileUrl.trim()) {
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
    
  return (
    <View className='w-[90%] shadow-lg shadow-black/40'>
        <View className='shadow-lg shadow-black/40'>
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
        </View>
        
        <View className='bg-slate-600 h-[125px] rounded-[16px] relative top-[-32px] -z-10 shadow-lg shadow-black/40'>
        {/* TO DO: Add the statistics section | make card fully behind then animate out*/}
        </View>
    </View>
  )
}

export default AccountCard