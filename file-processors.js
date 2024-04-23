const { REVENUE_DATE, CREATED_ON } = require("./data");
const {
  MTN_FILE_HEADERS,
  TIGO_FILE_HEADERS,
  VODAFILE_FILE_HEADERS,
} = require("./constants");

const getCumulativeReport = (report) =>
  report.reduce((result, record) => {
    const duplicate = result.find(({ SERVICE }) => SERVICE === record.SERVICE);
    return duplicate
      ? result.map((res) =>
          duplicate.SERVICE === res.SERVICE
            ? {
                ...duplicate,
                COUNTS: duplicate.COUNTS + record.COUNTS,
                REVENUE: duplicate.REVENUE + record.REVENUE,
              }
            : res
        )
      : [...result, record];
  }, []);

const processMtnReport = (csvRecords) => {
  const headers = { ...MTN_FILE_HEADERS };
  const report = csvRecords
    .filter(
      (record) =>
        JSON.stringify(record[headers.date]).slice(1, 11) === REVENUE_DATE &&
        record[headers.shortcode] !== "NULL"
    )
    .map((row) => ({
      ID: "",
      NETWORK: "MTN",
      COUNTS: row[headers.count],
      REVENUE: row[headers.revenue],
      SERVICE: row[headers.service],
      "REVENUE DATE": REVENUE_DATE,
      "CREATED ON": CREATED_ON,
      SHORTCODE: row[headers.shortcode],
    }));
  return getCumulativeReport(report);
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
      "REVENUE DATE": REVENUE_DATE,
      "CREATED ON": CREATED_ON,
      SHORTCODE: serviceRecords[0][headers.shortcode],
    };
  });
};

const processTigoReport = (csvRecords) => {
  const headers = { ...TIGO_FILE_HEADERS };
  return csvRecords.map((record) => ({
    ID: "",
    NETWORK: "AIRTELTIGO",
    COUNTS: record[headers.count],
    REVENUE: record[headers.revenue],
    SERVICE: record[headers.service],
    "REVENUE DATE": REVENUE_DATE,
    "CREATED ON": CREATED_ON,
    SHORTCODE: record[headers.shortcode],
  }));
};

module.exports = {
  processMtnReport,
  processTigoReport,
  processVodafoneReport,
  getCumulativeReport,
};
