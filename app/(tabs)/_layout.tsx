import { NativeTabs, Icon, Label, Badge } from 'expo-router/unstable-native-tabs';
import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// use for habtics later ^
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DynamicColorIOS } from 'react-native';


export default function TabLayout() {
  const colorScheme = useColorScheme();

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
        {/* <Badge>9+</Badge> */}
      </NativeTabs.Trigger>
      
    </NativeTabs>
  );
}
