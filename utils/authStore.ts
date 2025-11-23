import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {getItem, setItem, deleteItemAsync, getItemAsync} from "expo-secure-store"

// This defines the states that will be saved
type UserState = {

    loggedin: boolean;
    onboarding: boolean;

    onboardingComplete: () => void;
    onboardingReset: () => void;

    logIn: ({userId, username, password, 
        email, sessionID, defaultPicture, 
        profilePictureFileId, profilePictureFileUrl
    }:logInProps) => void;
    logOut: () => void;

    userId: string; //appwrite userid
    username:string; //appwrite username 
    password: string;
    email: string;
    sessionID: string,
    defaultPicture: boolean,
    profilePictureFileId: string
    profilePictureFileUrl: string,
    

    updateEmail: (newEmail:string) => void;
    updateUsername: (newUsername:string) => void;
    updatePassword: (newPassword:string) => void;
    updateProfilePicture: (newFileId:string, newFileUrl:string, useDefaultPicture:boolean) => void;
    deleteProfilePicture: () => void;

    getDefaultPicture: () => boolean;
    getProfileFileId: () => string;
    getProfileFileUrl: () => string;

    invitesCount: number;
    updateInvitescount: (newCount:number) => void;

    contractCardCompact: boolean;
    updateContractCard: (contractCardCompact:boolean) => void;
}

type logInProps = {
    userId: string;
    username:string;
    password: string;
    email: string;
    sessionID: string,
    defaultPicture: boolean,
    profilePictureFileId: string,
    profilePictureFileUrl: string,
}

// Export the hook, takes an arrow function that returns as object with each of the keys in our state
// (defined above)
export const useAuthStore = create(
    
    // first argument for the persistor is what we are persisting | the object to store
    persist
        <UserState>((set, get) => ({
            loggedin: false,
            onboarding: true,
            userId: "",
            username: "",
            displayName: "",
            password: "",
            email: "",
            sessionID: "",
            defaultPicture: true,
            profilePictureFileId: "",
            profilePictureFileUrl: "",
            invitesCount: 0,
            contractCardCompact: true,
            onboardingComplete: () => {
                set((state) => {
                    return {
                        ...state,
                        loggedin: false,
                        onboarding: false,
                    }
                })
            },
            onboardingReset: () => {
                set((state) => {
                    return {
                        ...state,
                        loggedin: false,
                        onboarding: true,
                    }
                })
            },
            logIn: ({userId, username, password, email, sessionID, defaultPicture, profilePictureFileId, profilePictureFileUrl}:logInProps) => {
                set((state) => {
                    return {
                        ...state,
                        loggedin: true,
                        onboarding: false,
                        userId: userId, 
                        username: username,
                        password: password,
                        email: email,
                        sessionID: sessionID,
                        defaultPicture: defaultPicture,
                        profilePictureFileId: profilePictureFileId,
                        profilePictureFileUrl: profilePictureFileUrl,
                        invitesCount: 0,
                        contractCardCompact: true,
                    }
                })
            },
            logOut: () => {
                set((state) => {
                    return {
                        ...state,
                        loggedin: false,
                        onboarding: false,
                        userId: "",
                        username: "", 
                        password: "",
                        email: "",
                        sessionID: "",
                        defaultPicture: true,
                        profilePictureFileId: "",
                        profilePictureFileUrl: "",
                        invitesCount: 0,
                    }
                })
            },
            updateEmail(newEmail:string) {
                set((state) => {
                    return {
                        ...state,
                        email: newEmail,
                    }
                }) 
            },
            updateUsername(newUsername:string) {
                set((state) => {
                    return {
                        ...state,
                        username: newUsername,
                    }
                }) 
            },
            updatePassword(newPassword:string) {
                set((state) => {
                    return {
                        ...state,
                        password: newPassword,
                    }
                }) 
            },
            updateProfilePicture(newFileId:string, newFileUrl:string, useDefaultPicture:boolean) {
                set((state) => {
                    return {
                        ...state,
                        defaultPicture: useDefaultPicture,
                        profilePictureFileId: newFileId,
                        profilePictureFileUrl: newFileUrl,
                    }
                })
            },
            deleteProfilePicture() {
                set((state) => {
                    return {
                        ...state,
                        defaultPicture: true,
                        profilePictureFileId: '',
                        profilePictureFileUrl: '',
                    }
                })
            },
            getDefaultPicture: () => {
                return get().defaultPicture
            },
            getProfileFileId: () => {
                return get().profilePictureFileId
            },
            getProfileFileUrl: () => {
                return get().profilePictureFileUrl
            },
            updateInvitescount(newCount:number) {
                set((state) => {
                    return {
                        ...state,
                        invitesCount: newCount,
                    }
                })
            },
            updateContractCard(contractCardCompact:boolean) {
                set((state) => {
                    return {
                        ...state,
                       contractCardCompact: contractCardCompact,
                    }
                })
            }
        }),  
    // second argument is where we are storing it
    {
        name: "auth-store",
        storage: createJSONStorage(() => ({
            setItem, 
            getItem,
            removeItem: deleteItemAsync,
        }))
    }
))