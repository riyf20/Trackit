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

// Allows users to change password
const accountPassword = () => {

  const theme = useThemeColor({}, 'text');

  {/* TO DO: Remove password, this is only for testing */}
  const {password} = useAuthStore();
  
  // Error and validity state for the form 
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState("");  

  // Value and validity state for current password 
  const[previousPasswordInvalid, setPreviousPasswordInvalid] = useState(false);
  const [previousPassword, setPreviousPassword] = useState(password);

  // Value and validity state for new password
  const[newPasswordInvalid, setNewPasswordInvalid] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Value and validity state for new password (user has to enter again)
  const[confirmNewPasswordInvalid, setConfirmNewPasswordInvalid] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


  return (
    <ThemedView className='flex-1'>
            
      <View className=' h-full flex items-center'>

        <View className={` ${theme==='#ECEDEE' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit pb-[50px] mt-[12px] rounded-3xl items-center`} >

          <View className='mt-[24px] w-[86%]'>
          
            <FormControl className='flex gap-[20px]' isInvalid={invalid}>

              <View>
                <ThemedText type='onboarding'>Previous Password</ThemedText>
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

export default accountPassword