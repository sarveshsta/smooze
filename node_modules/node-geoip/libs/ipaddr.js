/*
 geoip
 Copyright (c) 2015 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var assert = require('assert');

function IPAddress(ip) {
    var p = ip.split('.');
    assert(p.length, 4, 'Incorrect IPv4 address');
    for(var i=0; i<4; i++) {
        assert(p[i] >= 0); assert(p[i] <= 255, 'Incorrect IPv4 address');
    }
    this.ip = ip;
}

IPAddress.prototype.asNumber = function () {
    return this.ip
        .split('.')
        .reduce(function (a, b) {
            return ((+a) << 8) + (+b)
        }) >>> 0
}


IPAddress.prototype.asString = function () {
    return this.ip;
}

module.exports = IPAddress;
