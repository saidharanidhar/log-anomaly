# Log Anomaly

![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg) ![Build Status](https://img.shields.io/badge/%40babel%2Fpresent--env-7.2.3-blue.svg) ![Build Status](https://img.shields.io/badge/types-TypeScript-blue.svg)

Log Anomaly detector made in TypeScript.

## Installation

Use the node package manager to install log anomaly app.

```
npm install
```

## Supported log pattern

```bash
2019-01-19 22:17:45:547 DEBUG LoadSpringControllers.java:89 [thread-main] - App Thread started.
```

## Usage

### Training

```
npm start -- -t -l "{logs folder}" -o "{output file}" -s "{seive size}"
```

### Testing

```
npm start -- -e -l "{logs folder}" -k "{pattern file}"
```

## Help

```
npm start -- -h
```

```
Log Anamoly App

  Identifies the Anamolies in the logs

Options [ npm start -- <args>  , Eg. npm start -- -l . ]

  --logDir -l      The input log files
  --train -t       Trains on the give logs and identifies the pattern
  --test -e        Identfies the Anamolies
  --input -k       Input pattern file
  --seiveSize -s   Size of seive to be used for training
  --output -o      Output file for knowledge
  --help -h        Print this usage guide.
```
