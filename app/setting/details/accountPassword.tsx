import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color';
import { FormControl, Input, InputField, FormControlError, 
  FormControlErrorIcon, AlertCircleIcon, FormControlErrorText, 
  Button, ButtonText } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useAuthStore } from '@/utils/authStore';
import { useHapticFeedback as haptic} from '@/components/HapticTab';
import { updateUserPassword } from '@/services/appwriteAccount';
import AlertModal from '@/components/AlertModal';

// Allows users to change password
const accountPassword = () => {

  const theme = useThemeColor({}, 'text');

  const {password, updatePassword} = useAuthStore();
  
  // Error and validity state for the form 
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState("");  

  // Value and validity state for current password 
  const [previousPasswordInvalid, setPreviousPasswordInvalid] = useState(false);
  const [previousPassword, setPreviousPassword] = useState('');

  // Value and validity state for new password
  const [newPasswordInvalid, setNewPasswordInvalid] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Value and validity state for new password (user has to enter again)
  const [confirmNewPasswordInvalid, setConfirmNewPasswordInvalid] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Confirmation Modal
  const [alertModal, setAlertModal] = useState(false);

  const handleConfirm = async () => {
    // Logic Checks
    const requiredFields = [
      { value: previousPassword, setInvalid: setPreviousPasswordInvalid },
      { value: newPassword, setInvalid: setNewPasswordInvalid },
      { value: confirmNewPassword, setInvalid: setConfirmNewPasswordInvalid },
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

    if(previousPassword !== password) {
      setInvalid(true);
      setPreviousPasswordInvalid(true);
      setError("Current password is incorrect.");
      return;
    }

    if(newPassword !== confirmNewPassword) {
      setInvalid(true);
      setNewPasswordInvalid(true);
      setConfirmNewPasswordInvalid(true);
      setError("New password mismatch.");
      return;
    }

    if(previousPassword === password && newPassword === password && confirmNewPassword === password) {
      setAlertModal(true);
    }

    try {
      const response = await updateUserPassword(previousPassword, newPassword);

      updatePassword(newPassword);

      setAlertModal(true);

    } catch (error:any) {

      if(error.code === 400 && error.message.includes('Invalid `password` param:')) {
        setInvalid(true);
        setNewPasswordInvalid(true);
        setConfirmNewPasswordInvalid(true);
        setError("Password must be 8-265 characters long.")
      } else {
        setInvalid(true);
        setError("An unexpected error occured.")
      }

      console.log(error)
      console.log(error.code)
      console.log(error.message)
    }

  }

  return (
    <ThemedView className='flex-1'>
            
      <View className=' h-full flex items-center'>

        <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit pb-[50px] mt-[12px] rounded-3xl items-center`} >

          <View className='mt-[24px] w-[86%]'>
          
            <FormControl className='flex gap-[20px]' isInvalid={invalid}>

              <View>
                <ThemedText type='onboarding'>Current Password</ThemedText>
                <Input
                  variant='rounded' size='md' className='mt-[8px] bg-white/30 border-transparent'
                >
                  <InputField placeholder={''} value={previousPassword} className='bg-slate-50' 
                    onChangeText={(text) => {
                      setPreviousPassword(text);
                      setPreviousPasswordInvalid(false);
                      setInvalid(false); 
                    }}
                  />
                </Input>
              </View>
              
              <View>
                <ThemedText type='onboarding'>New Password</ThemedText>
                <Input
                  variant='rounded' size='md' className='mt-[8px] bg-white/30 border-transparent'
                >
                  <InputField placeholder={''} value={newPassword} className='bg-slate-50' 
                    onChangeText={(text) => {
                      setNewPassword(text);
                      setNewPasswordInvalid(false);
                      setInvalid(false); 
                    }}
                  />
                </Input>
              </View>
              
              <View>
                <ThemedText type='onboarding'>Confirm New Password</ThemedText>
                <Input
                  variant='rounded' size='md' className='mt-[8px] bg-white/30 border-transparent'
                >
                  <InputField placeholder={''} value={confirmNewPassword} className='bg-slate-50' 
                    onChangeText={(text) => {
                      setConfirmNewPassword(text);
                      setConfirmNewPasswordInvalid(false);
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
                  <Button action='positive' className='flex-1' onPressIn={haptic()} onPress={() => {handleConfirm()}}>
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

export default accountPassword