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
import { checkUser,  } from '@/services/appwriteUsers';
import { loginUser, createUser } from '@/services/appwriteAccount';
import { useHapticFeedback as haptic} from '@/components/HapticTab';

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
  const [passwordValue, setPaswordValue] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [emailValue, setEmailValue] = useState('')

  // Form validity error messages
  const [error, setError] = useState('')

  // Log in form view 
  const handleLogInView = () => {

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
  
  // Animation to keep input fields in view when keyboard enters
  useEffect(() => {
    // If keyboard is shown
    const keyboardShow = Keyboard.addListener('keyboardWillShow', (e) => {

      let moveUp = 0
      console.log(buttonText);
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
  }, [buttonText]);

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
    try {

      const response = await checkUser(usernameValue);

      // If no error this username already exists
      setFormInvalid(true);
      setUsernameInvalid(true);
      signUpTranslateY.value = withTiming(150, { duration: 400 });
      setError("This username already existed.");

    } catch (error:any) {

      if(error.code === 404 && error.message.includes('ID could not be found.')) {
        
        // Username is not take --> create the new user
        try {
          const response = await createUser(emailValue, passwordValue, usernameValue);

          // Successfully created new user --> log in and create session
          try {

            const responseLogin = await loginUser(emailValue, passwordValue);

            // Save all data to device storage and login
            logIn({
              username:usernameValue,
              password:passwordValue,
              email:emailValue,
              sessionID: responseLogin.$id,
            });
            
          } catch (error:any) {
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

      } else {
        // Other types of error
        setFormInvalid(true);
        signUpTranslateY.value = withTiming(150, { duration: 400 });
        
        debug && console.log("Error checking if userid exists during sign up");
        debug && console.log(error.message);
        
        setError("An unexpected error occured.");
      }

    }


  }

  const handleLogIn = async () => {

    // Logic Checks
    const requiredFields = [
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
      signUpTranslateY.value = withTiming(110, { duration: 400 });
      return;
    }

    try {
      // Check to see if the user exists
      const userResponse = await checkUser(usernameValue);

      try {
        // If user is found then login using email and password
        const userLoginResponse = await loginUser(userResponse.email, passwordValue);

        debug && console.log(userLoginResponse);
        debug && console.log(userLoginResponse.$id);

        // Store all user data on device
        logIn({
          username: usernameValue,
          password: passwordValue,
          email: userResponse.email,
          sessionID: userLoginResponse.$id,
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
      
    } catch (errorUser:any) {

      // Catches if user id could not be found
      setFormInvalid(true);
      setUsernameInvalid(true);
      setPasswordInvalid(true);
      signUpTranslateY.value = withTiming(120, { duration: 400 });

      if(errorUser.code === 404 && errorUser.message.includes("ID could not be found")) {
        setError("Please check username and password.");
      } else {
        setError("An unexpected error occured.")
      }
      
      // debug && console.log(errorUser)
      // debug && console.log(errorUser.code)
      // debug && console.log(errorUser.message)
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
            className="bg-transparent border-2 border-white p-4 rounded-2xl items-center w-[50%]"
            onPress={() => {handleLogInView()}}
            onPressIn={haptic()}
            /* TO DO: add effect to the button being pressed */
          >

            <ThemedText type="onboarding" lightColor="white"> Log in </ThemedText>
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
                  <FormInput invalid={emailInvalid} placeholder='Email' value={emailValue} parentInvalid={formInvalid} setValue={setEmailValue} setValueInvalid={setEmailInvalid} setParentInvalid={setFormInvalid} error={error} />
                </Animated.View>
                )
              }

              <Animated.View
                entering={
                  FadeIn.duration(400)
                  .reduceMotion(ReduceMotion.Never)
                }
              >
                <FormInput invalid={usernameInvalid} placeholder='Username' value={usernameValue} parentInvalid={formInvalid} setValue={setUsernameValue} setValueInvalid={setUsernameInvalid} setParentInvalid={setFormInvalid} error={error} /> 
              </Animated.View>

              <Animated.View
                entering={
                  FadeIn.duration(400)
                  .reduceMotion(ReduceMotion.Never)
                }
              >
                <FormInput invalid={passwordInvalid} placeholder='Password' value={passwordValue} parentInvalid={formInvalid} setValue={setPaswordValue} setValueInvalid={setPasswordInvalid} setParentInvalid={setFormInvalid} error={error} />
              </Animated.View>

              {/* TO DO: complete forgot password function */}
              {buttonText==='Log In' &&
                <Pressable  onPressIn={haptic()} onPress={() => {console.log('forgot password function')}} className='self-end'>
                  <Text className='text-gray-400 underline'>Forgot your password?</Text> 
                </Pressable>
              }

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
            className="bg-[#16182C] p-4 rounded-2xl items-center w-[50%]"
            onPressIn={haptic()}
            onPress={
              buttonText==='Sign Up' && showForm===true ? () => {handleSignUp()} 
              : buttonText==='Sign Up' && showForm===false ? () => {handleShowForm()}
              : buttonText==='Log In' ? () => {handleLogIn()} 
              : () => {}
            }
          >
            <Animated.View style={buttonTextStyle}>
              <ThemedText type="onboarding" lightColor="white">{buttonText}</ThemedText>
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
    </ImageBackground>
  )
}

export default onboardingMain