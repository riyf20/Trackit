import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetIcon, Button, ButtonText,
  EditIcon,
  EyeOffIcon,
  ClockIcon,
  DownloadIcon,
  TrashIcon,
} from '@gluestack-ui/themed'
import { useAuthStore } from '@/utils/authStore'
import { BlurView } from 'expo-blur'

// Actionsheet allowing users to select desired contract 
const ContractSelector = ({selectorOpen, setSelectorOpen, setSelectedContract}:ContractSelectorProps) => {
    
    const {contractNames} = useAuthStore()

    const [showActionsheet, setShowActionsheet] = useState(false);
    const handleClose = () => setShowActionsheet(false);

    useEffect(() => {
      setShowActionsheet(selectorOpen)
    }, [selectorOpen])

    useEffect(() => {
      setSelectorOpen(showActionsheet)
    }, [showActionsheet])
    
    
    const handleSelected = (contract:ContractOption) => {
        setSelectedContract(contract)
        handleClose()
    }

    return (
        <>
            <Actionsheet isOpen={showActionsheet} onClose={handleClose} >
                
                <ActionsheetBackdrop />
                
                <ActionsheetContent className='pb-[50px]' style={{backgroundColor: 'gray'}}>

                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    {contractNames?.map((contract:ContractOption, index:number) => (
                        <ActionsheetItem onPress={() => {handleSelected(contract)}} key={index}>
                            <BlurView style={{width: 50, height: 50, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}} intensity={100} tint={'light'} >
                                <Text className='text-3xl'>{contract.Icon}</Text>
                            </BlurView>
                            <Text className='text-lg font-semibold text-white ml-[12px]'>{contract.Name} {contract.Count === 7 ? 'daily' : contract.Count + 'x/week' }</Text>
                        </ActionsheetItem>
                    ))}

                </ActionsheetContent>

            </Actionsheet>
        </>
  );
}


export default ContractSelector