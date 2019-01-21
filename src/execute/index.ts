import fs from "fs";
export class Execute {
  private patternFile: string;
  private testFolder: string;
  private patternRegex: Array<RegExp> = [];
  private threadDict: { [key: string]: Array<string> } = {};
  private regex: RegExp = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}:\d{3}) (\w*) (\w*\.\w*:\d*) \[(.*)\]/;

  constructor(path: string = "./logs", knowledge: string = "path.json") {
    this.patternFile = knowledge;
    this.testFolder = path;
    this.generateTestPattern();
    this.generateThreadDict();
    this.identifyAnamolies();
  }

  private generateTestPattern() {
    let patterns: Array<Array<string>> = JSON.parse(
      fs.readFileSync(this.patternFile).toString()
    );

    patterns.forEach(pattern => {
      let experssion: Array<string> = [];
      pattern.forEach(fileName => {
        experssion.push(`.* (${fileName}) .*`);
      });
      this.patternRegex.push(RegExp(`\\n?${experssion.join("\\n?")}\\n?`));
    });
  }

  private generateThreadDict() {
    let directory = this.testFolder;
    let thread: string;

    fs.readdirSync(directory).map(file => {
      console.log(`Cleaning on ${file}`);
      fs.readFileSync(`${directory}/${file}`)
        .toString()
        .split("\n")
        .forEach(line => {
          let matchString: RegExpMatchArray | null = line.match(this.regex);
          if (matchString) {
            thread = matchString[4];
            if (this.threadDict[thread] == undefined) {
              this.threadDict[thread] = [];
            }
            this.threadDict[thread].push(line);
          }
        });
    });
  }

  private identifyAnamolies() {
    console.log("===".repeat(40));
    let threadLines: string;

    for (let key in this.threadDict) {
      threadLines = this.threadDict[key].join("\n");
      this.patternRegex.forEach(patternExpression => {
        while (true) {
          let matchString: RegExpMatchArray | null = threadLines.match(
            patternExpression
          );
          if (matchString) {
            threadLines = threadLines.replace(
              matchString[0],
              `\n${"---".repeat(40)}\n`
            );
          } else {
            break;
          }
        }
      });
      console.log(`Anomalies in ${key}`);
      console.log("===".repeat(40));
      console.log(threadLines);
      console.log("===".repeat(40));
    }
  }
}
