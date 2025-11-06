import React, { useEffect, useState } from 'react'
import {
  Modal,ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter,  Button, ButtonText,
  Heading, Text,
  Spinner} from '@gluestack-ui/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useHapticFeedback as haptic} from '@/components/HapticTab';

// Confirmation modal component | Will show loader 
const AlertModal = ({modalOpened, confirmFunction, setModalOpened, isLoading}:alertModalProps) => {

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(modalOpened)
  }, [modalOpened])

  useEffect(() => {
    if(!showModal) {
      setModalOpened(false);
    }
  }, [showModal])

  const theme = useThemeColor({}, 'text');

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ModalBackdrop  />
        <ModalContent style={{ backgroundColor: `${theme==='#ECEDEE' ? 'rgba(60, 60, 60)' : 'rgba(235, 235, 235)'}`}}>

          <ModalHeader style={{display: 'flex', flexDirection: 'row', gap: '8', justifyContent: 'center'}}>
            <Heading color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} >{isLoading ? 'Uploading Changes' : 'Changes Saved'}</Heading>
          </ModalHeader>

          <ModalBody >
            {isLoading && 
              <Spinner size="large" color="gray" className='my-[12px]'/>
            }
            <Text color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} style={{textAlign: 'center'}}>{isLoading ? 'Please wait while we update your changes' : 'Your changes have been saved.'}</Text> 
          </ModalBody>

          <ModalFooter>
            {!isLoading &&
              <Button
                onPressIn={haptic()}
                onPress={() => {confirmFunction()}}
                style={{width: '100%'}}
              >
                <ButtonText>Back</ButtonText>
              </Button>
            }
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
}

export default AlertModal