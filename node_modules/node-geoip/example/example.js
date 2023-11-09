var Geo =  require('..');

var geoIP = new Geo.GeoIP(Geo.Database);
try {
    console.dir(geoIP.getCountry('2.159.255.205'));
} catch (ex) {
    console.dir(ex);
}