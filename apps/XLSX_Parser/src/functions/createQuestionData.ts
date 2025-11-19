import axios from 'axios';

const API_URL = process.env.API_URL!;

export async function createQuestionData(questionData: any[]) {
    console.log(`\n======= CREATING QUESTION DATA =======`);
    console.log(`Total question data entries to create: ${questionData.length}`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const data of questionData) {
        try {
            await axios.post(API_URL, data);
            successCount++;
            process.stdout.write(`\rProgress: ${successCount + errorCount}/${questionData.length} (Success: ${successCount}, Errors: ${errorCount})`);
        } catch (error: any) {
            errorCount++;
            console.error(`\nError creating question data:`, error.response?.data || error.message);
        }
    }

    console.log(`\n\n======= CREATION COMPLETE =======`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total: ${questionData.length}`);
};