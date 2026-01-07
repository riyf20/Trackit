import React, { useEffect, useState,  } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Button, ButtonText, ButtonGroup, 
    Heading, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import { useHapticFeedback} from '@/components/HapticTab';
import { IconSymbol } from "./ui/icon-symbol";
import ToastAlert from "./ToastAlert";
import { ThemedText } from "./themed-text";
import { ScrollView } from "react-native-gesture-handler";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { LinearGradient } from "expo-linear-gradient";

// Image/video picker for logs
// TO DO: allows users to remove media
const ImageUploaderLogs = ({setClose, selectedPictures, setSelectedPictures, thumbnails, setThumbnails}:ImageUploaderLogsProps) => {

    const [alertModal, setAlertModal] = useState(false);

    const [selectedItems, setSelectedItems] = useState<ImagePicker.ImagePickerAsset[]>([])

    useEffect(() => {
      setSelectedItems(selectedPictures)
      setVideoThumbnails(thumbnails)
    }, [selectedPictures, thumbnails])
    

    // Browse files for image
    const handleBrowseFiles = async () => {

        // Ask for permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access media library is required!');
            return;
        }

        // Open picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            quality: 1,
            base64: true,
        });

        if (result.canceled) return;

        const pickedItems = result.assets;

        // This merges users previously selected with newly selected
        setSelectedItems(prev => {
            // Merges them
            const merged = [...prev, ...pickedItems];

            // Maps and keep unique ones [removes the duplicates]
            const unique = Array.from(
                new Map(
                    merged.map(item => [
                        item.assetId ?? item.uri,
                        item
                    ])
                ).values()
            )
            return unique;
        })
        
    };

    // Media counts
    const [pictureCount, setPictureCount] = useState(0);
    const [videoCount, setVideoCount] = useState(0);

    // Recalculates media counts if selection is altered
    useEffect(() => {
        let pics = 0
        let vids = 0
        selectedItems.forEach((asset) => {
            if(asset.type === 'image') {
                pics++
            } else if(asset.type === 'video') {
                vids++
            } 
        })
        setPictureCount(pics)
        setVideoCount(vids)
    },[selectedItems])
    

    const haptic = useHapticFeedback();
    
    // TO DO: allow for video playback
    // TO DO: pressing image opens a viewer
    const handleVideoPress = () => {
        console.log("implement a video player later...")
    }
    
    // Holds thumbnail view for all videos
    const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
    
    // Calculates thumbnail images
    useEffect(() => {
        selectedItems.forEach(async (item) => {
            if(item.type === 'video' && !videoThumbnails[item.uri]) {
                try {
                    const {uri} = await VideoThumbnails.getThumbnailAsync(
                        item.uri,
                        { time: 500 }
                    );
                    
                    setVideoThumbnails(prev => ({
                        ...prev,
                        [item.uri]: uri
                    }))
                } catch (error:any) {
                    console.log('[ImageUploaderLogs.tsx]: Error making thumbnail')
                }
            }
        })
    }, [selectedItems])
    
    // Saves the selected media and thumbnails
    const handleSave = () => {
        if(selectedItems.length > 0) {
            setSelectedPictures(selectedItems)
            setThumbnails(videoThumbnails)
            setAlertModal(true);
        }
        setClose();
    }
    
    return (
    <>

        <View className="">

            <HStack className="justify-between w-full">
                <VStack className="flex gap-[4px]">
                    <Heading size="md" className="font-semibold" color="black" >
                        Add Pictures | Videos
                    </Heading>
                    <Text size="sm" color="dimgray" >Optional for Beginner and Easy contracts</Text>
                </VStack>
            
                {/* Close sheet button */}
                <Pressable onPress={setClose} onPressIn={haptic} className="self-center">
                    <IconSymbol name='multiply.circle' size={40} color={'black'}  />
                </Pressable>

            </HStack>

            {/* top Half */}
            <View>

                <View className="flex flex-row items-center mt-[20px] mb-[10px]">
                    <ThemedText type="onboardingMain" darkColor="black">Preview</ThemedText>
                </View>
                <View className={`flex-row gap-[6px] items-center justify-center rounded-xl bg-[gray] ${selectedItems.length === 0 ? 'h-[160px]' : 'h-[240px]' } `}>
                    {selectedItems.length === 0 ?
                        <>
                        <ThemedText type="difficultyTitle" className="p-5 rounded-xl bg-[gray]" darkColor="black">No media has been added.</ThemedText>
                        </>
                        :
                        <>
                        <ScrollView
                            horizontal={true}
                            style={{ }}
                            contentContainerStyle={{gap: 12, marginLeft: 10}}
                            showsHorizontalScrollIndicator={false}
                        >
                            {selectedItems.map((item:ImagePicker.ImagePickerAsset, index:number) => (
                                item.type==='image' ? (
                                    <Image
                                        source={{uri: item.uri}}
                                        className='w-[200px] h-[200px] rounded-xl '
                                        resizeMode="cover"
                                        key={item.assetId}
                                    />
                                ) : (
                                    
                                    <TouchableOpacity
                                        key={item.assetId ?? item.uri}
                                        className="relative"
                                        onPress={handleVideoPress}
                                    >
                                        <Image 
                                            source={{uri: videoThumbnails[item.uri]}}
                                            className='w-[200px] h-[200px] rounded-xl '
                                            resizeMode="cover"
                                        />
                                        <View className="absolute inset-0 items-center justify-center bg-black/60 rounded-xl" >
                                            <IconSymbol name="play.circle.fill" size={48} color={'white'} />
                                        </View>
                                    </TouchableOpacity>
                                    
                                )
                            ))}
                        </ScrollView>
                        </>
                        }

                </View>
                
            </View>

            {/* bottom half */}
            <View>
                {selectedItems.length === 0 ?
                    <>
                        <View className='flex flex-row justify-evenly w-full items-center mt-[20px]'>
                            <View className="flex flex-row justify-center items-center gap-[6px] bg-[dimgray] pr-[12px] rounded-xl">
                                <View className='w-[50px] h-[50px] flex items-center justify-center bg-[dimgray] rounded-xl'>
                                    <IconSymbol name={'photo.fill'} size={32} color={'white'} />
                                </View>
                                <ThemedText darkColor="white" lightColor="white">{pictureCount} Pictures</ThemedText>
                            </View>
                            <View className="flex flex-row justify-center items-center gap-[6px] bg-[dimgray] pr-[12px] rounded-xl">
                                <View className='w-[50px] h-[50px] flex items-center justify-center bg-[dimgray] rounded-xl'>
                                    <IconSymbol name={'video.fill'} size={32} color={'white'} />
                                </View>
                                <ThemedText darkColor="white" lightColor="white">{videoCount} Videos</ThemedText>
                            </View>
                        </View>
                        <TouchableOpacity style={{width: 'auto', height: 130, backgroundColor: 'gray', borderStyle: 'dashed', borderWidth: 2, borderRadius: 10, marginTop: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20}} onPress={() => {handleBrowseFiles()}}>
                            <View className='flex flex-row items-center justify-center gap-[6px]'>
                                <IconSymbol name={'square.and.arrow.up'} size={32} color={'black'} />
                                <Text style={{textAlign: 'center', color: 'black', fontSize: 20, marginTop: 6}}>Upload Media</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                    :
                        <>
                        <View className='flex flex-row justify-evenly w-full items-center mt-[28px]'>
                            <LinearGradient colors={["#1C8850", "#2C566F", "#2F4E73", "#314977",]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: 'dimgray', paddingRight: 12, borderRadius: 12}}>
                                <View className='w-[50px] h-[50px] flex items-center justify-center rounded-xl'>
                                    <IconSymbol name={'photo.fill'} size={32} color={'white'} />
                                </View>
                                <ThemedText darkColor="white" lightColor="white">{pictureCount} {pictureCount > 1 || pictureCount === 0 ? 'Pictures' :  'Picture'}</ThemedText>
                            </LinearGradient>
                            <LinearGradient colors={["#1C8850", "#2C566F", "#2F4E73", "#314977",]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: 'dimgray', paddingRight: 12, borderRadius: 12}}>
                                <View className='w-[50px] h-[50px] flex items-center justify-center rounded-xl'>
                                    <IconSymbol name={'video.fill'} size={32} color={'white'} />
                                </View>
                                <ThemedText darkColor="white" lightColor="white">{videoCount} {videoCount > 1 || videoCount === 0 ? 'Videos' :  'Video'}</ThemedText>
                            </LinearGradient>
                            
                        </View>
                        <View style={{width: 'auto', height: 50, marginTop: 32, marginBottom: 0, alignItems: 'center'}}>
                            <TouchableOpacity style={{width: '60%', backgroundColor: '#0088FF', borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12, padding: 10}} onPress={() => {handleBrowseFiles()}}>
                                <IconSymbol name={'plus.rectangle.fill.on.rectangle.fill'} size={32} color={'white'} />
                                <ThemedText lightColor="white">Add Items</ThemedText>
                            </TouchableOpacity>
                        </View>
                        </>
                }

            </View>
  
            {/* Button bar */}
            <View className="fixed bottom-[-6%]">
                <ButtonGroup className="flex justify-center">

                    <Button className="w-[50%]" variant="solid" action="secondary" onPress={setClose}>
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button className="w-[50%]" variant="solid" action="positive" onPress={() => {handleSave()}} >
                        <ButtonText>Save</ButtonText>
                    </Button>
                </ButtonGroup>
            </View> 

            <ToastAlert parent={'createLogs'} show={alertModal}/>
        
        </View>    
        
    </>
    );
}

export default ImageUploaderLogs
