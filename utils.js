
function getBiggerSubstrEqual(s1,s2) {
    //assert (s1.length >1 && s2.length > 1);
    var bigger, smaller;
    if(s1.length > s2.length) {
        bigger = s1;
        smaller = s2;
    } else {
        bigger = s2;
        smaller = s1;
    }
    
    for(var len = smaller.length; len >= 1; len --) {//TODO
        for( var i = 0; i <= smaller.length - len; i++) {
            var strToSearch = smaller.substr(i, len);
            var pos = bigger.search(strToSearch); //pode ser também indexOf;
            if(pos >= 0) {
                return {
                    equalPart: strToSearch,
                    prefixBigger: bigger.substr(0, pos),
                    suffixBigger: bigger.substr(pos + strToSearch.length),
                    prefixSmaller: smaller.substr(0, i),
                    suffixSmaller: smaller.substr(i + strToSearch.length)
                }
            }
        }
    }
    return null;
}

function compareStrings(str1, str2) {
    var biggerSubstrComp = getBiggerSubstrEqual(str1,str2);
    if(biggerSubstrComp == null) {
        return 0;
    }
    var result = biggerSubstrComp.equalPart.length;
    
    
    /*TODO ver quando chegar a 1 caractere*/
    result += compareStrings(biggerSubstrComp.prefixBigger, biggerSubstrComp.prefixSmaller);
    result += compareStrings(biggerSubstrComp.suffixBigger, biggerSubstrComp.suffixSmaller);
    return result;
}

/*compare searching substrings matchs. 1 for totally equal, zero for totally different*/
function rateSimilarityStr(str1,str2) {
    return (compareStrings(str1,str2)*2)/(str1.length + str2.length);
}

function simplifyName(name) {
    return name.toUpperCase().trim()
    .replace(/[ÁÀÃÂÄ]/g, 'A')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[ÓÒÕÔÖ]/g, 'O')
    .replace(/[ÚÙÛÜ]/g, 'U')
    .replace(/[Ç]/g, 'C')
    .replace(/[-]/g, ' ')
    //.replace(/[Z]/g, 'S') /* FUNCIONA PRA MAIORIA DOS CASOS, MAS É MAIS AGRESSIVO. Pega casos que se troca luiS por luiZ por ex*/
    .replace(/[`]/g, "'");
}

function findBestMatch(name, arr) {
    if(arr.length == 0 ) {
        return null;
    }
    
    var bestMatch = {
        str: arr[0],
        rate: rateSimilarityStr(name, arr[0])
    };
    
    for(var i = 1; i < arr.length; i++) {
        var rate = rateSimilarityStr(name, arr[i]);
        if(rate > bestMatch.rate) {
            bestMatch = {
                str: arr[i],
                rate: rate
            }
        }
    }
    return bestMatch;
}

module.exports = {
    rateSimilarityStr: rateSimilarityStr,
    simplifyName: simplifyName,
    findBestMatch: findBestMatch
}