import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import UserCard from "@/components/UserCard";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getUserById } from "@/services/appwriteDatabase";
import { useAuthStore } from "@/utils/authStore";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

// Allows users to view their current friends
const friendsList = () => {
  const theme = useThemeColor({}, "text");

  const { userId } = useAuthStore();

  // Hold's list of users's friends and requests
  const [usersFriends, setUsersFriends] = useState([]);
  const [usersRequested, setUsersRequested] = useState([]);

  // State if a friend has been unadded and thier id [for removal]
  const [friendsChanged, setFriendsChanged] = useState(false);
  const [unaddedUserId, setUnaddedUserid] = useState('')

  // Loading state for fetching the lists
  const [loading, setLoading] = useState(false);

  // This queries the database to fill in the arrays above
  const fetchData = async () => {
    try {
      const response = await getUserById(userId);

      // Sets to the array returned else empty array
      setUsersFriends(response.Friends || []);
      setUsersRequested(response.Requested || []);

    } catch (error: any) {
      console.log("Error fetching user's lists");
    }
  };

  // Will refresh data 
  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        await fetchData();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [unaddedUserId]);

  return (
    <ThemedView className="flex-1">

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 75, 
          display: 'flex',
          alignItems: 'center',
        }}
      >

        {/* Friends Section */}
        <ThemedText type="settingSubheading" className="mt-[10px]">
          Your Friends
        </ThemedText>

        <View
          className={` ${
            theme === "#ECEDEE" ? "bg-white/20" : "bg-black/30"
          } bg-gray-600 w-[90%] h-fit py-[25px] mt-[12px] rounded-3xl items-center`}
        >
          {/* Shows loading text */}
          {loading ? 
            (<ThemedText className="align-middle">
              Loading...
            </ThemedText>)
            :
            usersFriends.length > 0 ? 
            (
              // Shows list of friends if array is populated
              usersFriends.map((userid: string, index) => (
                <UserCard key={index} userid={userid} parent={"friends"} unaddedUserid={setUnaddedUserid}/>
              ))
            ) : (
              // Shows message if user has no friends
              <ThemedText className="align-middle">
                You currently don't have any friends added.
              </ThemedText>
            )
          }          

        </View>

        {/* Friends Section */}
        <ThemedText type="settingSubheading" className="mt-[24px]">
          Requested
        </ThemedText>

        <View
          className={` ${
            theme === "#ECEDEE" ? "bg-white/20" : "bg-black/30"
          } bg-gray-600 w-[90%] h-fit py-[25px] mt-[12px] rounded-3xl items-center`}
        >
          {/* Shows list of requests */}
          {usersRequested.length > 0 ? (
            usersRequested.map((userid: string, index) => (  
              <UserCard key={index} userid={userid} />
            ))
          ) : (
            // Shows message if user has made no requests
            <ThemedText className="align-middle">
              Your requested invites will be here.
            </ThemedText>
          )}
        </View>

      </ScrollView>
    </ThemedView>
  );
};

export default friendsList;
