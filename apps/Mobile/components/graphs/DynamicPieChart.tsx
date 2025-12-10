import { Dimensions, View, Text as RNText, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useMemo } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = Math.min(SCREEN_WIDTH - 32); // Slightly wider since legend is gone

interface PieChartDataItem {
    name: string;
    value: number;
    color?: string;
    legendFontColor?: string;
    legendFontSize?: number;
}

interface DynamicPieChartProps {
    data: PieChartDataItem[];
    width?: number;
    height?: number;
    colors?: string[];
    legendFontColor?: string;
    legendFontSize?: number;
    hasLegend?: boolean; // We will ignore this for the built-in one, but use it to toggle our custom one
    center?: [number, number];
}

const DEFAULT_COLORS = [
    "#003DA5",
    "#F37021",
    "#C4D600",
    "#E4002B",
    "#FEDD00",
    "#99B3D6",
];

export function DynamicPieChart({
    data,
    width = CHART_WIDTH,
    height = 220,
    colors = DEFAULT_COLORS,
    legendFontColor = "#003DA5",
    legendFontSize = 12,
    hasLegend = true,
    center = [0, 0],
}: DynamicPieChartProps) {
    const chartData = useMemo(() => {
        return data.map((item, index) => ({
            name: item.name,
            population: item.value,
            color: item.color || colors[index % colors.length],
            legendFontColor: legendFontColor,
            legendFontSize: legendFontSize,
        }));
    }, [data, colors, legendFontColor, legendFontSize]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <RNText style={styles.noDataText}>No hay datos disponibles</RNText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.chartWrapper}>
                <PieChart
                    data={chartData}
                    width={width}
                    height={height}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft={(width / 4).toString()} // Center the pie chart horizontally
                    hasLegend={false} // Disable built-in legend
                    absolute={false}
                    avoidFalseZero={true}
                    center={center}
                />
            </View>

            {hasLegend && (
                <View style={styles.legendContainer}>
                    {chartData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View
                                style={[
                                    styles.legendColorBox,
                                    { backgroundColor: item.color },
                                ]}
                            />
                            <RNText
                                style={[
                                    styles.legendText,
                                    {
                                        color: legendFontColor,
                                        fontSize: legendFontSize,
                                    },
                                ]}
                            >
                                {item.name} - {Number(item.population).toFixed(1)}%
                            </RNText>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: "100%",
    },
    chartWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    noDataText: {
        fontSize: 14,
        color: "#003DA5",
        textAlign: "center",
        marginTop: 20,
    },
    legendContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 20,
        paddingHorizontal: 16,
        width: "100%",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
        marginBottom: 8,
        // This ensures the item doesn't overflow the screen width
        maxWidth: "100%", 
    },
    legendColorBox: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        // This allows text to wrap to the next line if needed
        flexShrink: 1, 
    },
});