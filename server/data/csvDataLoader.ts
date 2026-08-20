import fs from 'fs';
import path from 'path';

export function loadCsvData(fileName: string): string {
  const possiblePaths = [
    path.join(process.cwd(), 'data', fileName),
    path.join(process.cwd(), 'Sleepsia_Demo', 'data', fileName),
    path.resolve(__dirname, '../../data', fileName),
    path.resolve(__dirname, '../data', fileName),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  }

  return '';
}