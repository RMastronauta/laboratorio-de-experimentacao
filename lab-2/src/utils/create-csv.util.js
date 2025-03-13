import * as csv from "fast-csv";
import fs from "fs";

export const createCsv = (data, filePath) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("Error: The data array is empty or invalid.");
    return;
  }

  const csvStream = csv.format({
    headers: Object.keys(data[0]),
    delimiter: "|",
  });

  const writableStream = fs.createWriteStream(filePath);

  csvStream.pipe(writableStream).on("finish", () => {
    console.log(`✅ CSV file successfully saved at: ${filePath}`);
  });

  data.forEach((row) => csvStream.write(row));

  csvStream.end();
};
