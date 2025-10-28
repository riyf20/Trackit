import { View, Text, Button, Pressable, Image, ScrollView } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/utils/authStore'
import { logOutUser } from '@/services/appwriteAccount'
import AccountCard from '@/components/accountCard'
import { BlurView } from 'expo-blur';


const account = () => {

  // Debug switch
  const debug = false;

  const theme = useThemeColor({}, 'text');
  const {logOut, username, password, email, sessionID} = useAuthStore();

  // Deletes session and logs out
  const handleLogOutUser = async () => {

    try {

      const response = await logOutUser(sessionID);

      // Debugging purposes
      debug && console.log(response)

      logOut()
      
    } catch (error:any) {
      
      {/* TO DO: add a modal indicating error message */}
      console.log(error)
      console.log(error.code)
      console.log(error.message)

    }
  }

  return (
    
    <ThemedView className='h-full flex '>

      {/* Scrollview of setting and user data */}
      <ScrollView 
        contentContainerStyle={{paddingBottom: 125, marginTop: 120,}}
      >

        {/* Account card component */}
        <View
          className="flex h-[fit] items-center mt-[10px]"
        > 
          <AccountCard/>
        </View>

        {/* List of other settings */}
        <View className='w-[90%] self-center'>
          <ThemedText type='settingSubheading'>Account Details</ThemedText>
          <View className={`p-[8px] rounded-[16px] my-[12px] flex gap-6 py-[20px] backdrop-blur-md shadow-lg shadow-black/40  ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/20'} `}>
            <Pressable className='flex flex-row items-center mr-[6px]'><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >Change Account Information</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
            <Pressable className='flex flex-row items-center mr-[6px]'><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >Change Password</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
          </View>
          
          <ThemedText type='settingSubheading'>Friends and Social</ThemedText>
          <View className={`p-[8px] rounded-[16px] my-[12px] flex gap-6 py-[20px] backdrop-blur-md shadow-lg shadow-black/40  ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/20'} `}>
            <Pressable className='flex flex-row items-center mr-[6px]'><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >Friends List</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
            <Pressable className='flex flex-row items-center mr-[6px]'><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >Add Friends</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
            <Pressable className='flex flex-row items-center mr-[6px]'><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >Your Invites</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
          </View>
          
          <ThemedText type='settingSubheading'>Contracts and Progress</ThemedText>
          <View className={`p-[8px] rounded-[16px] my-[12px] flex gap-6 py-[20px] backdrop-blur-md shadow-lg shadow-black/40  ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/20'} `}>
            <Pressable className='flex flex-row items-center mr-[6px]'><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >Achievements</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
            <Pressable className='flex flex-row items-center mr-[6px]'><ThemedText className='ml-[16px] flex-1 ' type='settingSuboptions' >Lifetime Stats</ThemedText><IconSymbol name='chevron.right' size={16} color={'gray'}/></Pressable>
          </View>

        </View>

      </ScrollView>


      {/* Account header with more settings button (placed at bottom so scrollview renders and can be view beneath blurview) */}
      <BlurView 
        intensity={20} 
        tint={`${theme==='#ECEDEE' ? 'dark' : 'light'}`}
        className='h-[13%] absolute top-0 left-0 w-full flex justify-center'
      >
        <ThemedText type='title' className='items-left justify-start absolute ml-[30px] mt-[75px]'>Account</ThemedText>
        
        <View className='items-right justify-end absolute top-[75px] right-0 mr-[30px]'>
          {/* TO DO: add another detailed settings page for app settings and logging out */}
          <Pressable
            onPress={() => {handleLogOutUser()}}
          >
            <IconSymbol name='gear' size={35} color={theme}/>
          </Pressable>
        </View> 
      </BlurView>


    </ThemedView>
    

  )
}

export default account