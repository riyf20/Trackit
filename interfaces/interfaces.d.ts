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
    confirmFunction: () => void,
    isLoading: boolean,
}

interface BottomProps {
    parent:string,
    keyboard?: Boolean,
    altered: boolean,
    setAltered: (args0:boolean) => void,
}

interface BottomSheetHandle {
    open: () => void;
    commentUp: () => void;
    commentDown: () => void;
    close: () => void;
}


interface ImageUploaderProps {
    setClose: () => void;
    setAltered: (args0:boolean) => void,
}

interface ImageCardProps {
    uri: string;
    onPress: (args0: number) => void;
    onLongPress: (args0: number) => void;
    index: number;
    parent: string;
}

interface AccountCardProps {
    setExpanded: (args0: boolean) => void
}

// Can be used later...
// interface ImageItem {
//     filePath: string;
//     fileUri: string;
//     base64: string;
//     id?:number
// }

interface UserSearchCardProps {
    user:User,
    usersFriends?: string[]
    usersRequested?: string[]
    usersInvites?: string[]
}

interface User {
    User: string,
    User_Profile_Picture:string,
    UsersID: string,
}

interface UserCardProps {
    userid: string,
    parent?: string,
    unaddedUserid?: (args0:string) => void;
}

interface UserCardMenuProps {
    handleUnfriend: () => void;
}