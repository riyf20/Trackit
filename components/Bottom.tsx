import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {Dimensions, Text, View} from 'react-native'
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import ImageUploader from './ImageUploader';
import { useThemeColor } from '@/hooks/use-theme-color';

const Bottom =  forwardRef<BottomSheetHandle, BottomProps>(({ parent, keyboard, altered, setAltered}, ref) => {
  
  // Reference so it can connect to parent
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Functions that can be called
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetModalRef.current?.present(),
    commentUp: () => bottomSheetModalRef.current?.snapToIndex(2),
    commentDown: () => bottomSheetModalRef.current?.snapToIndex(1),
    close: () => bottomSheetModalRef.current?.close(),
  }));

  const points = ['80%'];
  const [dynamicHeight, setDynamicHeight] = useState(0);

  // Closes sheet
  const closeBottom = () => {
    bottomSheetModalRef.current?.close();
  }
  
  // Stores window size
  const windowHeight = Dimensions.get('window').height;

  const animatedPosition = useSharedValue(0);

  // Listen for position changes | Found this speed/size to work the best
  useAnimatedReaction(
    () => animatedPosition.value,
    (pos) => {
      let multiplier;

      if (pos >= 372) {
        // Between 650 and 372 | Bottom to mid
        multiplier = 0.1 + ((pos - 650) / (372 - 650)) * (0.4 - 0.1);
      } else {
        // Between 372 and 93 | mid to top
        multiplier = 0.4 + ((pos - 372) / (93 - 372)) * (0.7 - 0.4);
      }

      // Buffer so it doesnt go fully behind field | 88 is currently the best 
      const commentFieldBuffer = 88
      runOnJS(setDynamicHeight)((windowHeight * multiplier)-commentFieldBuffer);
      
    }
  );

  const theme = useThemeColor({}, 'text');
  
  return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={points}
          enablePanDownToClose={parent==='profile' ? true : false}
          enableContentPanningGesture={parent === 'profile' ? true : false}
          enableHandlePanningGesture={keyboard ? false : true}
          enableDynamicSizing={false}
          animatedPosition={animatedPosition}
          backgroundStyle={{
            backgroundColor: `${theme==='#ECEDEE' ? `darkgrey` : `lightgrey`}`,
          }}
          style={{
            borderColor: `${theme==='#ECEDEE' ? `lightgrey` : `black`}`,
            borderWidth: 2,
            borderRadius: 18,
            width: '100%',
          }}
          index={0} //starts at this index when opened
          animateOnMount={parent==='profile' ? true : false}
          handleComponent={() => (
              // Style for Handle indicator
              <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                <View style={{
                  backgroundColor: '#2F4858',
                  width: 45,
                  height: 4,
                  borderRadius: 2,
                  marginBottom: 6
                }}/>

                {/* Title | can reuse for other component later on */}
                {/* {parent==='profile' && (
                  <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20 }}>Change Profile Picture</Text>
                )} */}
              </View>
            )}
        >

          {/* Shows context here */}
          <BottomSheetView className="flex-1 items-center p-4 bg-#[121C22] z-50">

            <ImageUploader setClose={closeBottom} setAltered={setAltered}/>
            
          </BottomSheetView>
        </BottomSheetModal>

      </BottomSheetModalProvider>
  );
});

export default Bottom;