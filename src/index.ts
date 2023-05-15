import {
  createConfigurationFromFile,
  getFileFromDisk,
  parseCsv,
  sendRows,
} from "./utils";

const csvPath = process.argv[2];
if (!csvPath || csvPath.trim() == "") {
  console.log("Please provide a csv file path");
  process.exit(1);
}

async function main() {
  try {
    const csvData = await getFileFromDisk(csvPath);
    const configuration = await createConfigurationFromFile("./config.json");
    const parsedRows = await parseCsv(csvData, configuration);
    console.log(`Sending follow data to ${configuration.apiEndPoint} ...`);
    console.log(parsedRows);
    await sendRows(configuration.apiEndPoint, parsedRows);
    console.log(`${parsedRows.length} rows sent to the server successfully !`);
  } catch (e: any) {
    console.error(e);
    process.exit(1);
  }
}
for(let i = 0; i < 10; i++) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  console.log(date.getTime())
}
main();
