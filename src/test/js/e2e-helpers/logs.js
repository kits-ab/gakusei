import prettyjson from 'prettyjson';

export function dumpBrowserLogs(client, done) {
  client.getLogTypes((result) => {
    console.log('Available logTypes');
    console.log(result); // normally this should print: [ 'browser', 'driver', 'client', 'server' ]
  });

  client.isLogAvailable('browser', (isAvailable) => {
    if (isAvailable) {
      client.getLog('browser', (logEntriesArray) => {
        console.log(`${logEntriesArray.length} browser log entries listed:`);
        const options = {
          noColor: false,
          numberColor: 'cyan'
        };

        console.log(prettyjson.render(logEntriesArray, options));

        // logEntriesArray.forEach((log) => {
        //   console.log(`[${log.level}] ${log.timestamp} : ${log.message}`);
        // });
        done();
      });
    } else {
      console.log('Browser logs could not be retrieved, check your driver settings');
    }
  });
}
