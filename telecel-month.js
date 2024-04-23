const fs = require("fs");
const path = require("path");
const { getCumulativeReport } = require("./file-processors");
const { convertCSVSFileToJSON, convertJSONToCSVFile } = require("./converters");
const { VODAFILE_FILE_HEADERS } = require("./constants");
const { CREATED_ON, REVENUE_DATE } = require("./data");


const SDP_FILES_DIR = "telecel_Mar";
const reportName = `telecel_sdp_mar.csv`;


const formatDateObject = (date) => {
    const [year, month, day] = date.toISOString().slice(0, 10).split("-");
    return `${year}-${month}-${day}`;
  };

const processVodafoneReport = (csvRecords) => {
  const headers = { ...VODAFILE_FILE_HEADERS };
  const services = csvRecords.reduce((uniques, record) => {
    const result = [...uniques];
    const service = `${record[headers.service]}`;
    return result.includes(service) ? result : [...result, service];
  }, []);

  return services.map((service) => {
    const serviceRecords = csvRecords.filter(
      (el) => el[headers.service] === service
    );
    const count = serviceRecords
      .map((record) => record[headers.count])
      .reduce((total, cur) => cur + total, 0);
    const revenue = serviceRecords
      .map((record) => record[headers.revenue])
      .reduce((total, cur) => cur + total, 0);

     

    return {
      ID: "",
      NETWORK: "VODAFONE",
      COUNTS: count,
      REVENUE: revenue,
      SERVICE: service,
      "REVENUE DATE": formatDateObject(serviceRecords[0][headers.date]), // Assuming REVENUE_DATE is defined
      "CREATED ON": CREATED_ON,
      SHORTCODE: serviceRecords[0][headers.shortcode],
    };
  });
};

function generateMonthlyReport(dir) {
  let data = [];

  const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const filename = path.join(dir, file);
      const csvRecords = convertCSVSFileToJSON(filename);
      const vodafoneReport = processVodafoneReport(csvRecords);
      data = data.concat(vodafoneReport);
    });

  console.log(` last file count: ${data.length}`)

  
  convertJSONToCSVFile(data, reportName);
  console.log(`Report generated for Jan 2024`);
}

generateMonthlyReport(SDP_FILES_DIR);
