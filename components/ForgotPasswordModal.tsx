import { Keyboard, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  Modal, ModalBackdrop, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Button, ButtonText, 
  ButtonIcon, Heading, Text, HStack, Input, 
  InputField, Link, LinkText, ArrowLeftIcon, 
  FormControl,
  AlertCircleIcon,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText
} from '@gluestack-ui/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { checkUser } from '@/services/appwriteUsers';
import { resetPasswordEmail } from '@/services/resendEmails';


{/* TO DO: finish implementation | need to link email provider */}
const ForgotPasswordModal = ({forgotPasswordShowModal, setForgotPasswordShowModal}:ForgotPasswordModalProps) => {

  const theme = useThemeColor({}, 'text');

    
  const keyboardshift = useSharedValue(0);
  
  const keyboardShiftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: keyboardshift.value }
    ],
  }));

  // Animation to keep input fields in view when keyboard enters
  useEffect(() => {
    // If keyboard is shown
    const keyboardShow = Keyboard.addListener('keyboardWillShow', (e) => {

      let moveUp = 0
      moveUp = e.endCoordinates.height * 0.2; 
      keyboardshift.value = withTiming(-moveUp, { duration: 400 });
    });

    const keyboardHide = Keyboard.addListener('keyboardWillHide', () => {
      keyboardshift.value = withTiming(0, { duration: 300 });
    });
  
    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);


  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  const [usernameValue, setUsernameValue] = useState('');
  const [usernameInvalid, setUsernameInvalid] = useState(false);

  const [emailValue, setEmailValue] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);

  const[formInvalid, setFormInvalid] = useState(false);
  const [error, setError] = useState('')

  const [verificationFormInvalid, setVerificationFormInvalid] = useState(false);
  const [verificationError, setVerificationError] = useState('')
  const [codeValue, setCodeValue] = useState("");

  useEffect(() => {
    if(forgotPasswordShowModal) {
      setShowModal(true);
    }
  }, [forgotPasswordShowModal])

  useEffect(() => {
    if(!showModal) {
      setFormInvalid(false)
      setError("")
      setEmailValue("")
      setUsernameValue("")
      setForgotPasswordShowModal(false);
    }
  }, [showModal])

  const handleModal1 = async () => {

    if(!emailValue.trim() && !usernameValue.trim()) {
      setFormInvalid(true)
      setError("Please enter your username and email.")
      return;
    }

    if (!emailValue.trim()) {
      setFormInvalid(true)
      setEmailInvalid(true);
      setError("Please enter your email.")
      return;
    } else if (!usernameValue.trim()) {
      setFormInvalid(true)
      setUsernameInvalid(true);
      setError("Please enter your username.")
      return;
    }


    // username and password
    try {
      const response = await checkUser(usernameValue);

      const verifyEmail = response.email;
      // const emailTarget = response.targets[0].$id;

      if(verifyEmail!==emailValue) {
        setFormInvalid(true)
        setError("Please check Username and Email.")
        return;
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000);      
      
      try {

        const emailResponse = await resetPasswordEmail(usernameValue, resetCode, emailValue);


      } catch (emailError:any) {
        
      }

    } catch (error:any) {

      if(error.code === 404 && error.message.includes('ID could not be found.')) {
        setFormInvalid(true)
        setError("Please check Username and Email.")
        return;
      }
    }


    // get/check user by username
    // check email
    // generate a code
      // save code into database
      // send code to email

    // check code
    // change password

    setShowModal2(true);
    setShowModal(false);
  }

  const handleModal2 = () => {

  }
    

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        closeOnOverlayClick={false}
      >
        <ModalBackdrop />
        <Animated.View style={keyboardShiftStyle}>
        {/*  ${theme==='#ECEDEE' ? `${detailsStates[index] ? 'bg-white/20' : 'bg-white/10'}` : `${detailsStates[index] ? 'bg-black/20' : 'bg-black/10'}`} */}
          <ModalContent  style={{ backgroundColor: `${theme==='#ECEDEE' ? 'rgba(60, 60, 60)' : 'rgba(235, 235, 235)'}`}}>
            

            <ModalHeader style={{display: 'flex', flexDirection: 'column', gap: '8'}}>
              <Heading color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} >Forgot password?</Heading>
              <Text style={{textAlign: 'center', marginBottom: 12}} size="sm" color={`${theme==='#ECEDEE' ? 'white' : 'black'}`}>Enter your username and email to reset password.</Text>
            </ModalHeader>

            <ModalBody  >
              <FormControl isInvalid={formInvalid} style={{display: 'flex', gap: 12}}>
                <Input>
                  <InputField placeholder="Enter your username" value={usernameValue} 
                  onChangeText={(text) => {
                    setUsernameValue(text)
                    setUsernameInvalid(false)
                    setFormInvalid(false)
                  }} 
                  color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} />
                </Input>

                <Input>
                  <InputField placeholder="Enter your email" value={emailValue} 
                  onChangeText={(text) => {
                    setEmailValue(text)
                    setEmailInvalid(false)
                    setFormInvalid(false)
                  }} 
                  color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} />
                </Input>

                <FormControlError className='bg-red-300 rounded-3xl p-[2px] w-[100%] flex justify-center items-center'>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {error}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </ModalBody>

            <ModalFooter style={{flexDirection: 'column', alignItems: 'flex-start', marginTop: (-12)}}>
              <Button
                onPress={() => {
                  handleModal1()
                  // console.log("Email sent to", emailValue)
                  // setShowModal2(true);
                }}
                className="w-full"
              >
                <ButtonText>Submit</ButtonText>
              </Button>

              <Button
                variant="link"
                size="sm"
                onPress={() => {
                  setShowModal(false);
                }}
                style={{marginTop: 8, gap: 4}}
              >
                <ButtonIcon as={ArrowLeftIcon} />
                <ButtonText>Back to login</ButtonText>
              </Button>
              
            </ModalFooter>

          </ModalContent>
        </Animated.View>
      </Modal>

      {/* work on getting second modal to work properly | sizing mainly right now */}
      {/* <Modal
        isOpen={showModal2}
        onClose={() => {
          setShowModal2(false);
        }}
      >
        <ModalBackdrop />
        <Animated.View style={keyboardShiftStyle}>
          <ModalContent style={{display: 'flex', width: '30%',backgroundColor: `${theme==='#ECEDEE' ? 'rgba(60, 60, 60)' : 'rgba(235, 235, 235)'}`}}>

            <ModalHeader style={{display: 'flex', flexDirection: 'column', gap: '8'}}>
              <Heading color={`${theme==='#ECEDEE' ? 'white' : 'black'}`}>Reset password</Heading>
              <Text style={{textAlign: 'center', marginBottom: 12}} size="sm" color={`${theme==='#ECEDEE' ? 'white' : 'black'}`}>
                A verification code has been sent to you. Enter code below.
              </Text>
            </ModalHeader>

            <ModalBody className="mb-4">
              <FormControl isInvalid={verificationFormInvalid} style={{display: 'flex', gap: 12}}>
                <Input>
                  <InputField placeholder="Enter verification code" value={verificationCode}
                    onChangeText={(text) => {
                      setVerificationCode(text)
                    }} 
                    color={`${theme==='#ECEDEE' ? 'white' : 'black'}`}
                  />
                </Input>

                <FormControlError className='bg-red-300 rounded-3xl p-[2px] w-[100%] flex justify-center items-center'>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {error}
                  </FormControlErrorText>
                </FormControlError>

              </FormControl>
            </ModalBody>

            <ModalFooter style={{flexDirection: 'column', alignItems: 'flex-start', marginTop: (-12)}}>
              <Button
                onPress={() => {
                  setShowModal3(true);
                }}
                className="w-full"
              >
                <ButtonText>Continue</ButtonText>
              </Button>
              {/* <Text size="sm" className="">
                Didn't receive the email?
                <Link className="">
                  <LinkText
                    size="xs"
                    className="text-typography-700 font-semibold"
                  >
                    Click to resend
                  </LinkText>
                </Link>
              </Text> */}
              {/* <HStack space="xs" className="items-center">
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => {
                    setShowModal2(false);
                  }}
                  className="gap-1"
                >
                  <ButtonIcon as={ArrowLeftIcon} />
                  <ButtonText>Back to login</ButtonText>
                </Button>
              </HStack>
            </ModalFooter>

          </ModalContent>
        </Animated.View>

      </Modal>  */}

      <Modal
        isOpen={showModal2}
        onClose={() => {
          setShowModal2(false);
        }}
        closeOnOverlayClick={false}
      >
        <ModalBackdrop />
        <Animated.View style={keyboardShiftStyle}>
        {/*  ${theme==='#ECEDEE' ? `${detailsStates[index] ? 'bg-white/20' : 'bg-white/10'}` : `${detailsStates[index] ? 'bg-black/20' : 'bg-black/10'}`} */}
          <ModalContent  style={{width: 355,backgroundColor: `${theme==='#ECEDEE' ? 'rgba(60, 60, 60)' : 'rgba(235, 235, 235)'}`}}>
            

            <ModalHeader style={{display: 'flex', flexDirection: 'column', gap: '8'}}>
              <Heading color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} >Reset password</Heading>
              <Text style={{textAlign: 'center', marginBottom: 12}} size="sm" color={`${theme==='#ECEDEE' ? 'white' : 'black'}`}>A verification code has been sent to you. Enter the code below..</Text>
            </ModalHeader>

            <ModalBody>
              <FormControl isInvalid={verificationFormInvalid} style={{display: 'flex', gap: 12}}>
                <Input>
                  <InputField placeholder="Enter verification code" value={codeValue} 
                  onChangeText={(text) => {
                    setCodeValue(text)
                    setVerificationFormInvalid(false)
                  }} 
                  color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} />
                </Input>

                <FormControlError className='bg-red-300 rounded-3xl p-[2px] w-[100%] flex justify-center items-center'>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {verificationError}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </ModalBody>

            <ModalFooter style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <Button
                onPress={() => {
                  handleModal2()
                }}
                className="w-full"
              >
                <ButtonText>Continue</ButtonText>
              </Button>

              <Button
                variant="link"
                size="sm"
                onPress={() => {
                  setShowModal2(false);
                }}
                style={{marginTop: 8, gap: 4}}
              >
                <ButtonIcon as={ArrowLeftIcon} />
                <ButtonText>Back to login</ButtonText>
              </Button>
              
            </ModalFooter>

          </ModalContent>
        </Animated.View>
      </Modal>
      
      <Modal
        isOpen={showModal3}
        onClose={() => {
          setShowModal3(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="flex-col items-start gap-0.5">
            <Heading>Set new password</Heading>
            <Text size="sm">
              Almost done. Enter your new password and you are all set.
            </Text>
          </ModalHeader>
          <ModalBody className="" contentContainerClassName="gap-3">
            <Input>
              <InputField placeholder="New password" />
            </Input>
            <Input>
              <InputField placeholder="Confirm new password" />
            </Input>
          </ModalBody>
          <ModalFooter className="flex-col items-start">
            <Button
              onPress={() => {
                setShowModal(false);
                setShowModal2(false);
                setShowModal3(false);
              }}
              className="w-full"
            >
              <ButtonText>Submit</ButtonText>
            </Button>
            <Button
              variant="link"
              size="sm"
              onPress={() => {
                setShowModal3(false);
              }}
              className="gap-1"
            >
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText>Back to login</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


export default ForgotPasswordModal