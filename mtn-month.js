const { getCumulativeReport } = require("./file-processors");
const { convertCSVSFileToJSON, convertJSONToCSVFile } = require("./converters");
const { MTN_FILE_HEADERS } = require("./constants");
const { CREATED_ON, FILES } = require("./data");

const reportName = "mtn_sdp_Mar.csv";

function preprocessor(file) {
  const headers = { ...MTN_FILE_HEADERS };
  const csvRecords = convertCSVSFileToJSON(file);
  const report = csvRecords
    .filter((record) => record[headers.shortcode] !== "NULL")
    .map((row) => ({
      ID: "",
      NETWORK: "MTN",
      COUNTS: row[headers.count],
      REVENUE: row[headers.revenue],
      SERVICE: row[headers.service],
      "REVENUE DATE": JSON.stringify(row[headers.date]).slice(1, 11),
      "CREATED ON": CREATED_ON,
      SHORTCODE: row[headers.shortcode],
    }));
  return report;
}

function processor(data) {
  const aggs = {};
  for (const record of data) {
    const dateGroup = aggs[record["REVENUE DATE"]];
    if (dateGroup === undefined) {
      aggs[record["REVENUE DATE"]] = [record];
    } else {
      aggs[record["REVENUE DATE"]] = [...dateGroup, record];
    }
  }
  return aggs;
}

const aggsprocessor = (aggs) => {
  let cumulativeReports = [];
  for (const record in aggs) {
    const cumulativeReport = getCumulativeReport(aggs[record]);
    cumulativeReports = [...cumulativeReports, ...cumulativeReport];
  }
  return cumulativeReports;
};

const report = aggsprocessor(processor(preprocessor(FILES.mtn)));
convertJSONToCSVFile(report, reportName);
