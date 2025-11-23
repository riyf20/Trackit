import React from 'react'
import { ThemedText } from './themed-text'

// Dynamic text based on progress completion
const PercentageText = ({percentage, streak, total}:PercentageTextProps) => {
  return (
    <>
        {/* First half is the completed amount */}
        {percentage >= 91 ?

            // [91%-100%] - Shows completion percentage
            // Example: '93% Complete'
            <ThemedText
                className='absolute font-semibold'
                darkColor='white'
                style={{
                    left: `${percentage - 36}%`,
                    transform: [{ translateX: -10 }],
                }}
            >
                {percentage}{'% Complete'}
            </ThemedText>

        : percentage >=39 && percentage <= 90 ?

            // [39%-90%] - Shows counter of completed days with text
            //  Example: 'Completed 6'
            <ThemedText
                className='absolute font-semibold'
                darkColor='white'
                style={{
                    left: `${percentage - 32}%`,
                    transform: [{ translateX: -10 }],
                }}
            >
                {'Completed: '}{streak}
            </ThemedText>
        
        : percentage >= 10 && percentage <= 38 ?

            // [10%-38%] - Shows counter of completed days
            //  Example: '6'
            <ThemedText
                className='absolute font-semibold'
                darkColor='white'
                style={{
                    left: `${percentage - 6}%`,
                    transform: [{ translateX: -10 }],
                }}
            >
                {percentage >= 82 && 'Completed '}{streak}
            </ThemedText>

        : percentage < 10 &&

            // [Any percentage lower than 10] - Shows counter on the right side of progress bar
            // Example: 'Day 2 / 12'
            <ThemedText
                className='absolute font-semibold'
                darkColor='black'
                style={{
                    left: `${percentage + 6}%`,
                    transform: [{ translateX: -10 }],
                }}
            >
                Day {streak} / {total}
            </ThemedText>
        }
        
        {/* Second half is the total amount of days for contract*/}
        {
            // [91%-100%] Shows nothing as the first part shows full percentage

            percentage >= 79  && percentage <= 90 ?
                
                // [79%-90%] - Shows number of total days
                //  Example: '7'
                <ThemedText
                    className='absolute font-semibold'
                    darkColor='black'
                    style={{
                        left: `${percentage + 0.5}%`,
                    }}
                >
                    / {total}
                </ThemedText>

            : percentage >= 10 && percentage <= 78 &&

                // [10%-78%] - Shows number of total days with text
                //  Example: '7 days'
                <ThemedText
                    className='absolute font-semibold'
                    darkColor='black'
                    style={{
                        left: `${percentage + 1}%`,
                    }}
                >
                    / {total} Days
                </ThemedText>

            // [Any percentage lower than 10] Shows nothing as the first part shows full counter on the right

        }
        </>
  )
}

export default PercentageText