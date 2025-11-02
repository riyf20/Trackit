import React, { useEffect, useState } from 'react'
import {
  Modal,ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter,  Button, ButtonText,
  Heading, Text} from '@gluestack-ui/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useHapticFeedback as haptic} from '@/components/HapticTab';

// Confirmation modal component
const AlertModal = ({modalOpened, confirmFunction, setModalOpened}:alertModalProps) => {

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
        <ModalBackdrop />
        <ModalContent style={{ backgroundColor: `${theme==='#ECEDEE' ? 'rgba(60, 60, 60)' : 'rgba(235, 235, 235)'}`}}>

          <ModalHeader style={{display: 'flex', flexDirection: 'row', gap: '8', justifyContent: 'center'}}>
            <Heading color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} >Changes Saved</Heading>
            {/* <ModalCloseButton>
              <Icon as={CloseIcon} color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} />
            </ModalCloseButton> */}
          </ModalHeader>

          <ModalBody >
            <Text color={`${theme==='#ECEDEE' ? 'white' : 'black'}`} style={{textAlign: 'center'}}> Your changes have been saved.</Text> 
          </ModalBody>

          <ModalFooter>
            {/* <Button
              variant="outline"
              action="secondary"
              className="mr-3"
              onPress={() => {
                setShowModal(false);
              }}
              disabled={pressed}
            >
              <ButtonText color={`${theme==='#ECEDEE' ? 'white' : 'black'}`}>Change</ButtonText>
            </Button> */}
            <Button
              onPressIn={haptic()}
              onPress={() => {confirmFunction()}}
              style={{width: '100%'}}
            >
              <ButtonText>Back</ButtonText>
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
}

export default AlertModal