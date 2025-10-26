import { View, Text, ImageBackground, Image, Button, Pressable, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { images } from '@/constants/images'
import { ThemedText } from '@/components/themed-text'
import { BlurView } from 'expo-blur';
import Animated, { BounceIn, FadeIn, FadeInUp, FadeOut, ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withTiming, Layout, LinearTransition, FadeOutUp } from 'react-native-reanimated';
import { useAuthStore } from '@/utils/authStore';
import { AlertCircleIcon, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, Input, InputField, InputIcon, InputSlot } from '@gluestack-ui/themed';
import FormInput from '@/components/FormInput';
import { useWindowDimensions } from 'react-native';



const onboardingMain = () => {

  const {onboardingReset, logIn} = useAuthStore()

  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const { width } = useWindowDimensions();


  const subtitleOpacity = useSharedValue(1);
  const signInOpacity = useSharedValue(1);
  const formOpacity = useSharedValue(0);
  const signUpTranslateY = useSharedValue(0);
  const signUpWidth = useSharedValue(width);
  const buttonTextOpacity = useSharedValue(1);
  const keyboardshift = useSharedValue(0);

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

  const [formInvalid, setFormInvalid] = useState(false)
  
  const [usernameInvalid, setUsernameInvalid] = useState(false)
  const [usernameValue, setUsernameValue] = useState('')
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [passwordValue, setPaswordValue] = useState('')
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [emailValue, setEmailValue] = useState('')

  const [error, setError] = useState('')

  
  
  const handleLogIn = () => {
    setFormInvalid(false)
    setEmailInvalid(false)
    setUsernameInvalid(false)
    setPasswordInvalid(false)

    setMainAction('Log in function');
    setFormTitle("Welcome back!")
    setFormSubtitle("Your progress is waiting.")
    // Fade out subtitle and sign-in button 
    subtitleOpacity.value = withTiming(0, { duration: 400 });
    signInOpacity.value = withTiming(0, { duration: 400 });
    buttonTextOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) { 
        runOnJS(setShowForm)(true);
        // Fade in form and move sign-up button
        formOpacity.value = withTiming(1, { duration: 400 });
        signUpTranslateY.value = withTiming(75, { duration: 400 });
        signUpWidth.value = withTiming(675, { duration: 400 });
        runOnJS(setButtonText)('Log In');
        buttonTextOpacity.value = withTiming(1, { duration: 800 }); 
      }
    });
  };
  const handleShowForm = () => {

    if(buttonText==='Log In') {
        // emailOpacity.value = withTiming(0, { duration: 400 });
        
        runOnJS(setButtonText)('Sign Up');
        setMainAction('Log in function');
        setFormTitle("Your new chapter awaits!")
        setFormSubtitle("Commit today and build habits that last.")
        // emailOpacity.value = withTiming(1, { duration: 400 });
        signUpTranslateY.value = withTiming(125, { duration: 400 });
          
    } else {
      setMainAction('Log in function');
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
  const [mainAction, setMainAction] = useState('sign up function');
  
  const [formTitle, setFormTitle] = useState('')
  const [formSubtitle, setFormSubtitle] = useState('')
  
  useEffect(() => {
    const keyboardShow = Keyboard.addListener('keyboardWillShow', (e) => {
      // Move up smoothly based on keyboard height, but not too far
      let moveUp = 0
      if (buttonText==='Sign Up') {
        moveUp = e.endCoordinates.height * 0.5; // adjust 0.3–0.4 range for your design 
      } else if (buttonText==='Log In') {
        moveUp = e.endCoordinates.height * 0.3; // adjust 0.3–0.4 range for your design 
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
  }, []);

  const handleSignUp = () => {

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

    if (hasEmptyField) {
      setFormInvalid(true);
      setError("Username and Password is required.");
      return;
    }

    console.log('Email = ', emailValue)
    console.log('Username = ', usernameValue)
    console.log('Password = ', passwordValue)
    

  }
  

  return (
    <ImageBackground
      source={images.background}
      className='flex flex-1 justify-center items-center '
      resizeMode='cover'
    >

    <Animated.View style={keyboardShiftStyle} className='absolute top-0 left-0 w-full h-full z-0'>

    <View className="flex justify-center items-center w-full h-full">

      <BlurView
        intensity={60} 
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

      <View className='absolute bottom-20'>
        <Button
          title="Reset Onboarding"
          onPress={() => {onboardingReset()}}
        />
      </View>

      <View className='absolute bottom-[36%] flex gap-[30%] w-full justify-center items-center'>
        
        <Animated.View style={signInStyle} className={'w-full flex items-center'}>
          
          <Pressable
            className="bg-transparent border-2 border-white p-4 rounded-2xl items-center w-[50%]"
            onPress={() => {handleLogIn()}}
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
                  layout={FadeOutUp.duration(800).springify().damping(18).stiffness(120)}

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

              {buttonText==='Log In' &&
                <Pressable onPress={() => {console.log('forgot password function')}} className='self-end'>
                  <Text className='text-gray-400 underline'>Forgot your password?</Text> 
                </Pressable>
              }

              {formInvalid &&
                <FormControlError
                 className='bg-red-300 rounded-3xl p-[2px] w-[300px] bottom-[10px] flex justify-center items-center'
                >
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        {error}
                    </FormControlErrorText>
                </FormControlError>
              }

            </FormControl>
          </Animated.View>
        )}

        <Animated.View style={signUpStyle} className={'w-full flex items-center'}>
        
          <Pressable
            className="bg-[#16182C] p-4 rounded-2xl items-center w-[50%]"
            onPress={
              
              buttonText==='Sign Up' && showForm===true ? () => {handleSignUp()} 
              : buttonText==='Sign Up' && showForm===false ? () => {handleShowForm()}
              : buttonText==='Log In' ? () => {logIn()}
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
            <ThemedText type='subtitle' lightColor='white'>Don't have an account? <Text className='underline font-bold' onPress={() => {handleShowForm()}}>Sign Up</Text></ThemedText>
          </Animated.View>
          :
          
          <Animated.View 
            entering={
              FadeIn.duration(400)
              .delay(200)
            }
            className='absolute bottom-[-275px]'>
            <ThemedText type='subtitle' lightColor='white'>Already have an account? <Text className='underline font-bold' onPress={() => {handleLogIn()}}>Log In</Text></ThemedText>
          </Animated.View>
        )}
      </View>

    </View>
    </Animated.View>
    </ImageBackground>
  )
}

export default onboardingMain