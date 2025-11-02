interface FormInputProps {
    invalid: boolean;
    placeholder: string;
    value: string;
    parentInvalid: boolean;
    setValue: (arg0: string) => void;
    setValueInvalid: (arg0: boolean) => void;
    setParentInvalid: (arg0: boolean) => void;
    error: string;
    textarea?: boolean;
    parent?:string;
}

interface SettingSwitchProps {
    title: string,
    index: number,
}
interface SettingCardProps {
    title: string,
    index: number,
}

interface ForgotPasswordModalProps {
    forgotPasswordShowModal:boolean,
    setForgotPasswordShowModal: (args0:boolean) => void,
}

interface alertModalProps {
    modalOpened: boolean,
    setModalOpened: (args0:boolean) => void,
    confirmFunction: () => void;
}