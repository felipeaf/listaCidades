"use strict";
console.log("got here");
var fs = require('fs');
var page = require('webpage').create();
// page.onConsoleMessage = function(msg) {
    // console.log(msg);
// };

var cbEnd = function () {console.log("warning: cbEnd is supposed to be replaced");}; //to be replaced;
var UF = null; // configured in run()

/* END OF CONFIG PART */


var steps = [];
var dados = [];


function openAndWaitComplete(url, onPageReady) {
    page.open(url, function (status) {
        function checkReadyState() {
            setTimeout(function () {
                var readyState = page.evaluate(function () {
                    return document.readyState;
                });

                if ("complete" === readyState) {
                    onPageReady(status);
                } else {
                    checkReadyState();
                }
            });
        }

        checkReadyState();
    });
}


function waitComplete(cb) {
    function checkReadyState() {
        setTimeout(function () {
            var readyState = page.evaluate(function () {
                return document.readyState;
            });

            if ("complete" === readyState) {
                cb();
            } else {
                checkReadyState();
            }
        });
    }

    checkReadyState();
}

function esperaMudarPag(cb) {
    window.setTimeout(function () { //TODO
        waitComplete(cb);
    }, 1000);
}

/* apenas o waitComplete não funcionou aqui, pois pegava a página antes de mudar como "complete". O mesmo com apenas 100ms
TODO procurar jeito melhor de fazer, algum evento informando que o documento mudou, sei lá.*/
function nextComEspera() {
    esperaMudarPag(nextStep);
}


function trataPagSelecaoUF() {
    console.log("tataPagSelecaoUF", UF);
    openAndWaitComplete("http://www.buscacep.correios.com.br/sistemas/buscacep/ResultadoBuscaFaixaCEP.cfm", function(status) {
        console.log("buscando UF", UF);
        page.evaluate(function(UF) {
            console.log("buscando UF", UF);
            var selUF= document.querySelector("select[name='UF']");
            selUF.value= UF; /*se for fazer pros outros, ver selUF.options)*/;
            /*document.querySelector("#Geral").submit(); ou:*/
            selUF.form.submit();
        }, UF);
        nextComEspera();
    });
    
    
}


/*
na página da tabela: a informação começa só na 4ª linha (<TR>). Ou ainda, a primeira com alteração de cor <tr bgcolor="#C4DEE9">, ou a 2ª com 3 colunas
*/
function trataPagTabela() {
    var dadosPagina = page.evaluate(function() {
        var tabela = document.querySelector(".tmptabela");
        if(!tabela) {
            console.log(".tmptabela não encontrada! Recarregando step");
            return [];
        };
        console.log("sem erro")
        var dados = [];
        
        var ehPrimeira = (document.Anterior == undefined);
        var primeiraLinha = ehPrimeira? 3 : 1;
        
        var linhas = tabela.rows;
        console.log("linhas", linhas.length);
        
        for(var i = primeiraLinha; i < linhas.length; i++) {
            console.log("fazendo linha",i, linhas[i].children);
            dados.push({
                nome: linhas[i].children[0].textContent,
                cepInicial: linhas[i].children[1].textContent.substr(1,9),
                cepFinal: linhas[i].children[1].textContent.substr(13,9)
            })
        }
        return dados;
    });
    if(dadosPagina.length == 0) {
        esperaMudarPag(trataPagTabela);
        return;
    }
    
    Array.prototype.push.apply(dados, dadosPagina);
    
    var ehUltimaPag = page. evaluate(function() {
        return document.Proxima == undefined;
    });
    if(!ehUltimaPag) {
        page.evaluate(function() {
            document.Proxima.submit();
        });
        esperaMudarPag(trataPagTabela);
    }
    else {
        nextStep();
    }
}

/* function criaCSV() {
    page.close();
    fs.write(outputFile, "Município;cepInicial;cepFinal\n", 'w')
    dados.forEach(function(cidade) {
        fs.write(outputFile, cidade.nome + ";" + cidade.cepInicial + ";" + cidade.cepFinal + '\n', 'a');
    });
    nextStep();//TODO isso só funciona se as funções do fs aqui forem realmente sync
} */


var stepFinal = function stepFinal() {
    cbEnd(dados);
}


steps.push(
    trataPagSelecaoUF,
    trataPagTabela,
    stepFinal
);

function nextStep() {
    var next = steps.shift();
    if(next == undefined) {
        console.log("all steps ended");
        cbEnd();
        return;
    }
    console.log("going to step", next.name);
    next();
}

function runSync(_UF, cb) {
    console.log("Running correios");
    cbEnd = cb;
    UF = _UF;
    nextStep();
}

module.exports = {
    runSync: runSync
}