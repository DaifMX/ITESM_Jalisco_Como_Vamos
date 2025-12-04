import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

interface SegmentValue {
    id: string;
    name: string;
    segmentId: string;
}

interface Segment {
    id: string;
    name: string;
    values: SegmentValue[];
}

interface FilterModalProps {
    visible: boolean;
    segments: Segment[] | undefined;
    selectedSegmentValue: string | null;
    promedioSegmentValueId: string | null;
    onClose: () => void;
    onApply: () => void;
    onClearFilters: () => void;
    onSelectSegmentValue: (valueId: string | null) => void;
}

export function FilterModal({
    visible,
    segments,
    selectedSegmentValue,
    promedioSegmentValueId,
    onClose,
    onApply,
    onClearFilters,
    onSelectSegmentValue,
}: FilterModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalWrap}>
                <View style={styles.modalCard}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtros por segmento</Text>
                        <Button
                            variant="outline"
                            onPress={onClearFilters}
                            className="border-pantone-light-blue rounded-xl"
                        >
                            <ButtonText className="text-pantone-dark-blue rounded-xl">
                                Limpiar
                            </ButtonText>
                        </Button>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        <View style={styles.segmentsContainer}>
                            {segments?.map((segment) => (
                                <View key={segment.id}>
                                    <Text style={styles.filterTitle}>{segment.name}</Text>
                                    <View style={styles.chipRow}>
                                        <Chip
                                            label="Promedio"
                                            active={selectedSegmentValue === promedioSegmentValueId}
                                            onPress={() => onSelectSegmentValue(promedioSegmentValueId)}
                                        />
                                        {segment.values
                                            .filter(v => v.name.toLowerCase() !== "promedio")
                                            .map((value) => (
                                                <Chip
                                                    key={value.id}
                                                    label={value.name}
                                                    active={selectedSegmentValue === value.id}
                                                    onPress={() => onSelectSegmentValue(value.id)}
                                                />
                                            ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <Button 
                        variant="outline" 
                        onPress={onClose} 
                        className="border-pantone-light-blue rounded-xl"
                    >
                        <ButtonText className="text-pantone-dark-blue">
                            Cerrar
                        </ButtonText>
                    </Button>
                    <Button 
                        onPress={onApply} 
                        className="bg-pantone-dark-blue rounded-xl"
                    >
                        <ButtonText className="text-white">
                            Aplicar filtro
                        </ButtonText>
                    </Button>
                </View>
            </View>
        </Modal>
    );
}

// Componente Chip interno
type ChipProps = { 
    label: string; 
    active: boolean; 
    onPress: () => void 
};

function Chip({ label, active, onPress }: ChipProps): React.ReactElement {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.chip, active && styles.chipActive]}
        >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    modalWrap: {
        flex: 1,
        backgroundColor: "rgba(0, 61, 165, 0.3)",
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: "rgb(255, 255, 255)",
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: { 
        fontSize: 16, 
        fontWeight: "700", 
        color: "#000" 
    },
    scrollView: { 
        maxHeight: 400 
    },
    segmentsContainer: { 
        gap: 16 
    },
    filterTitle: { 
        fontWeight: "600", 
        marginBottom: 8, 
        color: "#000" 
    },
    chipRow: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        gap: 8 
    },
    chip: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    chipActive: { 
        backgroundColor: "rgb(0, 61, 165)", 
        borderColor: "rgb(0, 61, 165)" 
    },
    chipText: { 
        color: "rgb(0, 61, 165)" 
    },
    chipTextActive: { 
        color: "rgb(255, 255, 255)" 
    },
});
