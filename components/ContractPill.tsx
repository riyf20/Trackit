import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";
import { View } from "@gluestack-ui/themed";
import { SFSymbols7_0 } from 'sf-symbols-typescript';
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/utils/authStore";
import { logColors, streakColor, verificationColors } from "@/constants/colors";
import { logIcons, verificationIcons } from "@/constants/icons";

// Pill icons for contract details 
const ContractPill = ({ parent, value }: ContractPillProps) => {
  // TO DO: Alter interfaces file to reflect valid parents [data integrity]
  // parent can be = [streak, log, verification]

  const {theme} = useAuthStore()

  // Variable to hold icon
  const dynamicIcon: SFSymbols7_0 | null = 
    parent==='Log' && value === 'Submitted' ?
      logIcons.submitted
    : parent==='Log' && value === 'Not Submitted' ?
      logIcons.notSubmitted
    : parent==='Verification' && value === 'Pending' ? 
      verificationIcons.pending
    : parent === 'Verification' && value === 'Approved' ?
      verificationIcons.approved
    : parent === 'Verification' && value === 'Rejected' ?
      verificationIcons.rejected
    : null 

    const color = 
      parent === "Streak"
        ? streakColor
      : parent === "Log" && value === "Submitted"
        ? logColors.submitted
      : parent === "Log" && value === "Not Submitted"
        ? logColors.notSubmitted
      : parent === "Verification" && value === "Pending"
        ? verificationColors.pending
      : parent === "Verification" && value === "Approved"
        ? verificationColors.approved
      : parent === "Verification" && value === "Rejected"
        ? verificationColors.rejected
      : streakColor
  return (
    <LinearGradient
      colors={color}
      start={{ x: 0.18, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingVertical: 10,
        display: "flex",
        flexDirection: "row",
        paddingRight: 12,
        borderRadius: 18,
      }}
    >
      <ThemedText className="mr-auto" type="onboarding">
        {parent}
      </ThemedText>
      <View className="flex flex-row items-center justify-center gap-2">
          {parent !== 'Streak' && dynamicIcon &&
            <IconSymbol name={dynamicIcon} size={22} color={theme==='dark' ? 'white' : 'black'} />
          }
        <ThemedText type="onboarding">
          {value} {parent === "Streak" && "days"}
        </ThemedText>
      </View>
    </LinearGradient>
  );
};

export default ContractPill;
