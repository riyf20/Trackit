import React, { useState } from 'react'
import { View } from 'react-native'
import { FormControl, Input, InputField, 
    FormControlError, FormControlErrorIcon, 
    AlertCircleIcon, FormControlErrorText, 
    InputSlot, InputIcon, EyeIcon, EyeOffIcon, 
    Textarea,
    TextareaInput
} from '@gluestack-ui/themed';

// Imported from blog app project
// This is a custom reusable input component that can render each input as well as its error states

// Definition of all props that will be entered
// FormInputProps = { 
//     invalid:boolean,                                    // The form's valid state | will help to indicate errors for users
//     placeholder:string,                                 // Text inside the input
//     value:string,                                       // Value of the input
//     parentInvalid:boolean,                              // Valid state of the parent form (from the page that is calling this component) 
//     setValue: (arg0: string) => void,                   // Changes the value of input on typing
//     setValueInvalid: (arg0: boolean) => void,           // Function to change the input's valid state
//     setParentInvalid: (arg0: boolean) => void,          // Function to change the parent component's valid state
//     error:string                                        // Any error message
//     textarea?:boolean                                   // Optional: textarea input
//     parent?:string                                      // Optional: parent --> comment page, show error
// };


const FormInput = ({invalid, placeholder, value, parentInvalid, setValue, setValueInvalid, setParentInvalid, error, textarea, parent}: FormInputProps) => {

    // Used for password inputs
    const [showPassword, setShowPassword] = useState(false);

    // Changes visibility if icon was clicked
    const handleState = () => {
        setShowPassword(!showPassword);
    }

  return (
    <FormControl isInvalid={invalid} isRequired={true}>

        {/* Shows textarea  */}
        {textarea ? 
            <>
                <Textarea className='bg-slate-50'>
                    <TextareaInput 
                        type='text'
                        placeholder={placeholder} 
                        value={value} 
                        onChangeText={(text) => {
                            setValue(text);
                            setValueInvalid(false);
                            setParentInvalid(false); 
                        }}
                    />   
                </Textarea> 

                {invalid && parent==='comment' &&
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                            {error}
                        </FormControlErrorText>
                    </FormControlError>
                }          
            </>
        :
            <>
                {/* Regular input field */}
                <Input
                    variant="rounded"
                    size="md"
                    className="my-4 w-[350px]"
                >
                    <InputField type={placeholder=='Password' && !showPassword ? 'password' : 'text'} placeholder={placeholder} value={value} className='bg-slate-50'
                        onChangeText={(text) => {
                            setValue(text);
                            setValueInvalid(false);
                            setParentInvalid(false); 
                        }}
                    />

                    {/* Shows visibility icon if input is password */}
                    {placeholder=='Password' && 
                        <InputSlot className="pr-3 bg-slate-50" onPress={handleState}> 
                            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                        </InputSlot> 
                    }

                </Input>

                {/* Left individual error messages off | Can turn on later if necessary */}
                {/* {invalid && !parentInvalid &&
                    <>
                        <View className='mt-[-2px] flex justify-center items-center'>
                            <FormControlError
                                className='bg-red-300 rounded-3xl p-[2px] w-[300px] bottom-[10px] flex justify-center items-center mb-[-6px]'
                            >
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText>
                                    {error}
                                </FormControlErrorText>
                            </FormControlError>
                        </View>
                    </>
                } */}
            </>
        }
    </FormControl>
  )
}

export default FormInput