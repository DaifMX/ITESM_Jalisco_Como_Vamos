import path from 'path';
import { fileURLToPath } from 'url';

import ExcelJS from 'exceljs';

import { resolveQRC, QRC } from './functions/resolveQRC';

import { categoryMap } from './mappers/categoryMap';
import { segmentValueMap } from './mappers/segmentValueMap';
import { questionIdMap } from './mappers/questionIdMap';
import { answerIdMap } from './mappers/answerIdMap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workbook = new ExcelJS.Workbook();
const filePath = path.join(__dirname, '..' , 'xlsx', 'info-crossed-table.xlsx');

// La función parseXlsxToJson tira un error en caso de que alguno de
// los campos a parsear sea nulo, a menos de que se especifique en este
// arreglo.

export default async function parseXlsxToJson(): Promise<{
    answers: Array<Record<string, any>>,
    answersAggregates: Array<Record<string, any>>,
    questions: Array<Record<string, any>>,
    questionData: Array<Record<string, any>>,
}> {
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Conjunto');

    // Resultados a retornar
    const answers: Array<Record<string, any>> = [];
    const answersAggregates: Array<Record<string, any>> = [];
    const questions: Array<Record<string, any>> = [];
    const questionData: Array<Record<string, any>> = [];

    const startingRow = 5;
    let currentRow = startingRow;
    const stopRow = 1980;

    let currCategory = '';

    console.log('===== STARTING FETCH =====');
    console.log(`Starts at: ${currentRow}`);
    console.log(`Stops at: ${stopRow}`);
    console.log('==========================\n');

    let xlsxCode;

    for (currentRow; currentRow <= stopRow; currentRow++) {
        const row = worksheet?.getRow(currentRow);
        
        const var_Q_R_C = row?.getCell('B'); // Pregunta/Respuestas & Categorias
        
        // Resolver valor en 'B' para saber si es una pregunta, 
        // una respuesta, una categoria, o un espacio entre preguntas.
        
        const qrc: QRC = resolveQRC(var_Q_R_C);

        if (qrc === 'jump') continue;

        if (qrc === 'category') {
            const val = var_Q_R_C?.value;
            if (val) currCategory = val.toString();
            continue;
        }

        
        if (qrc === 'question') {
            xlsxCode = row?.getCell('A').value; // Código-2024
            const questionValue = var_Q_R_C?.value?.toString().trim().replace(/\s+/g, ' ');
            const questionId = questionIdMap[xlsxCode as string];
            questions.push({
                id: questionId,
                xlsxCode,
                value: questionValue,
                categoryId: categoryMap[currCategory as keyof typeof categoryMap],
            });
            continue;
        }

        if (qrc === 'response') {
            // Obtener datos de la respuesta
            const answerValue = var_Q_R_C?.value?.toString().trim().replace(/\s+/g, ' ');
            const answerIndex = answers.findIndex((e) => e.value === answerValue);
            let answerId;
            if (answerIndex === -1) {
                const newAnswer = {
                    id: answerIdMap[answerValue as string],
                    value: answerValue,
                };
                answers.push(newAnswer);
                answerId = newAnswer.id;
            } else {
                answerId = answers[answerIndex].id;
            }
            
            // Promedio (Total 2024)
            const resultAggregate = row?.getCell('C').value;
            const questionId = questionIdMap[xlsxCode as string];
            answersAggregates.push({
                questionId,
                answerId,
                result: resultAggregate
            });

            // Obtener porcentajes de respuesta

            // Calidad de Vida
            const lifeQuality12 = row?.getCell('D').value; // Calidad de Vida - 1-2
            const lifeQuality3 = row?.getCell('E').value; // Calidad de Vida - 3
            const lifeQuality45 = row?.getCell('F').value // Calidad de Vida - 4-5

            // Municipio
            const elSalto = row?.getCell("G").value;
            const guadalajara = row?.getCell("H").value;
            const tlaquepaque = row?.getCell("I").value;
            const tlajomulco = row?.getCell("J").value;
            const tonala = row?.getCell("K").value;
            const zapopan = row?.getCell("L").value;

            // Genero
            const hombre = row?.getCell("M").value;
            const mujer = row?.getCell("N").value;

            // Edad
            const age1829 = row?.getCell("O").value; // Edad - 18-29
            const age3044 = row?.getCell("P").value; // Edad - 30-44
            const age4559 = row?.getCell("Q").value; // Edad - 45 - 59
            const age60 = row?.getCell("R").value; // Edad 60+

            // Escolaridad
            const middleSchool = row?.getCell("S").value;
            const highSchool = row?.getCell("T").value;
            const college = row?.getCell("U").value;

            // NSE (Regla 2024-2022)
            const nseDDE = row?.getCell("V").value; // NSE D+/D/E
            const nseCC = row?.getCell("W").value; // NSE C/C+
            const nseABC = row?.getCell("X").value; // NSE A\B\C+

            const dataSet = [
                { value: lifeQuality12, segmentValueId: segmentValueMap['1-2'] },
                { value: lifeQuality3, segmentValueId: segmentValueMap['3'] },
                { value: lifeQuality45, segmentValueId: segmentValueMap['4-5'] },
                { value: elSalto, segmentValueId: segmentValueMap['El Salto'] },
                { value: guadalajara, segmentValueId: segmentValueMap['Guadalajara'] },
                { value: tlaquepaque, segmentValueId: segmentValueMap['Tlaquepaque'] },
                { value: tlajomulco, segmentValueId: segmentValueMap['Tlajomulco'] },
                { value: tonala, segmentValueId: segmentValueMap['Tonalá'] },
                { value: zapopan, segmentValueId: segmentValueMap['Zapopan'] },
                { value: hombre, segmentValueId: segmentValueMap['Hombre'] },
                { value: mujer, segmentValueId: segmentValueMap['Mujer'] },
                { value: age1829, segmentValueId: segmentValueMap['18-29'] },
                { value: age3044, segmentValueId: segmentValueMap['30-44'] },
                { value: age4559, segmentValueId: segmentValueMap['45-59'] },
                { value: age60, segmentValueId: segmentValueMap['60+'] },
                { value: middleSchool, segmentValueId: segmentValueMap['Sec<'] },
                { value: highSchool, segmentValueId: segmentValueMap['Prep'] },
                { value: college, segmentValueId: segmentValueMap['Univ+'] },
                { value: nseDDE, segmentValueId: segmentValueMap['D+/D/E'] },
                { value: nseCC, segmentValueId: segmentValueMap['C/C+'] },
                { value: nseABC, segmentValueId: segmentValueMap['A/B/C+'] }
            ];

            for (let column of dataSet) {
                if (column.value == '' || !column.value) continue;

                const cleanValue = column.value.toString().replace('%', '');                
                const questionId = questionIdMap[xlsxCode as string];
                questionData.push({
                    answerId,
                    questionId,
                    segmentValueId: column.segmentValueId,
                    result: cleanValue
                });
            }
        }
    }

    return { answersAggregates, answers, questions, questionData };
};