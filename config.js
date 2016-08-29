/*
//Descomentar e configurar se você precisa usar proxy.
var proxyHost = '10.9.8.74';
var proxyPort = '3128';
var proxyType = 'manual';
var proxyUser = '';
var proxyPassword = ''
phantom.setProxy(proxyHost, proxyPort, proxyType, proxyUser, proxyPassword);*/

module.exports = {
    UF: "RJ",
    esperaPadrao: 1000, /*ms após um click ou submit para ler nova página */
    outputFile: "municipiosRJ.csv"
}