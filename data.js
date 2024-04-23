//replace these
const REVENUE_DATE = "2024-01-01";
const MTN_FILE = "Service_based_revenue_reportNalo.csv";
const TIGO_FILE = "Charges Consolidated.csv";
const VODAFONE_FILE = "Daily NALO Revenue Report 21.12.2022.xlsx";
//
const CREATED_ON = JSON.stringify(new Date()).slice(1, 11);
const FILES = {
  mtn: MTN_FILE,
  tigo: TIGO_FILE,
  vodafone: VODAFONE_FILE,
};

module.exports = { REVENUE_DATE, CREATED_ON, FILES };
