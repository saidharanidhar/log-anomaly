import fs, { PathLike } from "fs";
import readline from "readline";

export class Train {
  private output: string;
  private seiveSize: number;
  private trainFolder: PathLike;
  private threadDict: { [key: string]: string } = {};
  private fileCodeDict: { [key: string]: string } = {};
  private threadPatterns: Array<string> = [];
  private regex: RegExp = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}:\d{3}) (\w*) (\w*\.\w*:\d*) \[(.*)\]/;

  constructor(
    path: string = "./train",
    file: string = "path.json",
    size: number = 4
  ) {
    console.log(path, file, size);
    this.output = file;
    this.seiveSize = size;
    this.trainFolder = path;

    this.readFileAndEncode();
    this.identifyPattern();
    this.decodeAndWrite();
  }

  private readFileAndEncode() {
    fs.readdirSync(this.trainFolder).map(file => {
      console.log(`Cleaning ${file}`);

      fs.readFileSync(`${this.trainFolder}/${file}`)
        .toString()
        .split("\n")
        .forEach(line => {
          let matchString: RegExpMatchArray | null = line.match(this.regex);
          if (matchString) {
            let fileName = matchString[3],
              thread = matchString[4];

            if (this.fileCodeDict[fileName] == undefined) {
              let code = `-${Object.keys(this.fileCodeDict).length}`;
              this.fileCodeDict[fileName] = code;
              this.fileCodeDict[code] = fileName;
            }

            if (this.threadDict[thread] == undefined) {
              this.threadDict[thread] = "";
            }

            this.threadDict[thread] = `${this.threadDict[thread]}${
              this.fileCodeDict[fileName]
            }`;
          }
        });
    });
    console.log(JSON.stringify(this.fileCodeDict, null, 4));
  }

  private identifyPattern() {
    for (let key in this.threadDict) {
      console.log(`Identifying patterns in ${key}`);
      let value: string = this.threadDict[key];

      let i: number = this.seiveSize;

      // As The MainThread won't run more than once and procduces exact path treating it with lower seive value
      if (key == "thread-main") {
        value = this.findPattern(value, 2);
        i = 0;
      }

      while (i > 0) {
        value = this.findPattern(value, i);
        i--;
      }

      console.log(value);
      this.threadDict[key] = value;
      this.threadPatterns.push(value);
    }
  }

  private decodeAndWrite() {
    let pathList: Array<Array<string>> = [];
    let uniquePatterns = new Set(this.threadPatterns);

    console.log("Identified Patterns");

    uniquePatterns.forEach(value => {
      console.log(value);
      let path: Array<string> = [];
      let codeList = value.replace(/-/gi, ",-").split(",");
      codeList.forEach(code => {
        if (this.fileCodeDict[code]) {
          path.push(this.fileCodeDict[code]);
        }
      });
      if (path.length > 0) pathList.push(path);
    });

    fs.writeFileSync(this.output, JSON.stringify(pathList, null, 4));
    console.log("The file was saved!");
  }

  private findPattern(basePattern: string, replication: number = 1) {
    if (replication < 1) {
      replication = 1;
    }
    let digitCount: number = 1;
    let pattern: string = "";

    while (true) {
      let expression: string = `(${"-\\d+".repeat(digitCount)})${".*\\1".repeat(
        replication
      )}`;
      let regularExp = new RegExp(expression);
      let matchString: RegExpMatchArray | null = basePattern.match(regularExp);

      if (matchString) {
        pattern = matchString[1];
        digitCount++;
      } else {
        break;
      }
    }
    return pattern;
  }
}
