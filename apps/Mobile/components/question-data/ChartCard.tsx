import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { DynamicPieChart } from "@/components/graphs/DynamicPieChart";
import { DynamicBarChart } from "@/components/graphs/DynamicBarChart";
import { PieChartIcon, BarChart3Icon } from "lucide-react-native";

interface ChartDataItem {
    name: string;
    value: number;
    label: string;
}

interface ChartCardProps {
    title: string;
    subtitle: string;
    chartData: ChartDataItem[];
    chartType: "pie" | "bar";
    onChartTypeChange: (type: "pie" | "bar") => void;
}

export function ChartCard({
    title,
    subtitle,
    chartData,
    chartType,
    onChartTypeChange,
}: ChartCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>

            <View style={styles.chartToggleContainer}>
                <Button
                    onPress={() => onChartTypeChange("pie")}
                    className={chartType === "pie" ? "bg-pantone-dark-blue" : "bg-gray-300"}
                    style={styles.toggleButton}
                >
                    <PieChartIcon 
                        size={20} 
                        color={chartType === "pie" ? "#ffffff" : "#6b7280"} 
                    />
                </Button>
                <Button
                    onPress={() => onChartTypeChange("bar")}
                    className={chartType === "bar" ? "bg-pantone-dark-blue" : "bg-gray-300"}
                    style={styles.toggleButton}
                >
                    <BarChart3Icon 
                        size={20} 
                        color={chartType === "bar" ? "#ffffff" : "#6b7280"} 
                    />
                </Button>
            </View>

            {chartType === "pie" ? (
                <DynamicPieChart
                    data={chartData}
                    height={240}
                />
            ) : (
                <DynamicBarChart
                    data={chartData}
                    height={260}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 16,
        padding: 12,
        backgroundColor: "rgb(255, 255, 255)",
        shadowColor: "rgb(0, 61, 165)",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    cardTitle: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#000" 
    },
    cardSubtitle: { 
        fontSize: 12, 
        color: "rgb(153, 179, 214)" 
    },
    chartToggleContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
        justifyContent: "flex-start",
    },
    toggleButton: {
        borderRadius: 12,
        minWidth: 48,
        paddingHorizontal: 12,
    },
});
