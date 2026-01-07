import { View, ScrollView, Pressable, RefreshControl } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'
import Header from '@/components/Header'
import { Input, InputField, InputIcon, InputSlot, SearchIcon, Spinner } from '@gluestack-ui/themed'
import { IconSymbol } from '@/components/ui/icon-symbol'
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { useAuthStore } from '@/utils/authStore'
import { searchUserContract } from '@/services/appwriteDatabase'
import ContractCard from '@/components/ContractCard'
import FilterMenu from '@/components/FilterMenu'
import { BlurView } from 'expo-blur'
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated'
import useTimedFocusRefresh from '@/services/useTimedFocusRefresh'


// [Contracts Tab] - All user contracts
const contracts = () => {

  // On device variables
  const {username, userId, theme} = useAuthStore()

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
      console.log("[Contracts.tsx] : Error while fetching contracts")
      console.log(error)
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [username, userId])

  // Refresh variable 
  const [refreshing, setRefreshing] = useState(false);

  // Filter titles [Will switch to selected option's name | Used for fetching as well]
  const [sortFilter, setSortFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('Active')
  const [difficultyFilter, setDifficultyFilter] = useState('')

  // Will do these calculations if the filters are changed
  const visibleContracts = useMemo(() => {

    // Store all contracts
    let result = [...contracts];

    // Search filter
    if (query.trim()) {
      const search = query.toLowerCase();
      result = result.filter((contract:Contract) =>
        contract.Habit_Name.toLowerCase().includes(search)
      );
    }

    // Difficulty filter
    if (difficultyFilter) {
      result = result.filter(
        (contract:Contract) => contract.Difficulty === difficultyFilter
      );
    }

    // Status filter | Active
    if(statusFilter==='Active') {
      result = result.filter(
        (contract:Contract) => contract.Active 
      );
    }

    // Status filter | Past
    if(statusFilter==='Past') {
      result = result.filter(
        (contract:Contract) => !contract.Active 
      );
    }

    // Sort filter | Newest
    if (sortFilter === 'Newest First') {
      result.sort(
        (a:Contract, b:Contract) =>
          new Date(b.$createdAt).getTime() -
          new Date(a.$createdAt).getTime()
      );
    }

    // Sort filter | Oldest
    if (sortFilter === 'Oldest First') {
      result.sort(
        (a:Contract, b:Contract) =>
          new Date(a.$createdAt).getTime() -
          new Date(b.$createdAt).getTime()
      );
    }

    // Sort filter | Ending soon
    if (sortFilter === 'Ending Soon') {
      result.sort(
        (a:Contract, b:Contract) =>
          new Date(a.Expiration).getTime() -
          new Date(b.Expiration).getTime()
      );
    }

    return result;
  }, [contracts, query, difficultyFilter, sortFilter, statusFilter]);

  // Filter's open states | Will be used to create an overlay to close on background tap
  const [sortFilterOpen, setSortFilterOpen] = useState(false); 
  const [statusFilterOpen, setStatusFilterOpen] = useState(false); 
  const [difficultyfilterOpen, setDifficultyFilterOpen] = useState(false); 

  // Creates a timeout and refetches data 
  useTimedFocusRefresh(fetchContracts, 20_000)
  
  return (
    <ThemedView
      className="h-full flex flex-1 items-center">

        {/* Used as overlay to ensure any other presses closes the filter window */}
        { (sortFilterOpen || statusFilterOpen || difficultyfilterOpen) &&
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              width: '100%',
              height: '100%',
            }}
            onPress={() => {
              setSortFilterOpen(false)
              setStatusFilterOpen(false)
              setDifficultyFilterOpen(false)
            }}
          />
        }

        {/* Search bar */}
        <View className="flex w-[88%] mt-[130px]">

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

        {/* Filter bar */}
        <View className='w-[88%] mt-[12px] flex flex-row justify-evenly'>
            
          {/* TO DO: Add coloring to the filter options or icons */}
          <FilterMenu parent={'Sort By'} changeFilter={setSortFilter} menuOpen={sortFilterOpen} setMenuOpen={setSortFilterOpen}/>
          <FilterMenu parent={'Status'} changeFilter={setStatusFilter} menuOpen={statusFilterOpen} setMenuOpen={setStatusFilterOpen} />
          <FilterMenu parent={'Difficulty'} changeFilter={setDifficultyFilter} menuOpen={difficultyfilterOpen} setMenuOpen={setDifficultyFilterOpen} />

        </View>
      
        {/* Scrollview of search results */}
        <View className='mt-[12px] w-[100%] h-[76%] flex items-center'>
          <ScrollView
            contentContainerStyle={{width: '100%', marginBottom: 100, paddingBottom: 150, display: 'flex'}}
            // Refresh function to refetch content
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchContracts} />
            }
          >
            {/* Loading message */}
            {fetching ?
              <View className={`flex flex-row items-center justify-center border-2 p-[10px] rounded-2xl ${theme === "dark" ? "border-white" : "border-black"} `} >
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
                <View className={`flex flex-row items-center justify-center border-2 p-[10px] rounded-2xl ${theme === "dark" ? "border-white" : "border-black"} `} >
                  <IconSymbol name={'exclamationmark.circle'} size={22} color={theme === "dark" ? "white" : "black"}/>
                  <ThemedText 
                    type='difficultyTitle'
                    className='ml-[6px]'
                  >
                    You currently don't have any contracts
                  </ThemedText>
                </View>

              :!fetching && !empty ?

                (query.trim() || sortFilter || statusFilter || difficultyFilter) && visibleContracts.length===0 ?
                  (
                    // Shows card if not matching contracts
                    <Animated.View layout={Layout.springify()} entering={FadeInDown.duration(200)} exiting={FadeOutUp.duration(150)} className='flex flex-row items-center justify-center'>
                      <View className='flex-row gap-2 border-white border-2 rounded-2xl p-4 w-[88%] flex items-center justify-center'>
                        <IconSymbol name={'exclamationmark.circle'} size={22} color={theme === "dark" ? "white" : "black"}/>
                        <ThemedText type='difficultyTitle'>No Contracts found...</ThemedText>
                      </View>
                    </Animated.View>
                  ) 
                  :
                    (
                      // Card view of contracts
                      visibleContracts.map((contract: Contract) => (
                        <ContractCard key={contract.$id} contract={contract}/>
                      ))
                    )
              : null
            }
          </ScrollView>
        </View>
        
      {/* Floating button for creating new contract */}
      <Pressable className='absolute bottom-[11%] right-[8%]' onPress={handleNewContract}>
        {/* Will render Liquid Glass UI if compatible otherwise blurview */}
        {isLiquidGlassAvailable() ?
          <GlassView style={{display: 'flex', flexDirection: 'row', gap: 6, padding: 10, borderRadius: 12, shadowOpacity: 0.2, alignItems: 'center'}} isInteractive={true}>
            <IconSymbol name={'doc.text.fill'} size={22} color={theme==='dark' ? 'white' : 'black'}/>
            <ThemedText lightColor='black' >New Contract</ThemedText>
          </GlassView>
          :
          <BlurView
            intensity={100} 
            tint={`${theme==='dark' ? 'dark' : 'light'}`}
            style={{display: 'flex', flexDirection: 'row', gap: 6, padding: 10, borderRadius: 12, overflow: 'hidden', borderWidth: 1, shadowOpacity: 0.2, alignItems: 'center'}}
          >
            <IconSymbol name={'doc.text.fill'} size={22} color={theme==='dark' ? 'white' : 'black'}/>
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