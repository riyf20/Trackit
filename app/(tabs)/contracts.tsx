import { View, ScrollView, Pressable, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import Header from '@/components/Header'
import { Input, InputField, InputIcon, InputSlot, SearchIcon, Spinner } from '@gluestack-ui/themed'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color'
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { useAuthStore } from '@/utils/authStore'
import { searchUserContract } from '@/services/appwriteDatabase'
import ContractCard from '@/components/ContractCard'
import ContractFilterMenu from '@/components/ContractFilterMenu'
import { BlurView } from 'expo-blur'


// [Contracts Tab] - All user contracts
const contracts = () => {

  // On device variables
  const {username, userId} = useAuthStore()

  const theme = useThemeColor({}, 'text');

  // Loading and empty state for contracts
  const [fetching, setFetching] = useState(false)
  const [empty, setEmpty] = useState(false)

  // Array of contracts
  const [contracts, setContracts] = useState([])

  // Function for new contract button
  const handleNewContract = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/contracts/createContract') 
  }

  // Search query for contracts
  const [query, setQuery] = useState('')

  {/* TO DO: Link search query to the fetch */}

  const fetchContracts = async () => {
    // Sets loading
    setFetching(true)
    try {
      const response = await searchUserContract(username, userId);

      if(!response.documents) {
        // Will trigger empty state
        setEmpty(true)
      } else {
        setContracts(response.documents);
      }
      setFetching(false)
    } catch (error:any) {
      console.log("Error while fetching contracts")
      console.log(error)
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [username, userId])

  // Refresh variable 
  const [refreshing, setRefreshing] = useState(false);


  return (
    <ThemedView
      className="h-full flex flex-1 items-center">

        {/* Search bar */}
        <View className="flex w-[88%] mt-[130px]">

          <Input
            variant="rounded"
            size="md"
            className={`mt-[8px] ${
              theme === "#ECEDEE" ? "bg-white/90" : "bg-black/20"
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

        {/* Filter bar */}
        <View className='w-[88%] mt-[12px] flex flex-row justify-evenly'>
            
          {/* TO DO: Link filters to work with searching */}
          <ContractFilterMenu tab={'Sort By'}/>
          <ContractFilterMenu tab={'Status'}/>
          <ContractFilterMenu tab={'Difficulty'}/>

        </View>
      
        {/* Scrollview of search results */}
        <View className='mt-[12px] w-[100%] h-[76%] flex items-center'>
          <ScrollView
            contentContainerStyle={{width: '88%', marginBottom: 100, paddingBottom: 150, display: 'flex'}}
            // Refresh function to refetch content
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchContracts} />
            }
          >
            {/* Loading message */}
            {fetching ?
              <View className={`flex flex-row items-center justify-center border-2 p-[10px] rounded-2xl ${theme === "#ECEDEE" ? "border-white" : "border-black"} `} >
                <Spinner size="small" color={'grey'}/>
                <ThemedText 
                  type='difficultyTitle'
                  className='ml-[6px]'
                >
                  Loading...
                </ThemedText>
              </View>  
            
              :!fetching && empty ?
              // Empty array | No contracts message
                <View className={`flex flex-row items-center justify-center border-2 p-[10px] rounded-2xl ${theme === "#ECEDEE" ? "border-white" : "border-black"} `} >
                  <IconSymbol name={'exclamationmark.circle'} size={22} color={theme === "#ECEDEE" ? "white" : "black"}/>
                  <ThemedText 
                    type='difficultyTitle'
                    className='ml-[6px]'
                  >
                    You currently don't have any contracts
                  </ThemedText>
                </View>

              :!fetching && !empty &&
                // Card view of contracts
                contracts.map((contract: Contract, index) => (
                  <ContractCard key={index} contract={contract}/>
                ))
            }
          </ScrollView>
        </View>
        
      {/* Floating button for creating new contract */}
      <Pressable className='absolute bottom-[11%] right-[8%]' onPress={handleNewContract}>
        {/* Will render Liquid Glass UI if compatible otherwise blurview */}
        {isLiquidGlassAvailable() ?
          <GlassView style={{display: 'flex', flexDirection: 'row', gap: 6, padding: 10, borderRadius: 12, shadowOpacity: 0.2}} isInteractive={true}>
            <IconSymbol name={'doc.text.fill'} size={22} color={theme==='#ECEDEE' ? 'white' : 'black'}/>
            <ThemedText lightColor='black' >New Contract</ThemedText>
          </GlassView>
          :
          <BlurView
            intensity={100} 
            tint={`${theme==='#ECEDEE' ? 'dark' : 'light'}`}
            style={{display: 'flex', flexDirection: 'row', gap: 6, padding: 10, borderRadius: 12, overflow: 'hidden', borderWidth: 1, shadowOpacity: 0.2}}
          >
            <IconSymbol name={'doc.text.fill'} size={22} color={theme==='#ECEDEE' ? 'white' : 'black'}/>
            <ThemedText lightColor='black' >New Contract</ThemedText>
          </BlurView>
        }
      </Pressable>
      {/* Reuable header component */}
      <Header parent={'Contracts'}/>
    </ThemedView>
  )
}

export default contracts