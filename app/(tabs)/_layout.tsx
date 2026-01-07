import { NativeTabs, Icon, Label, Badge } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useAuthStore } from '@/utils/authStore';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from "expo-router";
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/icon-symbol';

// [Tab Bar] - Dynamic tab bar styling
export default function TabLayout() {

  // Used to show badge and theme styling
  const { invitesCount, theme } = useAuthStore();

  return (
    isLiquidGlassAvailable() ?
    
    // Liquid Glass Tab Bar 
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
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="logs">
        <Label>Logs</Label>
        <Icon 
          sf={{ default: "list.bullet.rectangle", selected: "list.bullet.rectangle.fill" }}
          drawable="ic_menu_manage" 
        />
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
    :
    // Default Tab Bars
    <Tabs
      screenOptions={{
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconSymbol name={focused ? 'house.fill' : 'house'} size={28} color={focused ? '#0088FF' : theme==='dark' ? 'white' : 'black'} />
          ),
        }}
      />

      <Tabs.Screen
        name="contracts"
        options={{
          title: "Contracts",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconSymbol name={focused ? 'doc.text.fill' : 'doc.text'} size={28} color={focused ? '#0088FF' : theme==='dark' ? 'white' : 'black'} />
          ),
        }}
      />

      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconSymbol name={focused ? 'list.bullet.rectangle.fill' : 'list.bullet.rectangle'} size={28} color={focused ? '#0088FF' : theme==='dark' ? 'white' : 'black'} />        
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
          tabBarBadge: invitesCount > 0 ? invitesCount : undefined,
          tabBarBadgeStyle:{top: -6,},
          tabBarIcon: ({ focused }) => (
            <IconSymbol name={focused ? 'person.crop.circle.fill' : 'person.crop.circle'} size={28} color={focused ? '#0088FF' : theme==='dark' ? 'white' : 'black'} />        
          ),
        }}
      />
    </Tabs>
      
  );
}
