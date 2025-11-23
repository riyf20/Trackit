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

interface HeaderProps {
    parent:string
}

interface Page1Props {
    page: number,
    shown: boolean,
    habitName: string,
    setHabitName: (args0:string) => void,
    selectedEmoji: string,
    setSelectedEmoji: (args0:string) => void,
}
interface Page2Props {
    page: number,
    shown: boolean,
    frequency: string, 
    setFrequency: (args0:string) => void, 
    count: number, 
    setCount: (args0:number) => void, 
    duration: string, 
    setDuration: (args0:string) => void,
    endDate: string, 
    setEndDate: (args0:string) => void,   
}

interface Page4Props {
    selectedEmoji: string,
    habitName: string,
    frequency:string,
    count: number,
    duration: string,
    endDate: string,
}

interface Contract {
    Username: string,
    User_ID: string, 
    Habit_Name: string,
    Habit_Icon: string,
    Frequency: string,
    Count: number,
    Duration: string,
    Expiration: string,
    Difficulty: string,
    Streak: number,
    Total_Days: number,
    $id: string,
}

interface ContractCardProps {
    contract: Contract,
}

interface ContractFilterMenuProps {
    tab: string,
}

interface PercentageTextProps {
    percentage: nunber, 
    streak: number, 
    total: number,
}