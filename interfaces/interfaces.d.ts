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
    altered?: boolean,
    setAltered?: (args0:boolean) => void,
    backdrop?: (args0:boolean) => void; 
    selectedItems?: ImagePicker.ImagePickerAsset[]
    setSelectedItems?: (args0:ImagePicker.ImagePickerAsset[]) => void;
    videoThumbnails?: Record<string, string>
    setVideoThumbnails?: (args0:Record<string, string>) => void;
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

interface ImageUploaderLogsProps {
    setClose: () => void;
    selectedPictures: ImagePicker.ImagePickerAsset[]
    setSelectedPictures: (args0:ImagePicker.ImagePickerAsset[]) => void;
    thumbnails: Record<string, string>
    setThumbnails: (args0:Record<string, string>) => void;
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
    $createdAt: string,
    Active: boolean,
}

interface Log {
    $id: string,
    User_ID: string,
    Contract_ID: string,
    Logged_Streak: number,
    Logged_Date: string,
    Notes: string,
    Media_Count: number,
    Media_Ids: string[],
    Status: string,
    $createdAt: string,
}

interface ContractOption {
    Name: string,
    Icon: string,
    Count: number,
    Difficulty: string,
    Streak: number,
    Id: string,
    Total: number
}

interface ContractCardProps {
    contract: Contract,
}

interface FilterMenuProps {
    parent: string,
    changeFilter: (args0:string) => void,
    menuOpen: boolean,
    setMenuOpen: (args0:boolean) => void,
    contractNames?: ContractOption[]
    dateText? : DateType,
    clearDate? : (args0: boolean) => void,
}

interface PercentageTextProps {
    percentage: nunber, 
    streak: number, 
    total: number,
}

interface ToastAlertProps {
    parent: string,
    card?: string,
    show?: boolean
}

interface ContractPillProps {
    parent: string, 
    value: string | number | undefined,
}

interface FilterMenuOptionProps {
    icon: SFSymbols7_0;
    label: string;
    onPress: () => void;
    active: boolean;
    setMenuOpen: (args0:boolean) => void;
    logs?: boolean,
    count?:number,
}

interface ContractSelectorProps {
    selectorOpen: boolean,
    setSelectorOpen: (args0: boolean) => void
    setSelectedContract: (args0: ContractOption) => void;
} 

interface CreateConfirmationPageProps {
    parent: string,
}

interface LogCardProps {
    log: Log,
    contract: ContractOption,
}

interface FilterMenuDatePickerProps {
    selectedDate: DateType | null,
    changeFilter: (date: DateType | null) => void,
}