import { Pressable } from "react-native";

import { Box } from "@/components/ui/box";
import { ThemedText } from "@/components/themed-text";

import { Icon } from "@/components/icon";
import { icons } from "lucide-react-native";

export const HomeElementCard = ({
  text,
  bgColor,
  color,
  icon,
  onPress,
}: {
  text: string;
  bgColor: string;
  color: string;
  icon: keyof typeof icons;
  onPress: any;
}) => {
  return (
    <Pressable onPress={onPress} className="w-full">
      <Box
        className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 flex flex-row items-center gap-1"
        style={{ height: 70, backgroundColor: bgColor, }}
      >
        <Box className="mt-px mr-2">
          <Icon name={icon} color={color} size={20} />
        </Box>
        <ThemedText className="" style={{ color, fontSize: 19 }}>
          {text}
        </ThemedText>
      </Box>
    </Pressable>
  );
};
