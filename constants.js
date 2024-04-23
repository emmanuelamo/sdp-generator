//headers
const MTN_FILE_HEADERS = {
  date: "DATE",
  shortcode: "SHORT_CODE",
  count: "Successfull_Charged_Count",
  revenue: "Total_Revenue",
  service: "Service_Name",
};
const TIGO_FILE_HEADERS = {
  date: "REPORT_DATE",
  service: "PRODUCT_NAME",
  shortcode: "SHORT_CODE",
  count: "QTY_CHARGES",
  revenue: "TOTAL_INCOME",
};

const VODAFILE_FILE_HEADERS = {
  date: "DATE ",
  service: "SERVICE NAME",
  shortcode: "SHORT CODE",
  count: "COUNT",
  revenue: "REVENUE (GHS)",
};

module.exports = { MTN_FILE_HEADERS, TIGO_FILE_HEADERS, VODAFILE_FILE_HEADERS };
