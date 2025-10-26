import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {getItem, setItem, deleteItemAsync} from "expo-secure-store"

// This defines the states that will be saved
type UserState = {
    // token: string;
    // user: User;
    // username: string;
    // refreshToken:string,

    // isLoggedin: boolean;
    // shouldCreateAccount: boolean;

    // logIn: ({token, user, username, refreshToken}:logInProps) => void;
    // logOut: () => void;
    // setUsername: (username:string) => void;
    // changeToken: (newToken:string) => void;

    loggedin: boolean;
    onboarding: boolean;

    onboardingComplete: () => void;
    onboardingReset: () => void;

    logIn: () => void;
    logOut: () => void;
}

// type logInProps = {
//     token:string, 
//     user:User, 
//     username:string,
//     refreshToken:string,
// }

// Export the hook, takes an arrow function that returns as object with each of the keys in our state
// (defined above)
export const useAuthStore = create(
    
    // first argument for the persistor is what we are persisting | the object to store
    persist
        <UserState>((set) => ({
            loggedin: false,
            onboarding: true,
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
            logIn: () => {
                set((state) => {
                    return {
                        ...state,
                        loggedin: true,
                        onboarding: false,
                    }
                })
            },
            logOut: () => {
                set((state) => {
                    return {
                        ...state,
                        loggedin: false,
                        onboarding: false,
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