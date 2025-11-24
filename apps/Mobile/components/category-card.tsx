import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";


export const CategoryCard = ({ bgColor, color, icon, text }: { bgColor: string, color: string, icon: LucideIcon, text: string }) =>{
    return (
        <Pressable>
            <Badge
                className="rounded-xl h-12 px-4 shadow-sm"
                style={{ backgroundColor: bgColor }}
            >
                <BadgeIcon
                    as={icon}
                    size="lg"
                    style={{ color: color, strokeWidth: 20 }}
                />
                <BadgeText
                    className="font-semibold ml-2"
                    style={{ color: color }}
                >
                    {text}
                </BadgeText>
            </Badge>
        </Pressable>
    )
};