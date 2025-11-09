import { Menu, MenuItem, MenuItemLabel,
  Pressable,
} from '@gluestack-ui/themed'
import { IconSymbol } from './ui/icon-symbol';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';



const UserCardMenu = ({handleUnfriend}:UserCardMenuProps) => {

  const theme = useThemeColor({}, 'text');
  
  const [iconPressed, setIconPressed] = useState(false);  
  
  const handleIconPressed = () => {
    setIconPressed(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }


  return (
    <Menu
      placement="bottom right"
      offset={5}
      disabledKeys={['Settings']}
      trigger={({ ...triggerProps }) => {
        return (
            <Pressable {...triggerProps} className={`self-center justify-end absolute  right-[-4px]  border-2 border-transparent rounded-full p-[4px] ${iconPressed ? (theme==='#ECEDEE' ? 'bg-white/20' : 'bg-white/40') : 'bg-transparent' } `}
                onPressIn={handleIconPressed}
                onPressOut={() => {setIconPressed(false)}}
            >
                <IconSymbol name='ellipsis.circle' size={24} color={theme} />
            </Pressable>
        );
      }}
      style={{backgroundColor: theme==='#ECEDEE' ? 'gray' : 'white'}}
    >
      <MenuItem key="Unfriend" textValue="Unfriend" className='flex gap-2' onPress={handleUnfriend}>
        <IconSymbol name='person.badge.minus.fill' size={24} color={theme==='#ECEDEE' ? 'white' : 'black'} />
        <MenuItemLabel size="md" color={theme==='#ECEDEE' ? 'white' : 'black'}>Unfriend</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

export default UserCardMenu;
