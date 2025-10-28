import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {getItem, setItem, deleteItemAsync} from "expo-secure-store"

// This defines the states that will be saved
type UserState = {

    loggedin: boolean;
    onboarding: boolean;

    onboardingComplete: () => void;
    onboardingReset: () => void;

    logIn: ({username, password, email}:logInProps) => void;
    logOut: () => void;

    username: string;
    password: string;
    email: string;
    sessionID: string,
}

type logInProps = {
    username: string;
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
            username: "",
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
            logIn: ({username, password, email, sessionID}:logInProps) => {
                set((state) => {
                    return {
                        ...state,
                        loggedin: true,
                        onboarding: false,
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
                        username: "", 
                        password: "",
                        email: "",
                        sessionID: "",
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