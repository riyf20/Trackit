import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { getUserById } from '@/services/appwriteDatabase';
import { useAuthStore } from '@/utils/authStore';
import UserCard from '@/components/UserCard';

// Allows users to view incoming friend invites
const invites = () => {

  const {theme, userId } = useAuthStore();

  // Hold list of user's invites
  const [usersInvites, setUserInvites] = useState([]);
  
  // This queries the database to fill in the arrays above
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserById(userId);

        // Sets to the array returned else empty array
        setUserInvites(response.Invites || []);

      } catch (error: any) {
        console.log("Error fetching user's lists");
      }
    };
    fetchData();
  }, []);

  return (
    <ThemedView className='flex-1'>

      {/* Invites Section */}
      <View className='h-full flex items-center'>

        {/* Will show dynamic count */}
        <ThemedText type='settingSubheading' className='mt-[10px]'>Your Invites ({usersInvites.length})</ThemedText> 

        <View className={` ${theme==='dark' ? 'bg-white/20' : 'bg-black/30'} bg-gray-600 w-[90%] h-fit py-[25px] mt-[12px] rounded-3xl items-center`} >
          {/* Shows list of invites if array is populated */}
          {usersInvites.length > 0 ? (
            usersInvites.map((userid: string, index) => (              
              <UserCard key={index} userid={userid} parent={'invites'} />
            ))
          ) : (
            // Shows message if user has no invites
            <ThemedText className="align-middle">
              You currently don't have any friend invites.
            </ThemedText>
          )}        
        </View>

      </View>
    </ThemedView>
  )
}

export default invites