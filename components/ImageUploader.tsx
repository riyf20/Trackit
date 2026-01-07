import React, { useEffect, useState,  } from "react";
import { View, Image } from "react-native";
import { Box, Button, ButtonText, ButtonGroup, 
    Heading, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import { useHapticFeedback} from '@/components/HapticTab';
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/utils/authStore";
import { images } from "@/constants/images";
import { deleteUserProfilePicture, getUserPicture } from "@/services/appwriteStorage";
import {updateUserProfilePicture} from '@/services/appwriteStorageWeb'
import AlertModal from "./AlertModal";
import { router } from "expo-router";
import { updatePictureTable } from "@/services/appwriteDatabase";


// [Imported from BlogApp] A customized image picker for user's profile picture
const ImageUploader = ({setClose, setAltered}:ImageUploaderProps) => {

    const {userId, profilePictureFileId, profilePictureFileUrl, 
        updateProfilePicture, deleteProfilePicture} 
    = useAuthStore()
    const [basePicture, setBasePicture] = useState(true);

    const [changes, setChanges] = useState(false);
    const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [reverted, setReverted] = useState(false);

    const [alertModal, setAlertModal] = useState(false);

    const [uploading, setUploading] = useState(true);
   
    useEffect(() => {

       if(profilePictureFileId.trim() && profilePictureFileUrl.trim()) {
         setBasePicture(false);
       }
   
    }, [profilePictureFileId])

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
            mediaTypes: ['images'],
            allowsMultipleSelection: false,
            quality: 1,
            base64: true,
        });

        if (result.canceled) return;


        const pickedImage = result.assets[0];
        setNewImage(pickedImage);
        
        setChanges(true);
        
    };

    const haptic = useHapticFeedback();

    const handleRevert = () => {
        setChanges(true);
        setReverted(true);
    }

    const handleSave = async () => {

        if(!changes) {
            console.log("no changes")
            setClose()
        } else {
            
            // If user made any changes
            if(reverted) {
                
                // If user reverted back to default profile picture
                try {
                    setUploading(true);
                    setAlertModal(true);

                    const remove = await deleteUserProfilePicture(profilePictureFileId);

                    // Send the url to table
                    try {
                        const response = await updatePictureTable(userId, '');
                    } catch (error:any) {
                        console.log("Error adding picture url to table [reverting]")
                        console.log(error)
                    }

                    updateProfilePicture("","", true);

                    setUploading(false);
                } catch (error:any) {
                    console.log("Error during reverting")
                    console.log(error.code)
                    console.log(error.message)
                }

            } else { // If user did not revert | they changed active picture
                
                if(newImage !== null) { // User choose a new picture
                    

                    if(!basePicture) { // User changing from an old picture to new picture
                        try {
                            // Show loading modal
                            setUploading(true);
                            setAlertModal(true);
                            
                            // Remove old picture from database
                            const remove = await deleteUserProfilePicture(profilePictureFileId);

                            // Remove old picture from device storage [metadata not actual image deletion]
                            deleteProfilePicture;
    
                            try {
                                // Uploads the new picture with all necessary metadata
                                const add = await updateUserProfilePicture(userId, newImage.uri, newImage.fileName!, newImage.mimeType!, newImage.fileSize!)

                                // Grabs url of the new picture
                                const newUrl = getUserPicture(userId);

                                // Send the url to table
                                try {
                                    const response = await updatePictureTable(userId, newUrl);
                                } catch (error:any) {
                                    console.log("Error adding picture url to table [old pic --> new pic]")
                                    console.log(error)
                                }

                                // Saves url and image data to device storage
                                updateProfilePicture(userId, newUrl, false);

                                // Turns loading modal off --> changes to confirmation modal/message
                                setUploading(false);
                            } catch (error:any) {
                                console.log("error during adding")
                            }
        
                            setAlertModal(true);
                        } catch (error:any) {
                            console.log("Error during updating picture")
                            console.log(error.code)
                            console.log(error.message)
                        }
                    } else{ // User changing from default picture to new picture
                        try {
                            // Show loading modal
                            setUploading(true);
                            setAlertModal(true);

                            // Uploads the new picture with all necessary metadata
                            const add = await updateUserProfilePicture(userId, newImage.uri, newImage.fileName!, newImage.mimeType!, newImage.fileSize!)
                            
                            // Grabs url of the new picture
                            const newUrl = getUserPicture(userId);

                            // Send the url to table
                            try {
                                const response = await updatePictureTable(userId, newUrl);
                            } catch (error:any) {
                                console.log("Error adding picture url to table [default --> new pic]")
                                console.log(error)
                            }

                            // Saves url and image data to device storage
                            updateProfilePicture(userId, newUrl, false);

                            // Turns loading modal off --> changes to confirmation modal/message
                            setUploading(false);
                            
                        } catch (error:any) {
                            console.log("Error during adding picture")
                            console.log(error)
                            console.log(error.message)
                        }
                    }
                } 
            }
        }
    }

    // State if any changes were made
    useEffect(() => {
        setAltered(changes);
    }, [changes])
    
    
    return (
    <>

        <View className="">

            <HStack className="justify-between w-full">
                <VStack className="flex gap-[4px]">
                    <Heading size="md" className="font-semibold" color="black" >
                        Change Profile Picture
                    </Heading>
                    <Text size="sm" color="gray" >JPG, PNG, IMG supported</Text>
                </VStack>
            
                {/* Close sheet button */}
                <Pressable onPress={setClose} onPressIn={haptic} className="self-center">
                    <IconSymbol name='multiply.circle' size={40} color={'black'}  />
                </Pressable>

            </HStack>

            <Box className="my-[8px] items-center justify-center rounded-xl bg-background-50 bg-[A9A9A9]">

                {changes ? 
                    <Image
                        source={reverted ? images.profile : {uri: newImage?.uri} } 
                        className='w-[250px] h-[250px] rounded-3xl self-center my-[12px]'
                        resizeMode="cover"
                    /> 
                :
                    <Image
                        source={basePicture ? images.profile : {uri: profilePictureFileUrl} } 
                        className='w-[250px] h-[250px] rounded-3xl self-center my-[12px]'
                        resizeMode="cover"
                    />
                }

            </Box> 
            
            {/* Button bar */}
            {!basePicture &&
            <ButtonGroup className="flex justify-center ">
                <Button className="w-[100%] rounded-3xl" variant="link" action="secondary" onPress={() => {handleRevert()}}>
                    <ButtonText>Revert to Default</ButtonText>
                </Button>
            </ButtonGroup>
            }
            <ButtonGroup className={`flex justify-center ${!basePicture ? 'mt-[10px]' : 'mt-[30px]'} `}>
                <Button className="w-[50%] align-middle gap-2" onPress={handleBrowseFiles} >
                    <IconSymbol name='square.and.pencil' size={24} color={'white'}  />
                    <ButtonText>Change</ButtonText>
                </Button>
            </ButtonGroup>

            <View className="absolute bottom-[-24%] mt-[-20px]">
                <ButtonGroup className="flex justify-center">

                    <Button className="w-[50%]" variant="solid" action="secondary" onPress={setClose}>
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button className="w-[50%]" variant="solid" action="positive" onPress={() => {handleSave()}} >
                        <ButtonText>Save</ButtonText>
                    </Button>
                </ButtonGroup>
            </View> 

            <AlertModal modalOpened={alertModal} confirmFunction={() => router.back()} setModalOpened={setAlertModal} isLoading={uploading} />
        
        </View>    
        
    </>
    );
}

export default ImageUploader;