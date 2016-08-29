var utils = require("./utils.js");

function getMapSimplifiedName(arr, key) {
    var result = {};
    arr.forEach(function (obj) {
        result[utils.simplifyName(obj[key])] = obj;
    });
    return result;
}

//CAUTION: obj1 is modified
function mergeObjs(obj1, obj2) {
    Object.keys(obj2).forEach(function (key) {
        obj1[key] = obj2[key];
    });
    return obj1;
}

function merge(arr1, arr2, keyProp1, keyProp2) {
    //assert(key1 !== key2); //important to check if some data will be overwritten
    if(arr1.length !== arr2.length) {
        console.log("error, diferent length for arr1 and arr2", arr1.length, arr2.length);
    }
    
    var map1 = getMapSimplifiedName(arr1, keyProp1);
    var map2 = getMapSimplifiedName(arr2, keyProp2);
    
    var result = {};
    Object.keys(map1).forEach(function (key) {
        if(map2[key] != undefined) {
            result[key] = mergeObjs(map1[key], map2[key]);
            delete map1[key];
            delete map2[key];
        }
    });
    
    /*now we'll match not exactly matches*/
    console.log("there was", Object.keys(map1).length, "in arr1 and", Object.keys(map2).length, "in arr2 that was not matched by exactly simplified Name. Trying best match");
    
    console.log("matched", Object.keys(result));
    console.log("not matched map1", Object.keys(map1));
    console.log("not matched map2", Object.keys(map2));
    
    
    Object.keys(map1).forEach(function (key1) {
        if(Object.keys(map2).length == 0) {
            return false;
        }
        var bestMatchForKey1InMap2 = utils.findBestMatch(key1, Object.keys(map2));
        console.log(bestMatchForKey1InMap2);
        var key2 = bestMatchForKey1InMap2.str;
        console.log("matching", key1, "with", key2);
        if(bestMatchForKey1InMap2.rate < 0.75) {
            console.log("WARNING BAD MATCH", key1, key2);
        }
        result[key1] = mergeObjs(map1[key1], map2[key2]);
        delete map1[key1];
        delete map2[key2];
        result[key1].Key1Merge = key2;
        result[key1].Key1Merge = key2;
    });
    return result;
}

module.exports = merge;