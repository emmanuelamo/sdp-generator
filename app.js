const path = require("path");
const { convertCSVSFileToJSON, convertJSONToCSVFile } = require("./converters");
const { REVENUE_DATE, FILES } = require("./data");
const {
  processMtnReport,
  processTigoReport,
  processVodafoneReport,
} = require("./file-processors");

// ID	NETWORK	COUNTS	REVENUE	SERVICE	REVENUE DATE	CREATED ON	SHORTCODE

const getRevenueWithCount = (report) => {
  return report.reduce(
    (total, cur) => ({
      revenue: total.revenue + cur.REVENUE,
      count: total.count + cur.COUNTS,
    }),
    { revenue: 0, count: 0 }
  );
};

const generateSdpStat = (network, report) => {
  const { count, revenue } = getRevenueWithCount(report);
  console.log(`${network}`);
  console.log("revenue/count");
  console.log(`${revenue.toFixed(3)}/${count}`);
  console.log("");
};

const generateSdpReport = (files) => {
  const tigoReport = processTigoReport(convertCSVSFileToJSON(files.tigo));
  const mtnReport = processMtnReport(convertCSVSFileToJSON(files.mtn));
  const vodadoneReport = processVodafoneReport(
    convertCSVSFileToJSON(files.vodafone)
  );

  const sdpReport = [...vodadoneReport, ...tigoReport];
  const [mtn, tigo, vodafone] = Object.keys(files);

  generateSdpStat(mtn, mtnReport);
  generateSdpStat(tigo, tigoReport);
  generateSdpStat(vodafone, vodadoneReport);

  convertJSONToCSVFile(sdpReport, `SDP_${REVENUE_DATE}.csv`);
};

generateSdpReport(FILES);
