import {ScrollView } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color';
import SettingSwitch from '@/components/SettingSwitch';
import SettingCard from '@/components/SettingCard';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { logOutUser } from '@/services/appwriteAccount';
import { useAuthStore } from '@/utils/authStore';
import { useHapticFeedback as haptic} from '@/components/HapticTab';

// [Account tab --> System setting] - System/App settings page
const systemSetting = () => {

    const {logOut, sessionID} = useAuthStore();

    // Debug switch
    const debug = false;

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
    <ThemedView
      className="flex-1 items-center"
    >

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                display: 'flex',
                marginTop: 18,
                width: '90%',
                paddingBottom: 75,
            }}
        >
            <ThemedText type='onboardingMain' className=' self-start'>Homepage</ThemedText>
            
                <SettingSwitch title={"Insights"} index={0} />
                {/* TO DO: connect to homepage once implemented */}

                <SettingCard title={"Cards"} index={1} />
                {/* TO DO: add links/route to each page once implemented */}

            <ThemedText type='onboardingMain' className='mt-[18px] self-start'>Contracts</ThemedText>
            
                <SettingSwitch title={"Pinning"} index={2} />
                {/* TO DO: connect to contracts tab once implemented */}

                <SettingCard title={"Cards"} index={3} />
                {/* TO DO: add links/route to each page once implemented */}

            <ThemedText type='onboardingMain' className='mt-[18px] self-start'>Logs</ThemedText>
        
                <SettingCard title={"Cards"} index={4} />
                {/* TO DO: add links/route to each page once implemented */}

            <ThemedText type='onboardingMain' className='mt-[18px] self-start'>App Settings</ThemedText>
        
                <SettingSwitch title={"Dark Mode"} index={5} />
                {/* TO DO: link to theme to toggle between modes */}

                <Button variant="solid" size="md" action='negative' className='mt-[12px] rounded-full' style={{borderRadius: 99}} onPressIn={haptic()} onPress={() => {handleLogOutUser()}}>
                    <ButtonText color='black'>Log Out</ButtonText>
                </Button>

        </ScrollView>
    </ThemedView>
  )
}

export default systemSetting