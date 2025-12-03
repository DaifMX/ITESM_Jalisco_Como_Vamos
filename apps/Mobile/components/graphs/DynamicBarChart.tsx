import { Dimensions, View, Text as RNText, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useMemo } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

// AJUSTE CLAVE: Restamos más espacio (aprox 90-100px) para asegurar que
// los números del Eje Y (la escala) quepan dentro de la tarjeta.
const CHART_WIDTH = SCREEN_WIDTH - 90; 

interface BarChartDataItem {
    label: string;
    value: number;
}

interface DynamicBarChartProps {
    data: BarChartDataItem[];
    width?: number;
    height?: number;
    fromZero?: boolean;
    showValuesOnTopOfBars?: boolean;
    color?: string;
    fillColor?: string;
}

const DEFAULT_COLOR = "#003DA5";

export function DynamicBarChart({
    data,
    width = CHART_WIDTH,
    height = 260,
    fromZero = true,
    showValuesOnTopOfBars = true,
    color = DEFAULT_COLOR,
    fillColor = DEFAULT_COLOR,
}: DynamicBarChartProps) {
    
    const chartData = useMemo(() => ({
        labels: data.map((_, index) => (index + 1).toString()),
        datasets: [{
            data: data.map((item) => Math.round(item.value * 10) / 10),
        }]
    }), [data]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <RNText style={styles.noDataText}>No hay datos disponibles</RNText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BarChart
                data={chartData}
                width={width}
                height={height}
                yAxisLabel=""
                yAxisSuffix="%"
                fromZero={fromZero}
                showValuesOnTopOfBars={showValuesOnTopOfBars}
                segments={4} // Define cuántas líneas horizontales quieres en la escala
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 1, // Muestra decimales en la escala si es necesario
                    color: (opacity = 1) => fillColor,
                    fillShadowGradient: fillColor,
                    fillShadowGradientOpacity: 1,
                    labelColor: (opacity = 1) => color,
                    style: {
                        borderRadius: 16,
                    },
                    propsForLabels: {
                        fontSize: 11,
                        fontWeight: "600",
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: "",
                        stroke: "#E6EBF5",
                        strokeWidth: 1,
                    },
                    barPercentage: 0.6,
                }}
                style={{
                    borderRadius: 16,
                }}
                verticalLabelRotation={0}
            />

            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={styles.legendIndexBox}>
                            <RNText style={styles.legendIndexText}>
                                {index + 1}
                            </RNText>
                        </View>
                        <RNText style={styles.legendLabelText}>
                            {item.label}
                        </RNText>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: 'center',
        width: "100%",
        backgroundColor: "#fff",
    },
    noDataText: {
        fontSize: 14,
        color: "#003DA5",
        textAlign: "center",
        marginTop: 20,
    },
    legendContainer: {
        marginTop: 12,
        width: "100%",
        paddingHorizontal: 16,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
        width: "100%",
    },
    legendIndexBox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#F0F4FA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginTop: 1,
        borderWidth: 1,
        borderColor: "#D1DBEB"
    },
    legendIndexText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#003DA5",
    },
    legendLabelText: {
        fontSize: 13,
        color: "#333",
        flex: 1,
        flexWrap: "wrap",
        lineHeight: 18,
    },
});