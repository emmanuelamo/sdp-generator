const xlsx = require("xlsx");
const convertCSVSFileToJSON = (csvFile) => {
  const csvWorkBook = xlsx.readFile(csvFile, { cellDates: true });
  const sheet = csvWorkBook.SheetNames[0];
  const csvSheet = csvWorkBook.Sheets[sheet];
  return xlsx.utils.sheet_to_json(csvSheet);
};

const convertJSONToCSVFile = (jsonObj, filename) => {
  try {
    const newWkBk = xlsx.utils.book_new();
    const newSheet = xlsx.utils.json_to_sheet(jsonObj);
    const sheetName = filename.replace(".csv", "");
    xlsx.utils.book_append_sheet(newWkBk, newSheet, sheetName);
    xlsx.writeFile(newWkBk, filename);
    console.log("file created sucessfully", filename);
  } catch (err) {
    console.log("AN ERROR OCCURED" + err);
  }
};

module.exports = { convertCSVSFileToJSON, convertJSONToCSVFile };
