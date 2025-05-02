import db from '../config/connection.js';
import { Question } from '../models/index.js'
import cleanDB from './cleanDb.js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const questionData = JSON.parse(
  readFileSync(join(__dirname, './pythonQuestions.json'), 'utf-8')
);

try {
  await db();
  await cleanDB();

  // bulk create each model
  await Question.insertMany(questionData);

  console.log('Seeding completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
