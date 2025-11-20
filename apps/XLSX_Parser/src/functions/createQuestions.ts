import axios from 'axios';

const API_URL = process.env.API_URL!;

export async function createQuestions(questions: any[]) {
    console.log(`\n======= CREATING QUESTIONS =======`);
    console.log(`Total questions to create: ${questions.length}`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const question of questions) {
        try {
            await axios.post(`${API_URL}/question`, question);
            successCount++;
            process.stdout.write(`\rProgress: ${successCount + errorCount}/${questions.length} (Success: ${successCount}, Errors: ${errorCount})`);
        } catch (error: any) {
            errorCount++;
            console.error(`\nError creating question:`, error.response?.data || error.message);
        }
    }

    console.log(`\n\n======= CREATION COMPLETE =======`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total: ${questions.length}`);
}
