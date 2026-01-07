import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import UserSearchCard from "@/components/UserSearchCard";
import { getUserById, searchUserTable,} from "@/services/appwriteDatabase";
import { useAuthStore } from "@/utils/authStore";
import { Input, InputField, InputIcon, InputSlot, SearchIcon} from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

// Allows users to add friends
const addFriends = () => {

  const { userId, username, theme } = useAuthStore();
  
  // Hold's user's search query
  const [query, setQuery] = useState("");
  const [zeroResults, setZeroResults] = useState(false);
  const [results, setResults] = useState(false);

  // Hold's list of results
  const [list, setList] = useState([]);

  const getList = async () => {
    const list = await searchUserTable(query);
    if (!list) {
      setResults(false);
      setZeroResults(true);
    } else {
      setList(list);
      setResults(true);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        // Search appwrite
        getList();
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Will hold list of current user's friends, requests, and invites
  const [usersFriends, setUsersFriends] = useState([]);
  const [usersRequested, setUsersRequested] = useState([]);
  const [usersInvites, setUserInvites] = useState([]);

  // This queries the database to fill in the 3 arrays above
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserById(userId);

        // Sets to the array returned else empty array
        setUsersFriends(response.Friends || []);
        setUsersRequested(response.Requested || []);
        setUserInvites(response.Invites || []);
      } catch (error: any) {
        console.log("Error fetching user's lists");
      }
    };
    fetchData();
  }, []);

  return (
    <ThemedView className="flex-1">

      <View className="h-full flex items-center">

        {/* Search bar */}
        <View className="flex w-[90%] mt-[12px]">

          <Input
            variant="rounded"
            size="md"
            className={`mt-[8px] ${
              theme === "dark" ? "bg-white/90" : "bg-black/20"
            } `}
          >

            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>

            <InputField
              placeholder={"Search..."}
              value={query}
              className=""
              onChangeText={(text) => {
                setQuery(text);
              }}
            />

          </Input>
          
        </View>

        {/* Will hold results */}
        <View
          className={` ${
            theme === "dark" ? "bg-white/20" : "bg-black/30"
          } bg-gray-600 w-[90%] h-fit max-h-[86%] py-[25px] mt-[24px] rounded-3xl items-center`}
        >
          {/* Displays results */}
          {results ? 
          (
            // Creates scrollview of users
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
                // I made this scrollable if there are a lot of results
                scrollEnabled={list.length > 8}
              >
              {/* Goes through the array and make component for each */}
              {list?.map((user: User, index) => (
                (username!==user.User ?
                <UserSearchCard
                  user={user}
                  key={index}
                  usersFriends={usersFriends}
                  usersRequested={usersRequested}
                  usersInvites={usersInvites}
                />
                :
                  (list.length===0 &&
                  <ThemedText>
                    No matching results
                  </ThemedText>)

                )

              ))}
            </ScrollView>
          ) 
          : 
          (
            // Shows message if there are no results 
            <ThemedText>
              {/* Zero results helps track if a query was made */}
              {zeroResults ? "No matching results" : "Enter a query above"}
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

export default addFriends;
