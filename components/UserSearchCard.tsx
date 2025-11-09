import { View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from './themed-text'
import { images } from '@/constants/images'
import { Button, ButtonText } from '@gluestack-ui/themed'
import { useAuthStore } from '@/utils/authStore'
import { acceptInviteTable, updateRequestedTable } from '@/services/appwriteDatabase'

const UserSearchCard = ({user, usersFriends, usersRequested, usersInvites}:UserSearchCardProps) => {

    const {username, userId} = useAuthStore();

    const[basePicture, setBasePicture] = useState(true);

    useEffect(() => {
        if(user.User_Profile_Picture === null) {
            setBasePicture(true)
        } else if(!user.User_Profile_Picture.trim()) {
            setBasePicture(true);
        } else {
            setBasePicture(false)
        }
    }, [basePicture])
    
    const [buttonText, setButtonText] = useState('')
    
    const handleRequest = async () => {

        // Will send request to given user
        if(buttonText==="Request") {
            setButtonText("Requested")
            try {
                const response = await updateRequestedTable(userId, user.UsersID)

            } catch (error:any) {
                console.log("Error storing invite")
            }

            // Allows for accepting invites from given user
        } else if (buttonText==='Accept') {
            setButtonText('Friend')
            try {
                const response = await acceptInviteTable(userId, user.UsersID)
            } catch (error:any) {
                console.log("Error accepting invite")
            }
        }

    }

    useEffect(() => {
        // If user is within any of the arrays will set button text accordingly
        if(usersFriends!.includes(user.UsersID)) {
            setButtonText('Friend')
        } else if (usersRequested!.includes(user.UsersID)) {
            setButtonText('Requested')
        } else if (usersInvites!.includes(user.UsersID)) {
            setButtonText('Accept')
        } else {
            setButtonText("Request")
        }
    }, [user])
    

    // Currently this component is only being used in search
  return (

    // This will remove the currently logged in user from the search result
    username!==user.User 
    &&
    <View className='w-[90%] flex flex-row'>
        <View className='flex-1 flex-row gap-[12px]'>
            <Image
                source={basePicture ? images.profile : {uri: user.User_Profile_Picture}}
                className='w-[50px] h-[50px] rounded-full self-start my-[12px] ml-[12px]'
                resizeMode="cover"
            />
            <ThemedText type='onboarding' className='self-center'>{user.User}</ThemedText>
        </View>
        <View className='justify-center mr-[12px]'>
            <Button 
                onPress={handleRequest} 
                action={buttonText==='Requested' ? 'secondary' : buttonText==='Accept' ? 'positive' : 'primary'} 
                disabled={buttonText==='Requested' || buttonText==='Friend'} 
            >
                <ButtonText>{buttonText}</ButtonText>
            </Button>
        </View>
    </View>
  )
}

export default UserSearchCard