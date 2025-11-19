import type { Cell } from "exceljs";
import { RuntimeError } from "@jcv/errors";

export type QRC = 'question' | 'category' | 'response' | 'jump';

export function resolveQRC(var_Q_R_C: Cell | undefined): QRC {
    if (!var_Q_R_C) throw new RuntimeError('Error getting cell.');

    const value = var_Q_R_C.value;

    // isEmptyString
    if (!value) return 'jump';
    
    // notEmptyString notBold notItalic
    if (!var_Q_R_C.style.font?.bold) return 'response';
    
    // notEmptyString isBold isItalic
    if (var_Q_R_C.style.font?.italic) {
        if (value === 'Promedio') return 'jump';
        return 'question';
    }

    // notEmptyString isBold notItalic
    return 'category';
};