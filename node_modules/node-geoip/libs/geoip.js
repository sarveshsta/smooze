/*
 geoip
 Copyright (c) 2015 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var loadSync = require('./driver');
var RangeIndex = require('./rangeindex');
var IPAddress = require('./ipaddr');


function GeoIP(fileName, depth) {
    this.ri = new RangeIndex(loadSync(fileName, depth));
}

GeoIP.prototype.getCountry = function (ip) {
    var addr = new IPAddress(ip);
    return this.ri.search(addr.asNumber());
}

module.exports = GeoIP;