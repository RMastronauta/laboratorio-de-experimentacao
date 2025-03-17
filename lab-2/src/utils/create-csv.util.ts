import * as csv from 'fast-csv';
import fs from 'fs';
import path from 'path';

export const createCsv = (data: any[], filePath: string) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Error: The data array is empty or invalid.');
    return;
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const csvStream = csv.format({
    headers: Object.keys(data[0]),
    delimiter: '|',
  });

  const writableStream = fs.createWriteStream(filePath);

  csvStream.pipe(writableStream).on('finish', () => {
    console.log(`✅ CSV file successfully saved at: ${filePath}`);
  });

  data.forEach((row) => csvStream.write(row));

  csvStream.end();
};
