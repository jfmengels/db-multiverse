const fs = require('fs');
const request = require('request');
const Promise = require('bluebird')
const _ = require('lodash');

const downloadAllWithExt = ext => Promise.map(
  _.range(1218, 1400),
  number => Promise.fromCallback(cb => {
    const paddedNumber = _.padStart(number.toString(), 4, '0');
    const url = `http://www.dragonball-multiverse.com/en/pages/final/${paddedNumber}.${ext}`;
    const outputFile = `~/Manga/Dragon Ball Multiverse/${paddedNumber}.${ext}`;
    request.get(url)
        .on('response', function(response) {
           if (response.statusCode !== 200) {
             return cb();
           }
           console.log(`Download ${number}.${ext}`)
           request.get(url)
             .pipe(fs.createWriteStream(outputFile))
             .on('error', () => cb())
             .on('finish', () => {
               console.log(number);
               cb()
             });
        })
        .on('error', () => cb())
  }),
  {concurrency: 5}
);

downloadAllWithExt('jpg')
.then(() => downloadAllWithExt('png'));
