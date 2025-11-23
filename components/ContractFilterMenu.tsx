import { Button, ButtonText, Menu, MenuItem, MenuItemLabel,
  Pressable,
} from '@gluestack-ui/themed'
import { IconSymbol } from './ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

// Filter button bar for searching on contract page 
{/* TO DO: Link button state to search query */}
{/* TO DO: Active state is a toggle was pressed */}
{/* TO DO: Alter the style of the selector when the options are opened */}
const ContractFilterMenu = ({tab}:ContractFilterMenuProps) => {

    const theme = useThemeColor({}, 'text');
    
    return (
        <Menu
            placement={tab==="Sort By" ? 'bottom left' : tab==="Status" ? 'bottom' : tab==="Difficulty" ? 'bottom right' : 'bottom'}
            offset={5}
            trigger={({ ...triggerProps }) => {
            return (
                       
                // Renders liquid glass buttons if compatible 
                (isLiquidGlassAvailable() ? 
                    <Pressable
                        {...triggerProps}
                        onPressIn={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
                    >
                        <GlassView 
                            style={{borderRadius: 18, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, height: 34, width: 'auto', shadowOpacity: 0.1}} 
                            tintColor={theme === "#ECEDEE" ? 'darkgray' : 'lightgray'}
                            isInteractive={true} 
                        >
                            {tab==='Sort By' ? 
                                <IconSymbol name='line.3.horizontal.decrease' size={20} color={'black'}/>
                            : tab==='Status' ?
                                <IconSymbol name='circle.dashed' size={20} color={'black'}/>
                            : tab==='Difficulty' &&
                                <IconSymbol name='chart.bar.fill' size={20} color={'black'}/>
                            }
                            <ButtonText color='black' className='ml-[6px]' size='sm'>{tab}</ButtonText>
                        </GlassView>
                    </Pressable>
                :
                    <Button style={{borderRadius: 18, height: 34, paddingHorizontal: 14, width: 'auto'}} bgColor={theme === "#ECEDEE" ? 'gray' : 'lightgrey'} {...triggerProps}>
                        {tab==='Sort By' ? 
                            <IconSymbol name='line.3.horizontal.decrease' size={20} color={'black'}/>
                        : tab==='Status' ?
                            <IconSymbol name='circle.dashed' size={20} color={'black'}/>
                        : tab==='Difficulty' &&
                            <IconSymbol name='chart.bar.fill' size={20} color={'black'}/>
                        }
                        <ButtonText color='black' className='ml-[6px]' size='sm'>{tab}</ButtonText>
                    </Button>
                )

            );
            }}
            style={{backgroundColor: theme==='#ECEDEE' ? 'gray' : 'white', marginTop: 2}}
        >
            {tab==='Sort By' ?
                <>
                    <MenuItem key="newestFirst" textValue="Newest First" className='flex gap-2' onPress={() => {}}>
                        <IconSymbol name='arrow.down.to.line' size={18} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                        <MenuItemLabel size="md" color={theme==='#ECEDEE' ? 'white' : 'black'}>Newest First</MenuItemLabel>
                    </MenuItem>
                    <MenuItem key="oldestFirst" textValue="Oldest First" className='flex gap-2' onPress={() => {}}>
                        <IconSymbol name='arrow.up.to.line' size={18} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                        <MenuItemLabel size="md" color={theme==='#ECEDEE' ? 'white' : 'black'}>Oldest First</MenuItemLabel>
                    </MenuItem>
                    <MenuItem key="endingSoon" textValue="Ending Soon" className='flex gap-2' onPress={() => {}}>
                        <IconSymbol name='clock.badge.exclamationmark' size={18} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                        <MenuItemLabel size="md" color={theme==='#ECEDEE' ? 'white' : 'black'}>Ending Soon</MenuItemLabel>
                    </MenuItem>
                </>
            : tab==='Status' ?
        
                <>
                    <MenuItem key="newestFirst" textValue="Newest First" className='flex gap-2' onPress={() => {}}>
                        <IconSymbol name='checkmark.circle' size={18} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                        <MenuItemLabel size="md" color={theme==='#ECEDEE' ? 'white' : 'black'}>Active</MenuItemLabel>
                    </MenuItem>
                    <MenuItem key="oldestFirst" textValue="Oldest First" className='flex gap-2' onPress={() => {}}>
                        <IconSymbol name='archivebox' size={18} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                        <MenuItemLabel size="md" color={theme==='#ECEDEE' ? 'white' : 'black'}>Past</MenuItemLabel>
                    </MenuItem>
                </>

            : tab==='Difficulty' &&
                <>
                <MenuItem key="endingSoon" textValue="Ending Soon" className='flex gap-2' onPress={() => {}}>
                    <IconSymbol name='tortoise' size={18} color={theme==='#ECEDEE' ? 'white' : 'black'} />
                    <MenuItemLabel size="md" color={theme==='#ECEDEE' ? 'white' : 'black'}>Beginner</MenuItemLabel>
                </MenuItem>
                </>
            }
        </Menu>
    );
}

export default ContractFilterMenu