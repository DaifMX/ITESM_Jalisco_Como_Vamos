import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import parseXlsxToJson from './parseXlsxToJson';

// import { createAnswers } from './functions/createAnswers';
// import { createQuestions } from './functions/createQuestions';
// import { createQuestionData } from './functions/createQuestionData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.time('Fetched in: ');

parseXlsxToJson().then(async (entries) => {
    console.log('======= FETCH DONE =======');
    console.log('Answers fetched:', entries.answers.length);
    console.log('Answer Aggregates fetched:', entries.answersAggregates.length);
    console.log('Questions fetched:', entries.questions.length);
    console.log('Question Metadata fetched:', entries.questionData.length);
    
    let outputPath = path.join(__dirname, '..', 'json', 'answers.json');
    await fs.writeFile(outputPath, JSON.stringify(entries.answers, null, 2), 'utf-8');
    
    outputPath = path.join(__dirname, '..', 'json', 'answersAggregates.json');
    await fs.writeFile(outputPath, JSON.stringify(entries.answersAggregates, null, 2), 'utf-8');
    
    outputPath = path.join(__dirname, '..', 'json', 'questionData.json');
    await fs.writeFile(outputPath, JSON.stringify(entries.questionData, null, 2), 'utf-8');

    outputPath = path.join(__dirname, '..', 'json', 'questions.json');
    await fs.writeFile(outputPath, JSON.stringify(entries.questions, null, 2), 'utf-8');

    console.log(`\nData saved in: ${path.join(__dirname, '..', 'json')}`);

    // Create questions via API
    // KEEP THIS ORDER FOR INSERTIONS
    // await createQuestions(entries.questions); // Uncomment this to push questions
    // await createAnswers(entries.answers);  // Uncomment this to push answers
    // await createQuestionData(entries.questionData);  // Uncomment this to push questionData

}).catch((err: any) => {
    console.log(err);
});

console.timeEnd('Fetched in: ');