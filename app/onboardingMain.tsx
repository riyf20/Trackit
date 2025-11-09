import { View, Text, ImageBackground, Image, Button, Pressable, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { images } from '@/constants/images'
import { ThemedText } from '@/components/themed-text'
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import { useAuthStore } from '@/utils/authStore';
import { AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@gluestack-ui/themed';
import FormInput from '@/components/FormInput';
import { useWindowDimensions } from 'react-native';
import { checkUser } from '@/services/appwriteUsers';
import { loginUser, createUser, getUser } from '@/services/appwriteAccount';
import { checkUserProfilePicture, getUserProfilePicture } from '@/services/appwriteStorage';
import { useHapticFeedback as haptic} from '@/components/HapticTab';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import * as Haptics from 'expo-haptics';
import { addUserTable } from '@/services/appwriteDatabase';


// Log/Sign up page
const onboardingMain = () => {

  // Debug switch
  const debug = true;

  const {onboardingReset, logIn} = useAuthStore()

  // Shows sign up fields
  const [showForm, setShowForm] = useState(false);
  const { width } = useWindowDimensions();


  // Animation values
  const subtitleOpacity = useSharedValue(1);
  const signInOpacity = useSharedValue(1);
  const formOpacity = useSharedValue(0);
  const signUpTranslateY = useSharedValue(0);
  const signUpWidth = useSharedValue(width);
  const buttonTextOpacity = useSharedValue(1);
  const keyboardshift = useSharedValue(0);

  // Animation value links
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));
  const signInStyle = useAnimatedStyle(() => ({
    opacity: signInOpacity.value,
  }));
  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));
  const signUpStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: signUpTranslateY.value }
    ],
    width: signUpWidth.value ,
  }));
  const buttonTextStyle = useAnimatedStyle(() => ({
    opacity: buttonTextOpacity.value,
  }));
  const keyboardShiftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: keyboardshift.value }
    ],
  }));

  // Form validity checks
  const [formInvalid, setFormInvalid] = useState(false)
  const [usernameInvalid, setUsernameInvalid] = useState(false)
  const [usernameValue, setUsernameValue] = useState('')
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [emailValue, setEmailValue] = useState('')

  // Form validity error messages
  const [error, setError] = useState('')

  // Log in form view 
  const handleLogInView = () => {

    setEmailValue("")
    setPasswordValue("")

    // Clears form errors
    setFormInvalid(false)
    setEmailInvalid(false)
    setUsernameInvalid(false)
    setPasswordInvalid(false)

    // Log in texts
    setFormTitle("Welcome back!")
    setFormSubtitle("Your progress is waiting.")

    // Fade out subtitle and sign-in button 
    subtitleOpacity.value = withTiming(0, { duration: 400 });
    signInOpacity.value = withTiming(0, { duration: 400 });
    buttonTextOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) { 
        runOnJS(setShowForm)(true);

        // Fade in form and move button
        formOpacity.value = withTiming(1, { duration: 400 });
        signUpTranslateY.value = withTiming(75, { duration: 400 });
        signUpWidth.value = withTiming(675, { duration: 400 });
        runOnJS(setButtonText)('Log In');
        buttonTextOpacity.value = withTiming(1, { duration: 800 }); 
      }
    });
  };

  // Switchs between form views
  const handleShowForm = () => {

    setUsernameValue("")
    setEmailValue("")
    setPasswordValue("")

    // Clears form errors
    setFormInvalid(false)
    setEmailInvalid(false)
    setUsernameInvalid(false)
    setPasswordInvalid(false)
    setError('')


    // Login form to signup form
    if(buttonText==='Log In') {
        
      runOnJS(setButtonText)('Sign Up');
      setFormTitle("Your new chapter awaits!")
      setFormSubtitle("Commit today and build habits that last.")
      signUpTranslateY.value = withTiming(125, { duration: 400 });
          
    } else {
      // Went directly to sign up (from main title screen)
      setFormTitle("Your new chapter awaits!")
      setFormSubtitle("Commit today and build habits that last.")
      
      // Fade out subtitle and sign-in button 
      subtitleOpacity.value = withTiming(0, { duration: 400 });
      signInOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) { 
          runOnJS(setShowForm)(true);
          // Fade in form and move sign-up button
          formOpacity.value = withTiming(1, { duration: 400 });
          signUpTranslateY.value = withTiming(125, { duration: 400 });
          signUpWidth.value = withTiming(675, { duration: 400 });
        }
      });
    }
  };
   
  const [buttonText, setButtonText] = useState('Sign Up');
  
  // Log in or sign up text
  const [formTitle, setFormTitle] = useState('')
  const [formSubtitle, setFormSubtitle] = useState('')

  const handleSignUp = async () => {

    // Logic Checks
    const requiredFields = [
      { value: emailValue, setInvalid: setEmailInvalid },
      { value: usernameValue, setInvalid: setUsernameInvalid },
      { value: passwordValue, setInvalid: setPasswordInvalid },
    ];
    
    let hasEmptyField = false;
    
    // Loops through all fields to check if empty --> show error if true
    requiredFields.forEach(({ value, setInvalid }) => {
      if (!value.trim()) {
        setInvalid(true);
        hasEmptyField = true;
      }
    });
    
    // Makes sure all fields are entered
    if (hasEmptyField) {
      setFormInvalid(true);
      setError("All fields are required.");
      signUpTranslateY.value = withTiming(150, { duration: 400 });
      return;
    }
    
    // Will attempt sign up

    const response = await checkUser(usernameValue);

    if(response) {
      
      // If response is true --> username already exists
      setFormInvalid(true);
      setUsernameInvalid(true);
      signUpTranslateY.value = withTiming(150, { duration: 400 });
      setError("This username already existed.");
    } else {
        
      // Username is not taken --> create the new user
      try {
        const response = await createUser(emailValue, passwordValue, usernameValue);

        
        // Add this new user to table
        try {
          const responseTable = await addUserTable(usernameValue)
          
          try {
            // Successfully created new user --> log in and create session
            const responseLogin = await loginUser(emailValue, passwordValue);

            // Save all data to device storage and login
            logIn({
              userId:usernameValue,
              username:usernameValue,
              password:passwordValue,
              email:emailValue,
              sessionID: responseLogin.$id,
              defaultPicture: true,
              profilePictureFileId: '',
              profilePictureFileUrl: ''
            });
            
          } catch (error:any) {
            setFormInvalid(true);
            signUpTranslateY.value = withTiming(150, { duration: 400 });
            setError("An unexpected error occured.");
          }

        } catch (error:any) {
          console.log("Error adding user to table")
          console.log(error)
          
          setFormInvalid(true);
          signUpTranslateY.value = withTiming(150, { duration: 400 });
          setError("An unexpected error occured.");
        }
      
      } catch (errorCreate:any) {

        // Catches invalid email
        if(errorCreate.code === 400 && errorCreate.message.includes('Invalid `email` param:')) {
          setFormInvalid(true);
          setEmailInvalid(true);
          signUpTranslateY.value = withTiming(150, { duration: 400 });
          setError("Please enter a valid email address.")

          // Catches invalid password
        } else if(errorCreate.code === 400 && errorCreate.message.includes('Invalid `password` param')) {
          setFormInvalid(true);
          setEmailInvalid(true);
          signUpTranslateY.value = withTiming(150, { duration: 400 });
          setError("Password must be 8-265 characters long.")

        } else {
          // Will catch other errors as well
          setFormInvalid(true);
          signUpTranslateY.value = withTiming(150, { duration: 400 });

          debug && console.log("error creating user");
          debug && console.log(errorCreate);
          debug && console.log(errorCreate.code);
          debug && console.log(errorCreate.message);

          setError("An unexpected error occured.");
        }
 
      }

    }

  }

  // Checks if user has profile picture | returns true/false
  const checkUserProfilePic = async (fileId:string) => {
    try {
      const userProfilePic = await checkUserProfilePicture(fileId)
            
      return true;
    } catch (error:any) {

      if(error.code === 404 && error.message.includes('file could not be found')) {
        return false;
      }
      console.log("Other error:")
      console.log(error)
      return false;
    }
  }

  // Grabs the url of profile picture based on id
  const getUserProfilePic = async (fileId:string) => {
    try {
      const profilePictureUrl = getUserProfilePicture(fileId);

      return profilePictureUrl;
    } catch (error:any) {
      console.log("Other error:")
      console.log(error)
      return '';
    }
  }

  const handleLogIn = async () => {

    // Logic Checks
    const requiredFields = [
      { value: emailValue, setInvalid: setEmailInvalid },
      { value: passwordValue, setInvalid: setPasswordInvalid },
    ];

    let hasEmptyField = false;

    // Loops through all fields to check if empty --> show error if true
    requiredFields.forEach(({ value, setInvalid }) => {
      if (!value.trim()) {
          setInvalid(true);
          hasEmptyField = true;
      }
    });

    // Makes sure all fields are entered
    if (hasEmptyField) {
      setFormInvalid(true);
      setError("All fields are required.");
      signUpTranslateY.value = withTiming(110, { duration: 400 });
      return;
    }

    try {
      // If user is found then login using email and password
      const userLoginResponse = await loginUser(emailValue, passwordValue);
      const userResponse = await getUser(userLoginResponse.$id);
      
      // Booleon value
      const userProfilePic = await checkUserProfilePic(userLoginResponse.userId);

      let userProfilePicUrl = ''
      if(userProfilePic) {
        userProfilePicUrl = await getUserProfilePic(userLoginResponse.userId);
      }
    
      // profile picture id will be userid 
      // both are immutable so they are both unique;

      // Store all user data on device
      logIn({
        password: passwordValue,
        email: emailValue,
        sessionID: userLoginResponse.$id,
        userId: userLoginResponse.userId,
        username: userResponse.name,
        defaultPicture: (!userProfilePic),
        profilePictureFileId:  `${userProfilePic ? userLoginResponse.userId : ''}`,
        profilePictureFileUrl:userProfilePicUrl,
      })
  
    } catch (errorUserLogin:any) {

      // Catches error in username/password 
      setFormInvalid(true);
      setUsernameInvalid(true);
      setPasswordInvalid(true);
      signUpTranslateY.value = withTiming(120, { duration: 400 });
      setError("Please check username and password.");

      debug && console.log(errorUserLogin)
      debug && console.log(errorUserLogin.code)
      debug && console.log(errorUserLogin.message)
    }
      
  }

  // Moves main button up after user types (typing clears error message --> resets view)
  useEffect(() => {
    if(buttonText==='Log In') {
      if (!formInvalid && error!='') {
        signUpTranslateY.value = withTiming((75), { duration: 400 });
      }
    } else {
      if (!formInvalid && error!='') {
        signUpTranslateY.value = withTiming((125), { duration: 400 });
      }
    }
  }, [formInvalid])
  
  const [clearButton, setClearButton] = useState(false);
  const [fullButton, setFullButton] = useState(false);

  const handleButton = (type:String) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if(type==="clear"){
      setClearButton(true);
    } else if(type==="full"){
      setFullButton(true);
    }
  }

  const [forgotPasswordShowModal, setForgotPasswordShowModal] = useState(false);

  // Animation to keep input fields in view when keyboard enters
  useEffect(() => {

    // if(forgotPasswordShowModal) {
      // If keyboard is shown
      const keyboardShow = Keyboard.addListener('keyboardWillShow', (e) => {

        let moveUp = 0
        if (buttonText==='Sign Up') {
          // move slightly higher as there are 3 input fields 
          moveUp = e.endCoordinates.height * 0.5; 
        } else if (buttonText==='Log In') {
          // move up enough to show input fields
          moveUp = e.endCoordinates.height * 0.4; 
        }
        keyboardshift.value = withTiming(-moveUp, { duration: 300 });
      });

      const keyboardHide = Keyboard.addListener('keyboardWillHide', () => {
        keyboardshift.value = withTiming(0, { duration: 300 });
      });
      return () => {
        keyboardShow.remove();
        keyboardHide.remove();
      };
    // }
  }, [buttonText]);

  return (
    <ImageBackground
      source={images.background}
      className='flex flex-1 justify-center items-center '
      resizeMode='cover'
    >

    {/* Animated view so it can move up if keyboard is shown */}
    <Animated.View style={keyboardShiftStyle} className='absolute top-0 left-0 w-full h-full z-0'>

    <View className="flex justify-center items-center w-full h-full">

      <BlurView
        intensity={40} 
        tint="light"   
        className="absolute top-[15%] rounded-3xl overflow-hidden shadow-black shadow-2xl"
      >
        <Image
          source={images.logo}
          className='w-[200px] h-[200px]'
          resizeMode="cover"
        />
      </BlurView>

      <Animated.View style={subtitleStyle} className='flex flex-row gap-2 relative top-[-6%] '>
        <Text className={`font-bold mb-4 text-white ${width < 380 ? 'text-[16px]' : width < 430 ? 'text-[18px]' : 'text-[20px]'}`} >Your habits.</Text>
        <Text className={`font-bold mb-4 text-white ${width < 380 ? 'text-[16px]' : width < 430 ? 'text-[18px]' : 'text-[20px]'}`} >Your contracts.</Text>
        <Text className={`font-bold mb-4 text-white ${width < 380 ? 'text-[16px]' : width < 430 ? 'text-[18px]' : 'text-[20px]'}`} >Your growth.</Text>
      </Animated.View>


      {/* Resets to user onboarding */}
      {debug &&
        <View className='absolute bottom-20'>
          <Button
            title="Reset Onboarding"
            onPress={() => {onboardingReset()}}
          />
        </View>
      }

      <View className='absolute bottom-[36%] flex gap-[30%] w-full justify-center items-center'>
        
        {/* Shows log in button [main title screen] */}
        <Animated.View style={signInStyle} className={'w-full flex items-center'}>
          
          <Pressable
            key={"clearButton"}
            className={`border-white p-4 rounded-2xl items-center bg-transparent w-[50%] border-2 ${clearButton && 'bg-slate-500 w-[48%] border-[1px] '}`}
            onPress={() => {handleLogInView()}}
            onPressIn={() => {handleButton("clear")}}
            onPressOut={() => {setClearButton(false)}}
          >
            <ThemedText type="onboarding" lightColor="white" className={` scale-100 ${clearButton && 'scale-90'}`}> Log in </ThemedText>
          </Pressable>
        </Animated.View>

        {showForm && (

          <Animated.View style={formStyle} className='absolute top-[-100px] flex justify-center items-center ' >
            
            <FormControl
              isInvalid={formInvalid}
              className='justify-center items-center'
            >
              <View className='flex flex-col gap-4 t-[12px]'>
                <Text className="font-bold text-center color-white text-4xl top-[12px]">{formTitle}</Text>
                <Text 
                  className='font-semibold text-center text-gray-400 mt-2 text-xl'  
                >{formSubtitle}</Text>
              </View>
              
              {buttonText==='Sign Up' &&
                (
                <Animated.View
                  entering={
                    FadeIn.duration(400)
                  }
                >
                  <FormInput invalid={usernameInvalid} placeholder='Username' value={usernameValue} parentInvalid={formInvalid} setValue={setUsernameValue} setValueInvalid={setUsernameInvalid} setParentInvalid={setFormInvalid} error={error} /> 
                </Animated.View>
                )
              }

              <Animated.View
                entering={
                  FadeIn.duration(400)
                  .reduceMotion(ReduceMotion.Never)
                }
              >
                <FormInput invalid={emailInvalid} placeholder='Email' value={emailValue} parentInvalid={formInvalid} setValue={setEmailValue} setValueInvalid={setEmailInvalid} setParentInvalid={setFormInvalid} error={error} />
              </Animated.View>

              <Animated.View
                entering={
                  FadeIn.duration(400)
                  .reduceMotion(ReduceMotion.Never)
                }
              >
                <FormInput invalid={passwordInvalid} placeholder='Password' value={passwordValue} parentInvalid={formInvalid} setValue={setPasswordValue} setValueInvalid={setPasswordInvalid} setParentInvalid={setFormInvalid} error={error} />
              </Animated.View>

              {/* TO DO: complete forgot password function [need to link email provider]*/}
              {/* {buttonText==='Log In' &&
                <Pressable  onPressIn={haptic()} onPress={() => {setForgotPasswordShowModal(true)}} className='self-end'>
                  <Text className='text-gray-400 underline'>Forgot your password?</Text> 
                </Pressable>
              } */}

              {formInvalid &&
                <View className={`${buttonText==='Log In' ? 'mt-[20px]' : 'mt-[4px]'} `}>
                  <FormControlError
                 className={`bg-red-300 rounded-3xl p-[2px] w-[300px] bottom-[10px] flex justify-center items-center `}
                >
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        {error}
                    </FormControlErrorText>
                </FormControlError>
                </View>
                
              }

            </FormControl>
          </Animated.View>
        )}

        <Animated.View style={signUpStyle} className={'w-full flex items-center'}>
        
          <Pressable
            key={"fullButton"}
            className={`p-4 rounded-2xl items-center bg-[#16182C] w-[50%] ${fullButton && 'bg-[#212241] w-[48%]'}`}
            onPressIn={() => {handleButton("full")}} 
            onPressOut={() => {setFullButton(false)}} 
            onPress={
              buttonText==='Sign Up' && showForm===true ? () => {handleSignUp()} 
              : buttonText==='Sign Up' && showForm===false ? () => {handleShowForm()}
              : buttonText==='Log In' ? () => {handleLogIn()} 
              : () => {}
            }
          >
            <Animated.View style={buttonTextStyle}>
              <ThemedText type="onboarding" lightColor="white" className={` scale-100 ${fullButton && 'scale-90'}`} >{buttonText}</ThemedText>
            </Animated.View>
          </Pressable>
        </Animated.View> 

        {showForm && 
        (
          buttonText==='Log In' ?
          <Animated.View 
            entering={
              FadeIn.duration(400)
              .delay(200)
            }
            className='absolute bottom-[-275px]'>
            <ThemedText type='subtitle' lightColor='white'>Don't have an account? <Text className='underline font-bold' onPressIn={haptic()} onPress={() => {handleShowForm()}}>Sign Up</Text></ThemedText>
          </Animated.View>
          :
          
          <Animated.View 
            entering={
              FadeIn.duration(400)
              .delay(200)
            }
            className='absolute bottom-[-275px]'>
            <ThemedText type='subtitle' lightColor='white'>Already have an account? <Text className='underline font-bold' onPressIn={haptic()} onPress={() => {handleLogInView()}}>Log In</Text></ThemedText>
          </Animated.View>
        )}
      </View>

    </View>
    </Animated.View>
    <ForgotPasswordModal forgotPasswordShowModal={forgotPasswordShowModal} setForgotPasswordShowModal={setForgotPasswordShowModal} />
    </ImageBackground>
  )
}

export default onboardingMain