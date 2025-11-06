import { View, Pressable, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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
import Bottom from '@/components/Bottom'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

// Allows users to change profile picture, username, and email
const accountInformation = () => {

    const theme = useThemeColor({}, 'text');

    const {username, email, password, updateEmail, updateUsername, 
        profilePictureFileId, profilePictureFileUrl, defaultPicture,
        getDefaultPicture, getProfileFileId, getProfileFileUrl
    } = useAuthStore();

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
            // If no changes were made but user hit save
            // No need to make api call
            setAlertModal(true);

        } else {

            // Email was changed
            if(emailInput!==email){
                try {

                    // Api call to change email
                    const response = await updateUserEmail(emailInput, password);

                    // Saves the changes on device 
                    updateEmail(emailInput);
                    
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

            // Username was changed
            if(usernameInput!==username) {
                try {

                    // Api call to change username
                    const response = await updateUserUsername(usernameInput);

                    // Saves the changes on device 
                    updateUsername(usernameInput);
                    
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

    const bottomRef = useRef<BottomSheetHandle>(null);

    const [pressed, setPressed] = useState(false);

    const handlePressed = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPressed(true)
    }

    const[url, setUrl] = useState<String | null>("")
    const [basePicture, setBasePicture] = useState(true);
    const [imageChanged, setImageChanged] = useState(false);
    
    // Depending on any changes will change picture
    useEffect(() => {
        if(!defaultPicture) {
        if(profilePictureFileId.trim() && profilePictureFileUrl.trim()) {
            setUrl(profilePictureFileUrl)
            setBasePicture(false);
        } else {
            setBasePicture(true);
        }
        } else {
        setBasePicture(true);
        }

    }, [profilePictureFileId, profilePictureFileUrl, imageChanged])

    useEffect(() => {
        if(!getDefaultPicture() || imageChanged) {
    
            if(getProfileFileId().trim() && getProfileFileUrl().trim()) {
            setUrl(getProfileFileUrl())
            setBasePicture(false);
            } else {
            setBasePicture(true);
            }

            } else {
            setBasePicture(true)
        }
    }, [imageChanged])



  return (
    <GestureHandlerRootView>
        <ThemedView className='flex-1'>
            
            <View className='h-full flex items-center'>

                <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit pb-[50px] mt-[12px] rounded-3xl items-center`} >
                    
                    <Image
                        source={basePicture ? images.profile : {uri: url}}
                        className='w-[100px] h-[100px] rounded-full self-center my-[20px]'
                        resizeMode="cover"
                    />

                    <View className='mt-[12px] w-[86%]'>

                        <FormControl className='flex gap-[20px]' isInvalid={invalid}>

                            <View>
                                <ThemedText type='onboarding'>Profile Picture</ThemedText>
                                <Pressable className={`flex flex-row items-center mr-[6px] mt-[8px] p-2 rounded-3xl ${pressed ? 'bg-white/70': 'bg-white/50'}`} 
                                    onPressIn={() => {handlePressed()}} onPressOut={() => setPressed(false)} onPress={() => {bottomRef.current?.open()}}
                                >
                                    <ThemedText className='w-[88%] ml-[12px]' darkColor='black' lightColor='white'>Change Profile Picture</ThemedText>
                                    <IconSymbol name='chevron.up' size={16} color={theme==='#ECEDEE' ? 'black' : 'white'}/>
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
            <AlertModal modalOpened={alertModal} confirmFunction={() => {router.back()}} setModalOpened={setAlertModal} isLoading={false} />
            <Bottom ref={bottomRef} parent={'profile'} altered={imageChanged} setAltered={setImageChanged}/>

        </ThemedView>
    </GestureHandlerRootView>
  )
}

export default accountInformation