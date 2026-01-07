import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

// Will refresh data based on interval timeout
function useTimedFocusRefresh(callback: () => void, interval: number) {

    const lastRef = useRef(Date.now())

    useFocusEffect(
        useCallback(() => {
            if(Date.now() - lastRef.current > interval) {
                lastRef.current = Date.now()
                callback()
                // console.log("reloaded!")
            }
        }, [callback, interval])
    );

    const reset = () => {
        lastRef.current = 0;
    }

    return {reset}

}

export default useTimedFocusRefresh