import { ColorValue, } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, ButtonText, View } from '@gluestack-ui/themed';
import { useAuthStore } from '@/utils/authStore';
import { GlassView } from 'expo-glass-effect';
import { useState } from 'react';

// [Home Tab] - Quick overview of contracts and current progress
// TO DO: Finish implementation
export default function HomeScreen() {

  const {username} = useAuthStore()

  const [color, setColor] = useState<ColorValue>('green')
  return (
    <ThemedView style={{}}>
      <GlassView
        style={{        
          height: '16%',
          position: 'fixed',
          top: -1,
          left: 0,
          width: '101%',
          alignSelf: 'center',
          justifyContent: 'center',
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          overflow: 'hidden',
          borderColor: color,
          borderWidth: 2,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
        }}
      >
        <View className='px-[20px] mt-[44px] ml-[10px]'>
          <ThemedText type='title'>Hello {username} 👋</ThemedText>
          <ThemedText type='defaultSemiBold' lightColor='gray' darkColor='gray' className='mt-[6px]'>Keep pushing, your habits are paying off</ThemedText>
        </View>
      </GlassView>

      <View className='mt-[20px] flex w-full h-full gap-[20px] items-center'>
        <Button className='w-[40%]' onPress={() => {setColor('blue')}}>
          <ButtonText>Blue</ButtonText>
        </Button>
        <Button className='w-[40%]' onPress={() => {setColor('green')}}>
          <ButtonText>Green</ButtonText>
        </Button>
        <Button className='w-[40%]' onPress={() => {setColor('red')}}>
          <ButtonText>Red</ButtonText>
        </Button>
        <Button className='w-[40%]' onPress={() => {setColor('purple')}}>
          <ButtonText>Purple</ButtonText>
        </Button>
        <Button className='w-[40%]' onPress={() => {setColor('pink')}}>
          <ButtonText>Pink</ButtonText>
        </Button>
        <Button className='w-[40%]' onPress={() => {setColor('yellow')}}>
          <ButtonText>Yellow</ButtonText>
        </Button>

      </View>
    </ThemedView>
  )
}
