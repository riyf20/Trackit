import { View, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '@/constants/images'
import { ThemedText } from '@/components/themed-text'
import { useAuthStore } from '@/utils/authStore';
// May switch to glassview later on
// import { GlassView } from 'expo-glass-effect';

// Account card component to show user data
const AccountCard = () => {

  const {username} = useAuthStore()
    
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
              source={images.profile}
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