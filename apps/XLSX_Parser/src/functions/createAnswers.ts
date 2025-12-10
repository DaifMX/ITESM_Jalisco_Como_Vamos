import axios from 'axios';

const API_URL = process.env.API_URL!;

export async function createAnswers(answers: any[]) {
    console.log(`\n======= CREATING ANSWERS =======`);
    console.log(`Total answers to create: ${answers.length}`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const answer of answers) {
        try {
            await axios.post(`${API_URL}/answer`, answer);
            successCount++;
            process.stdout.write(`\rProgress: ${successCount + errorCount}/${answers.length} (Success: ${successCount}, Errors: ${errorCount})`);
        } catch (error: any) {
            errorCount++;
            console.error(`\nError creating answer:`, error.response?.data || error.message);
        }
    }

    console.log(`\n\n======= CREATION COMPLETE =======`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total: ${answers.length}`);
}
