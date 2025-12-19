import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";
import { View } from "@gluestack-ui/themed";
import { SFSymbols7_0 } from 'sf-symbols-typescript';
import { useThemeColor } from "@/hooks/use-theme-color";

// Pill icons for contract details 
const ContractPill = ({ parent, value }: ContractPillProps) => {
  // TO DO: Alter interfaces to reflect valid parents
  // parent can be = [streak, log, verification]

  const theme = useThemeColor({}, 'text');
  
  // TO DO: Merge all constants and place into constants folder

  // Color codes for pills
  const streakColor = ["transparent", "#6B4FA3"] as const;
  const logColors = {
    submitted: ["transparent", "#0C5A00"] as const,
    notSubmitted: ["transparent", "#6F0000"] as const,
  };
  const verificationColors = {
    pending: ["transparent", "#9B5102"] as const,
    approved: ["transparent", "#0C5A00"] as const,
    rejected: ["transparent", "#6F0000"] as const,
  };

  // Icons for pills
  const logIcons = {
    submitted: 'checkmark.circle',
    notSubmitted: 'xmark.circle'
  } satisfies Record< string, SFSymbols7_0>

  const verificationIcons = {
    pending: 'hourglass',
    approved: 'checkmark.seal',
    rejected: 'xmark.seal',
  } satisfies Record< string, SFSymbols7_0>

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
  

  return (
    <LinearGradient
      colors={
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
      }
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
            <IconSymbol name={dynamicIcon} size={22} color={theme==='#ECEDEE' ? 'white' : 'black'} />
          }
        <ThemedText type="onboarding">
          {value} {parent === "Streak" && "days"}
        </ThemedText>
      </View>
    </LinearGradient>
  );
};

export default ContractPill;
