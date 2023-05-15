export type DataRow = {
  timestamp: number;
  sensorId: string;
  value: number;
};

export type Configuration = {
  apiEndPoint: string;
  delimiter: string;
  trim: boolean;
  indexes: {
    timestamp: number;
    sensorId: number;
    value: number;
  };
  header: boolean;
};
