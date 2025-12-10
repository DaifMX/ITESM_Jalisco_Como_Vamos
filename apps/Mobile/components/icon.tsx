import { icons } from "lucide-react-native";

export const Icon = ({
  name,
  color,
  size,
}: {
  name: keyof typeof icons;
  color: string;
  size: number;
}) => {
  // eslint-disable-next-line import/namespace
  const LucideIcon = icons[name];

  // Return null or a fallback icon if the icon doesn't exist
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return <LucideIcon color={color} size={size} />;
};