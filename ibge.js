"use strict";
console.log("got here");
var fs = require('fs');
var page = require('webpage').create();
var utils = require("./utils.js");

// page.onConsoleMessage = function(msg) {
    // console.log(msg);
// };

module.exports = {
    runSync: _runSync
}



function getCidades() {
    return page.evaluate(function() {
        //TODO usar xpath pra encontrar direto o que tem o innerHTML que eu quero
        var dados= document.querySelector("ul[id=lista_municipios]").children;
        var cidades = [];
        for(var i = 0; i < dados.length; i++) {//dados.forEach deu erro aqui
            cidades.push({
                "nome": dados[i].children[0].innerText,
                "link": dados[i].children[0]['href']
            });
        }
        return cidades;
    });
}


var cidades = [];
function getCodCidadePorLink(link, callback) {
    //var page = require('webpage').create();
    page.open(link, function(status) {
        if ( status !== "success" ) {
            console.log("ERRO ao carregar página");
            return;
        }
        var codMunicipio = page.evaluate(function() {
            //TODO usar xpath pra encontrar direto o que tem o innerHTML que eu quero
            var dados= document.querySelectorAll("td[class=desc]");
            var codMunicipio = 0;
            for(var i = 0; i < dados.length; i++) {//dados.forEach deu erro aqui
                var tdTag = dados[i];
                if(tdTag.innerText == 'Código do Município') {
                    return tdTag.nextSibling.innerText;
                }
            }
        });
        //page.close();
        callback(codMunicipio);
    });
}


var result = []
function getCodMunicipioRecursivo(cb) {
    var cidade = cidades.shift();
    if(cidade == undefined) {
        cb(result);
        return;
    }
    
    getCodCidadePorLink(cidade.link, function(codMunicipio) {
        cidade.cod = codMunicipio;
        
        result.push ({nomeIbge: cidade.nome, codIbge: cidade.cod});
        console.log("incluindo", cidade.nome, cidades.length, "restantes");
        // try {
            // fs.write("codmunicipios.csv", cidade.nome + ";" + cidade.cod+'\n', 'a');
        // } catch (e) {console.log(e);}
        getCodMunicipioRecursivo(cb);
    });
}



/*
Eu poderia pegar a lista de ufs também pelo crawler, mas achei que tende a não mudar muito (a não ser que mude a pag toda)
para pegar o json de ufs abaixo, o seguinte código funciona

var menu = document.querySelector("#menu_ufs");
var result = {};
for (i = 0; i < menu.children.length; i++) {
    var item = menu.children[i];
    result[item.textContent] = item.firstChild.href;
}
*/

var UFs = {  
   "AC":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=12&search=acre",
   "AL":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=27&search=alagoas",
   "AM":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=13&search=amazonas",
   "AP":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=16&search=amapa",
   "BA":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=29&search=bahia",
   "CE":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=23&search=ceara",
   "DF":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=53&search=distrito-federal",
   "ES":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=32&search=espirito-santo",
   "GO":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=52&search=goias",
   "MA":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=21&search=maranhao",
   "MG":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=31&search=minas-gerais",
   "MS":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=50&search=mato-grosso-do-sul",
   "MT":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=51&search=mato-grosso",
   "PA":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=15&search=para",
   "PB":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=25&search=paraiba",
   "PE":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=26&search=pernambuco",
   "PI":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=22&search=piaui",
   "PR":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=41&search=parana",
   "RJ":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=33&search=rio-de-janeiro",
   "RN":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=24&search=rio-grande-do-norte",
   "RO":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=11&search=rondonia",
   "RR":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=14&search=roraima",
   "RS":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=43&search=rio-grande-do-sul",
   "SC":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=42&search=santa-catarina",
   "SE":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=28&search=sergipe",
   "SP":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=35&search=sao-paulo",
   "TO":"http://cidades.ibge.gov.br/xtras/uf.php?lang=&coduf=17&search=tocantins"
}

/*TODO
- Mudar para async. é possível ir processando a relação entre os dois arrays (correios e ibge), enquanto ainda vai carregando
- Permitir pegar todos os UFs (levando em conta que pode ter cidades com nomes iguais em UFs diferentes)
*/
function _runSync(UF, cb) {
    page.open(UFs[UF], function(status) {
        if ( status !== "success" ) {
            console.log("ERRO ao carregar página");
            return;
        }
        
        cidades = getCidades();
        ///* fs.write("codmunicipios.csv", "município;código\n", 'w'); */
        setTimeout(function () {
            getCodMunicipioRecursivo(cb);
        }, 100);
        
    });
}

