/*
 geoip
 Copyright (c) 2015 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var fs = require('fs');

function loadSync(fileName) {
    function trim(s) {
        return s.slice(1, s.length - 1)
    }
    return fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .map(function (line) {
            if (line) {
                var p = line.split(',');
                return {
                    start: parseInt(trim(p[2])),
                    end: parseInt(trim(p[3])),
                    value: {
                        code: trim(p[4]),
                        country: trim(p[5])
                    }
                }
            }
        })
        .filter(Boolean)
}

module.exports = loadSync;