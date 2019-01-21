// import fs from "fs";
// let patterns: Array<Array<string>> = JSON.parse(
//   fs.readFileSync("./path.json").toString()
// );

// let patternRegex: Array<RegExp> = [];

// patterns.forEach(pattern => {
//   let experssion: Array<string> = [];
//   pattern.forEach(fileName => {
//     experssion.push(`.* (${fileName}) .*`);
//   });
//   patternRegex.push(RegExp(`\\n?${experssion.join("\\n?")}\\n?`));
// });

// console.log(patternRegex);

// let directory = "./train";
// let regex: RegExp = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}:\d{3}) (\w*) (\w*\.\w*:\d*) \[(.*)\]/;
// let thread: string,
//   threadDict: { [key: string]: Array<string> } = {};

// fs.readdirSync(directory).map(file => {
//   console.log(`Cleaning on ${file}`);
//   fs.readFileSync(`${directory}/${file}`)
//     .toString()
//     .split("\n")
//     .forEach(line => {
//       let matchString: RegExpMatchArray | null = line.match(regex);
//       if (matchString) thread = matchString[4];
//       //   console.log(thread);
//       if (threadDict[thread] == undefined) threadDict[thread] = [];
//       threadDict[thread].push(line);
//     });
// });

// console.log("===".repeat(40));
// for (let key in threadDict) {
//   let threadLines = threadDict[key].join("\n");
//   patternRegex.forEach(patternExpression => {
//     while (true) {
//       let matchString: RegExpMatchArray | null = threadLines.match(
//         patternExpression
//       );
//       if (matchString) {
//         threadLines = threadLines.replace(
//           matchString[0],
//           `\n${"---".repeat(40)}\n`
//         );
//       } else {
//         break;
//       }
//     }
//   });
//   console.log(`Anamolies in ${key}`);
//   console.log("===".repeat(40));
//   console.log(threadLines);
//   console.log("===".repeat(40));
// }
import { Train } from "./train";
import { Execute } from "./execute";
import { parseCommandLineArguments } from "./input/parse-input-args";

const userArgs = parseCommandLineArguments();

console.log(userArgs);

if (userArgs.train) {
  new Train(userArgs.logDir, userArgs.output, userArgs.sevieSize);
} else {
  new Execute(userArgs.logDir, userArgs.input);
}
