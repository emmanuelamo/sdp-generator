const { getCumulativeReport } = require("./file-processors");
const { convertCSVSFileToJSON, convertJSONToCSVFile } = require("./converters");
const { TIGO_FILE_HEADERS } = require("./constants");
const { CREATED_ON, FILES } = require("./data");

const reportName = "tigo_sdp_Mar.csv";

function preprocessor(file) {
  const headers = { ...TIGO_FILE_HEADERS };
  const csvRecords = convertCSVSFileToJSON(file);

  const formatDateObject = (date) => {
    const [year, day, month] = date.toISOString().slice(0, 10).split("-");
    return `${year}-${month}-${day}`;
  };

  const formatDateString = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };
  const formatDate = (date) => {
    const formattedDate =
      typeof date === "object"
        ? formatDateObject(date)
        : formatDateString(date);

    return formattedDate;
  };

  return csvRecords.map((record) => ({
    ID: "",
    NETWORK: "AIRTELTIGO",
    COUNTS: record[headers.count],
    REVENUE: record[headers.revenue],
    SERVICE: record[headers.service],
    "REVENUE DATE": formatDate(record[headers.date]), // Format the date
    "CREATED ON": CREATED_ON,
    SHORTCODE: record[headers.shortcode],
  }));
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

const report = aggsprocessor(processor(preprocessor(FILES.tigo)));
convertJSONToCSVFile(report, reportName);
