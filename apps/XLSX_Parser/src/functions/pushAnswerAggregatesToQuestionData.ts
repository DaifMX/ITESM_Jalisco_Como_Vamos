import axios from 'axios';

const API_URL = process.env.API_URL!;

export async function pushAggregatesQuestionData(questionData: any[], segmentValueId: string) {
    console.log(`\n======= PUSH QUESTION DATA =======`);
    console.log(`Total question data entries to create: ${questionData.length}`);

    let successCount = 0;
    let errorCount = 0;

    const badAnswers: any[] = [];
    const badQuestions: any[] = [];

    for (const data of questionData) {
        try {
            data.segmentValueId = segmentValueId;
            if (data.result === null) data.result = 0.0;

            await axios.post(`${API_URL}/question/push`, data);
            successCount++;
            process.stdout.write(`\rProgress: ${successCount + errorCount}/${questionData.length} (Success: ${successCount}, Errors: ${errorCount})`);
        } catch (error: any) {
            errorCount++;
            badAnswers.push(data.answerId);
            badQuestions.push(data.questionId);
            console.error(`\nError creating question data:`, { body: { questionId: data.questionId, answerId: data.answerId, result: data.result }, response: { data: error.response?.data, message: error.message } });
        }
    }

    // Remove duplicates from badAnswers array
    const uniqueBadAnswers = [...new Set(badAnswers)];

    let badAnswerCount = 0;
    for (const badAnswer of uniqueBadAnswers) {
        try {
            const a = await axios.get(`${API_URL}/answer/${badAnswer}`);
            if (a.status !== 200) {
                console.log(`NO EXISTE Answer ID: ${badAnswer}`);
                badAnswerCount++;
                continue;
            }

        } catch {
            badAnswerCount++;
            console.log(`NO EXISTE Answer ID: ${badAnswer}`);
        }
    }
    console.log({ badAnswerCount });

    let badQuestionCount = 0;
    for (const badQuestion of badQuestions) {
        try {
            const a = await axios.get(`${API_URL}/question/${badQuestion}`);
            if (a.status !== 200) {
                console.log(`NO EXISTE Question ID: ${badQuestion}`);
                badQuestionCount++;
                continue;
            }

        } catch {
            badQuestionCount++;
            console.log(`NO EXISTE Question ID: ${badQuestion}`);
        }
    }
    console.log({ badQuestionCount });

    console.log(`\n\n======= CREATION COMPLETE =======`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total: ${questionData.length}`);
};