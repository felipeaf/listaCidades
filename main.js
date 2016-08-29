"use strict";
console.log("got here");
var config = require("./config.js"); //em primeiro enquanto o lance do proxy estiver assim
var ibge = require("./ibge.js");
var merge = require("./merge.js");
var correios = require("./correios.js");
var config = require("./config.js");
var fs = require("fs");

ibge.runSync(config.UF, function(resultIbge) {
    console.log("Terminou IBGE");
    correios.runSync(config.UF, function (resultCorreios) {
        console.log("terminou correios")
        fs.write(config.outputFile, "Município;codIbge;cepInicial;cepFinal\n", 'w') //Se preferir gerar no padrão windows substitua aqui o \n por \r\n
        var result = merge(resultIbge, resultCorreios, "nomeIbge", "nome");
        Object.keys(result).forEach(function(key) {
            var cidade = result[key];
            fs.write(config.outputFile, cidade.nome+";"+cidade.codIbge+';'+cidade.cepInicial + ";" + cidade.cepFinal + '\n', 'a');//Se preferir gerar no padrão windows substitua aqui o \n por \r\n
        });
        phantom.exit();
    });
});


// correios.runSync(config.UF, function (resultCorreios) {
    // console.log("terminou correios com", resultcorreios.length, "cidades");
// });