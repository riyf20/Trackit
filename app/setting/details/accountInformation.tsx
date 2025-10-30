import { View, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router'
import { AlertCircleIcon, Button, ButtonText, FormControl, 
    FormControlError, FormControlErrorIcon, FormControlErrorText, 
    Input, InputField } from '@gluestack-ui/themed'
import { images } from '@/constants/images'
import { useAuthStore } from '@/utils/authStore'
import { useHapticFeedback as haptic} from '@/components/HapticTab';

// Allows users to change profile picture, username, and email
const accountInformation = () => {

    const theme = useThemeColor({}, 'text');
    const {username, email} = useAuthStore();

    // Error and validity state for the form 
    const [invalid, setInvalid] = useState(false);
    const [error, setError] = useState("");

    // Value and validity state for username 
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [usernameInput, setUsernameInput] = useState(username);
    
    // Value and validity state for email 
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [emailInput, setEmailInput] = useState(email);
    
  return (
    <ThemedView className='flex-1'>
        
        <View className='h-full flex items-center'>

            <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit pb-[50px] mt-[12px] rounded-3xl items-center`} >
                
                {/* TO DO: Currently holds placeholder profile picture, allow for user inputted image */}
                <Image
                    source={images.profile}
                    className='w-[100px] h-[100px] rounded-full self-center my-[20px]'
                    resizeMode="cover"
                />

                <View className='mt-[12px] w-[86%]'>

                    <FormControl className='flex gap-[20px]' isInvalid={invalid}>

                        <View>
                            <ThemedText type='onboarding'>Profile Picture</ThemedText>
                            <Pressable className={`flex flex-row items-center mr-[6px] mt-[8px] bg-white p-2 rounded-3xl `}>
                                <ThemedText className='w-[88%] ml-[12px]' darkColor='black'>Change Profile Picture</ThemedText>
                                <IconSymbol name='chevron.right' size={16} color={theme}/>
                            </Pressable>
                        </View>

                        <View>
                            <ThemedText type='onboarding'>Username</ThemedText>
                            <Input
                                variant='rounded' size='md' className='mt-[8px] bg-white/30 border-transparent'
                            >
                                <InputField placeholder={usernameInput} value={usernameInput} className='bg-slate-50' 
                                    onChangeText={(text) => {
                                        setUsernameInput(text);
                                        setUsernameInvalid(false);
                                        setInvalid(false); 
                                    }}
                                />
                            </Input>
                        </View>

                        <View>
                            <ThemedText type='onboarding'>Email</ThemedText>
                            <Input
                                variant='rounded' size='md' className='mt-[8px] bg-white/30 border-transparent'
                            >
                                <InputField placeholder={email} value={email} className='bg-slate-50' 
                                    onChangeText={(text) => {
                                        setEmailInput(text);
                                        setEmailInvalid(false);
                                        setInvalid(false); 
                                    }}
                                />
                            </Input>
                        </View>

                        <FormControlError
                            className={`bg-red-300 rounded-3xl p-[2px] w-[96%] bottom-[10px] flex justify-center self-center`}
                        >
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>
                                {error}
                            </FormControlErrorText>
                        </FormControlError>

                    </FormControl>

                    <View className='mt-[24px] flex flex-row gap-4'>
                        <Button variant='solid' action='negative' className='flex-1' onPressIn={haptic()} onPress={() => router.back()}>
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button action='positive' className='flex-1'>
                            <ButtonText>Confirm</ButtonText>
                        </Button>  
                    </View>

                    {/* TO DO: work on making confirm button connect to appwrite */}
                    
                </View>
            </View>

        </View>
    </ThemedView>
  )
}

export default accountInformation