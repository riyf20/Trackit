import {  Pressable,View,
} from '@gluestack-ui/themed'
import { IconSymbol } from './ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useState } from 'react';
import { Text } from 'react-native'
import FilterMenuOption from './FilterMenuOption';
import { useAuthStore } from '@/utils/authStore';
import { BlurView } from 'expo-blur';
import { format } from 'date-fns';
import { contractDetailsIcons, contractIcons, dateIcons, difficultyIcons, sortByIcons, statusIcons, statusLogIcons } from '@/constants/icons';

// Filter button bar for searching on contract page |  modal overlay in contract details page
const FilterMenu = ({parent, changeFilter, menuOpen, setMenuOpen, contractNames, dateText, clearDate}:FilterMenuProps) => {

    // Restricts option if difficulty is beginner
    const {contractDetails, theme} = useAuthStore()

    // Default state being the filter | option text will be filter selection | number corresponds to the option
    const [useDefault, setUseDefault] = useState(true)
    const [optionText, setOptionText] = useState("")
    const [optionNumber, setOptionNumber] = useState(0)
    const [selectedContractIcon, setSelectedContractIcon] = useState('')

    // Resets filter back
    const handleClearFilter= () => {
        setUseDefault(true)
        setOptionNumber(0)
        setOptionText('')

        // Status filter's default is to show only active contracts
        changeFilter(parent==='Status' ? 'Active' : '')

        if(parent==='Date' && dateText !== null){
            clearDate!(true)
        } 
    }

    const handleSort = (filter:string, option:number) => {

        // If the same option is pressed it reverts to default
        if(!useDefault && optionNumber===option) {
            handleClearFilter()
        } else {

            setUseDefault(false)
            setOptionNumber(option)

            // setOptionText changes filter's title
            // change filter does the logic and shows result based on filter

            if(filter==='sort') {
                if(option===1) {
                    setOptionText('Newest First') 
                    changeFilter('Newest First')
                } else if (option===2) {
                    setOptionText('Oldest First')
                    changeFilter('Oldest First')
                } else if (option===3) {
                    setOptionText('Ending Soon')
                    changeFilter('Ending Soon')
                }

            } else if(filter==='status') {
                if(option===1) {
                    setOptionText('Active')
                    changeFilter('Active')
                } else if (option===2) {
                    setOptionText('Past')
                    changeFilter('Past')
                }
            } else if(filter==='difficulty') {

                if(option===1) {
                    setOptionText('Beginner')
                    changeFilter('Beginner')
                }
            } else if(filter==='contract') {

                
                let current =contractNames?.at(option)
                setOptionText(current?.Name!)
                setSelectedContractIcon(current?.Icon!)
                changeFilter(current?.Name!)
            } else if (filter==='statusLog') {

                if(option===1) {
                    setOptionText('Pending')
                    // changeFilter('Pending')
                } else if (option===2) {
                    setOptionText('Approved')
                    changeFilter('Approved')
                } else if (option===3) {
                    setOptionText('Rejected')
                    changeFilter('Rejected')
                }

            }

        }

    }

    useEffect(() => {
      if (parent==='Date' && dateText !== null) {
        const text = format(new Date(dateText as Date), 'EEE d')
        setOptionText(text)
        setUseDefault(false)
      } else if (parent==='Date' && dateText === null) {
        setUseDefault(true)
        setOptionText('')
      }
    }, [dateText])
    
    // Active states, tint colors, and icon colors
    const isActive = !useDefault;

    const inactiveTint =
        theme === 'dark'
        ? 'rgba(255,255,255,0.35)'
        : 'rgba(0,0,0,0.35)';

    const activeTint =
        theme === 'dark'
        ? 'darkgray'
        : 'lightgray';

    const inactiveIcon =
        theme === 'dark'
            ? 'black'
            : 'dimgrey'; 
    
    const activeIcon ='black'; 

    // TO DO: implement edit contract function
    const editContract = () => {
        console.log("implement edit function")
    }
    // TO DO: implement renew contract function
    const renewContract = () => {
        console.log("implement renew function")
    }
    // TO DO: implement give up contract function
    const giveUpContract = () => {
        console.log("implement give up function")
    }
    
    return (
        <>
        {/* Shows main filter button [omitted for contract details] */}
        {parent!=='Contract Details' &&
            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    setMenuOpen(!menuOpen)
                }}
                onLongPress={handleClearFilter}
            >
                {isLiquidGlassAvailable() ?
                    <GlassView 
                        style={{borderRadius: 18, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, height: 34, width: 'auto', shadowOpacity: 0.1}} 
                        tintColor={isActive ? activeTint : inactiveTint}
                        isInteractive={true} 
                    >
                        {parent==='Sort By' ? 
                            <IconSymbol name={sortByIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='Status' ?
                            <IconSymbol name={statusIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='Difficulty' ?
                            <IconSymbol name={difficultyIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='Contract' ?
                            (isActive ?
                                <Text>{selectedContractIcon}</Text>
                                :
                                <IconSymbol name={contractIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                            )
                        : parent==='Date' ?
                            <IconSymbol name={dateIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='StatusLogs' &&
                            <IconSymbol name={statusLogIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        }

                        <Text className={`ml-[6px] ${isActive && 'font-bold'} ${isActive ? activeIcon : inactiveIcon} `} >{useDefault ? parent==='StatusLogs' ? 'Status' : parent : optionText}</Text>
                    </GlassView>
                :
                    <BlurView 
                        style={{borderRadius: 18, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, height: 34, width: 'auto', shadowOpacity: 0.1, backgroundColor: theme==='#ECEDEE' ? 'white' : 'grey', overflow: 'hidden', borderWidth: isActive ? 1 : 0, borderColor: isActive ? 'white' : 'blue'}} 
                        // tintColor={isActive ? activeTint : inactiveTint}
                        intensity={100} 
                        tint={`${theme==='dark' ? 'dark' : 'light'}`}
                    >
                        {parent==='Sort By' ? 
                            <IconSymbol name={sortByIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='Status' ?
                            <IconSymbol name={statusIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='Difficulty' ?
                            <IconSymbol name={difficultyIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='Contract' ?
                            (isActive ?
                                <Text>{selectedContractIcon}</Text>
                                :
                                <IconSymbol name={contractIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                            )
                        : parent==='Date' ?
                            <IconSymbol name={dateIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        : parent==='StatusLogs' &&
                            <IconSymbol name={statusLogIcons[optionNumber]} size={20} color={isActive ? activeIcon : inactiveIcon}/>
                        }

                        <Text className={`ml-[6px] ${isActive && 'font-bold'} ${isActive ? activeIcon : inactiveIcon} `} >{useDefault ? parent==='StatusLogs' ? 'Status' : parent : optionText}</Text>
                    </BlurView>
                }
            </Pressable>
        }

        {/* Overlay with menu options */}
        {menuOpen &&
            <View
                style=
                {{
                    position: 'absolute', 
                    top: 42, 
                    left: parent==='Sort By' || parent==='Contract' ? -10 
                        : parent==='Status' ? 110 
                        : parent==='Difficulty' || parent==='StatusLogs' ? 220 
                        : parent==='Contract Details' ? -160 
                        : 0, 
                    zIndex: 100,
                }}
            >
                {parent!=='Date' &&
                    (isLiquidGlassAvailable() ?
                        <GlassView
                            style={{
                                borderRadius: 14,
                                paddingVertical: 6,
                                transform: [{
                                    scale: parent==='Date' ? 0.8 : 1,
                                }],
                                width: '100%',
                                display: 'flex',
                                marginHorizontal: 14,
                            }}
                            isInteractive={true}
                            tintColor={theme === 'dark' ? 'gray' : 'white'}
                        >
                            {   
                                parent==='Sort By' ?
                                    <>
                                        <FilterMenuOption icon={sortByIcons[1]} label={'Newest First'} onPress={() => handleSort('sort', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={sortByIcons[2]} label={'Oldest First'} onPress={() => handleSort('sort', 2)} active={!useDefault && optionNumber === 2} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={sortByIcons[3]} label={'Ending Soon'} onPress={() => handleSort('sort', 3)} active={!useDefault && optionNumber === 3} setMenuOpen={setMenuOpen} />
                                    </>
                                : parent==='Status' ?
                                    <>
                                        <FilterMenuOption icon={statusIcons[1]} label={'Active'} onPress={() => handleSort('status', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={statusIcons[2]} label={'Past'} onPress={() => handleSort('status', 2)} active={!useDefault && optionNumber === 2} setMenuOpen={setMenuOpen} />
                                    </>
                                : parent==='Difficulty' ?
                                    <FilterMenuOption icon={difficultyIcons[1]} label={'Beginner'} onPress={() => handleSort('difficulty', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                : parent==='Contract Details' ?
                                    <>
                                        {contractDetails?.Difficulty === 'Beginner' && 
                                            <FilterMenuOption icon={contractDetailsIcons[1]} label={'Edit'} onPress={() => editContract()} active={false} setMenuOpen={setMenuOpen} />
                                        }
                                        <FilterMenuOption icon={contractDetailsIcons[2]} label={'Renew'} onPress={() => renewContract()} active={false} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={contractDetailsIcons[3]} label={'Give Up'} onPress={() => giveUpContract()} active={false} setMenuOpen={setMenuOpen} />
                                    </>
                                : parent==='Contract' ?

                                    contractNames?.map((contractItem: ContractOption, index:number) => (
                                            <FilterMenuOption key={contractItem.Name} icon={contractItem.Icon} label={contractItem.Name} count={contractItem.Count} onPress={() => handleSort('contract', index)} active={!useDefault && optionNumber === index} setMenuOpen={setMenuOpen} logs={true}/>
                                        )
                                    )
                                    
                                : parent==='StatusLogs' &&
                                    <>
                                        <FilterMenuOption icon={statusLogIcons[1]} label={'Pending'} onPress={() => handleSort('statusLog', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={statusLogIcons[2]} label={'Approved'} onPress={() => handleSort('statusLog', 2)} active={!useDefault && optionNumber === 2} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={statusLogIcons[3]} label={'Rejected'} onPress={() => handleSort('statusLog', 3)} active={!useDefault && optionNumber === 3} setMenuOpen={setMenuOpen} />
                                    </>
                            }

                        </GlassView>
                    :
                        <BlurView
                            style={{
                                borderRadius: 14,
                                paddingVertical: 6,
                                minWidth: 180,
                                overflow: 'hidden',
                            }}
                            tint={'light'}
                        >
                            {   
                                parent==='Sort By' ?
                                    <>
                                        <FilterMenuOption icon={sortByIcons[1]} label={'Newest First'} onPress={() => handleSort('sort', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={sortByIcons[2]} label={'Oldest First'} onPress={() => handleSort('sort', 2)} active={!useDefault && optionNumber === 2} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={sortByIcons[3]} label={'Ending Soon'} onPress={() => handleSort('sort', 3)} active={!useDefault && optionNumber === 3} setMenuOpen={setMenuOpen} />
                                    </>
                                : parent==='Status' ?
                                    <>
                                        <FilterMenuOption icon={statusIcons[1]} label={'Active'} onPress={() => handleSort('status', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={statusIcons[2]} label={'Past'} onPress={() => handleSort('status', 2)} active={!useDefault && optionNumber === 2} setMenuOpen={setMenuOpen} />
                                    </>
                                : parent==='Difficulty' ?
                                    <FilterMenuOption icon={difficultyIcons[1]} label={'Beginner'} onPress={() => handleSort('difficulty', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                : parent==='Contract Details' ?
                                    <>
                                        {contractDetails?.Difficulty === 'Beginner' && 
                                            <FilterMenuOption icon={contractDetailsIcons[1]} label={'Edit'} onPress={() => editContract()} active={false} setMenuOpen={setMenuOpen} />
                                        }
                                        <FilterMenuOption icon={contractDetailsIcons[2]} label={'Renew'} onPress={() => renewContract()} active={false} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={contractDetailsIcons[3]} label={'Give Up'} onPress={() => giveUpContract()} active={false} setMenuOpen={setMenuOpen} />
                                    </>
                                : parent==='Contract' ?

                                    contractNames?.map((contractItem: ContractOption, index:number) => (
                                            <FilterMenuOption key={contractItem.Name} icon={contractItem.Icon} label={contractItem.Name} count={contractItem.Count} onPress={() => handleSort('contract', index)} active={!useDefault && optionNumber === index} setMenuOpen={setMenuOpen} logs={true}/>
                                        )
                                    )
                                    
                                : parent==='StatusLogs' &&
                                    <>
                                        <FilterMenuOption icon={statusLogIcons[1]} label={'Pending'} onPress={() => handleSort('statusLog', 1)} active={!useDefault && optionNumber === 1} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={statusLogIcons[2]} label={'Approved'} onPress={() => handleSort('statusLog', 2)} active={!useDefault && optionNumber === 2} setMenuOpen={setMenuOpen} />
                                        <FilterMenuOption icon={statusLogIcons[3]} label={'Rejected'} onPress={() => handleSort('statusLog', 3)} active={!useDefault && optionNumber === 3} setMenuOpen={setMenuOpen} />
                                    </>
                            }

                        </BlurView>
                    )
                }
            </View>
        }
        
        </>
    );
}

export default FilterMenu