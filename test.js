// const { convertCSVSFileToJSON } = require("./converters");
// const { FILES } = require("./data");
// const { processMtnReport } = require("./file-processors");
// // const filename = "SDP_2022-09-14.csv";

// const mtnData = processMtnReport(convertCSVSFileToJSON(FILES.mtn));

// const getCumulativeReport = (report) => {
//   const res = report.reduce((result, record) => {
//     const duplicate = result.find(({ SERVICE }) => SERVICE === record.SERVICE);
//     if (duplicate) {
//       //  console.log({duplicate,record})
//       const u = result.map((rec) =>
//         duplicate.SERVICE === rec.SERVICE
//           ? {
//               ...duplicate,
//               COUNTS: duplicate.COUNTS + record.COUNTS,
//               REVENUE: duplicate.REVENUE + record.REVENUE,
//             }
//           : rec
//       );
//       return u;
//     }

//     return [...result, record];
//   }, []);
//   return res;
// };

// console.log(getCumulativeReport(mtnData));

//foo0042 -> foo0043

const sample = "fo99obar99";
function stringIncrementor(str) {
  const breakPoint = getBreakPoint(str);

  if (breakPoint === str.length - 1) return str + 1;

  const arr = [...str];
  const strings = arr.slice(0, breakPoint + 1);
  const numbers = arr.slice(breakPoint + 1);
  const zeros = numbers.filter((el) => +el === 0);

  const incrementedNum = (+numbers.join("") + 1).toString();
  const zerosToRemove = incrementedNum.length + zeros.length - numbers.length;
  const sigZeros = zeros.slice(zerosToRemove);
  return [...strings, ...sigZeros, incrementedNum].join("");
}

const getBreakPoint = (str) => {
  for (let i = str.length - 1; i > 0; i--) {
    if (isNaN(str[i])) return i;
  }
};
stringIncrementor(sample);
