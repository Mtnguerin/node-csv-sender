# node-csv-sender
A simple node.js script to send CSV data to a server via HTTP POST requests.

## Usage
### Install dependencies
Using last node LTS version (v18.16.0)
```
npm install
```

### Configuration
Using config.json you can configure your CSV requirements: 
```
{
    // The API endpoint to send the data. Is required.
    "apiEndPoint": "http://localhost:3000/api/rows", 
    "indexes": {
        "timestamp": 0,     // The index of the timestamp column. default is 0
        "id": 2,            // The index of the id column. default is 1
        "value": 1          // The index of the value column. default is 2
    },
    "delimiter": ";",     // the delimiter used in the csv file. default is ","
    "header": false,      // If there is a header in top of the CSV file. default is true
    "trim": true          // If you want to trim the values. default is false
}
```

### Run
```
npm run start <csv-file>
```

### Test with server
You can start a simple server to test the script. 
The server will listen on port 3000 and will accept POST requests on localhost:3000/api/rows. It will console log the received data.
```
npm run test-server
```
