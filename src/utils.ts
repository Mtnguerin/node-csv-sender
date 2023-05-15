import { parse } from "csv-parse";
import fs from "fs";
import { Configuration, DataRow } from "./type";
import request from "request";

/**
 * Reads a file from disk and returns its contents as a string.
 * @param path - The path of the file to read.
 * @returns A Promise that resolves with the file contents as a string.
 */
export const getFileFromDisk = (path: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err.message);
      }
      resolve(data);
    });
  });
};

/**
 * Reads a JSON configuration file from disk and merges it with the default configuration.
 * @param path - The path of the JSON configuration file.
 * @returns A Promise that resolves with the merged Configuration object.
 */
export const createConfigurationFromFile = (
  path: string
): Promise<Configuration> => {
  return new Promise<Configuration>((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err.message);
      }
      const configFromFile = JSON.parse(data);
      const defaultConfiguration: Partial<Configuration> = {
        delimiter: ",",
        trim: false,
        indexes: {
          timestamp: 0,
          sensorId: 1,
          value: 2,
        },
        header: false,
      };
      const configuration = { ...defaultConfiguration, ...configFromFile };
      if (!configuration.apiEndPoint) {
        reject("apiEndPoint is missing from the configuration file");
      }
      resolve(configuration);
    });
  });
};

/**
 * Parses CSV data using the provided configuration.
 * @param data - The CSV data to parse as a string.
 * @param config - The configuration object specifying parsing options.
 * @returns A Promise that resolves with an array of DataRow objects representing the parsed CSV data.
 */
export const parseCsv = (
  data: string,
  config: Configuration
): Promise<DataRow[]> => {
  const { delimiter, trim, indexes, header } = config;
  return new Promise<DataRow[]>((resolve, reject) => {
    const records: DataRow[] = [];
    const parser = parse(data, { delimiter });
    parser
      .on("readable", function () {
        let record;
        let firstLine = true;
        while ((record = parser.read()) !== null) {
          if (firstLine && header) {
            firstLine = false;
            continue;
          }
          if (trim) {
            record = record.map((value: string) => value.trim());
          }
          const timestamp = parseInt(record[indexes.timestamp]);
          const sensorId = record[indexes.sensorId];
          const value = parseFloat(record[indexes.value]);
          records.push({ timestamp, sensorId, value });
        }
      })
      .on("end", function () {
        resolve(records);
      })
      .on("error", function (err) {
        reject(err.message);
      });
  });
};

/**
 * Sends an array of DataRow objects as a POST request to the specified URI.
 * @param uri - The URI to send the POST request to.
 * @param rows - The array of DataRow objects to send.
 * @returns A Promise that resolves when the request is successful.
 */
export const sendRows = (uri: string, rows: DataRow[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    request.post(uri, { json: rows }, (err, data) => {
      if (err) {
        reject(err.message);
      } else if (data.statusCode !== 200) {
        reject(`Server responded with status code ${data.statusCode}`);
      }
      resolve();
    });
  });
};
