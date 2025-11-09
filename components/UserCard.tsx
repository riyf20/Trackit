import { View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from './themed-text'
import { images } from '@/constants/images'
import { Button, ButtonText } from '@gluestack-ui/themed'
import { useAuthStore } from '@/utils/authStore'
import { acceptInviteTable, getUserById, unfriendTable } from '@/services/appwriteDatabase'
import UserCardMenu from './UserCardMenu'


const UserCard = ({userid, parent, unaddedUserid}:UserCardProps) => {

    // Saved states
    const {userId, invitesCount, updateInvitescount} = useAuthStore();

    // Holds picture data
    const [basePicture, setBasePicture] = useState(true);
    const [userPicture, setUserPicture] = useState('');

    const [username, setUsername] = useState('')

    const [buttonText, setButtonText] = useState("Accept")

    // Fetches given user's information
    const fetch = async () => {
        try {
            const response = await getUserById(userid);

            setUserPicture(response.User_Profile_Picture);
            setUsername(response.User);
            if(response.User_Profile_Picture !== null) {
                setBasePicture(false);
            }
        } catch (error:any) {
            console.log("Error grabbing image")
        }
    }

    useEffect(() => {
        fetch();
    }, [])
    
    const handleRequest = async () => {

        setButtonText('Friend')
        try {
            // Get current users invites and remove the id
            // userId is the logged in user (uppercase i)
            // userid is the id passed into this component (lowercase i)
            const response = await acceptInviteTable(userId, userid)

            // Will update saved data [changes the tab bar badge as well]
            updateInvitescount(invitesCount-1);
        } catch (error:any) {
            console.log("Error accepting invite")
        }
            
    }
    
    const handleUnfriend = async () => {
        try {
            const response = await unfriendTable(userId, userid)
            unaddedUserid!(userid);
        } catch (error:any) {
            console.log("Error unfriending")
        }
    }

  return (
        <View className='w-[90%] flex flex-row'>
            {/* Shows icon of user as well as username */}
            <View className='flex-1 flex-row gap-[12px]'>
                <Image
                    source={basePicture ? images.profile : {uri: userPicture}}
                    className='w-[50px] h-[50px] rounded-full self-start my-[12px] ml-[12px]'
                    resizeMode="cover"
                />
                <ThemedText type='onboarding' className='self-center'>{username}</ThemedText>
                {/* If parent is friends then will show icon allowing to unfriend */}
                {parent==='friends' &&
                    <UserCardMenu handleUnfriend={handleUnfriend}/>
                }
            </View>

            {/* If parent is invites will have button to accept invite */}
            {parent==='invites' &&
                <View className='justify-center mr-[12px]'>
                    <Button onPress={handleRequest} action={buttonText==='Accept' ? 'positive' : 'primary'} disabled={buttonText==='Friend'} >
                        <ButtonText>{buttonText}</ButtonText>
                    </Button>
                </View>
            }
        </View>
   
  )
}

export default UserCard