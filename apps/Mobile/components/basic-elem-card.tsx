import { Pressable } from "react-native";

import { Box } from "@/components/ui/box";
import { ThemedText } from "@/components/themed-text";

export const BasicElementCard = ({ text, onPress }: { text: string, onPress: any }) => {
    return (
        <Pressable onPress={onPress} className="w-full">
            <Box className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 justify-center">
                <ThemedText className="text-base font-semibold text-[#111827]">
                    {text}
                </ThemedText>
            </Box>
        </Pressable>
    );
};