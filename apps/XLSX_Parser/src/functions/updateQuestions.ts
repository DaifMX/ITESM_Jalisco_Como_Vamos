import axios from 'axios';

const API_URL = process.env.API_URL!;

export async function updateQuestions(questions: Record<string, any>[]) {
    console.log(`\n======= UPDATING QUESTIONS =======`);
    console.log(`Total question data entries to update: ${questions.length}`);

    let successCount = 0;
    let errorCount = 0;

    for (const data of questions) {
        try {
            await axios.patch(`${API_URL}/question/${data.uuid}`, { valueShort: data.valueShort });
            successCount++;
            process.stdout.write(`\rProgress: ${successCount + errorCount}/${questions.length} (Success: ${successCount}, Errors: ${errorCount})`);
        } catch (error: any) {
            errorCount++;
            console.error(`\nError creating question data:`, error.response?.data || error.message);
        }
    }

    console.log(`\n\n======= CREATION COMPLETE =======`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total: ${questions.length}`);
};