import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {getItem, setItem, deleteItemAsync} from "expo-secure-store"

// This defines the states that will be saved
type UserState = {

    loggedin: boolean;
    onboarding: boolean;

    onboardingComplete: () => void;
    onboardingReset: () => void;

    logIn: ({userId, username, password, email, sessionID}:logInProps) => void;
    logOut: () => void;

    userId: string; //appwrite userid
    username:string; //appwrite username 
    password: string;
    email: string;
    sessionID: string,

    updateEmail: (newEmail:string) => void;
    updateUsername: (newUsername:string) => void;
    updatePassword: (newPassword:string) => void;
}

type logInProps = {
    userId: string;
    username:string;
    password: string;
    email: string;
    sessionID: string,
}

// Export the hook, takes an arrow function that returns as object with each of the keys in our state
// (defined above)
export const useAuthStore = create(
    
    // first argument for the persistor is what we are persisting | the object to store
    persist
        <UserState>((set) => ({
            loggedin: false,
            onboarding: true,
            userId: "",
            username: "",
            displayName: "",
            password: "",
            email: "",
            sessionID: "",
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
            logIn: ({userId, username, password, email, sessionID}:logInProps) => {
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