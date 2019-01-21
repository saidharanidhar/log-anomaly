import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import path from "path";

import { InputArgs } from "./input-args";

const defaultOptions: InputArgs = {
  logDir: `${process.cwd()}/logs`,
  train: false,
  test: true,
  input: "path.json",
  sevieSize: 4,
  output: "path.json"
};

// Defining input arguement options
const optionDefinitions = [
  { name: "logDir", alias: "l", type: String },
  { name: "help", alias: "h", type: Boolean },
  { name: "train", alias: "t", type: Boolean },
  { name: "test", alias: "e", type: Boolean },
  { name: "input", alias: "k", type: String },
  { name: "sevieSize", alias: "s", type: Number },
  { name: "output", alias: "o", type: String }
];

// Configuring the help to be printed
const sections = [
  {
    header: "Log Anomaly App",
    content: "Identifies the Anomalies in the logs"
  },
  {
    header: "Options [ npm start -- <args>  , Eg. npm start -- -l . ]",
    optionList: [
      {
        name: "logDir",
        typeLabel: "-l",
        description: "The input log files"
      },
      {
        name: "train",
        typeLabel: "-t",
        description: "Trains on the give logs and identifies the pattern"
      },
      {
        name: "test",
        typeLabel: "-e",
        description: "Identfies the Anomalies"
      },
      {
        name: "input",
        typeLabel: "-k",
        description: "Input pattern file"
      },
      {
        name: "seiveSize",
        typeLabel: "-s",
        description: "Size of seive to be used for training"
      },
      {
        name: "output",
        typeLabel: "-o",
        description: "Output file for knowledge"
      },
      {
        name: "help",
        typeLabel: "-h",
        description: "Print this usage guide."
      }
    ]
  }
];

export function parseCommandLineArguments() {
  // Parse the input arguments
  const userOptions = commandLineArgs(optionDefinitions);

  // If no arguments specific or asked for help. Print help and exit
  if (userOptions.length === 0 || userOptions.help === true) {
    console.log(commandLineUsage(sections));
    process.exit();
  }

  if (userOptions.logDir) {
    userOptions.logDir = path.resolve(userOptions.logDir);
  }

  return { ...defaultOptions, ...userOptions };
}
