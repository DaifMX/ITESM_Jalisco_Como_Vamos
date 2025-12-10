import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

interface ChartDataItem {
    name: string;
    value: number;
}

interface PDFExportOptions {
    questionText: string;
    questionCode: string;
    chartData: ChartDataItem[];
    chartImageBase64: string;
    total: number;
}

/**
 * Generates and exports a PDF with the chart, logo, question, and percentage data
 */
export async function exportChartToPDF(options: PDFExportOptions) {
    const { questionText, questionCode, chartData, chartImageBase64, total } = options;

    // Load the logo as base64
    const logoAsset = Asset.fromModule(require('../assets/images/logo2.png'));
    await logoAsset.downloadAsync();
    
    // Fetch logo and convert to base64
    let logoBase64 = '';
    try {
        const response = await fetch(logoAsset.localUri || logoAsset.uri);
        const blob = await response.blob();
        logoBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error loading logo:', error);
    }

    // Build the percentage distribution table
    const percentageRows = chartData
        .map((item) => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${item.value.toFixed(1)}%</td>
            </tr>
        `)
        .join('');

    // Create HTML content for the PDF
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte - ${questionCode}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #ffffff;
                    color: #000000;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #003da5;
                }
                .logo {
                    width: 140px;
                    height: auto;
                }
                .title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #003da5;
                }
                .question-section {
                    background-color: #f8fafc;
                    border: 1px solid #99b3d6;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .question-code {
                    font-size: 14px;
                    font-weight: 600;
                    color: #003da5;
                    margin-bottom: 8px;
                }
                .question-text {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #000000;
                }
                .chart-section {
                    margin-bottom: 20px;
                    text-align: center;
                }
                .chart-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #000000;
                    margin-bottom: 10px;
                    text-align: left;
                }
                .chart-image {
                    width: 100%;
                    max-width: 600px;
                    height: auto;
                    margin: 0 auto;
                    display: block;
                }
                .data-section {
                    margin-top: 20px;
                }
                .data-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #000000;
                    margin-bottom: 12px;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .data-table th {
                    background-color: #003da5;
                    color: #ffffff;
                    padding: 10px;
                    text-align: left;
                    font-weight: 600;
                }
                .data-table td {
                    padding: 8px;
                    border-bottom: 1px solid #e5e7eb;
                }
                .total-row {
                    background-color: #f1f5f9;
                    font-weight: 700;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 11px;
                    color: #6b7280;
                    padding-top: 15px;
                    border-top: 1px solid #e5e7eb;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">Jalisco Cómo Vamos - Reporte de Análisis</div>
                ${logoBase64 ? `<img src="${logoBase64}" alt="Jalisco Cómo Vamos" class="logo" />` : ''}
            </div>

            <div class="question-section">
                <div class="question-code">${questionCode}</div>
                <div class="question-text">${questionText}</div>
            </div>

            <div class="chart-section">
                <div class="chart-title">Distribución de Respuestas</div>
                <img src="data:image/png;base64,${chartImageBase64}" alt="Gráfica" class="chart-image" />
            </div>

            <div class="data-section">
                <div class="data-title">Porcentajes de Distribución</div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Respuesta</th>
                            <th style="text-align: right;">Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${percentageRows}
                        <tr class="total-row">
                            <td style="padding: 10px;">TOTAL</td>
                            <td style="padding: 10px; text-align: right;">${total.toFixed(1)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="footer">
                <p>Documento generado por Jalisco Cómo Vamos</p>
                <p>www.jaliscocomovamos.org</p>
            </div>
        </body>
        </html>
    `;

    try {
        // Generate PDF
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false
        });

        // Share the PDF
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: `Reporte - ${questionCode}`,
                UTI: 'com.adobe.pdf'
            });
        } else {
            console.error('Sharing is not available on this platform');
            throw new Error('No se puede compartir el PDF en este dispositivo');
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}
