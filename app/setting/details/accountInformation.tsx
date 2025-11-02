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
import { updateUserEmail, updateUserUsername } from '@/services/appwriteAccount'
import AlertModal from '@/components/AlertModal'

// Allows users to change profile picture, username, and email
const accountInformation = () => {

    const theme = useThemeColor({}, 'text');
    const {username, email, password, updateEmail, updateUsername} = useAuthStore();

    // Error and validity state for the form 
    const [invalid, setInvalid] = useState(false);
    const [error, setError] = useState("");

    // Value and validity state for username 
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [usernameInput, setUsernameInput] = useState(username);
    
    // Value and validity state for email 
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [emailInput, setEmailInput] = useState(email);

    // Confirmation Modal
    const [alertModal, setAlertModal] = useState(true);

    const handleConfirm = async () => {
        // Logic Checks
        const requiredFields = [
            { value: usernameInput, setInvalid: setUsernameInvalid },
            { value: emailInput, setInvalid: setEmailInvalid },
        ];

        let hasEmptyField = false;

        // Loops through all fields to check if empty --> show error if true
        requiredFields.forEach(({ value, setInvalid }) => {
            if (!value.trim()) {
                setInvalid(true);
                hasEmptyField = true;
            }
        });

        // Makes sure all fields are entered
        if (hasEmptyField) {
            setInvalid(true);
            setError("All fields are required.");
            return;
        }

        if(emailInput===email && usernameInput===username) {
            setAlertModal(true);

        } else {

            if(emailInput!==email){
                // Change Email
                try {

                    const response = await updateUserEmail(emailInput, password);

                    updateEmail(emailInput);
                    
                    console.log("email changed");

                } catch (error:any) {

                    if(error.code === 400 && error.message.includes('Invalid `email` param:')) {
                        setInvalid(true);
                        setEmailInvalid(true);
                        setError("Please enter a valid email address.")
                    } else {
                        setInvalid(true);
                        setError("An unexpected error occured.")
                    }

                    console.log(error)
                    console.log(error.code)
                    console.log(error.message)
                }
            }

            if(usernameInput!==username) {
                // Change Username
                try {

                    const response = await updateUserUsername(usernameInput);

                    updateUsername(usernameInput);
                    
                    console.log("username changed");

                } catch (error:any) {

                    if(error.code === 400 && error.message.includes('Invalid `username` param:')) {
                        setInvalid(true);
                        setUsernameInvalid(true);
                        setError("Please enter a valid username.")
                    } else {
                        setInvalid(true);
                        setError("An unexpected error occured.")
                    }

                    console.log(error)
                    console.log(error.code)
                    console.log(error.message)
                }
            }

            setAlertModal(true);

        }
    }
    
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
                                <InputField placeholder={emailInput} value={emailInput} className='bg-slate-50' 
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
                        <Button action='positive' className='flex-1' onPressIn={haptic()} onPress={() => handleConfirm()}>
                            <ButtonText>Confirm</ButtonText>
                        </Button>  
                    </View>
                    
                </View>
            </View>

        </View>
        <AlertModal modalOpened={alertModal} confirmFunction={() => {router.back()}} setModalOpened={setAlertModal} />
    </ThemedView>
  )
}

export default accountInformation