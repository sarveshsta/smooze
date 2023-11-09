GeoIP
===========================
Fast search country by IP

Cli
===========================
```output
[gap@localhost geoip]$ ./bin/geoip "131.221.27.2" "156.22.33.7" "100.11.1.1" "2.159.255.255" "5.39.127.249"
ip = 131.221.27.2 	code = PA 	country = Panama
ip = 156.22.33.7 	code = AU 	country = Australia
ip = 100.11.1.1 	code = US 	country = United States
ip = 2.159.255.255 	code = IT 	country = Italy
ip = 5.39.127.249 	code = LT 	country = Lithuania
```

Example
=========================
```javascript
var Geo = require('geoip');

var geoIP = new Geo.GeoIP(Geo.Database);
try {
    console.dir(geoIP.getCountry('2.159.255.205'));
} catch (ex) {
    console.dir(ex);
}
```

```output
[gap@localhost example]$ node example.js 
{ code: 'IT', country: 'Italy' }
```