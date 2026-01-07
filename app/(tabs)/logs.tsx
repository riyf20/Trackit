import { View, Pressable, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import Header from '@/components/Header'
import FilterMenu from '@/components/FilterMenu'
import { searchUserContract, searchUserLogs } from '@/services/appwriteDatabase'
import { useAuthStore } from '@/utils/authStore'
import FilterMenuDatePicker from '@/components/FilterMenuDatePicker'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import Animated, { FadeInDown, FadeOutUp, Layout, runOnJS, 
  useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol'
import { BlurView } from 'expo-blur'
import { router, } from 'expo-router'
import { Spinner } from '@gluestack-ui/themed'
import LogCard from '@/components/LogCard'
import { format } from 'date-fns'
import { DateType } from 'react-native-ui-datepicker'
import useTimedFocusRefresh from '@/services/useTimedFocusRefresh'

// [Logs Tab] - All user submitted logs
const logs = () => {

  // On device variables
  const {username, userId, updateContractNames, theme} = useAuthStore()
  
  // States for empty contract list and if fetch was completed
  const [contractsFetched, setContractFetched] = useState(false)
  const [emptyContracts, setEmptyContracts] = useState(false)

  // Array of contracts
  const [contracts, setContracts] = useState([])

  const fetchContracts = async () => {
    try {
      const response = await searchUserContract(username, userId);

      if(!response.documents) {
        // Will trigger empty state
        setEmptyContracts(true)
      } else {
        setContracts(response.documents);
      }
      setContractFetched(true)
    } catch (error:any) {
      console.log("[Logs.tsx] : Error while fetching contracts")
      console.log(error)
    }
  }

  // Will fetch contracts once loaded in
  useEffect(() => {
    fetchContracts()
  }, [username, userId])

  
  // Will hold onto contract names (and other variables)
  const [contractNames, setContractNames] = useState<ContractOption[]>([])

  // Will grab active contracts and store necessary variables
  useEffect(() => {
    const activeContracts: ContractOption[] = contracts
      .filter((contract: Contract) => contract.Active)
      .map((contract:Contract) => ({
          Name: contract.Habit_Name,
          Icon: contract.Habit_Icon,
          Count: contract.Count,
          Difficulty: contract.Difficulty,
          Streak: contract.Streak,
          Id: contract.$id,
          Total: contract.Total_Days,
      }));

    setContractNames(activeContracts);
  }, [contracts])

  
  // Filter titles [Will switch to selected option's name | Used for fetching as well]
  const [contractFilter, setContractFilter] = useState('')
  const [dateFilter, setDateFilter] = useState<DateType | null>(null)
  const [statusFilter, setStatusFilter] = useState('')

  // Filter's open states | Will be used to create an overlay to close on background tap
  const [contractFilterOpen, setContractFilterOpen] = useState(false); 
  const [dateFilterOpen, setDateFilterOpen] = useState(false); 
  const [statusFilterOpen, setStatusFilterOpen] = useState(false); 

  // States for tab switching at the top [My logs <--/-->  To verify]
  // TO DO: Finish implementing to verify tab
  const [myLogsActive, setMyLogsActive] = useState(true);
  const [activeTabPressed, setActiveTabPressed] = useState(false);

  // Styling for animated tab blob
  const activeTabScale = useSharedValue(1);

  const activeTabLeft = useSharedValue(0);
  const activeTabStyle = useAnimatedStyle(() => ({
      left: activeTabLeft.value,
      transform: [{scaleY: activeTabScale.value}]
  }));

  // Trigger to move blob depending on selected option
  useEffect(() => {
    // Moves to `My Logs`
   if(myLogsActive) {
      activeTabLeft.value = withTiming(0, { duration: 700 }, (finished) => {
        if (finished) {
          runOnJS(setActiveTabPressed)(false)
        }
      });
   } else {
    // Moves to `To Verify`
      activeTabLeft.value = withTiming(isLiquidGlassAvailable() ? 194 : 175, { duration: 700 }, (finished) => {
        if (finished) {
          runOnJS(setActiveTabPressed)(false)
        }
      });
   }
  }, [myLogsActive])

  // Scales the tab
  useEffect(() => {
    if(activeTabPressed) {
      activeTabScale.value = withTiming(0.8, { duration: 150})
    } else {
      activeTabScale.value = withTiming(1, { duration: 300})
    }
  }, [activeTabPressed])
  

  // Function for new log button
  const handleNewLog = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Need to pass contract names so user can select contract that log is associated with
    updateContractNames(contractNames)
    router.push('/logs/createLog') 
  }

  // Logs empty and fetching state
  const [logsEmpty, setLogsEmpty] = useState(false)
  const [logsFetching, setLogsFetching] = useState(false)
  
  // All user's logs
  const [logs, setLogs] = useState([])

  // Fetches logs
  const fetchLogs = async () => {
    setLogsFetching(true)
    try {

      const response = await searchUserLogs(userId);

      if(!response.documents) {
        // Will trigger empty state
        setLogsEmpty(true)
      } else {
        setLogs(response.documents);
      }
      setLogsFetching(false)
    } catch (error:any) {
      console.log("[Logs.tsx] : Error while fetching logs")
      console.log(error)
      setLogsFetching(false)
    }
  }

  // Will trigger if contracts have been fetching and there ARE contracts
  useEffect(() => {
    if(contractsFetched && !emptyContracts) { 
      fetchLogs()
    }
  }, [contractNames])
    
  // Refresh variable 
  const [refreshing, setRefreshing] = useState(false);

  // Will grab fresh data 
  const refreshAllData = () => {
    fetchLogs()
    fetchContracts()
  }

  // Will do these calculations if the filters are changed
  const visibleLogs = useMemo(() => {

    let result = [...logs]

    if(contractFilter.trim()) {

      let contractName = contractNames.find(item => {
        return contractFilter === item.Name
      })

      result = result.filter(
        (log:Log) => contractName?.Id === log.Contract_ID
      )
    }

    if(statusFilter.trim()) {
      result = result.filter(
        (log:Log) => statusFilter === log.Status
      )
    }

    if(dateFilter !== null) {
      const selectedDate = format(new Date(dateFilter as Date), 'yyyy-MM-dd')

      result = result.filter((log:Log) => {
        const logDate = format(new Date(log.Logged_Date), 'yyyy-MM-dd')
        return logDate === selectedDate
      })
    }

    return result;
  }, [logs, contractFilter, statusFilter, dateFilter])

  // If a date was picked then the filter overlay will close
  useEffect(() => {
    if(dateFilter !== null) {
      setDateFilterOpen(false)
    }
  }, [dateFilter])
  
  useTimedFocusRefresh(fetchLogs, 20_000)  

  return (
    <ThemedView
      className='h-full flex flex-1 items-center'
    >

      {/* Used as overlay to ensure any other presses closes the filter window */}
      { (contractFilterOpen || dateFilterOpen || statusFilterOpen) &&
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
            alignItems: 'center',
          }}
          onPress={() => {
            setContractFilterOpen(false)
            setDateFilterOpen(false)
            setStatusFilterOpen(false)
          }}

        >
          {dateFilterOpen &&
            (isLiquidGlassAvailable () ?
              <GlassView 
                style={{
                  borderWidth: 2,
                  borderColor: 'gray',
                  marginTop: 220,
                  width: '90%',
                  borderRadius: 20,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                tintColor={theme === "dark" ? 'black' : 'gray'}
                isInteractive
              >

                <FilterMenuDatePicker selectedDate={dateFilter} changeFilter={setDateFilter} />
              </GlassView>
            :
              <BlurView 
                style={{
                  borderWidth: 2,
                  borderColor: 'gray',
                  marginTop: 220,
                  width: '90%',
                  borderRadius: 20,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                tint={'dark'}
              >

                <FilterMenuDatePicker selectedDate={dateFilter} changeFilter={setDateFilter} />
              </BlurView>
            )
          }
        </Pressable>
      }

      {/* Logs/Verify bar */}
      <View className="flex w-[88%] mt-[130px]">
        {isLiquidGlassAvailable() ? 
          <GlassView
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingVertical: 2,
              borderRadius: 20,
              marginTop: 6,
              position: 'relative',
              overflow: 'hidden'
            }}
            tintColor={theme === "dark" ? 'gray' : 'lightgray'}
          >
            <Animated.View style={[{
              position: 'absolute',
              backgroundColor: 'white',
              height: '120%',
              width: '50%',
              borderRadius: 16,
              zIndex: 0,
              left: 0,
              alignSelf: 'center',
              borderColor: theme === "dark" ? 'gray' : 'lightgray',
              borderWidth: 2,
            },
            activeTabStyle
            ]} />

              <Pressable
                style={{
                  flex: 1, alignItems: 'center', zIndex:1, justifyContent: 'center', paddingVertical: 4
                }}
                onPress={() => {
                  if(!myLogsActive) setActiveTabPressed(true)
                  setMyLogsActive(true)
                }}
                onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
              >
                <ThemedText type='difficultyTitle' darkColor='black' >My Logs</ThemedText>
              </Pressable>

              <Pressable
                style={{
                  flex: 1, alignItems: 'center', zIndex:1, justifyContent: 'center', paddingVertical: 4
                }}
                onPress={() => {
                  if(myLogsActive) setActiveTabPressed(true)
                  setMyLogsActive(false)
                  // TO DO: Implement Verify page
                }}
                onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
              >
                <ThemedText type='difficultyTitle' darkColor='black' >To Verify</ThemedText>
              </Pressable>
          </GlassView>
          :
          <BlurView
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingVertical: 2,
              borderRadius: 20,
              marginTop: 6,
              position: 'relative',
              overflow: 'hidden'
            }}
            tint={theme === "dark" ? 'light' : 'dark'}
          >
            <Animated.View style={[{
              position: 'absolute',
              backgroundColor: 'gray',
              height: '120%',
              width: '50%',
              borderRadius: 16,
              zIndex: 0,
              left: 0,
              alignSelf: 'center'
            },
            activeTabStyle
            ]} />

              <Pressable
                style={{
                  flex: 1, alignItems: 'center', zIndex:1, justifyContent: 'center', paddingVertical: 4
                }}
                onPress={() => {
                  if(!myLogsActive) setActiveTabPressed(true)
                  setMyLogsActive(true)
                }}
                onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
              >
                <ThemedText type='difficultyTitle' darkColor='black' >My Logs</ThemedText>
              </Pressable>

              <Pressable
                style={{
                  flex: 1, alignItems: 'center', zIndex:1, justifyContent: 'center', paddingVertical: 4
                }}
                onPress={() => {
                  if(myLogsActive) setActiveTabPressed(true)
                  setMyLogsActive(false)
                  // TO DO: Implement Verify page
                }}
                onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
              >
                <ThemedText type='difficultyTitle' darkColor='black' >To Verify</ThemedText>
              </Pressable>
          </BlurView>
        }
      </View>   
              
      {/* Filter bar */}
      <View className='w-[88%] mt-[12px] flex flex-row justify-evenly'>
          
        {/* TO DO: Add coloring to the filter options or icons */}
        <FilterMenu parent={'Contract'} changeFilter={setContractFilter} menuOpen={contractFilterOpen} setMenuOpen={setContractFilterOpen} contractNames={contractNames} />
        <FilterMenu parent={'Date'} changeFilter={() => {}} menuOpen={dateFilterOpen} setMenuOpen={setDateFilterOpen} dateText={dateFilter} clearDate={() => {setDateFilter(null)}}/>
        <FilterMenu parent={'StatusLogs'} changeFilter={setStatusFilter} menuOpen={statusFilterOpen} setMenuOpen={setStatusFilterOpen} />

      </View>

      {/* Scrollview of search results */}
      <View className='mt-[12px] w-[100%] h-[76%] flex items-center'>
        <ScrollView
          contentContainerStyle={{width: '100%', marginBottom: 100, paddingBottom: 150, display: 'flex',}}
          style={{width: '100%', }}
          // Refresh function to refetch content
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshAllData} />
          }
        >
          {/* Loading message */}
          {logsFetching ?
            <View className={`flex flex-row items-center justify-center border-2 p-[10px] self-center rounded-2xl w-[40%] ${theme === "dark" ? "border-white" : "border-black"} `} >
              <Spinner size="small" />
              <ThemedText 
                type='difficultyTitle'
                className='ml-[6px]'
              >
                Loading...
              </ThemedText>
            </View>  
          
            :!logsFetching && logsEmpty ?
            // Empty array | No contracts message
              <View className={`flex flex-row items-center justify-center border-2 p-[10px] rounded-2xl self-center w-[78%] ${theme === "dark" ? "border-white" : "border-black"} `} >
                <IconSymbol name={'exclamationmark.circle'} size={22} color={theme === "dark" ? "white" : "black"}/>
                <ThemedText 
                  type='difficultyTitle'
                  className='ml-[6px]'
                >
                  You currently don't have any logs
                </ThemedText>
              </View>

            :!logsFetching && !logsEmpty ?

              (contractFilter.trim() || statusFilter.trim() || dateFilter !== null) && visibleLogs.length===0 ?
                (
                  // Shows card if not matching contracts
                  <Animated.View layout={Layout.springify()} entering={FadeInDown.duration(200)} exiting={FadeOutUp.duration(150)} className='flex flex-row items-center justify-center'>
                    <View className={`flex-row gap-2 border-2 rounded-2xl p-4 w-[78%] flex items-center justify-center ${theme==='dark' ? 'border-white' : 'border-black'} `}>
                      <IconSymbol name={'exclamationmark.circle'} size={22} color={theme === "dark" ? "white" : "black"}/>
                      <ThemedText type='difficultyTitle'>No Logs found...</ThemedText>
                    </View>
                  </Animated.View>
                ) 
                :
                  (
                    // Card view of contracts
                    visibleLogs.map((log: Log) => (
                      <LogCard key={log.$id} log={log} contract={contractNames.find((item: ContractOption) => (log.Contract_ID === item.Id))!} />
                    ))
                  )
            : <></>
          }
        </ScrollView>
      </View>

      {/* Floating button for creating new contract */}
      <Pressable className='absolute bottom-[11%] right-[8%]' onPress={handleNewLog}>
        {/* Will render Liquid Glass UI if compatible otherwise blurview */}
        {isLiquidGlassAvailable() ?
          <GlassView style={{display: 'flex', flexDirection: 'row', gap: 6, padding: 10, borderRadius: 12, shadowOpacity: 0.2, alignItems: 'center'}} isInteractive={true}>
            <IconSymbol name={'list.bullet.rectangle.fill'} size={22} color={theme==='dark' ? 'white' : 'black'}/>
            <ThemedText lightColor='black' >New Log</ThemedText>
          </GlassView>
          :
          <BlurView
            intensity={100} 
            tint={`${theme==='dark' ? 'dark' : 'light'}`}
            style={{display: 'flex', flexDirection: 'row', gap: 6, padding: 10, borderRadius: 12, overflow: 'hidden', borderWidth: 1, shadowOpacity: 0.2, alignItems: 'center'}}
          >
            <IconSymbol name={'list.bullet.rectangle.fill'} size={22} color={theme==='dark' ? 'white' : 'black'}/>
            <ThemedText lightColor='black' >New Log</ThemedText>
          </BlurView>
        }
      </Pressable>

      <Header parent={'Logs'}/>

    </ThemedView>
  )
}

export default logs