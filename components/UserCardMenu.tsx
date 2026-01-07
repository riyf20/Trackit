import { Menu, MenuItem, MenuItemLabel,
  Pressable,
} from '@gluestack-ui/themed'
import { IconSymbol } from './ui/icon-symbol';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/utils/authStore';

// Option menu to unfriend 
const UserCardMenu = ({handleUnfriend}:UserCardMenuProps) => {

  const {theme} = useAuthStore()
  
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
          <Pressable {...triggerProps} className={`self-center justify-end absolute  right-[-4px]  border-2 border-transparent rounded-full p-[4px] ${iconPressed ? (theme==='dark' ? 'bg-white/20' : 'bg-white/40') : 'bg-transparent' } `}
            onPressIn={handleIconPressed}
            onPressOut={() => {setIconPressed(false)}}
          >
            <IconSymbol name='ellipsis.circle' size={24} color={theme==='dark' ? 'white' : 'black'} />
          </Pressable>
        );
      }}
      style={{backgroundColor: theme==='dark' ? 'gray' : 'white'}}
    >
      <MenuItem key="Unfriend" textValue="Unfriend" className='flex gap-2' onPress={handleUnfriend}>
        <IconSymbol name='person.badge.minus.fill' size={24} color={theme==='dark' ? 'white' : 'black'} />
        <MenuItemLabel size="md" color={theme==='dark' ? 'white' : 'black'}>Unfriend</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

export default UserCardMenu;
