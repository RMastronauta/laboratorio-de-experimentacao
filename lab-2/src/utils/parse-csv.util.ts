import csvParser from 'csv-parser';
import fs from 'fs';

export const parseCsvToJson = <T>(path: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];

    if (!fs.existsSync(path)) {
      return reject(new Error(`File not found: ${path}`));
    }

    fs.createReadStream(path)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data as T);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
