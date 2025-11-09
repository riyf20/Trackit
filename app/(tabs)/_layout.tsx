import { NativeTabs, Icon, Label, Badge } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/utils/authStore';


export default function TabLayout() {

  // Used to show badge
  const { invitesCount } = useAuthStore();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name='index'>
        <Label>Home</Label>
        <Icon 
          sf={{ default: "house", selected: "house.fill" }}
          drawable='ic_menu_mylocation' 
        />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="contracts">
        <Label>Contracts</Label>
        <Icon
          sf={{ default: "doc.text", selected: "doc.text.fill" }}
          drawable="ic_menu_manage"
        />
        {/* <Badge>2+</Badge> */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="logs">
        <Label>Logs</Label>
        <Icon 
          sf={{ default: "list.bullet.rectangle", selected: "list.bullet.rectangle.fill" }}
          drawable="ic_menu_manage" 
        />
        {/* <Badge>9+</Badge> */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="account">
        <Label>Account</Label>
        <Icon 
          sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }}
          drawable="ic_menu_manage" 
        />
        {invitesCount > 0 &&
          <Badge>{invitesCount.toString()}</Badge>
        }
      </NativeTabs.Trigger>
      
    </NativeTabs>
  );
}
