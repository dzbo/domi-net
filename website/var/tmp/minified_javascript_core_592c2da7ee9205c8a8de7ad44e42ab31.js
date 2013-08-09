/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */
function t(key) {
    if (pimcore && pimcore.system_i18n && pimcore.system_i18n[key]) {
        return pimcore.system_i18n[key];
    }
    return "~" + key + "~";
}

function ts(key) {

    if(!key) {
        return "";
    }

    var alreadyTranslated = pimcore.globalmanager.get("translations_admin_translated_values");

    // remove plus at the start and the end to avoid double translations
    key = key.replace(/^[\+]+/,"");
    key = key.replace(/[\+]+$/,"");

    var originalKey = key;
    key = key.toLocaleLowerCase();

    if (pimcore && pimcore.admin_i18n && pimcore.admin_i18n[key]) {
        // add here a "zero width joiner" to detect if a key is already translated

        alreadyTranslated.push(pimcore.admin_i18n[key]);
        pimcore.globalmanager.add("translations_admin_translated_values", alreadyTranslated);

        return pimcore.admin_i18n[key];
    } else {

        // if the key contains a "zero width joiner" it is already translated
        if(in_array(key, alreadyTranslated)) {
            return originalKey;
        }

        if(!in_array(key, pimcore.globalmanager.get("translations_admin_added"))){
             var missingTranslations =  pimcore.globalmanager.get("translations_admin_missing");
             missingTranslations.push(key);
             pimcore.globalmanager.add("translations_admin_missing", missingTranslations);
        }
    }
    if(pimcore.settings.debug_admin_translations){
        return "+" + key + "+";
    } else {
        return originalKey;
    }
}

Math.sec = function(x) {
    return 1 / Math.cos(x);
};



function RealTypeOf(v) {
  if (typeof(v) == "object") {
    if (v === null) {
        return "null";
    }
    if (v.constructor == (new Array).constructor) {
        return "array";
    }
    if (v.constructor == (new Date).constructor) {
        return "date";
    }
    if (v.constructor == (new RegExp).constructor) {
        return "regex";
    }
    return "object";
  }
  return typeof(v);
};



function FormatJSON(oData, sIndent) {
    if (arguments.length < 2) {
        var sIndent = "";
    }
    var sIndentStyle = "    ";
    var sDataType = RealTypeOf(oData);

    // open object
    if (sDataType == "array") {
        if (oData.length == 0) {
            return "[]";
        }
        var sHTML = "[";
    } else {
        var iCount = 0;
        $.each(oData, function() {
            iCount++;
            return;
        });
        if (iCount == 0) { // object is empty
            return "{}";
        }
        var sHTML = "{";
    }

    // loop through items
    var iCount = 0;
    $.each(oData, function(sKey, vValue) {
        if (iCount > 0) {
            sHTML += ",";
        }
        if (sDataType == "array") {
            sHTML += ("\n" + sIndent + sIndentStyle);
        } else {
            sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
        }

        // display relevant data type
        switch (RealTypeOf(vValue)) {
            case "array":
            case "object":
                sHTML += FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                sHTML += "null";
                break;
            case "string":
                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + typeof(vValue));
        }

        // loop
        iCount++;
    });

    // close object
    if (sDataType == "array") {
        sHTML += ("\n" + sIndent + "]");
    } else {
        sHTML += ("\n" + sIndent + "}");
    }

    // return
    return sHTML;
};


function in_arrayi(needle, haystack) {
    return in_array(needle.toLocaleLowerCase(), array_map(strtolower, haystack));
};


function strtolower (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Onno Marsman
    // *     example 1: strtolower('Kevin van Zonneveld');
    // *     returns 1: 'kevin van zonneveld'
    return (str + '').toLowerCase();
};


function array_map (callback) {
    // http://kevin.vanzonneveld.net
    // +   original by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: Takes a function as an argument, not a function's name
    // %        note 2: If the callback is a string, it can only work if the function name is in the global context
    // *     example 1: array_map( function (a){return (a * a * a)}, [1, 2, 3, 4, 5] );
    // *     returns 1: [ 1, 8, 27, 64, 125 ]
    var argc = arguments.length,
        argv = arguments;
    var j = argv[1].length,
        i = 0,
        k = 1,
        m = 0;
    var tmp = [],
        tmp_ar = [];

    while (i < j) {
        while (k < argc) {
            tmp[m++] = argv[k++][i];
        }

        m = 0;
        k = 1;

        if (callback) {
            if (typeof callback === 'string') {
                callback = this.window[callback];
            }
            tmp_ar[i++] = callback.apply(null, tmp);
        } else {
            tmp_ar[i++] = tmp;
        }

        tmp = [];
    }

    return tmp_ar;
}



function is_numeric(mixed_var) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: David
    // +   improved by: taith
    // +   bugfixed by: Tim de Koning
    // +   bugfixed by: WebDevHobo (http://webdevhobo.blogspot.com/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: is_numeric(186.31);
    // *     returns 1: true
    // *     example 2: is_numeric('Kevin van Zonneveld');
    // *     returns 2: false
    // *     example 3: is_numeric('+186.31e2');
    // *     returns 3: true
    // *     example 4: is_numeric('');
    // *     returns 4: false
    // *     example 4: is_numeric([]);
    // *     returns 4: false

    return (typeof(mixed_var) === 'number' || typeof(mixed_var) === 'string') && mixed_var !== '' && !isNaN(mixed_var);
}


function ucfirst(str) {
    // Makes a string's first character uppercase  
    // 
    // version: 905.3122
    // discuss at: http://phpjs.org/functions/ucfirst
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ucfirst('kevin van zonneveld');
    // *     returns 1: 'Kevin van zonneveld'
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
};


function in_array(needle, haystack, argStrict) {
    // Checks if the given value exists in the array  
    // 
    // version: 905.3120
    // discuss at: http://phpjs.org/functions/in_array
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: vlado houba
    // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true
    // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    // *     returns 2: false
    // *     example 3: in_array(1, ['1', '2', '3']);
    // *     returns 3: true
    // *     example 3: in_array(1, ['1', '2', '3'], false);
    // *     returns 3: true
    // *     example 4: in_array(1, ['1', '2', '3'], true);
    // *     returns 4: false
    var key = '', strict = !!argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
};


function uniqid(prefix, more_entropy) {
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kankrelune (http://www.webfaktory.info/)
    // %        note 1: Uses an internal counter (in php_js global) to avoid collision
    // *     example 1: uniqid();
    // *     returns 1: 'a30285b160c14'
    // *     example 2: uniqid('foo');
    // *     returns 2: 'fooa30285b1cd361'
    // *     example 3: uniqid('bar', true);
    // *     returns 3: 'bara20285b23dfd1.31879087'
    if (typeof prefix == 'undefined') {
        prefix = "";
    }

    var retId;
    var formatSeed = function(seed, reqWidth) {
        seed = parseInt(seed, 10).toString(16); // to hex str
        if (reqWidth < seed.length) { // so long we split
            return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) { // so short we pad
            return Array(1 + (reqWidth - seed.length)).join('0') + seed;
        }
        return seed;
    };

    // BEGIN REDUNDANT
    if (!this.php_js) {
        this.php_js = {};
    }
    // END REDUNDANT
    if (!this.php_js.uniqidSeed) { // init seed with big random int
        this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    }
    this.php_js.uniqidSeed++;

    retId = prefix; // start with prefix, add current milliseconds hex string
    retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
    retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string

    if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10).toFixed(8).toString();
    }

    return retId;
};


function empty (mixed_var) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philippe Baumann
    // +      input by: Onno Marsman
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: LH
    // +   improved by: Onno Marsman
    // +   improved by: Francesco
    // +   improved by: Marc Jansen
    // +   input by: Stoyan Kyosev (http://www.svest.org/)
    // *     example 1: empty(null);
    // *     returns 1: true
    // *     example 2: empty(undefined);
    // *     returns 2: true
    // *     example 3: empty([]);
    // *     returns 3: true
    // *     example 4: empty({});
    // *     returns 4: true
    // *     example 5: empty({'aFunc' : function () { alert('humpty'); } });
    // *     returns 5: false
    var key;

    if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false
                                                            || typeof mixed_var === 'undefined') {
        return true;
    }

    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }
        return true;
    }

    return false;
};

function str_replace(search, replace, subject, count) {
    // Replaces all occurrences of search in haystack with replace  
    // 
    // version: 905.3122
    // discuss at: http://phpjs.org/functions/str_replace
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Gabriel Paderni
    // +   improved by: Philip Peterson
    // +   improved by: Simon Willison (http://simonwillison.net)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   bugfixed by: Anton Ongson
    // +      input by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    tweaked by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   input by: Oleg Eremeev
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Oleg Eremeev
    // %          note 1: The count parameter must be passed as a string in order
    // %          note 1:  to find a global variable in which the result will be given
    // *     example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    // *     returns 1: 'Kevin.van.Zonneveld'
    // *     example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    // *     returns 2: 'hemmo, mars'
    var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
            f = [].concat(search),
            r = [].concat(replace),
            s = subject,
            ra = r instanceof Array, sa = s instanceof Array;
    s = [].concat(s);
    if (count) {
        this.window[count] = 0;
    }

    for (i = 0,sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j = 0,fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
            }
        }
    }
    return sa ? s : s[0];
};


function trim(str, charlist) {
    // Strips whitespace from the beginning and end of a string  
    // 
    // version: 905.1001
    // discuss at: http://phpjs.org/functions/trim
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // *     example 1: trim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    // *     example 3: trim(16, 1);
    // *     returns 3: 6
    var whitespace, l = 0, i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};


function base64_encode(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];

    if (!data) {
        return data;
    }

    data = this.utf8_encode(data + '');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
};

function base64_decode(data) {
    // Decodes string using MIME base64 algorithm  
    // 
    // version: 905.3122
    // discuss at: http://phpjs.org/functions/base64_decode
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_decode
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['btoa'] == 'function') {
    //    return btoa(data);
    //}

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do {  // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');
    dec = this.utf8_decode(dec);

    return dec;
};


function utf8_decode(str_data) {
    // Converts a UTF-8 encoded string to ISO-8859-1  
    // 
    // version: 905.3122
    // discuss at: http://phpjs.org/functions/utf8_decode
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'
    var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if ((c1 > 191) && (c1 < 224)) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return tmp_arr.join('');
};


function ucfirst(str) {
    // Makes a string's first character uppercase  
    // 
    // version: 905.3122
    // discuss at: http://phpjs.org/functions/ucfirst
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ucfirst('kevin van zonneveld');
    // *     returns 1: 'Kevin van zonneveld'
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
};


function array_search(needle, haystack, argStrict) {
    // Searches the array for a given value and returns the corresponding key if successful  
    // 
    // version: 905.3122
    // discuss at: http://phpjs.org/functions/array_search
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
    // *     returns 1: 'surname'

    var strict = !!argStrict;
    var key = '';

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            return key;
        }
    }

    return false;
};


function mergeObject(p, c) {

    var keys = Object.keys(p);

    for (var i = 0; i < keys.length; i++) {
        if (!c[keys[i]]) {
            c[keys[i]] = p[keys[i]];
        }
    }

    return c;
};


function strip_tags(str, allowed_tags) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Luke Godfrey
    // +      input by: Pul
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +      input by: Alex
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Marc Palau
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Eric Nagel
    // +      input by: Bobby Drake
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Tomasz Wesolowski
    // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
    // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
    // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
    // *     returns 2: '<p>Kevin van Zonneveld</p>'
    // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
    // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
    // *     example 4: strip_tags('1 < 5 5 > 1');
    // *     returns 4: '1 < 5 5 > 1'

    var key = '', allowed = false;
    var matches = [];
    var allowed_array = [];
    var allowed_tag = '';
    var i = 0;
    var k = '';
    var html = '';

    var replacer = function (search, replace, str) {
        return str.split(search).join(replace);
    };

    // Build allowes tags associative array
    if (allowed_tags) {
        allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
    }

    str += '';

    // Match tags
    matches = str.match(/(<\/?[\S][^>]*>)/gi);

    // Go through all HTML tags
    for (key in matches) {
        if (isNaN(key)) {
            // IE7 Hack
            continue;
        }

        // Save HTML tag
        html = matches[key].toString();

        // Is tag not in allowed list? Remove from str!
        allowed = false;

        // Go through all allowed tags
        for (k in allowed_array) {
            // Init
            allowed_tag = allowed_array[k];
            i = -1;

            if (i != 0) {
                i = html.toLowerCase().indexOf('<' + allowed_tag + '>');
            }
            if (i != 0) {
                i = html.toLowerCase().indexOf('<' + allowed_tag + ' ');
            }
            if (i != 0) {
                i = html.toLowerCase().indexOf('</' + allowed_tag);
            }

            // Determine
            if (i == 0) {
                allowed = true;
                break;
            }
        }

        if (!allowed) {
            str = replacer(html, "", str); // Custom replace. No regexing
        }
    }

    return str;
};


function md5(str) {
    // Calculate the md5 hash of a string  
    // 
    // version: 909.322
    // discuss at: http://phpjs.org/functions/md5    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
    var xl;
    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    var addUnsigned = function (lX, lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };
    var _F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function (x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };
    var _FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue = "",wordToHexValue_temp = "",lByte,lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],        k,AA,BB,CC,DD,a,b,c,d,
            S11 = 7, S12 = 12, S13 = 17, S14 = 22,
            S21 = 5, S22 = 9 , S23 = 14, S24 = 20,
            S31 = 4, S32 = 11, S33 = 16, S34 = 23,
            S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
};

function utf8_encode(string) {
    // Encodes an ISO-8859-1 string to UTF-8  
    // 
    // version: 909.322
    // discuss at: http://phpjs.org/functions/utf8_encode    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
};


function intval(mixed_var, base) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: stensi
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   input by: Matteo
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: intval('Kevin van Zonneveld');
    // *     returns 1: 0
    // *     example 2: intval(4.2);
    // *     returns 2: 4
    // *     example 3: intval(42, 8);
    // *     returns 3: 42
    // *     example 4: intval('09');
    // *     returns 4: 9
    // *     example 5: intval('1e', 16);
    // *     returns 5: 30

    var tmp;

    var type = typeof( mixed_var );

    if (type === 'boolean') {
        return (mixed_var) ? 1 : 0;
    } else if (type === 'string') {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
    } else if (type === 'number' && isFinite(mixed_var)) {
        return Math.floor(mixed_var);
    } else {
        return 0;
    }
};


function nl2br (str, is_xhtml) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Philip Peterson
    // +   improved by: Onno Marsman
    // +   improved by: Atli Þór
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Maximusya
    // *     example 1: nl2br('Kevin\nvan\nZonneveld');
    // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
    // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
    // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
    // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
    // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'

    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};


function array_merge () {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Nate
    // +   input by: josh
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: arr1 = {"color": "red", 0: 2, 1: 4}
    // *     example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
    // *     example 1: array_merge(arr1, arr2)
    // *     returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
    // *     example 2: arr1 = []
    // *     example 2: arr2 = {1: "data"}
    // *     example 2: array_merge(arr1, arr2)
    // *     returns 2: {0: "data"}
    var args = Array.prototype.slice.call(arguments),
        retObj = {},
        k, j = 0,
        i = 0,
        retArr = true;

    for (i = 0; i < args.length; i++) {
        if (!(args[i] instanceof Array)) {
            retArr = false;
            break;
        }
    }

    if (retArr) {
        retArr = [];
        for (i = 0; i < args.length; i++) {
            retArr = retArr.concat(args[i]);
        }
        return retArr;
    }
    var ct = 0;

    for (i = 0, ct = 0; i < args.length; i++) {
        if (args[i] instanceof Array) {
            for (j = 0; j < args[i].length; j++) {
                retObj[ct++] = args[i][j];
            }
        } else {
            for (k in args[i]) {
                if (args[i].hasOwnProperty(k)) {
                    if (parseInt(k, 10) + '' === k) {
                        retObj[ct++] = args[i][k];
                    } else {
                        retObj[k] = args[i][k];
                    }
                }
            }
        }
    }
    return retObj;
};


function preg_quote (str, delimiter) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
};


function urlencode (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Lars Fischer
    // +      input by: Ratheous
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Joris
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: This reflects PHP 5.3/6.0+ behavior
    // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
    // %        note 2: pages served as UTF-8
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
    str = (str + '').toString();

    // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
};


function htmlentities (string, quote_style, charset, double_encode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: nobbler
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +   improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // +   improved by: Dj (http://phpjs.org/functions/htmlentities:425#comment_134018)
    // -    depends on: get_html_translation_table
    // *     example 1: htmlentities('Kevin & van Zonneveld');
    // *     returns 1: 'Kevin &amp; van Zonneveld'
    // *     example 2: htmlentities("foo'bar","ENT_QUOTES");
    // *     returns 2: 'foo&#039;bar'
    var hash_map = get_html_translation_table('HTML_ENTITIES', quote_style),
        symbol = '';
    string = string == null ? '' : string + '';

    if (!hash_map) {
        return false;
    }

    if (quote_style && quote_style === 'ENT_QUOTES') {
        hash_map["'"] = '&#039;';
    }

    if (!!double_encode || double_encode == null) {
        for (symbol in hash_map) {
            string = string.split(symbol).join(hash_map[symbol]);
        }
    } else {
        string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function (ignore, text, entity) {
            for (symbol in hash_map) {
                text = text.split(symbol).join(hash_map[symbol]);
            }

            return text + entity;
        });
    }

    return string;
};


function get_html_translation_table (table, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Frank Forte
    // +   bugfixed by: T.Wild
    // +      input by: Ratheous
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js, meaning the constants are not
    // %          note: real constants, but strings instead. Integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
    var entities = {},
        hash_map = {},
        decimal = 0,
        symbol = '';
    var constMappingTable = {},
        constMappingQuoteStyle = {};
    var useTable = {},
        useQuoteStyle = {};

    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: " + useTable + ' not supported');
        // return false;
    }

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';


    // ascii decimals to real symbols
    for (decimal in entities) {
        symbol = String.fromCharCode(decimal);
        hash_map[symbol] = entities[decimal];
    }

    return hash_map;
};


function parse_url (str, component) {
    // http://kevin.vanzonneveld.net
    // +      original by: Steven Levithan (http://blog.stevenlevithan.com)
    // + reimplemented by: Brett Zamir (http://brett-zamir.me)
    // + input by: Lorenzo Pisani
    // + input by: Tony
    // + improved by: Brett Zamir (http://brett-zamir.me)
    // %          note: Based on http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    // %          note: blog post at http://blog.stevenlevithan.com/archives/parseuri
    // %          note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    // %          note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
    // %          note: a seriously malformed URL.
    // %          note: Besides function name, is essentially the same as parseUri as well as our allowing
    // %          note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
    // *     example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
    // *     returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
    var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                        'relative', 'path', 'directory', 'file', 'query', 'fragment'],
        ini = (this.php_js && this.php_js.ini) || {},
        mode = (ini['phpjs.parse_url.mode'] &&
            ini['phpjs.parse_url.mode'].local_value) || 'php',
        parser = {
            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
        };

    var m = parser[mode].exec(str),
        uri = {},
        i = 14;
    while (i--) {
        if (m[i]) {
          uri[key[i]] = m[i];
        }
    }

    if (component) {
        return uri[component.replace('PHP_URL_', '').toLowerCase()];
    }
    if (mode !== 'php') {
        var name = (ini['phpjs.parse_url.queryKey'] &&
                ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        uri[key[12]].replace(parser, function ($0, $1, $2) {
            if ($1) {uri[name][$1] = $2;}
        });
    }
    delete uri.source;
    return uri;
};

function round (value, precision, mode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Onno Marsman
    // +      input by: Greenseed
    // +    revised by: T.Wild
    // +      input by: meo
    // +      input by: William
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Josep Sanz (http://www.ws3.es/)
    // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    // %        note 1: Great work. Ideas for improvement:
    // %        note 1:  - code more compliant with developer guidelines
    // %        note 1:  - for implementing PHP constant arguments look at
    // %        note 1:  the pathinfo() function, it offers the greatest
    // %        note 1:  flexibility & compatibility possible
    // *     example 1: round(1241757, -3);
    // *     returns 1: 1242000
    // *     example 2: round(3.6);
    // *     returns 2: 4
    // *     example 3: round(2.835, 2);
    // *     returns 3: 2.84
    // *     example 4: round(1.1749999999999, 2);
    // *     returns 4: 1.17
    // *     example 5: round(58551.799999999996, 2);
    // *     returns 5: 58551.8
    var m, f, isHalf, sgn; // helper variables
    precision |= 0; // making sure precision is integer
    m = Math.pow(10, precision);
    value *= m;
    sgn = (value > 0) | -(value < 0); // sign of the number
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);

    if (isHalf) {
        switch (mode) {
        case 'PHP_ROUND_HALF_DOWN':
            value = f + (sgn < 0); // rounds .5 toward zero
            break;
        case 'PHP_ROUND_HALF_EVEN':
            value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
            break;
        case 'PHP_ROUND_HALF_ODD':
            value = f + !(f % 2); // rounds .5 towards the next odd integer
            break;
        default:
            value = f + (sgn > 0); // rounds .5 away from zero
        }
    }

    return (isHalf ? value : Math.round(value)) / m;
};


function implode (glue, pieces) {
    // Joins array elements placing glue string between items and return one string
    //
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/implode    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Waldo Malqui Silva
    // +   improved by: Itsacon (http://www.itsacon.net/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
    // *     returns 2: 'Kevin van Zonneveld'
    var i = '',
        retVal = '',        tGlue = '';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }    if (typeof(pieces) === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        }
        for (i in pieces) {            retVal += tGlue + pieces[i];
            tGlue = glue;
        }
        return retVal;
    }    return pieces;
};

/**
 * inserts a text into an input/textarea where the cursor is set
 * @param txtarea
 * @param text
 */
function insertTextToFormElementAtCursor(txtarea, text) {
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0, strPos);
    var back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        range.moveStart('character', strPos);
        range.moveEnd('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
};

/**
 * inserts a text into an html element with contenteditable where the cursor is set
 * @param text
 * @param win
 * @param doc
 */
function insertTextToContenteditableAtCursor (text, win, doc) {

    if(!win) {
        var win = window;
    }
    if(!doc) {
        var doc = document;
    }

    var sel, range;
    if (win.getSelection) {
        sel = win.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( doc.createTextNode(text) );
        }
    } else if (doc.selection && doc.selection.createRange) {
        doc.selection.createRange().text = text;
    }
};




/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.element.tag.imagehotspotmarkereditor");
pimcore.element.tag.imagehotspotmarkereditor = Class.create({

    initialize: function (imageId, data, saveCallback) {
        this.imageId = imageId;
        this.data = data;
        this.saveCallback = saveCallback;
        this.modal = true;
    },

    open: function (modal) {
        var imageUrl = '/admin/asset/get-image-thumbnail/id/' + this.imageId + '/width/500/height/400/contain/true';

        if(typeof modal != "undefined") {
            this.modal = modal;
        }

        this.hotspotStore = [];
        this.hotspotMetaData = {};

        this.hotspotWindow = new Ext.Window({
            width: 500,
            height: 400,
            modal: this.modal,
            closeAction: "close",
            resizable: false,
            bodyStyle: "background: url(" + imageUrl + ") center center no-repeat; position:relative; ",
            tbar: [{
                xtype: "button",
                text: t("add_marker"),
                iconCls: "pimcore_icon_add_marker",
                handler: function () {
                    this.addMarker();

                }.bind(this)
            }, {
                xtype: "button",
                text: t("add_hotspot"),
                iconCls: "pimcore_icon_add_hotspot",
                handler: function () {
                    this.addHotspot();
                }.bind(this)
            }],
            bbar: ["->", {
                xtype: "button",
                iconCls: "pimcore_icon_apply",
                text: t("save"),
                handler: function () {

                    var el;
                    var dataHotspot = [];
                    var dataMarker = [];
                    var originalWidth = this.hotspotWindow.getInnerWidth();
                    var originalHeight = this.hotspotWindow.getInnerHeight();

                    for(var i=0; i<this.hotspotStore.length; i++) {
                        el = this.hotspotStore[i];

                        if(Ext.get(el["id"])) {
                            var dimensions = Ext.get(el["id"]).getStyles("top","left","width","height");
                            var name = Ext.get(el["id"]).getAttribute("title");
                            var metaData = [];
                            if(this.hotspotMetaData && this.hotspotMetaData[el["id"]]) {
                                metaData = this.hotspotMetaData[el["id"]];
                            }

                            if(el.type == "marker") {
                                dataMarker.push({
                                    top:(intval(dimensions.top)+35) * 100 / originalHeight, //the marker el is 35px high
                                    left:(intval(dimensions.left)+12) * 100 / originalWidth,//the marker el is 25px wide
                                    data: metaData,
                                    name: name
                                });
                            } else if (el.type == "hotspot") {
                                dataHotspot.push({
                                    top: intval(dimensions.top) * 100 / originalHeight,
                                    left:  intval(dimensions.left) * 100 / originalWidth,
                                    width: intval(dimensions.width) * 100 / originalWidth,
                                    height: intval(dimensions.height) * 100 / originalHeight,
                                    data: metaData,
                                    name: name
                                });
                            }
                        }
                    }

                    this.data.hotspots = dataHotspot;
                    this.data.marker = dataMarker;

                    if(typeof this.saveCallback == "function") {
                        this.saveCallback(this.data);
                    }

                    this.hotspotWindow.close();
                }.bind(this)
            }],
            html: '<img id="hotspotImage" src="' + imageUrl + '" />'
        });

        this.hotspotWindowInitCount = 0;

        this.hotspotWindow.on("afterrender", function ( ){
            this.hotspotWindowInterval = window.setInterval(function () {
                var el = Ext.get("hotspotImage");
                var imageWidth = el.getWidth();
                var imageHeight = el.getHeight();
                var i;
                var elId;

                if(el) {
                    if(el.getWidth() > 30) {
                        clearInterval(this.hotspotWindowInterval);
                        this.hotspotWindowInitCount = 0;

                        var winBodyInnerSize = this.hotspotWindow.body.getSize();
                        var winOuterSize = this.hotspotWindow.getSize();
                        var paddingWidth = winOuterSize["width"] - winBodyInnerSize["width"];
                        var paddingHeight = winOuterSize["height"] - winBodyInnerSize["height"];

                        this.hotspotWindow.setSize(imageWidth + paddingWidth, imageHeight + paddingHeight);
                        Ext.get("hotspotImage").remove();

                        if(this.data && this.data["hotspots"]) {
                            for(i=0; i<this.data.hotspots.length; i++) {
                                elId = this.addHotspot(this.data.hotspots[i]);
                                if(this.data.hotspots[i]["data"]) {
                                    this.hotspotMetaData[elId] = this.data.hotspots[i]["data"];
                                }
                            }
                        }

                        if(this.data && this.data["marker"]) {
                            for(i=0; i<this.data.marker.length; i++) {
                                elId = this.addMarker(this.data.marker[i]);
                                if(this.data.marker[i]["data"]) {
                                    this.hotspotMetaData[elId] = this.data.marker[i]["data"];
                                }
                            }
                        }

                        return;

                    } else if (this.hotspotWindowInitCount > 60) {
                        // if more than 30 secs cancel and close the window
                        this.resizer = null;
                        this.hotspotWindow.close();
                    }

                    this.hotspotWindowInitCount++;
                }
            }.bind(this), 500);

        }.bind(this));

        this.hotspotWindow.show();
    },

    addMarker: function (config) {

        var markerId = "marker-" + (this.hotspotStore.length+1);
        this.hotspotWindow.body.insertHtml("beforeEnd", '<div id="' + markerId
            + '" class="pimcore_image_marker"></div>');

        var markerEl = Ext.get(markerId);

        if(typeof config == "object" && config["top"]) {
            var originalWidth = this.hotspotWindow.getInnerWidth();
            var originalHeight = this.hotspotWindow.getInnerHeight();

            markerEl.applyStyles({
                top: (originalHeight * (config["top"]/100) - 35) + "px",
                left: (originalWidth * (config["left"]/100) - 12) + "px"
            });

            if(config["name"]) {
                markerEl.dom.setAttribute("title", config["name"]);
            }
        }

        this.addMarkerHotspotContextMenu(markerId, markerEl);

        var markerDD = new Ext.dd.DD(markerEl);
        this.hotspotStore.push({
            id: markerId,
            type: "marker"
        });

        return markerId;
    },

    addHotspot: function (config) {
        var hotspotId = "hotspot-" + (this.hotspotStore.length+1);
        this.hotspotWindow.body.insertHtml("beforeEnd", '<div id="' + hotspotId + '" class="pimcore_image_hotspot"></div>');

        var hotspotEl = Ext.get(hotspotId);

        // default dimensions
        hotspotEl.applyStyles({
            width: "50px",
            height: "50px"
        });

        if(typeof config == "object" && config["top"]) {
            var originalWidth = this.hotspotWindow.getInnerWidth();
            var originalHeight = this.hotspotWindow.getInnerHeight();

            hotspotEl.applyStyles({
                top: (originalHeight * (config["top"]/100)) + "px",
                left: (originalWidth * (config["left"]/100)) + "px",
                width: (originalWidth * (config["width"]/100)) + "px",
                height: (originalHeight * (config["height"]/100)) + "px"
            });

            if(config["name"]) {
                hotspotEl.dom.setAttribute("title", config["name"]);
            }
        }

        this.addMarkerHotspotContextMenu(hotspotId, hotspotEl);

        var resizer = new Ext.Resizable(hotspotId, {
            pinned:true,
            minWidth:20,
            minHeight: 20,
            preserveRatio: false,
            dynamic:true,
            handles: 'all',
            draggable:true
        });


        this.hotspotStore.push({
            id: hotspotId,
            type: "hotspot"
        });

        return hotspotId;
    },

    addMarkerHotspotContextMenu: function (id, el) {
        el.on("contextmenu", function (id, e) {
            var menu = new Ext.menu.Menu();

            menu.add(new Ext.menu.Item({
                text: t("add_data"),
                iconCls: "pimcore_icon_add_data",
                handler: function (id, item) {
                    item.parentMenu.destroy();

                    this.editMarkerHotspotData(id);
                }.bind(this, id)
            }));

            menu.add(new Ext.menu.Item({
                text: t("remove"),
                iconCls: "pimcore_icon_delete",
                handler: function (id, item) {
                    item.parentMenu.destroy();
                    Ext.get(id).remove();
                }.bind(this, id)
            }));

            menu.showAt(e.getXY());
            e.stopEvent();
        }.bind(this, id));
    },

    editMarkerHotspotData: function (id) {
        var hotspotMetaDataWin = new Ext.Window({
            width: 600,
            height: 440,
            modal: this.modal,
            closeAction: "close",
            resizable: false,
            autoScroll: true,
            items: [{
                xtype: "form",
                itemId: "form",
                bodyStyle: "padding: 10px;"
            }],
            tbar: [{
                xtype: "button",
                iconCls: "pimcore_icon_add",
                menu: [{
                    text: t("textfield"),
                    iconCls: "pimcore_icon_input",
                    handler: function () {
                        addItem("textfield");
                    }
                }, {
                    text: t("textarea"),
                    iconCls: "pimcore_icon_textarea",
                    handler: function () {
                        addItem("textarea");
                    }
                }, {
                    text: t("checkbox"),
                    iconCls: "pimcore_icon_checkbox",
                    handler: function () {
                        addItem("checkbox");
                    }
                }, {
                    text: t("object"),
                    iconCls: "pimcore_icon_object",
                    handler: function () {
                        addItem("object");
                    }
                }, {
                    text: t("document"),
                    iconCls: "pimcore_icon_document",
                    handler: function () {
                        addItem("document");
                    }
                }, {
                    text: t("asset"),
                    iconCls: "pimcore_icon_asset",
                    handler: function () {
                        addItem("asset");
                    }
                }]
            }, "->", {
                xtype: "tbtext",
                text: t("name") + ":"
            }, {
                xtype: "textfield",
                id: "name-field-" + id,
                value: Ext.get(id).getAttribute("title")
            }],
            buttons: [{
                text: t("save"),
                iconCls: "pimcore_icon_apply",
                handler: function (id) {

                    var data = hotspotMetaDataWin.getComponent("form").getForm().getFieldValues();
                    var normalizedData = [];

                    // when only one item is in the form
                    if(typeof data["name"] == "string") {
                        data = {
                            name: [data["name"]],
                            type: [data["type"]],
                            value: [data["value"]]
                        };
                    }

                    if(data && data["name"] && data["name"].length > 0) {
                        for(var i=0; i<data["name"].length; i++) {
                            normalizedData.push({
                                name: data["name"][i],
                                value: data["value"][i],
                                type: data["type"][i]
                            });
                        }
                    }


                    Ext.get(id).dom.setAttribute("title", Ext.getCmp("name-field-" + id).getValue());
                    this.hotspotMetaData[id] = normalizedData;

                    hotspotMetaDataWin.close();
                }.bind(this, id)
            }],
            listeners: {
                afterrender: function (id) {
                    if(this.hotspotMetaData && this.hotspotMetaData[id]) {
                        var data = this.hotspotMetaData[id];
                        for(var i=0; i<data.length; i++) {
                            addItem(data[i]["type"], data[i]);
                        }
                    }
                }.bind(this, id)
            }
        });

        var addItem = function (hotspotMetaDataWin, type, data) {

            var id = "item-" + uniqid();
            var valueField;

            if(!data || !data["name"]) {
                data = {
                    name: "",
                    value: ""
                };
            }

            if(type == "textfield") {
                valueField = {
                    xtype: "textfield",
                    name: "value",
                    fieldLabel: t("value"),
                    width: 400,
                    value: data["value"]
                };
            } else if(type == "textarea") {
                valueField = {
                    xtype: "textarea",
                    name: "value",
                    fieldLabel: t("value"),
                    width: 400,
                    value: data["value"]
                };
            } else if(type == "checkbox") {
                valueField = {
                    xtype: "checkbox",
                    name: "value",
                    fieldLabel: t("value"),
                    checked: data["value"]
                };
            } else if(type == "object") {
                valueField = {
                    xtype: "textfield",
                    cls: "pimcore_droptarget_input",
                    name: "value",
                    fieldLabel: t("value"),
                    value: data["value"],
                    width: 400,
                    listeners: {
                        render: this.addDataDropTarget.bind(this, "object")
                    }
                };
            } else if(type == "asset") {
                valueField = {
                    xtype: "textfield",
                    cls: "pimcore_droptarget_input",
                    name: "value",
                    fieldLabel: t("value"),
                    value: data["value"],
                    width: 400,
                    listeners: {
                        render: this.addDataDropTarget.bind(this, "asset")
                    }
                };
            } else if(type == "document") {
                valueField = {
                    xtype: "textfield",
                    cls: "pimcore_droptarget_input",
                    name: "value",
                    fieldLabel: t("value"),
                    value: data["value"],
                    width: 400,
                    listeners: {
                        render: this.addDataDropTarget.bind(this, "document")
                    }
                };
            } else {
                // no valid type
                return;
            }

            hotspotMetaDataWin.getComponent("form").add({
                xtype: "fieldset",
                style: "padding: 0;",
                bodyStyle: "padding: 5px;",
                itemId: id,
                items: [{
                    xtype: "hidden",
                    name: "type",
                    value: type
                },{
                    xtype: "textfield",
                    name: "name",
                    value: data["name"],
                    fieldLabel: t("name")
                }, valueField],
                tbar: ["->", {
                    iconCls: "pimcore_icon_delete",
                    handler: function (hotspotMetaDataWin) {
                        var form = hotspotMetaDataWin.getComponent("form");
                        form.remove(form.getComponent(id));
                        hotspotMetaDataWin.doLayout();
                    }.bind(this, hotspotMetaDataWin)
                }]
            });

            hotspotMetaDataWin.doLayout();
        }.bind(this, hotspotMetaDataWin);

        hotspotMetaDataWin.show();
    },

    addDataDropTarget: function (type, el) {
        var drop = function (target, dd, e, data) {
            if(data.node.attributes.elementType == type) {
                target.dom.value = data.node.attributes.path;
                return true;
            } else {
                return false;
            }
        }.bind(this);

        var over = function (target, dd, e, data) {
            if(data.node.attributes.elementType == type) {
                return Ext.dd.DropZone.prototype.dropAllowed;
            }
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        };

        if(typeof dndManager == "object") {
            // register at global DnD manager
            // in iframes, eg. document editmode
            dndManager.addDropTarget(el.getEl(), over, drop);
        } else {
            new Ext.dd.DropZone(el.getEl(), {
                reference: this,
                ddGroup: "element",
                getTargetFromEvent: function(e) {
                    return el.getEl();
                },
                onNodeOver : over,
                onNodeDrop : drop
            });
        }
    }

});



/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.element.tag.imagecropper");
pimcore.element.tag.imagecropper = Class.create({

    initialize: function (imageId, data, saveCallback) {
        this.imageId = imageId;
        this.data = data;
        this.saveCallback = saveCallback;
        this.modal = true;
    },

    open: function (modal) {
        var imageUrl = '/admin/asset/get-image-thumbnail/id/' + this.imageId + '/width/500/height/400/contain/true';

        if(typeof modal != "undefined") {
            this.modal = modal;
        }

        this.editWindow = new Ext.Window({
            width: 500,
            height: 400,
            modal: this.modal,
            closeAction: "close",
            resizable: false,
            bodyStyle: "background: url(" + imageUrl + ") center center no-repeat;",
            bbar: ["->", {
                xtype: "button",
                iconCls: "pimcore_icon_apply",
                text: t("save"),
                handler: function () {

                    var originalWidth = this.editWindow.getInnerWidth();
                    var originalHeight = this.editWindow.getInnerHeight();

                    var dimensions = Ext.get("selector").getStyles("top","left","width","height");

                    var newWidth = intval(dimensions.width);
                    var newHeight = intval(dimensions.height);
                    var top = intval(dimensions.top);
                    var left = intval(dimensions.left);

                    this.data = {
                        cropWidth: newWidth * 100 / originalWidth,
                        cropHeight: newHeight * 100 / originalHeight,
                        cropTop: top * 100 / originalHeight,
                        cropLeft: left * 100 / originalWidth,
                        cropPercent: true
                    };

                    if(typeof this.saveCallback == "function") {
                        this.saveCallback(this.data);
                    }

                    this.resizer = null;
                    this.editWindow.close();
                }.bind(this)
            }],
            html: '<img id="selectorImage" src="' + imageUrl + '" />' +
                '<div id="selector" style="cursor:move; position: absolute; top: 10px; left: 10px;z-index:9000;"></div>'
        });

        this.editWindowInitCount = 0;

        this.editWindow.on("afterrender", function ( ){
            this.editWindowInterval = window.setInterval(function () {
                var el = Ext.get("selectorImage");
                var imageWidth = el.getWidth();
                var imageHeight = el.getHeight();

                if(el) {
                    if(el.getWidth() > 30) {
                        clearInterval(this.editWindowInterval);
                        this.editWindowInitCount = 0;

                        var winBodyInnerSize = this.editWindow.body.getSize();
                        var winOuterSize = this.editWindow.getSize();
                        var paddingWidth = winOuterSize["width"] - winBodyInnerSize["width"];
                        var paddingHeight = winOuterSize["height"] - winBodyInnerSize["height"];

                        this.editWindow.setSize(imageWidth + paddingWidth, imageHeight + paddingHeight);

                        Ext.get("selectorImage").remove();

                        this.resizer = new Ext.Resizable('selector', {
                            pinned:true,
                            minWidth:50,
                            minHeight: 50,
                            preserveRatio: false,
                            dynamic:true,
                            handles: 'all',
                            draggable:true,
                            width: 100,
                            height: 100
                        });

                        if(this.data.cropPercent) {
                            Ext.get("selector").applyStyles({
                                width: (imageWidth * (this.data.cropWidth / 100)) + "px",
                                height: (imageHeight * (this.data.cropHeight / 100)) + "px",
                                top: (imageHeight * (this.data.cropTop / 100)) + "px",
                                left: (imageWidth * (this.data.cropLeft / 100)) + "px"
                            });
                        }

                        return;

                    } else if (this.editWindowInitCount > 60) {
                        // if more than 30 secs cancel and close the window
                        this.resizer = null;
                        this.editWindow.close();
                    }

                    this.editWindowInitCount++;
                }
            }.bind(this), 500);

        }.bind(this));

        this.editWindow.show();
    }

});



/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */




// disable reload & links, this function is here because it has to be in the header (body attribute)
function pimcoreOnUnload() {
    editWindow.protectLocation();
}


pimcore.edithelpers = {};

pimcore.edithelpers.setBodyHeight = function () {
    try {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        Ext.getBody().setHeight(height);
        Ext.get(Ext.query("html")[0]).setHeight(height);
    } catch (e) {
        console.log(e);
    }
};

pimcore.edithelpers.frame = {
    active: false,
    topEl: null,
    bottomEl: null,
    rightEl: null,
    leftEl: null,
    timeout: null
};

pimcore.edithelpers.frameElement = function (el, body) {

    if(pimcore.edithelpers.frame.active) {
        pimcore.edithelpers.unFrameElement();
    }

    var offsets;
    var borderWidth;
    var width;
    var height;

    try {
        var startDistance = 5;
        offsets = Ext.get(el).getOffsetsTo(Ext.getBody());
        var bodyOffsetLeft = intval(Ext.getBody().getStyle("margin-left"));
        var bodyOffsetTop = intval(Ext.getBody().getStyle("margin-top"));

        offsets[0] -= bodyOffsetLeft;
        offsets[1] -= bodyOffsetTop;

        offsets[0] -= startDistance;
        offsets[1] -= startDistance;

        width = Ext.get(el).getWidth() + (startDistance*2);
        height = Ext.get(el).getHeight() + (startDistance*2);
        borderWidth = 5;

        if(typeof body == "undefined") {
            body = document.body;
        }
    } catch (e) {
        return;
    }

    var top = document.createElement("div");
    top = Ext.get(top);
    top.appendTo(body);
    top.applyStyles({
        position: "absolute",
        top: (offsets[1] - borderWidth) + "px",
        left: (offsets[0] - borderWidth) + "px",
        width: (width + borderWidth*2) + "px",
        height: borderWidth + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    var bottom = document.createElement("div");
    bottom = Ext.get(bottom);
    bottom.appendTo(body);
    bottom.applyStyles({
        position: "absolute",
        top: (offsets[1] + borderWidth + height) + "px",
        left: (offsets[0] - borderWidth) + "px",
        width: (width + borderWidth*2) + "px",
        height: borderWidth + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    var left = document.createElement("div");
    left = Ext.get(left);
    left.appendTo(body);
    left.applyStyles({
        position: "absolute",
        top: (offsets[1] - borderWidth) + "px",
        left: (offsets[0] - borderWidth) + "px",
        width: borderWidth + "px",
        height: (height + borderWidth*2) + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    var right = document.createElement("div");
    right = Ext.get(right);
    right.appendTo(body);
    right.applyStyles({
        position: "absolute",
        top: (offsets[1] - borderWidth) + "px",
        left: (offsets[0] + width ) + "px",
        width: borderWidth + "px",
        height: (height + borderWidth*2) + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    pimcore.edithelpers.frame.topEl= top;
    pimcore.edithelpers.frame.bottomEl = bottom;
    pimcore.edithelpers.frame.leftEl = left;
    pimcore.edithelpers.frame.rightEl = right;
    pimcore.edithelpers.frame.active = true;

    var animDuration = 0.35;

    pimcore.edithelpers.frame.timeout = window.setTimeout(function () {
        top.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
        bottom.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
        left.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
        right.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
    }, 500);

};


pimcore.edithelpers.unFrameElement = function () {

    if(pimcore.edithelpers.frame.active) {

        window.clearTimeout(pimcore.edithelpers.frame.timeout);

        pimcore.edithelpers.frame.topEl.remove();
        pimcore.edithelpers.frame.bottomEl.remove();
        pimcore.edithelpers.frame.leftEl.remove();
        pimcore.edithelpers.frame.rightEl.remove();

        pimcore.edithelpers.frame.active = false;
    }
};




/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.edit.dnd");
pimcore.document.edit.dnd = Class.create({

    dndManager: null,

    globalDropZone: null,

    initialize: function(parentExt, body, iframeElement) {

        this.dndManager = parentExt.dd.DragDropMgr;
        var iFrameElement = parent.Ext.get('document_iframe_' + window.editWindow.document.id);
        
        parentExt.EventManager.on(body, 'mousemove', this.ddMouseMove.bind(this));
        parentExt.EventManager.on(body, 'mouseup', this.ddMouseUp.bind(this));

        this.globalDropZone = new parent.Ext.dd.DropZone(iframeElement, {
            ddGroup: "element",
            validElements: [],

            getTargetFromEvent: function(e) {
                var element = null;
                var elLength = this.validElements.length;

                for (var i = 0; i < elLength; i++) {
                    element = this.validElements[i];
                    if (element["el"].dndOver) {
                        if(element["drop"]) {
                            this.onNodeDrop = element["drop"];
                        }
                        if(element["over"]) {
                            this.onNodeOver = element["over"];
                        }
                        return element["el"];
                    }
                }
            }
        });
        
        window.setInterval(this.setIframeOffset.bind(this),1000);
        this.setIframeOffset();
    },

    addDropTarget: function (el, overCallback, dropCallback) {

        el.on("mouseover", function (e) {
            this.dndOver = true;
        }.bind(el));
        el.on("mouseout", function (e) {
            this.dndOver = false;
        }.bind(el));

        el.dndOver = false;

        this.globalDropZone.validElements.push({
            el: el,
            over: overCallback,
            drop: dropCallback
        });
    },

    ddMouseMove: function (e) {
        // update the xy of the event if necessary
        this.setDDPos(e);
        // *** Note that the 'this' scope is the drag drop manager
        this.dndManager.handleMouseMove(e);
    },

    ddMouseUp : function (e) {
        // update the xy of the event if necessary
        this.setDDPos(e);
        // *** Note that the 'this' scope is the drag drop manager
        this.dndManager.handleMouseUp(e);
    },


    setDDPos: function (e) {

        var scrollTop = 0;
        var scrollLeft = 0;

        var doc = (window.contentDocument || window.document);
        scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
        scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;

        e.xy = [e.xy[0] + this.iframeOffset[0] - scrollLeft, e.xy[1] + this.iframeOffset[1] - scrollTop];
    },
    
    setIframeOffset: function () {
        try {
            this.iframeOffset = parent.Ext.get('document_iframe_'
                                                    + window.editWindow.document.id).getOffsetsTo(parent.Ext.getBody());
        } catch (e) {
            
        }
    }

});



/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tag");
pimcore.document.tag = Class.create({

    id: null,
    name: null,
    inherited: false,

    setupWrapper: function (styleOptions) {

        if (!styleOptions) {
            styleOptions = {};
        }

        var container = Ext.get(this.id);
        container.setStyle(styleOptions);

        return container;
    },

    setName: function(name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    },

    reloadDocument: function () {
        window.editWindow.reload();
    },

    setInherited: function(inherited, el) {
        this.inherited = inherited;

        // if an element given is as optional second parameter we use this for the mask
        if(!(el instanceof Ext.Element)) {
            el = Ext.get(this.id);
        }

        // check for inherited elements, and mask them if necessary
        if(this.inherited) {
            var mask = el.mask();
            new Ext.ToolTip({
                target: mask,
                showDelay: 100,
                trackMouse:true,
                title: t("click_right_to_overwrite")
            });
            mask.on("contextmenu", function (e) {
                var menu = new Ext.menu.Menu();
                menu.add(new Ext.menu.Item({
                    text: t('overwrite'),
                    iconCls: "pimcore_icon_overwrite",
                    handler: function (item) {
                        this.setInherited(false);
                    }.bind(this)
                }));
                menu.showAt(e.getXY());

                e.stopEvent();
            }.bind(this));
        } else {
            el.unmask();
        }
    },

    getInherited: function () {
        return this.inherited;
    },

    setId: function (id) {
        this.id = id;
    },

    getId: function () {
        return this.id;
    },

    /**
     * HACK to get custom data from a grid instead of the tree
     * better solutions are welcome ;-)
     */
    getCustomPimcoreDropData : function (data){
        if(typeof(data.grid) != 'undefined' && typeof(data.grid.getCustomPimcoreDropData) == 'function'){ //droped from priceList
             var record = data.grid.getStore().getAt(data.rowIndex);
             var data = data.grid.getCustomPimcoreDropData(record);
         }
        return data;
    }
});




/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.block");
pimcore.document.tags.block = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        if (!options) {
            options = {};
        }

        this.id = id;
        this.name = name;
        this.elements = [];
        this.options = options;

        var plusButton, minusButton, upButton, downButton, plusDiv, minusDiv, upDiv, downDiv, amountDiv, amountBox;
        this.elements = Ext.get(id).query("div." + name + "[key]");


        var limitReached = false;
        if(typeof options.limit != "undefined" && this.elements.length >= options.limit) {
            limitReached = true;
        }

        if (this.elements.length < 1) {
            this.createInitalControls();
        }
        else {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].key = this.elements[i].getAttribute("key");


                if(!limitReached) {
                    // amount selection
                    amountDiv = Ext.get(this.elements[i]).query(".pimcore_block_amount_" + this.name)[0];
                    amountBox = new Ext.form.ComboBox({
                        cls: "pimcore_block_amount_select",
                        store: this.getAmountValues(),
                        value: 1,
                        mode: "local",
                        triggerAction: "all",
                        width: 40,
                        listeners: {
                            /*"focus": function (el) {
                                Ext.get(el).addClass("pimcore_tag_block_force_show_buttons");
                            }.bind(this, this.elements[i]),
                            "blur": function (el) {
                                if(this.options["autoHideButtons"] !== false) {
                                    Ext.get(el).removeClass("pimcore_tag_block_force_show_buttons");
                                }
                            }.bind(this, this.elements[i])*/
                        }
                    });
                    amountBox.render(amountDiv);

                    // plus button
                    plusDiv = Ext.get(this.elements[i]).query(".pimcore_block_plus_" + this.name)[0];
                    plusButton = new Ext.Button({
                        cls: "pimcore_block_button_plus",
                        iconCls: "pimcore_icon_plus",
                        listeners: {
                            "click": this.addBlock.bind(this, this.elements[i], amountBox)
                        }
                    });
                    plusButton.render(plusDiv);
                }

                // minus button
                minusDiv = Ext.get(this.elements[i]).query(".pimcore_block_minus_" + this.name)[0];
                minusButton = new Ext.Button({
                    cls: "pimcore_block_button_minus",
                    iconCls: "pimcore_icon_minus",
                    listeners: {
                        "click": this.removeBlock.bind(this, this.elements[i])
                    }
                });
                minusButton.render(minusDiv);

                // up button
                upDiv = Ext.get(this.elements[i]).query(".pimcore_block_up_" + this.name)[0];
                upButton = new Ext.Button({
                    cls: "pimcore_block_button_up",
                    iconCls: "pimcore_icon_up",
                    listeners: {
                        "click": this.moveBlockUp.bind(this, this.elements[i])
                    }
                });
                upButton.render(upDiv);

                // up button
                downDiv = Ext.get(this.elements[i]).query(".pimcore_block_down_" + this.name)[0];
                downButton = new Ext.Button({
                    cls: "pimcore_block_button_down",
                    iconCls: "pimcore_icon_down",
                    listeners: {
                        "click": this.moveBlockDown.bind(this, this.elements[i])
                    }
                });
                downButton.render(downDiv);

                /*if(options["autoHideButtons"] !== false) {
                    Ext.get(this.elements[i]).on("mouseenter", function () {
                        Ext.get(this.query(".pimcore_block_buttons")[0]).show();
                    });
                    Ext.get(this.elements[i]).on("mouseleave", function () {
                        Ext.get(this.query(".pimcore_block_buttons")[0]).hide();
                    });
                }
                */
            }
        }
    },

    setInherited: function ($super, inherited) {
        var elements = Ext.get(this.id).query(".pimcore_block_buttons_" + this.name);
        if(elements.length > 0) {
            for(var i=0; i<elements.length; i++) {
                $super(inherited, Ext.get(elements[i]));
            }
        }
    },

    getAmountValues: function () {
        var amountValues = [];

        if(typeof this.options.limit != "undefined") {
            var maxAddValues = intval(this.options.limit) - this.elements.length;
            if(maxAddValues > 10) {
                maxAddValues = 10;
            }
            for (var a=1; a<=maxAddValues; a++) {
                amountValues.push(a);
            }
        }

        if(amountValues.length < 1) {
            amountValues = [1,2,3,4,5,6,7,8,9,10];
        }

        return amountValues;
    },

    createInitalControls: function (amountValues) {
        var amountEl = document.createElement("div");
        amountEl.setAttribute("class", "pimcore_block_amount pimcore_block_amount_" + this.name);

        var plusEl = document.createElement("div");
        plusEl.setAttribute("class", "pimcore_block_plus pimcore_block_plus_" + this.name);

        var clearEl = document.createElement("div");
        clearEl.setAttribute("class", "pimcore_block_clear");

        Ext.get(this.id).appendChild(amountEl);
        Ext.get(this.id).appendChild(plusEl);
        Ext.get(this.id).appendChild(clearEl);

        // amount selection
        var amountBox = new Ext.form.ComboBox({
            cls: "pimcore_block_amount_select",
            store: this.getAmountValues(),
            mode: "local",
            triggerAction: "all",
            value: 1,
            width: 40
        });
        amountBox.render(amountEl);

        // plus button
        var plusButton = new Ext.Button({
            cls: "pimcore_block_button_plus",
            iconCls: "pimcore_icon_plus",
            listeners: {
                "click": this.addBlock.bind(this, null, amountBox)
            }
        });
        plusButton.render(plusEl);
        
        Ext.get(this.id).addClass("pimcore_block_limitnotreached");
    },

    addBlock : function (element, amountbox) {

        var index = this.getElementIndex(element) + 1;
        var amount = 1;

        // get amount of new blocks
        try {
            amount = amountbox.getValue();
        }
        catch (e) {
        }

        if (intval(amount) < 1) {
            amount = 1;
        }

        // get next higher key
        var nextKey = 0;
        var currentKey;

        for (var i = 0; i < this.elements.length; i++) {
            currentKey = intval(this.elements[i].key);
            if (currentKey > nextKey) {
                nextKey = currentKey;
            }
        }

        var args = [index, 0];

        for (var p = 0; p < amount; p++) {
            nextKey++;
            args.push({key: nextKey});
        }

       this.elements.splice.apply(this.elements, args);

        //this.elements.splice(index, 0, {key: nextKey});

        this.reloadDocument();
    },

    removeBlock: function (element) {

        var index = this.getElementIndex(element);

        this.elements.splice(index, 1);
        Ext.get(element).remove();

        // there is no existing block element anymore
        if (this.elements.length < 1) {
            this.createInitalControls();
        }

        // this is necessary because of the limit which is only applied when initializing
        //Even though reload is not necessary after remove, some sites change their appearance
        //according to the amount of block elements they contain and this arose the need for reload anyway
        this.reloadDocument();
    },

    moveBlockDown: function (element) {

        var index = this.getElementIndex(element);

        if (index < (this.elements.length-1)) {
            var x = this.elements[index];
            var y = this.elements[index + 1];

            this.elements[index + 1] = x;
            this.elements[index] = y;

            this.reloadDocument();

        }
    },

    moveBlockUp: function (element) {

        var index = this.getElementIndex(element);

        if (index > 0) {
            var x = this.elements[index];
            var y = this.elements[index - 1];

            this.elements[index - 1] = x;
            this.elements[index] = y;

            this.reloadDocument();
        }
    },

    getElementIndex: function (element) {

        try {
            var key = Ext.get(element).dom.key;
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == key) {
                    var index = i;
                    break;
                }
            }
        }
        catch (e) {
            return 0;
        }

        return index;
    },

    getValue: function () {
        var data = [];
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i]) {
                if (this.elements[i].key) {
                    data.push(this.elements[i].key);
                }
            }
        }

        return data;
    },

    getType: function () {
        return "block";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.date");
pimcore.document.tags.date = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;
        this.setupWrapper();

        if (!options) {
            options = {};
        }

        if (data) {
            var tmpDate = new Date(intval(data) * 1000);
            options.value = tmpDate;
        }

        options.name = id + "_editable";



        this.element = new Ext.form.DateField(options);
        if (options["reload"]) {
            this.element.on("change", this.reloadDocument);
        }

        this.element.render(id);
    },

    getValue: function () {
        return this.element.getValue();
    },

    getType: function () {
        return "date";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.href");
pimcore.document.tags.href = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;


        this.data = {
            id: null,
            path: "",
            type: ""
        };

        if (!options) {
            options = {};
        }

        if (!options.width) {
            options.width = Ext.get(id).getWidth() - 2;
        }


        if (data) {
            this.data = data;
            options.value = this.data.path;
        }

        this.options = options;

        this.setupWrapper();

        options.enableKeyEvents = true;

        if(typeof options.emptyText == "undefined") {
            options.emptyText = t("drop_element_here");
        }

        options.name = id + "_editable";
        this.element = new Ext.form.TextField(options);


        this.element.on("render", function (el) {
            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

            el.getEl().on("contextmenu", this.onContextMenu.bind(this));
        }.bind(this));

        // disable typing into the textfield
        this.element.on("keyup", function (element, event) {
            element.setValue(this.data.path);
        }.bind(this));

        this.element.render(id);
    },

    uploadDialog: function () {
        pimcore.helpers.assetSingleUploadDialog(this.options["uploadPath"], "path", function (res) {
            try {
                var data = Ext.decode(res.response.responseText);
                if(data["id"]) {

                    if (this.options["subtypes"]) {
                        var found = false;
                        var typeKeys = Object.keys(this.options.subtypes);
                        for (var st = 0; st < typeKeys.length; st++) {
                            for (var i = 0; i < this.options.subtypes[typeKeys[st]].length; i++) {
                                if (this.options.subtypes[typeKeys[st]][i] == data["type"]) {
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            return false;
                        }
                    }

                    this.data.id = data["id"];
                    this.data.subtype = data["type"];
                    this.data.elementType = "asset";
                    this.data.path = data["fullpath"];
                    this.element.setValue(data["fullpath"]);
                }
            } catch (e) {
                console.log(e);
            }
        }.bind(this));
    },

    onNodeOver: function(target, dd, e, data) {
        data = this.getCustomPimcoreDropData(data);
        if (this.dndAllowed(data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    onNodeDrop: function (target, dd, e, data) {
        data = this.getCustomPimcoreDropData(data);

        if(!this.dndAllowed(data)){
            return false;
        }


        this.data.id = data.node.attributes.id;
        this.data.subtype = data.node.attributes.type;
        this.data.elementType = data.node.attributes.elementType;
        this.data.path = data.node.attributes.path;

        this.element.setValue(this.data.path);

        if (this.options.reload) {
            this.reloadDocument();
        }

        return true;
    },

    dndAllowed: function(data) {

        var i;
        var found;

        //only is legacy
        if (this.options.only && !this.options.types) {
            this.options.types = [this.options.only];
        }

        //type check   (asset,document,object)
        if (this.options.types) {
            found = false;
            for (i = 0; i < this.options.types.length; i++) {
                if (this.options.types[i] == data.node.attributes.elementType) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }

        //subtype check  (folder,page,snippet ... )
        if (this.options.subtypes) {
            found = false;
            var typeKeys = Object.keys(this.options.subtypes);
            for (var st = 0; st < typeKeys.length; st++) {
                for (i = 0; i < this.options.subtypes[typeKeys[st]].length; i++) {
                    if (this.options.subtypes[typeKeys[st]][i] == data.node.attributes.type) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                return false;
            }
        }

        //object class check
        if (data.node.attributes.elementType == "object" && this.options.classes) {
            found = false;
            for (i = 0; i < this.options.classes.length; i++) {
                if (this.options.classes[i] == data.node.attributes.className) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }

        return true;
    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.data["id"]) {
            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: "pimcore_icon_delete",
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.data = {};
                    this.element.setValue(this.data.path);
                    if (this.options.reload) {
                        this.reloadDocument();
                    }

                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "pimcore_icon_open",
                handler: function (item) {
                    item.parentMenu.destroy();
                    if (this.data.elementType == "document") {
                        pimcore.helpers.openDocument(this.data.id, this.data.subtype);
                    }
                    else if (this.data.elementType == "asset") {
                        pimcore.helpers.openAsset(this.data.id, this.data.subtype);
                    }
                    else if (this.data.elementType == "object") {
                        pimcore.helpers.openObject(this.data.id, this.data.subtype);
                    }
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('show_in_tree'),
                iconCls: "pimcore_icon_fileexplorer",
                handler: function (item) {
                    item.parentMenu.destroy();
                    pimcore.helpers.selectElementInTree(this.data.elementType, this.data.id);
                }.bind(this)
            }));
        }

        menu.add(new Ext.menu.Item({
            text: t('search'),
            iconCls: "pimcore_icon_search",
            handler: function (item) {
                item.parentMenu.destroy();

                this.openSearchEditor();
            }.bind(this)
        }));

        if((this.options["types"] && in_array("asset",this.options.types)) || !this.options["types"]) {
            menu.add(new Ext.menu.Item({
                text: t('upload'),
                iconCls: "pimcore_icon_upload_single",
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.uploadDialog();
                }.bind(this)
            }));
        }

        menu.showAt(e.getXY());

        e.stopEvent();
    },

    openSearchEditor: function () {

        //only is legacy
        if (this.options.only && !this.options.types) {
            this.options.types = [this.options.only];
        }

        pimcore.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: this.options.types,
            subtype: this.options.subtypes
        });
    },

    addDataFromSelector: function (item) {
        if (item) {
            this.data.id = item.id;
            this.data.subtype = item.subtype;
            this.data.elementType = item.type;
            this.data.path = item.fullpath;

            this.element.setValue(this.data.path);
        }
    },

    getValue: function () {
        return {
            id: this.data.id,
            type: this.data.elementType,
            subtype: this.data.subtype
        };
    },

    getType: function () {
        return "href";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.multihref");
pimcore.document.tags.multihref = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;

        if (!options) {
            options = {};
        }
        this.options = options;
        this.data = data;

        this.setupWrapper();


        this.store = new Ext.data.ArrayStore({
            data: this.data,
            fields: [
                "id",
                "path",
                "type",
                "subtype"
            ]
        });


        var elementConfig = {
            store: this.store,
            bodyStyle: "color:#000",
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: false
                },
                columns: [
                    {header: 'ID', dataIndex: 'id', width: 50},
                    {id: "path", header: t("path"), dataIndex: 'path', width: 200},
                    {header: t("type"), dataIndex: 'type', width: 100},
                    {header: t("subtype"), dataIndex: 'subtype', width: 100},
                    {
                        xtype:'actioncolumn',
                        width:30,
                        items:[
                            {
                                tooltip:t('up'),
                                icon:"/pimcore/static/img/icon/arrow_up.png",
                                handler:function (grid, rowIndex) {
                                    if (rowIndex > 0) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        grid.getStore().removeAt(rowIndex);
                                        grid.getStore().insert(rowIndex - 1, [rec]);
                                    }
                                }.bind(this)
                            }
                        ]
                    },
                    {
                        xtype:'actioncolumn',
                        width:30,
                        items:[
                            {
                                tooltip:t('down'),
                                icon:"/pimcore/static/img/icon/arrow_down.png",
                                handler:function (grid, rowIndex) {
                                    if (rowIndex < (grid.getStore().getCount() - 1)) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        grid.getStore().removeAt(rowIndex);
                                        grid.getStore().insert(rowIndex + 1, [rec]);
                                    }
                                }.bind(this)
                            }
                        ]
                    },
                    {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            tooltip: t('open'),
                            icon: "/pimcore/static/img/icon/pencil_go.png",
                            handler: function (grid, rowIndex) {
                                var data = grid.getStore().getAt(rowIndex);
                                var subtype = data.data.subtype;
                                if (data.data.type == "object" && data.data.subtype != "folder") {
                                    subtype = "object";
                                }
                                pimcore.helpers.openElement(data.data.id, data.data.type, subtype);
                            }.bind(this)
                        }]
                    },
                    {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            tooltip: t('remove'),
                            icon: "/pimcore/static/img/icon/cross.png",
                            handler: function (grid, rowIndex) {
                                grid.getStore().removeAt(rowIndex);
                            }.bind(this)
                        }]
                    }
                ]
            }),
            autoExpandColumn: 'path',
            tbar: {
                items: [
                    {
                        xtype: "tbspacer",
                        width: 20,
                        height: 16,
                        cls: "pimcore_icon_droptarget"
                    },
                    {
                        xtype: "tbtext",
                        text: "<b>" + (this.options.title ? this.options.title : "") + "</b>"
                    },
                    "->",
                    {
                        xtype: "button",
                        iconCls: "pimcore_icon_delete",
                        handler: this.empty.bind(this)
                    },
                    {
                        xtype: "button",
                        iconCls: "pimcore_icon_search",
                        handler: this.openSearchEditor.bind(this)
                    },
                    {
                        xtype: "button",
                        iconCls: "pimcore_icon_upload_single",
                        handler: this.uploadDialog.bind(this)
                    }
                ]
            }
        };

        // height specifics
        if(typeof this.options.height != "undefined") {
            elementConfig.height = this.options.height;
        } else {
            elementConfig.autoHeight = true;
        }

        // width specifics
        if(typeof this.options.width != "undefined") {
            elementConfig.width = this.options.width;
        }



        this.element = new Ext.grid.GridPanel(elementConfig);

        this.element.on("rowcontextmenu", this.onRowContextmenu);
        this.element.reference = this;

        this.element.on("render", function (el) {
            // register at global DnD manager
            dndManager.addDropTarget(this.element.getEl(),
                this.onNodeOver.bind(this),
                this.onNodeDrop.bind(this));

        }.bind(this));

        this.element.render(id);
    },

    uploadDialog: function () {
        pimcore.helpers.assetSingleUploadDialog(this.options["uploadPath"], "path", function (res) {
            try {
                var data = Ext.decode(res.response.responseText);
                if(data["id"]) {
                    this.store.add(new this.store.recordType({
                        id: data["id"],
                        path: data["fullpath"],
                        type: "asset",
                        subtype: data["type"]
                    }, this.store.getCount() + 1));
                }
            } catch (e) {
                console.log(e);
            }
        }.bind(this));
    },

    onNodeOver: function(target, dd, e, data) {
        return Ext.dd.DropZone.prototype.dropAllowed;
    },

    onNodeDrop: function (target, dd, e, data) {

        var initData = {
            id: data.node.attributes.id,
            path: data.node.attributes.path,
            type: data.node.attributes.elementType
        };

        if (initData.type == "object") {
            if (data.node.attributes.className) {
                initData.subtype = data.node.attributes.className;
            }
            else {
                initData.subtype = "folder";
            }
        }

        if (initData.type == "document" || initData.type == "asset") {
            initData.subtype = data.node.attributes.type;
        }

        // check for existing element
        if (!this.elementAlreadyExists(initData.id, initData.type)) {
            this.store.add(new this.store.recordType(initData, this.store.getCount() + 1));
            return true;
        }
        return false;

    },

    onRowContextmenu: function (grid, rowIndex, event) {

        var menu = new Ext.menu.Menu();
        var data = grid.getStore().getAt(rowIndex);

        menu.add(new Ext.menu.Item({
            text: t('remove'),
            iconCls: "pimcore_icon_delete",
            handler: this.reference.removeElement.bind(this, rowIndex)
        }));

        menu.add(new Ext.menu.Item({
            text: t('open'),
            iconCls: "pimcore_icon_open",
            handler: function (data, item) {

                item.parentMenu.destroy();

                var subtype = data.data.subtype;
                if (data.data.type == "object" && data.data.subtype != "folder") {
                    subtype = "object";
                }
                pimcore.helpers.openElement(data.data.id, data.data.type, subtype);
            }.bind(this, data)
        }));

        menu.add(new Ext.menu.Item({
            text: t('search'),
            iconCls: "pimcore_icon_search",
            handler: function (item) {
                item.parentMenu.destroy();
                this.openSearchEditor();
            }.bind(this.reference)
        }));

        menu.add(new Ext.menu.Item({
            text: t('upload'),
            iconCls: "pimcore_icon_upload_single",
            handler: function (item) {
                item.parentMenu.destroy();
                this.uploadDialog();
            }.bind(this.reference)
        }));

        event.stopEvent();
        menu.showAt(event.getXY());
    },

    openSearchEditor: function () {

        var allowedTypes = [];
        var allowedSpecific = {};
        var allowedSubtypes = {};


        pimcore.helpers.itemselector(true, this.addDataFromSelector.bind(this), {});

    },

    elementAlreadyExists: function (id, type) {

        // check for existing element
        var result = this.store.queryBy(function (id, type, record, rid) {
            if (record.data.id == id && record.data.type == type) {
                return true;
            }
            return false;
        }.bind(this, id, type));

        if (result.length < 1) {
            return false;
        }
        return true;
    },

    addDataFromSelector: function (items) {
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                if (!this.elementAlreadyExists(items[i].id, items[i].type)) {

                    var subtype = items[i].subtype;
                    if (items[i].type == "object") {
                        if (items[i].subtype == "object") {
                            if (items[i].classname) {
                                subtype = items[i].classname;
                            }
                        }
                    }

                    this.store.add(new this.store.recordType({
                        id: items[i].id,
                        path: items[i].fullpath,
                        type: items[i].type,
                        subtype: subtype
                    }, this.store.getCount() + 1));
                }
            }
        }
    },

    empty: function () {
        this.store.removeAll();
    },

    removeElement: function (index, item) {
        this.getStore().removeAt(index);
        item.parentMenu.destroy();
    },

    getValue: function () {
        var tmData = [];

        var data = this.store.queryBy(function(record, id) {
            return true;
        });


        for (var i = 0; i < data.items.length; i++) {
            tmData.push(data.items[i].data);
        }

        return tmData;
    },

    getType: function () {
        return "multihref";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.checkbox");
pimcore.document.tags.checkbox = Class.create(pimcore.document.tag, {


    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.setupWrapper();
        if (!options) {
            options = {};
        }
        if (!data) {
            data = false;
        }
   

        options.listeners = {};
        // onchange event
        if (options.onchange) {
            options.listeners.check = eval(options.onchange);
        }
        if (options.reload) {
            options.listeners.check = this.reloadDocument;
        }

        options.checked = data;
        options.name = id + "_editable";
        this.element = new Ext.form.Checkbox(options);
        this.element.render(id);
    },

    getValue: function () {
        return this.element.getValue();
    },

    getType: function () {
        return "checkbox";
    }
});



/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.image");
pimcore.document.tags.image = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.datax = new Object();

        if (!options) {
            options = {};
        }

        this.options = options;

        this.originalDimensions = {
            width: this.options.width,
            height: this.options.height
        };

        // set width & height
        /*if(!this.options.width) {
         this.options.width = 100;
         }*/
        if (!this.options.height) {
            this.options.height = 100;
        }

        if (data) {
            this.datax = data;
        }

        this.setupWrapper();

        this.options.name = id + "_editable";
        this.element = new Ext.Panel(this.options);


        this.element.on("render", function (el) {

            // contextmenu
            el.getEl().on("contextmenu", this.onContextMenu.bind(this));

            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

            el.getEl().setStyle({
                position: "relative"
            });

            // alt / title
            this.altBar = document.createElement("div");
            this.getBody().appendChild(this.altBar);

            this.altBar = Ext.get(this.altBar);
            this.altBar.addClass("pimcore_tag_image_alt");
            this.altBar.setStyle({
                opacity: 0.8,
                display: "none"
            });

            this.altInput = new Ext.form.TextField({
                name: "altText",
                width: this.options.width
            });
            this.altInput.render(this.altBar);

            if (this.datax.alt) {
                this.altInput.setValue(this.datax.alt);
            }

            if (this.options.hidetext == true) {
                this.altBar.setStyle({
                    display: "none",
                    visibility: "hidden"
                });
            }

            this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');

            this.getBody().addClass("pimcore_tag_image_empty");

        }.bind(this));

        this.element.render(id);


        // insert image
        if (this.datax) {
            this.updateImage();
        }
    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.datax.id) {
            menu.add(new Ext.menu.Item({
                text: t('select_specific_area_of_image'),
                iconCls: "pimcore_icon_image_region",
                handler: function (item) {
                    item.parentMenu.destroy();

                    this.openEditWindow();
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('add_marker_or_hotspots'),
                iconCls: "pimcore_icon_image_add_hotspot",
                handler: function (item) {
                    item.parentMenu.destroy();

                    this.openHotspotWindow();
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: "pimcore_icon_delete",
                handler: function (item) {
                    item.parentMenu.destroy();

                    this.empty();

                }.bind(this)
            }));
            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "pimcore_icon_open",
                handler: function (item) {
                    item.parentMenu.destroy();
                    pimcore.helpers.openAsset(this.datax.id, "image");
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('show_in_tree'),
                iconCls: "pimcore_icon_fileexplorer",
                handler: function (item) {
                    item.parentMenu.destroy();
                    pimcore.helpers.selectElementInTree("asset", this.datax.id);
                }.bind(this)
            }));
        }

        menu.add(new Ext.menu.Item({
            text: t('search'),
            iconCls: "pimcore_icon_search",
            handler: function (item) {
                item.parentMenu.destroy();
                this.openSearchEditor();
            }.bind(this) 
        }));

        menu.add(new Ext.menu.Item({
            text: t('upload'),
            iconCls: "pimcore_icon_upload_single",
            handler: function (item) {
                item.parentMenu.destroy();
                this.uploadDialog();
            }.bind(this)
        }));

        menu.showAt(e.getXY());
        e.stopEvent();
    },

    uploadDialog: function () {
        pimcore.helpers.assetSingleUploadDialog(this.options["uploadPath"], "path", function (res) {
            try {
                var data = Ext.decode(res.response.responseText);
                if(data["id"] && data["type"] == "image") {
                    this.resetData();
                    this.datax.id = data["id"];

                    this.updateImage();
                    this.reload();
                }
            } catch (e) {
                console.log(e);
            }
        }.bind(this));
    },

    onNodeOver: function(target, dd, e, data) {
        if (this.dndAllowed(data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    onNodeDrop: function (target, dd, e, data) {

        if (data.node.attributes.type == "image") {
            this.resetData();
            this.datax.id = data.node.attributes.id;

            this.updateImage();
            this.reload();

            return true;
        }
    },

    dndAllowed: function(data) {

        if(data.node.attributes.elementType!="asset" || data.node.attributes.type!="image"){
            return false;
        } else {
            return true;
        }

    },

    openSearchEditor: function () {
        pimcore.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: ["asset"],
            subtype: {
                asset: ["image"]
            }
        });
    },
    
    addDataFromSelector: function (item) {        
        if(item) {
            this.resetData();
            this.datax.id = item.id;

            this.updateImage();
            this.reload();

            return true;
        }
    },

    resetData: function () {
        this.datax = {
            id: null
        };
    },

    empty: function () {

        this.resetData();

        this.updateImage();
        this.getBody().addClass("pimcore_tag_image_empty");
        this.altBar.setStyle({
            display: "none"
        });
        this.reload();
    },

    getBody: function () {
        // get the id from the body element of the panel because there is no method to set body's html
        // (only in configure)
        var body = Ext.get(this.element.getEl().query(".x-panel-body")[0]);
        return body;
    },

    updateImage: function () {

        var path = "";
        var existingImage = this.getBody().dom.getElementsByTagName("img")[0];
        if (existingImage) {
            Ext.get(existingImage).remove();
        }

        if (!this.datax.id) {
            return;
        }


        if (!this.options["thumbnail"] && !this.originalDimensions["width"] && !this.originalDimensions["height"]) {
            path = "/admin/asset/get-image-thumbnail/id/" + this.datax.id + "/width/" + this.element.getEl().getWidth()
                            + "/aspectratio/true?" + Ext.urlEncode(this.datax);
        } else if (this.originalDimensions["width"]) {
            path = "/admin/asset/get-image-thumbnail/id/" + this.datax.id + "/width/" + this.originalDimensions["width"]
                            + "/aspectratio/true?" + Ext.urlEncode(this.datax);
        } else if (this.originalDimensions["height"]) {
            path = "/admin/asset/get-image-thumbnail/id/" + this.datax.id + "/height/"
                            + this.originalDimensions["height"] + "/aspectratio/true?" + Ext.urlEncode(this.datax);
        } else {
            if (typeof this.options.thumbnail == "string") {
                path = "/admin/asset/get-image-thumbnail/id/" + this.datax.id + "/thumbnail/" + this.options.thumbnail
                            + "?" + Ext.urlEncode(this.datax);
            }
            else if (this.options.thumbnail.width || this.options.thumbnail.height) {
                path = "/admin/asset/get-image-thumbnail/id/" + this.datax.id + "/width/"
                            + this.options.thumbnail.width + "/height/" + this.options.thumbnail.height + "?"
                            + Ext.urlEncode(this.datax);
            }
        }

        var image = document.createElement("img");
        image.src = path;

        this.getBody().appendChild(image);

        // show alt input field
        this.altBar.setStyle({
            display: "block"
        });

        this.getBody().removeClass("pimcore_tag_image_empty");

        this.updateCounter = 0;
        this.updateDimensionsInterval = window.setInterval(this.updateDimensions.bind(this), 1000);
    },

    reload : function () {
        if (this.options.reload) {
            this.reloadDocument();
        }
    },

    updateDimensions: function () {

        var image = this.element.getEl().dom.getElementsByTagName("img")[0];
        if (!image) {
            return;
        }
        image = Ext.get(image);

        var width = image.getWidth();
        var height = image.getHeight();

        if (width > 1 && height > 1) {

            if(Ext.isIE && width==28 && height==30){
                //IE missing image placeholder
                return;
            }

            var dimensionError = false;
            if(typeof this.options.minWidth != "undefined") {
                if(width < this.options.minWidth) {
                    dimensionError = true;
                }
            }
            if(typeof this.options.minHeight != "undefined") {
                if(height < this.options.minHeight) {
                    dimensionError = true;
                }
            }

            if(dimensionError) {
                this.empty();
                clearInterval(this.updateDimensionsInterval);

                Ext.MessageBox.alert(t("error"), t("image_is_too_small"));

                return;
            }

            if (typeof this.originalDimensions.width == "undefined") {
                this.element.setWidth(width);
            }
            if (typeof this.originalDimensions.height == "undefined") {
                this.element.setHeight(height);
            }

            this.altInput.setWidth(width);

            // show alt input field
            this.altBar.setStyle({
                display: "block"
            });

            clearInterval(this.updateDimensionsInterval);
        }
        else {
            this.altBar.setStyle({
                display: "none"
            });
        }

        if (this.updateCounter > 20) {
            // only wait 20 seconds until image must be loaded
            clearInterval(this.updateDimensionsInterval);
        }

        this.updateCounter++;
    },

    openEditWindow: function() {
        var editor = new pimcore.element.tag.imagecropper(this.datax.id, this.datax, function (data) {
            this.datax.cropWidth = data.cropWidth;
            this.datax.cropHeight = data.cropHeight;
            this.datax.cropTop = data.cropTop;
            this.datax.cropLeft = data.cropLeft;
            this.datax.cropPercent = true;

            this.updateImage();
        }.bind(this));
        editor.open(true);
    },

    openHotspotWindow: function() {
        var editor = new pimcore.element.tag.imagehotspotmarkereditor(this.datax.id, this.datax, function (data) {
            this.datax["hotspots"] = data["hotspots"];
            this.datax["marker"] = data["marker"];
        }.bind(this));
        editor.open(true);
    },

    getValue: function () {

        // alt alt value
        this.datax.alt = this.altInput.getValue();

        return this.datax;
    },

    getType: function () {
        return "image";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.input");
pimcore.document.tags.input = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.setupWrapper();
        if (!options) {
            options = {};
        }
        if (!data) {
            data = "";
        }
        
        if(!options.width) {
            options.width = Ext.get(id).getWidth()-2;
        }

        options.value = data;
        options.name = id + "_editable";
        this.element = new Ext.form.TextField(options);
        this.element.render(id);

        if(options["autoStyle"] !== false) {
            var styles = Ext.get(id).parent().getStyles("font-size","font-family","font-style","font-weight",
                                "font-stretch","font-variant","color","line-height","text-shadow","text-align",
                                "text-decoration","text-transform","direction","white-space","word-spacing");
            styles["background"] = "none";
            if(!options["height"]) {
                styles["height"] = "auto";
            }
            this.element.getEl().applyStyles(styles);

            // necessary for IE9
            window.setTimeout(function () {
                this.element.getEl().repaint();
            }.bind(this), 300);
        }
    },

    getValue: function () {
        return this.element.getValue();
    },

    getType: function () {
        return "input";
    }
});



/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.link");
pimcore.document.tags.link = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        if (!data) {
            data = {};
        }

        this.defaultData = {
            type: "internal",
            path: "",
            parameters: "",
            anchor: "",
            accesskey: "",
            rel: "",
            tabindex: "",
            target: "",
            "class": "",
            attributes: ""
        };

        this.data = mergeObject(this.defaultData, data);

        this.id = id;
        this.name = name;
        this.setupWrapper();
        if (!options) {
            options = {};
        }

        this.options = options;

        Ext.get(id).setStyle({
            display:"inline"
        });
        Ext.get(id).insertHtml("beforeEnd",'<span class="pimcore_tag_link_text">' + this.getLinkContent() + '</span>');

        var button = new Ext.Button({
            iconCls: "pimcore_icon_edit_link",
            cls: "pimcore_edit_link_button",
            listeners: {
                "click": this.openEditor.bind(this)
            }
        });
        button.render(id);
    },

    openEditor: function () {

        this.fieldPath = new Ext.form.TextField({
            fieldLabel: t('path'),
            value: this.data.path,
            name: "path",
            width: 320,
            cls: "pimcore_droptarget_input",
            enableKeyEvents: true,
            listeners: {
                keyup: function (el) {
                    if(el.getValue().match(/^www\./)) {
                        el.setValue("http://" + el.getValue());
                    }
                }
            }
        });


        this.fieldPath.on("render", function (el) {
            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));
        }.bind(this));

        this.form = new Ext.FormPanel({
            items: [
                {
                    xtype:'tabpanel',
                    activeTab: 0,
                    deferredRender: false,
                    defaults:{autoHeight:true, bodyStyle:'padding:10px'},
                    border: false,
                    items: [
                        {
                            title:t('basic'),
                            layout:'form',
                            border: false,
                            defaultType: 'textfield',
                            items: [
                                {
                                    fieldLabel: t('text'),
                                    name: 'text',
                                    value: this.data.text
                                },
                                {
                                    xtype: "compositefield",
                                    items: [this.fieldPath, {
                                        xtype: "button",
                                        iconCls: "pimcore_icon_search",
                                        handler: this.openSearchEditor.bind(this)
                                    }]
                                },
                                {
                                    xtype:'fieldset',
                                    title: t('properties'),
                                    collapsible: false,
                                    autoHeight:true,
                                    defaultType: 'textfield',
                                    items :[
                                        {
                                            xtype: "combo",
                                            fieldLabel: t('target'),
                                            name: 'target',
                                            triggerAction: 'all',
                                            editable: true,
                                            mode: "local",
                                            store: ["","_blank","_self","_top","_parent"],
                                            value: this.data.target
                                        },
                                        {
                                            fieldLabel: t('parameters'),
                                            name: 'parameters',
                                            value: this.data.parameters
                                        },
                                        {
                                            fieldLabel: t('anchor'),
                                            name: 'anchor',
                                            value: this.data.anchor
                                        },
                                        {
                                            fieldLabel: t('title'),
                                            name: 'title',
                                            value: this.data.title
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: t('advanced'),
                            layout:'form',
                            defaultType: 'textfield',
                            border: false,
                            items: [
                                {
                                    fieldLabel: t('accesskey'),
                                    name: 'accesskey',
                                    value: this.data.accesskey
                                },
                                {
                                    fieldLabel: t('relation'),
                                    name: 'rel',
                                    width: 300,
                                    value: this.data.rel
                                },
                                {
                                    fieldLabel: ('tabindex'),
                                    name: 'tabindex',
                                    value: this.data.tabindex
                                },
                                {
                                    fieldLabel: t('class'),
                                    name: 'class',
                                    width: 300,
                                    value: this.data["class"]
                                },
                                {
                                    fieldLabel: t('attributes') + ' (key="value")',
                                    name: 'attributes',
                                    width: 300,
                                    value: this.data["attributes"]
                                }
                            ]
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: t("empty"),
                    listeners:  {
                        "click": this.empty.bind(this)
                    }
                },
                {
                    text: t("cancel"),
                    listeners:  {
                        "click": this.cancel.bind(this)
                    }
                },
                {
                    text: t("save"),
                    listeners: {
                        "click": this.save.bind(this)
                    },
                    icon: "/pimcore/static/img/icon/tick.png"
                }
            ]
        });


        this.window = new Ext.Window({
            modal: true,
            width: 500,
            height: 330,
            title: t("edit_link"),
            items: [this.form],
            layout: "fit"
        });
        this.window.show();
    },

    openSearchEditor: function () {
        pimcore.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: ["asset","document"]
        });
    },

    addDataFromSelector: function (item) {
        if (item) {
            this.fieldPath.setValue(item.fullpath);
            return true;
        }
    },

    getLinkContent: function () {

        var text = "[" + t("not_set") + "]";
        if (this.data.text) {
            text = this.data.text;
        }
        if (this.data.path) {
            return '<a href="' + this.data.path + '">' + text + '</a>';
        }
        return text;
    },

    onNodeDrop: function (target, dd, e, data) {

        if(this.dndAllowed(data)){
            this.fieldPath.setValue(data.node.attributes.path);
            return true;
        } else {
            return false;
        }
    },

    onNodeOver: function(target, dd, e, data) {
        if (this.dndAllowed(data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    dndAllowed: function(data) {

        if (data.node.attributes.elementType == "asset" && data.node.attributes.type != "folder") {
            return true;
        } else if (data.node.attributes.elementType == "document"
                            && (data.node.attributes.type=="page" || data.node.attributes.type=="hardlink"
                                                                            || data.node.attributes.type=="link")){
            return true;
        }
        return false;

    },

    save: function () {

        // close window
        this.window.hide();

        var values = this.form.getForm().getFieldValues();
        this.data = values;

        // set text
        Ext.get(this.id).query(".pimcore_tag_link_text")[0].innerHTML = this.getLinkContent();

        this.reload();
    },

    reload : function () {
        if (this.options.reload) {
            this.reloadDocument();
        }
    },

    empty: function () {

        // close window
        this.window.hide();

        this.data = this.defaultData;

        // set text
        Ext.get(this.id).query(".pimcore_tag_link_text")[0].innerHTML = this.getLinkContent();
    },

    cancel: function () {
        this.window.hide();
    },

    getValue: function () {
        return this.data;
    },

    getType: function () {
        return "link";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.select");
pimcore.document.tags.select = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;

        this.setupWrapper();

        options.listeners = {};

        // onchange event
        if (options.onchange) {
            options.listeners.select = eval(options.onchange);
        }

        if (options["reload"]) {
            options.listeners.select = this.reloadDocument;
        }

        options.name = id + "_editable";
        options.triggerAction = 'all';
        options.editable = false;
        options.value = data;

        this.element = new Ext.form.ComboBox(options);
        this.element.render(id);
    },

    getValue: function () {
        return this.element.getValue();
    },

    getType: function () {
        return "select";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.snippet");
pimcore.document.tags.snippet = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.options = options;

        this.data = {};

        if (!this.options) {
            this.options = {};
        }
        if (!data) {
            data = {};
        }

        // cast array to object
        this.options = Ext.apply({}, this.options);

        // height management                
        this.defaultHeight = 100;
        if (this.options.defaultHeight) {
            this.defaultHeight = this.options.defaultHeight;
        }
        if (!this.options.height && !data.path) {
            this.options.height = this.defaultHeight;
        }

        this.setupWrapper();

        this.options.name = id + "_editable";
        this.options.border = false;
        this.options.bodyStyle = "min-height: 40px;";

        this.element = new Ext.Panel(this.options);

        this.element.on("render", function (el) {
            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

            this.getBody().setStyle({
                overflow: "auto"
            });

            this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');
            this.getBody().addClass("pimcore_tag_snippet_empty");

            el.getEl().on("contextmenu", this.onContextMenu.bind(this));

        }.bind(this));

        this.element.render(id);


        // insert snippet content
        if (data) {
            this.data = data;
            if (this.data.path) {
                this.updateContent(this.data.path);
            }
        }
    },

    onNodeDrop: function (target, dd, e, data) {

        if (this.dndAllowed(data)) {
            // get path from nodes data
            var uri = data.node.attributes.path;

            this.data.id = data.node.attributes.id;
            this.data.path = uri;

            if (this.options.reload) {
                this.reloadDocument();
            } else {
                this.updateContent(uri);
            }

            return true;
        }
    },

    onNodeOver: function(target, dd, e, data) {
        if (this.dndAllowed(data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    dndAllowed: function(data) {

        if (data.node.attributes.type != "snippet") {
            return false;
        } else {
            return true;
        }
    },

    getBody: function () {
        // get the id from the body element of the panel because there is no method to set body's html
        // (only in configure)
        var bodyId = Ext.get(this.element.getEl().dom).query(".x-panel-body")[0].getAttribute("id");
        return Ext.get(bodyId);
    },

    updateContent: function (path) {

        var params = this.options;
        params.blockAutoHtml = true;
        params.pimcore_admin = true;

        Ext.Ajax.request({
            method: "get",
            url: path,
            success: function (response) {
                this.getBody().dom.innerHTML = response.responseText;
                this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');
                this.updateDimensions();
            }.bind(this),
            params: params
        });
    },

    updateDimensions: function () {
        this.getBody().setStyle({
            height: "auto"
        });

        this.getBody().removeClass("pimcore_tag_snippet_empty");
    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.data["id"]) {
            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: "pimcore_icon_delete",
                handler: function (item) {
                    item.parentMenu.destroy();

                    var height = this.options.height;
                    if (!height) {
                        height = this.defaultHeight;
                    }

                    this.element.setHeight(height);

                    this.data = {};
                    this.getBody().dom.innerHTML = '';
                    this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');
                    this.getBody().addClass("pimcore_tag_snippet_empty");
                    this.getBody().setStyle(height + "px");

                    if (this.options.reload) {
                        this.reloadDocument();
                    }

                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "pimcore_icon_open",
                handler: function (item) {
                    item.parentMenu.destroy();

                    pimcore.helpers.openDocument(this.data.id, "snippet");

                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('show_in_tree'),
                iconCls: "pimcore_icon_fileexplorer",
                handler: function (item) {
                    item.parentMenu.destroy();
                    pimcore.helpers.selectElementInTree("document", this.data.id);
                }.bind(this)
            }));
        }
        
        menu.add(new Ext.menu.Item({
            text: t('search'),
            iconCls: "pimcore_icon_search",
            handler: function (item) {
                item.parentMenu.destroy();
                
                this.openSearchEditor();
            }.bind(this)
        }));


        menu.showAt(e.getXY());

        e.stopEvent();
    },
    
    openSearchEditor: function () {

        pimcore.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: ["document"],
            subtype: {
                document: ["snippet"]
            }
        });
    },
    
    addDataFromSelector: function (item) {
        
        if(item) {
            var uri = item.fullpath;
    
            this.data.id = item.id;
            this.data.path = uri;

            if (this.options.reload) {
                this.reloadDocument();
            } else {
                this.updateContent(uri);
            }
        }
    },

    getValue: function () {
        return this.data.id;
    },

    getType: function () {
        return "snippet";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.textarea");
pimcore.document.tags.textarea = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.setupWrapper();
        if (!options) {
            options = {};
        }
        if (!data) {
            data = "";
        }

        options.value = data;
        options.name = id + "_editable";

        if(!options.width) {
            options.width = Ext.get(id).getWidth()-2;
        }

        this.element = new Ext.form.TextArea(options);
        this.element.render(id);

        if(options["autoStyle"] !== false) {
            var styles = Ext.get(id).parent().getStyles("font-size","font-family","font-style","font-weight","font-stretch","font-variant","color","line-height","text-shadow","text-align","text-decoration","text-transform","direction");
            styles["background"] = "none";
            if(!options["height"]) {
                styles["height"] = "auto";
            }
            this.element.getEl().applyStyles(styles);

            // necessary for IE9
            window.setTimeout(function () {
                this.element.getEl().repaint();
            }.bind(this), 300);
        }
    },

    getValue: function () {
        return this.element.getValue();
    },

    getType: function () {
        return "textarea";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.numeric");
pimcore.document.tags.numeric = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;
        this.setupWrapper();
        if (!options) {
            options = {};
        }
        if (!data) {
            data = "";
        }

        options.value = data;
        options.name = id + "_editable";
        options.decimalPrecision = 20;

        this.element = new Ext.ux.form.SpinnerField(options);
        this.element.render(id);
    },

    getValue: function () {
        return this.element.getValue();
    },

    getType: function () {
        return "numeric";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

/*global CKEDITOR*/
pimcore.registerNS("pimcore.document.tags.wysiwyg");
pimcore.document.tags.wysiwyg = Class.create(pimcore.document.tag, {

    type: "wysiwyg",

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;
        this.setupWrapper();
        if (!options) {
            options = {};
        }

        this.initialOptions = Object.clone(options);

        if (!data) {
            data = "";
        }
        this.data = data;

        if (!options.width) {
            options.width = Ext.get(id).getWidth();
            if (options.width < 1) {
                options.width = 400;
            }
        }

        if (options.resize_disabled) {
            options.resize_enabled = false;
        }

        this.options = options;


        var textareaId = id + "_textarea";
        this.textarea = document.createElement("div");
        if(this.options["inline"] !== false) {
            this.textarea.setAttribute("contenteditable","true");
        }
        Ext.get(id).appendChild(this.textarea);

        Ext.get(id).insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');

        this.textarea.id = textareaId;
        this.textarea.innerHTML = data;
        
        var textareaHeight = 300;
        if (options.height) {
            textareaHeight = options.height;
        }

        var inactiveContainerWidth = options.width + "px";
        if (typeof options.width == "string" && options.width.indexOf("%") >= 0) {
            inactiveContainerWidth = options.width;
        }

        Ext.get(this.textarea).addClass("pimcore_wysiwyg_inactive");
        Ext.get(this.textarea).addClass("pimcore_wysiwyg");
        Ext.get(this.textarea).applyStyles("width: " + inactiveContainerWidth  + "; min-height: " + textareaHeight
                                                                                                + "px;");

        // if the width is a % value get the current width of the container in px for further processing
        if (typeof options.width == "string" && options.width.indexOf("%") >= 0) {
            this.options.width = Ext.get(this.textarea).getWidth();
            if (this.options.width < 1) {
                this.options.width = 400;
            }
            // apply the width again in px
            Ext.get(this.textarea).applyStyles("width: " + this.options.width + "px");
        }

        Ext.get(id).setStyle({
            width: options.width + "px"
        });

        
        // create mask for dnd, this is done here (in initialize) because we have to register the dom node in
        // dndZones which is used in startup.js
        var mask = document.createElement("div");
        Ext.getBody().appendChild(mask);
        mask = Ext.get(mask);

        var offset = Ext.get(id).getOffsetsTo(Ext.getBody());

        mask.addClass("pimcore_wysiwyg_mask");

        // single applyStyles because of IE, he doesn't like setStyle() here
        mask.applyStyles("top:" + offset[1] + "px;");
        mask.applyStyles("left:" + offset[0] + "px;");
        mask.applyStyles("width:" + options.width + "px;");
        mask.applyStyles("height:" + textareaHeight + "px;");
        mask.hide();


        // register at global DnD manager
        dndManager.addDropTarget(mask, this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

        this.maskEl = mask;

        if(this.options["inline"] === false) {
            Ext.get(this.textarea).on("click", this.startCKeditor.bind(this));
        } else {
            this.startCKeditor();
        }
    },

    mask: function () {
        var offset = Ext.get(this.id).getOffsetsTo(Ext.getBody());

        this.maskEl.setStyle({
            width: this.options.width + "px",
            height: Ext.get(this.id).getHeight() + "px",
            top: offset[1] + "px",
            left: offset[0] + "px",
            backgroundColor: "#ff6600"
        });
        this.maskEl.show();
    },

    unmask: function () {
        this.maskEl.hide();
    },

    startCKeditor: function () {
        
        try {
            if(this.options["inline"] === false) {
                Ext.get(this.textarea).un("click", this.startCKeditor.bind(this));
                Ext.get(this.textarea).removeClass("pimcore_wysiwyg_inactive");
            }

            CKEDITOR.config.language = pimcore.globalmanager.get("user").language;

            // IE Hack see: http://dev.ckeditor.com/ticket/9958
            // problem is that every button in a CKEDITOR window fires the onbeforeunload event
            CKEDITOR.on('instanceReady', function (event) {
                event.editor.on('dialogShow', function (dialogShowEvent) {
                    if (CKEDITOR.env.ie) {
                        $(dialogShowEvent.data._.element.$).find('a[href*="void(0)"]').removeAttr('href');
                    }
                });
            });

            var eConfig = Object.clone(this.options);

            // if there is no toolbar defined use Full which is defined in CKEDITOR.config.toolbar_Full, possible
            // is also Basic
            if (!this.options["toolbar"] && !this.options["toolbarGroups"]) {
                eConfig.toolbarGroups = [
                    { name: 'clipboard', groups: [ "sourcedialog", 'clipboard', 'undo', "find" ] },
                    { name: 'basicstyles', groups: [ 'basicstyles', 'list'] },
                    '/',
                    { name: 'paragraph', groups: [ 'align', 'indent'] },
                    { name: 'blocks' },
                    { name: 'links' },
                    { name: 'insert' },
                    "/",
                    { name: 'styles' },
                    { name: 'tools', groups: ['colors', "tools", 'cleanup', 'mode', "others"] }
                ];
            }

            delete eConfig.width;

            var removePluginsAdd = "";
            if(eConfig.removePlugins) {
                removePluginsAdd = "," + eConfig.removePlugins;
            }

            eConfig.removePlugins = 'about,placeholder,flash,smiley,scayt,save,print,preview,newpage,maximize,forms,'
                    + 'filebrowser,templates,divarea,bgcolor,magicline' + removePluginsAdd;
            eConfig.entities = false;
            eConfig.entities_greek = false;
            eConfig.entities_latin = false;
            eConfig.allowedContent = true; // disables CKEditor ACF (will remove pimcore_* attributes from links, etc.)
            eConfig.resize_minWidth = this.options.width - 2;
            eConfig.resize_maxWidth = this.options.width - 2;

            if(this.options["inline"] === false) {
                if(this.options["height"]) {
                    eConfig.removePlugins += ",autogrow";
                } else {
                    eConfig.autogrow = true;
                }
                this.ckeditor = CKEDITOR.replace(this.textarea, eConfig);
            } else {
                if(!this.options['extraPlugins'] || this.options['extraPlugins']== ''){
                    eConfig.extraPlugins = "sourcedialog";
                }else{
                    if(this.options['extraPlugins'].indexOf("sourcedialog") == -1){
                        eConfig.extraPlugins += ",sourcedialog";
                    }
                }
                this.ckeditor = CKEDITOR.inline(this.textarea, eConfig);

                this.ckeditor.on('focus', function () {
                    Ext.get(this.textarea).removeClass("pimcore_wysiwyg_inactive");
                }.bind(this));

                this.ckeditor.on('blur', function () {
                    Ext.get(this.textarea).addClass("pimcore_wysiwyg_inactive");
                }.bind(this));

                // HACK - clean all pasted html
                this.ckeditor.on('paste', function(evt) {
                    evt.data.dataValue = '<!--class="Mso"-->' + evt.data.dataValue;
                }, null, null, 1);
            }
        }
        catch (e) {
            console.log(e);
        }
    },

    endCKeditor : function (force) {

        if (this.ckeditor && (this.options["inline"] === false || force === true)) {
            this.data = this.ckeditor.getData();

            this.ckeditor.destroy();
            this.ckeditor = null;

            Ext.get(this.textarea).on("click", this.startCKeditor.bind(this));
            Ext.get(this.textarea).addClass("pimcore_wysiwyg_inactive");
        }
    },

    onNodeDrop: function (target, dd, e, data) {

        if (!this.ckeditor ||!this.dndAllowed(data)) {
            return;
        }

        var wrappedText = data.node.attributes.text;
        var textIsSelected = false;
        
        try {
            var selection = this.ckeditor.getSelection();
            var bookmarks = selection.createBookmarks();
            var range = selection.getRanges()[ 0 ];
            var fragment = range.clone().cloneContents();

            selection.selectBookmarks(bookmarks);
            var retval = "";
            var childList = fragment.getChildren();
            var childCount = childList.count();

            for (var i = 0; i < childCount; i++) {
                var child = childList.getItem(i);
                retval += ( child.getOuterHtml ?
                        child.getOuterHtml() : child.getText() );
            }

            if (retval.length > 0) {
                wrappedText = retval;
                textIsSelected = true;
            }
        }
        catch (e2) {
        }

        // remove existing links out of the wrapped text
        wrappedText = wrappedText.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function ($0, $1) {
            if($1.toLowerCase() == "a") {
                return "";
            }
            return $0;
        });

        var insertEl = null;
        var id = data.node.attributes.id;
        var uri = data.node.attributes.path;
        var browserPossibleExtensions = ["jpg","jpeg","gif","png"];

        if (data.node.attributes.elementType == "asset") {
            if (data.node.attributes.type == "image" && textIsSelected == false) {
                // images bigger than 600px or formats which cannot be displayed by the browser directly will be
                // converted by the pimcore thumbnailing service so that they can be displayed in the editor
                var defaultWidth = 600;
                var additionalAttributes = "";

                if(typeof data.node.attributes.imageWidth != "undefined") {
                    uri = "/admin/asset/get-image-thumbnail/id/" + id + "/width/" + defaultWidth + "/aspectratio/true";
                    if(data.node.attributes.imageWidth < defaultWidth
                            && in_arrayi(pimcore.helpers.getFileExtension(data.node.attributes.text),
                                        browserPossibleExtensions)) {
                        uri = data.node.attributes.path;
                        additionalAttributes += ' pimcore_disable_thumbnail="true"';
                    }

                    if(data.node.attributes.imageWidth < defaultWidth) {
                        defaultWidth = data.node.attributes.imageWidth;
                    }

                    additionalAttributes += ' style="width:' + defaultWidth + 'px;"';
                }

                insertEl = CKEDITOR.dom.element.createFromHtml('<img src="'
                            + uri + '" pimcore_type="asset" pimcore_id="' + id + '" ' + additionalAttributes + ' />');
                this.ckeditor.insertElement(insertEl);
                return true;
            }
            else {
                insertEl = CKEDITOR.dom.element.createFromHtml('<a href="' + uri
                            + '" target="_blank" pimcore_type="asset" pimcore_id="' + id + '">' + wrappedText + '</a>');
                this.ckeditor.insertElement(insertEl);
                return true;
            }
        }

        if (data.node.attributes.elementType == "document" && (data.node.attributes.type=="page"
                            || data.node.attributes.type=="hardlink" || data.node.attributes.type=="link")){
            insertEl = CKEDITOR.dom.element.createFromHtml('<a href="' + uri + '" pimcore_type="document" pimcore_id="'
                                                                        + id + '">' + wrappedText + '</a>');
            this.ckeditor.insertElement(insertEl);
            return true;
        }

    },

    onNodeOver: function(target, dd, e, data) {
        if (this.dndAllowed(data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },


    dndAllowed: function(data) {

        if (data.node.attributes.elementType == "document" && (data.node.attributes.type=="page"
                            || data.node.attributes.type=="hardlink" || data.node.attributes.type=="link")){
            return true;
        } else if (data.node.attributes.elementType=="asset" && data.node.attributes.type != "folder"){
            return true;
        }

        return false;

    },


    getValue: function () {

        var value = this.data;

        if (this.ckeditor) {
            value = this.ckeditor.getData();
        }

        this.data = value;

        return value;
    },

    getType: function () {
        return "wysiwyg";
    }
});


CKEDITOR.disableAutoInline = true;

function closeCKeditors() {
    for (var i = 0; i < editables.length; i++) {
        if (editables[i].getType() == "wysiwyg") {
            editables[i].endCKeditor();
        }
    }
}



/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.renderlet");
pimcore.document.tags.renderlet = Class.create(pimcore.document.tag, {

    defaultHeight: 100,

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.options = options;

        this.data = {};

        if (!this.options) {
            this.options = {};
        }
        if (!data) {
            data = {};
        }

        // cast array to object
        this.options = Ext.apply({}, this.options);

        // height management
        this.defaultHeight = 100;
        if (this.options.defaultHeight) {
            this.defaultHeight = this.options.defaultHeight;
        }
        if (!this.options.height && !data.path) {
            this.options.height = this.defaultHeight;
        }

        this.setupWrapper();

        this.options.name = id + "_editable";
        this.options.border = false;
        this.options.bodyStyle = "min-height: 40px;";

        this.element = new Ext.Panel(this.options);

        this.element.on("render", function (el) {
            
            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

            this.getBody().setStyle({
                overflow: "auto"
            });

            this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');
            this.getBody().addClass("pimcore_tag_snippet_empty");

            el.getEl().on("contextmenu", this.onContextMenu.bind(this));

        }.bind(this));

        this.element.render(id);
        
        // insert snippet content
        if (data) {
            this.data = data;
            if (this.data.id) {
                this.updateContent();
            }
        }
    },

    onNodeDrop: function (target, dd, e, data) {

        // get path from nodes data
        this.data.id = data.node.attributes.id;
        this.data.type = data.node.attributes.elementType;
        this.data.subtype = data.node.attributes.type;

        if (this.options.reload) {
            this.reloadDocument();
        } else {
            this.updateContent();
        }

        return true;
    },

    onNodeOver: function(target, dd, e, data) {

        return Ext.dd.DropZone.prototype.dropAllowed;

    },

    getBody: function () {
        // get the id from the body element of the panel because there is no method to set body's html
        // (only in configure)
        var bodyId = this.element.getEl().query(".x-panel-body")[0].getAttribute("id");
        return Ext.get(bodyId);
    },

    updateContent: function (path) {

        this.getBody().removeClass("pimcore_tag_snippet_empty");
        this.getBody().dom.innerHTML = '<br />&nbsp;&nbsp;Loading ...';

        var params = this.data;
        Ext.apply(params, this.options);

        Ext.Ajax.request({
            method: "get",
            url: "/pimcore_document_tag_renderlet",
            success: function (response) {
                this.getBody().dom.innerHTML = response.responseText;
                this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');
                this.updateDimensions();
            }.bind(this),
            params: params
        });
    },

    updateDimensions: function () {
        this.getBody().setStyle({
            height: "auto"
        });
    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.data["id"]) {
            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: "pimcore_icon_delete",
                handler: function () {
                    var height = this.options.height;
                    if (!height) {
                        height = this.defaultHeight;
                    }
                    this.data = {};
                    this.getBody().update('');
                    this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');
                    this.getBody().addClass("pimcore_tag_snippet_empty");
                    this.getBody().setHeight(height + "px");

                    if (this.options.reload) {
                        this.reloadDocument();
                    }

                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "pimcore_icon_open",
                handler: function () {
                    if(this.data.id) {
                        pimcore.helpers.openElement(this.data.id, this.data.type, this.data.subtype);
                    }
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('show_in_tree'),
                iconCls: "pimcore_icon_fileexplorer",
                handler: function (item) {
                    item.parentMenu.destroy();
                    pimcore.helpers.selectElementInTree(this.data.type, this.data.id);
                }.bind(this)
            }));
        }
        
        menu.add(new Ext.menu.Item({
            text: t('search'),
            iconCls: "pimcore_icon_search",
            handler: function (item) {
                item.parentMenu.destroy();
                
                this.openSearchEditor();
            }.bind(this)
        }));
        

        menu.showAt(e.getXY());

        e.stopEvent();
    },
    
    openSearchEditor: function () {
        pimcore.helpers.itemselector(false, this.addDataFromSelector.bind(this), {});
    },
    
    addDataFromSelector: function (item) {        
        if(item) {
            // get path from nodes data
            this.data.id = item.id;
            this.data.type = item.type;
            this.data.subtype = item.subtype;

            if (this.options.reload) {
                this.reloadDocument();
            } else {
                this.updateContent();
            }
        }
    },
    
    getValue: function () {
        return this.data;
    },

    getType: function () {
        return "renderlet";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.table");
pimcore.document.tags.table = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;
        this.setupWrapper();
        if (!options) {
            options = {};
        }

        if (!data) {
            data = [
                [" "]
            ];
            if (options.defaults) {
                if (options.defaults.cols) {
                    for (var i = 0; i < (options.defaults.cols - 1); i++) {
                        data[0].push(" ");
                    }
                }
                if (options.defaults.rows) {
                    for (var i = 0; i < (options.defaults.rows - 1); i++) {
                        data.push(data[0]);
                    }
                }
                if (options.defaults.data) {
                    data = options.defaults.data;
                }
            }
        }

        options.value = data;
        options.name = id + "_editable";
        options.frame = true;
        options.layout = "fit";

        this.options = options;

        if (!this.panel) {
            this.panel = new Ext.Panel(this.options);
        }

        this.panel.render(id);

        this.initStore(data);

        this.initGrid();
    },

    initGrid: function () {

        this.panel.removeAll();

        var data = this.store.queryBy(function(record, id) {
            return true;
        });
        var columns = [];

        if (data.items[0]) {
            var keys = Object.keys(data.items[0].data);

            for (var i = 0; i < keys.length; i++) {
                columns.push({
                    dataIndex: keys[i],
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                });
            }
        }


        this.grid = new Ext.grid.EditorGridPanel({
            store: this.store,
            width: 700,
            height: 300,
            columns:columns,
            stripeRows: true,
            columnLines: true,
            clicksToEdit: 2,
            autoHeight: true,
            tbar: [
                {
                    iconCls: "pimcore_tag_table_addcol",
                    handler: this.addColumn.bind(this)
                },
                {
                    iconCls: "pimcore_tag_table_delcol",
                    handler: this.deleteColumn.bind(this)
                },
                {
                    iconCls: "pimcore_tag_table_addrow",
                    handler: this.addRow.bind(this)
                },
                {
                    iconCls: "pimcore_tag_table_delrow",
                    handler: this.deleteRow.bind(this)
                },
                {
                    iconCls: "pimcore_tag_table_empty",
                    handler: this.initStore.bind(this, [
                        [" "]
                    ])
                }
            ]
        });
        this.panel.add(this.grid);
        this.panel.doLayout();
    },

    initStore: function (data) {
        var storeFields = [];
        if (data[0]) {
            for (var i = 0; i < data[0].length; i++) {
                storeFields.push({
                    name: "col_" + i
                });
            }
        }

        this.store = new Ext.data.ArrayStore({
            fields: storeFields
        });

        this.store.loadData(data);
        this.initGrid();
    },

    addColumn : function  () {

        var currentData = this.getValue();

        for (var i = 0; i < currentData.length; i++) {
            currentData[i].push(" ");
        }

        this.initStore(currentData);
    },

    addRow: function  () {
        var initData = {};

        for (var o = 0; o < this.grid.getColumnModel().config.length; o++) {
            initData["col_" + o] = " ";
        }

        this.store.add(new this.store.recordType(initData, this.store.getCount() + 1));
    },

    deleteRow : function  () {
        var selected = this.grid.getSelectionModel();
        if (selected.selection) {
            this.store.remove(selected.selection.record);
        }
    },

    deleteColumn: function () {
        var selected = this.grid.getSelectionModel();

        if (selected.selection) {
            var column = selected.selection.cell[1];

            var currentData = this.getValue();

            for (var i = 0; i < currentData.length; i++) {
                currentData[i].splice(column, 1);
            }

            this.initStore(currentData);
        }
    },

    getValue: function () {
        var data = this.store.queryBy(function(record, id) {
            return true;
        });

        var storedData = [];
        var tmData = [];
        for (var i = 0; i < data.items.length; i++) {
            tmData = [];

            var keys = Object.keys(data.items[i].data);
            for (var u = 0; u < keys.length; u++) {
                tmData.push(data.items[i].data[keys[u]]);
            }
            storedData.push(tmData);
        }

        return storedData;
    },

    getType: function () {
        return "table";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.video");
pimcore.document.tags.video = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.data = {};

        if (!options) {
            options = {};
            options = {};
        }

        this.options = options;
        this.data = data;

        this.setupWrapper();

        var element = Ext.get("pimcore_video_" + name);
        element.insertHtml("afterBegin", '<div class="pimcore_video_edit_button"></div>');

        var button = new Ext.Button({
            iconCls: "pimcore_icon_edit_video",
            cls: "pimcore_edit_link_button",
            handler: this.openEditor.bind(this)
        });
        button.render(Ext.get(Ext.query(".pimcore_video_edit_button", element.dom)[0]));
    },

    openEditor: function () {

        this.fieldPath = new Ext.form.TextField({
            fieldLabel: t('path'),
            value: this.data.path,
            name: "path",
            width: 320,
            cls: "pimcore_droptarget_input",
            enableKeyEvents: true,
            listeners: {
                keyup: function (el) {
                    if(el.getValue().indexOf("you") >= 0 && el.getValue().indexOf("http") >= 0) {
                        this.form.getComponent("type").setValue("youtube");
                    } else if (el.getValue().indexOf("vim") >= 0 && el.getValue().indexOf("http") >= 0) {
                        this.form.getComponent("type").setValue("vimeo");
                    }
                }.bind(this)
            }
        });

        this.poster = new Ext.form.TextField({
            fieldLabel: t('poster_image'),
            value: this.data.poster,
            name: "poster",
            width: 320,
            cls: "pimcore_droptarget_input",
            enableKeyEvents: true,
            listeners: {
                keyup: function (el) {
                    //el.setValue(this.data.poster)
                }.bind(this)
            }
        });

        var initDD = function (el) {
            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));
        };

        this.fieldPath.on("render", initDD.bind(this));
        this.poster.on("render", initDD.bind(this));

        this.searchButton = new Ext.Button({
            iconCls: "pimcore_icon_search",
            handler: this.openSearchEditor.bind(this)
        });

        this.form = new Ext.FormPanel({
            bodyStyle: "padding:10px;",
            items: [{
                xtype: "combo",
                itemId: "type",
                fieldLabel: t('type'),
                name: 'type',
                triggerAction: 'all',
                editable: true,
                mode: "local",
                store: ["asset","youtube","vimeo"],
                value: this.data.type,
                listeners: {
                    select: function (combo) {
                        var type = combo.getValue();
                        this.updateType(type);
                    }.bind(this)
                }
            }, {
                xtype: "compositefield",
                itemId: "pathContainer",
                items: [this.fieldPath, this.searchButton]
            }, this.poster,{
                xtype: "textfield",
                name: "title",
                fieldLabel: t('title'),
                width: 320,
                value: this.data.title
            },{
                xtype: "textarea",
                name: "description",
                fieldLabel: t('description'),
                width: 320,
                height: 50,
                value: this.data.description
            }],
            buttons: [
                {
                    text: t("cancel"),
                    listeners:  {
                        "click": this.cancel.bind(this)
                    }
                },
                {
                    text: t("save"),
                    listeners: {
                        "click": this.save.bind(this)
                    },
                    icon: "/pimcore/static/img/icon/tick.png"
                }
            ]
        });


        this.window = new Ext.Window({
            modal: true,
            width: 500,
            height: 250,
            title: t("video"),
            items: [this.form],
            layout: "fit",
            listeners: {
                afterrender: function () {
                    this.updateType(this.data.type);
                }.bind(this)
            }
        });
        this.window.show();
    },

    updateType: function (type) {
        this.searchButton.enable();
        var labelEl = this.form.getComponent("pathContainer").label;
        labelEl.update(t("path"));

        if(type != "asset") {
            this.searchButton.disable();
        }
        if(type == "youtube") {
            labelEl.update("URL / ID");
        }
        if(type == "vimeo") {
            labelEl.update("URL");
        }
    },

    onNodeDrop: function (target, dd, e, data) {

        if(target) {
            if(target.getAttribute("name") == "path") {
                if(this.dndAllowedPath(data)){
                    this.fieldPath.setValue(data.node.attributes.path);
                    this.form.getComponent("type").setValue("asset");
                    return true;
                }
            } else if (target.getAttribute("name") == "poster") {
                if(this.dndAllowedPoster(data)){
                    this.poster.setValue(data.node.attributes.path);
                    return true;
                }
            }
        }

        return false;
    },

    onNodeOver: function(target, dd, e, data) {

        var check = "dndAllowedPath";
        if (target && target.getAttribute("name") == "poster") {
            check = "dndAllowedPoster";
        }

        if (this[check](data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    dndAllowedPath: function(data) {

        if (data.node.attributes.elementType == "asset" && data.node.attributes.type == "video") {
            return true;
        }
        return false;
    },

    dndAllowedPoster: function(data) {

        if (data.node.attributes.elementType == "asset" && data.node.attributes.type == "image") {
            return true;
        }
        return false;
    },

    openSearchEditor: function () {
        pimcore.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: ["asset"],
            subtype: {
                asset: ["video"]
            }
        });
    },

    addDataFromSelector: function (item) {
        if (item) {
            this.fieldPath.setValue(item.fullpath);
            return true;
        }
    },

    save: function () {

        // close window
        this.window.hide();

        var values = this.form.getForm().getFieldValues();
        this.data = values;



        this.reloadDocument();
    },

    cancel: function () {
        this.window.hide();
    },

    getValue: function () {
        return this.data;
    },

    getType: function () {
        return "video";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.multiselect");
pimcore.document.tags.multiselect = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;

        this.setupWrapper();


        options.name = id + "_editable";
        options.value = data;

        options.listeners = {};
        // onchange event
        if (options.onchange) {
            options.listeners.change = eval(options.onchange);
        }

        if (options["reload"]) {
            options.listeners.change = this.reloadDocument;
        }

        this.element = new Ext.ux.form.MultiSelect(options);

        this.element.render(id);
    },

    getValue: function () {
        return this.element.getValue();
    },

    getType: function () {
        return "multiselect";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.areablock");
pimcore.document.tags.areablock = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;
        this.elements = [];
        this.options = options;

        this.toolbarGlobalVar = this.getType() + "toolbar";

        if(typeof this.options["toolbar"] == "undefined" || this.options["toolbar"] != false) {
            this.createToolBar();
        }

        var plusButton, minusButton, upButton, downButton, optionsButton, plusDiv, minusDiv, upDiv, downDiv, optionsDiv,
            typemenu, typeDiv, typebuttontext, editDiv, editButton;
        this.elements = Ext.get(id).query("div." + name + "[key]");

        // reload or not => default not
        if(typeof this.options["reload"] == "undefined") {
            this.options.reload = false;
        }

        // type mapping
        var typeNameMappings = {};
        this.allowedTypes = []; // this is for the toolbar to check if an brick can be dropped to this areablock
        for (var i=0; i<this.options.types.length; i++) {
            typeNameMappings[this.options.types[i].type] = {
                name: this.options.types[i].name,
                description: this.options.types[i].description,
                icon: this.options.types[i].icon
            };

            this.allowedTypes.push(this.options.types[i].type);
        }

        var limitReached = false;
        if(typeof options["limit"] != "undefined" && this.elements.length >= options.limit) {
            limitReached = true;
        }


        if (this.elements.length < 1) {
            this.createInitalControls();
        }
        else {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].key = this.elements[i].getAttribute("key");
                this.elements[i].type = this.elements[i].getAttribute("type");

                // edit button
                try {
                    editDiv = Ext.get(this.elements[i]).query(".pimcore_area_edit_button_" + this.name)[0];
                    if(editDiv) {
                    editButton = new Ext.Button({
                        cls: "pimcore_block_button_plus",
                        iconCls: "pimcore_icon_edit",
                        handler: this.editmodeOpen.bind(this, this.elements[i])
                    });
                    editButton.render(editDiv);
                    }
                } catch (e) {}

                if(!limitReached) {
                    // plus button
                    plusDiv = Ext.get(this.elements[i]).query(".pimcore_block_plus_" + this.name)[0];
                    plusButton = new Ext.Button({
                        cls: "pimcore_block_button_plus",
                        iconCls: "pimcore_icon_plus",
                        menu: [this.getTypeMenu(this, this.elements[i])],
                        listeners: {
                            /*"menushow": function () {
                                Ext.get(this).addClass("pimcore_tag_areablock_force_show_buttons");
                            }.bind(this.elements[i]),
                            "menuhide": function () {
                                Ext.get(this).removeClass("pimcore_tag_areablock_force_show_buttons");
                            }.bind(this.elements[i])*/
                        }
                    });
                    plusButton.render(plusDiv);
                }

                // minus button
                minusDiv = Ext.get(this.elements[i]).query(".pimcore_block_minus_" + this.name)[0];
                minusButton = new Ext.Button({
                    cls: "pimcore_block_button_minus",
                    iconCls: "pimcore_icon_minus",
                    listeners: {
                        "click": this.removeBlock.bind(this, this.elements[i])
                    }
                });
                minusButton.render(minusDiv);

                // up button
                upDiv = Ext.get(this.elements[i]).query(".pimcore_block_up_" + this.name)[0];
                upButton = new Ext.Button({
                    cls: "pimcore_block_button_up",
                    iconCls: "pimcore_icon_up",
                    listeners: {
                        "click": this.moveBlockUp.bind(this, this.elements[i])
                    }
                });
                upButton.render(upDiv);

                // down button
                downDiv = Ext.get(this.elements[i]).query(".pimcore_block_down_" + this.name)[0];
                downButton = new Ext.Button({
                    cls: "pimcore_block_button_down",
                    iconCls: "pimcore_icon_down",
                    listeners: {
                        "click": this.moveBlockDown.bind(this, this.elements[i])
                    }
                });
                downButton.render(downDiv);

                // type button
                typebuttontext = "<b>"  + this.elements[i].type + "</b>";
                if(typeNameMappings[this.elements[i].type]
                                        && typeof typeNameMappings[this.elements[i].type].name != "undefined") {
                    typebuttontext = "<b>" + typeNameMappings[this.elements[i].type].name + "</b> "
                                                + typeNameMappings[this.elements[i].type].description;
                }

                typeDiv = Ext.get(this.elements[i]).query(".pimcore_block_type_" + this.name)[0];
                var typeButton = new Ext.Button({
                    cls: "pimcore_block_button_type",
                    text: typebuttontext,
                    handleMouseEvents: false,
                    tooltip: t("drag_me"),
                    icon: "/pimcore/static/img/icon/arrow_nw_ne_sw_se.png",
                    style: "cursor: move;"
                });
                typeButton.on("afterrender", function (index, v) {

                    var element = this.elements[index];

                    v.dragZone = new Ext.dd.DragZone(v.getEl(), {
                        hasOuterHandles: true,
                        getDragData: function(e) {
                            closeCKeditors();

                            var sourceEl = element;
                            var proxyEl = null;

                            /*if(Ext.get(element).getHeight() > 300 || Ext.get(element).getWidth() > 900) {
                                // use the button as proxy if the area itself is to big
                                proxyEl = v.getEl().dom;
                            } else {
                                proxyEl = element;
                            }*/

                            // only use the button as proxy element
                            proxyEl = v.getEl().dom;

                            if (sourceEl) {
                                var d = proxyEl.cloneNode(true);
                                d.id = Ext.id();

                                return v.dragData = {
                                    sourceEl: sourceEl,
                                    repairXY: Ext.fly(sourceEl).getXY(),
                                    ddel: d
                                };
                            }
                        },

                        onStartDrag: this.createDropZones.bind(this),
                        afterDragDrop: this.removeDropZones.bind(this),
                        afterInvalidDrop: this.removeDropZones.bind(this),

                        getRepairXY: function() {
                            return this.dragData.repairXY;
                        }
                    });
                }.bind(this, i));
                typeButton.render(typeDiv);


                // option button
                optionsDiv = Ext.get(this.elements[i]).query(".pimcore_block_options_" + this.name)[0];
                optionsButton = new Ext.Button({
                    cls: "pimcore_block_button_options",
                    iconCls: "pimcore_icon_options",
                    listeners: {
                        "click": this.optionsClickhandler.bind(this, this.elements[i])
                    }
                });
                optionsButton.render(optionsDiv);


                /*
                Ext.get(this.elements[i]).on("mouseenter", function () {
                    Ext.get(this.query(".pimcore_block_buttons")[0]).show();
                });
                Ext.get(this.elements[i]).on("mouseleave", function () {
                    Ext.get(this.query(".pimcore_block_buttons")[0]).hide();
                });
                */
            }
        }
    },

    copyToClipboard: function (element) {
        var ea;
        var areaIdentifier = {name: this.getName(), key: element.getAttribute("key")};
        var item = {
            identifier: areaIdentifier,
            type: element.getAttribute("type"),
            values: {}
        };

        // check which editables are inside this area and get the data
        for (var i = 0; i < editables.length; i++) {
            try {
                ea = editables[i];
                if (ea.getName().indexOf(areaIdentifier["name"] + areaIdentifier["key"]) > 0 && ea.getName() && !ea.getInherited()) {
                    item.values[ea.getName()] = {};
                    item.values[ea.getName()].data = ea.getValue();
                    item.values[ea.getName()].type = ea.getType();
                }
            } catch (e) { }
        }

        pimcore.globalmanager.add("areablock_clipboard", item);
    },

    optionsClickhandler: function (element, btn, e) {
        var menu = new Ext.menu.Menu();

        if(element != false) {
            menu.add(new Ext.menu.Item({
                text: t('copy'),
                iconCls: "pimcore_icon_copy",
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.copyToClipboard(element);
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('cut'),
                iconCls: "pimcore_icon_cut",
                handler: function (item) {
                    item.parentMenu.destroy();
                    this.copyToClipboard(element);
                    this.removeBlock(element);
                }.bind(this)
            }));
        }

        if(pimcore.globalmanager.exists("areablock_clipboard")) {
            menu.add(new Ext.menu.Item({
                text: t('paste'),
                iconCls: "pimcore_icon_paste",
                handler: function (item) {
                    item.parentMenu.destroy();
                    var item = pimcore.globalmanager.get("areablock_clipboard");
                    var areaIdentifier = {name: this.getName(), key: (this.getNextKey()+1)};

                    // push the data as an object compatible to the pimcore.document.tag interface to the rest of
                    // available editables so that they get read by pimcore.document.edit.getValues()
                    Ext.iterate(item.values, function (key, value, object) {
                        editables.push({
                            getName: function () {
                                var newKey = key.replace(new RegExp(item["identifier"]["name"] + item["identifier"]["key"], "g"), areaIdentifier["name"] + areaIdentifier["key"]);
                                var tmpKey;

                                while(tmpKey != newKey) {
                                    tmpKey = newKey;
                                    newKey = newKey.replace(new RegExp(item["identifier"]["name"] + "_(.*)" + item["identifier"]["key"] + "_", "g"), areaIdentifier["name"] + "_$1" + areaIdentifier["key"] + "_");
                                }

                                return newKey;
                            },
                            getValue: function () {
                                return value["data"];
                            },
                            getInherited: function () {
                                return false;
                            },
                            getType: function () {
                                return value["type"];
                            }
                        });
                    });

                    this.addBlock(element, item.type);
                }.bind(this)
            }));
        }

        if(menu.items && menu.items.getCount()) {
            menu.showAt(e.getXY());
        }

        e.stopEvent();
    },

    setInherited: function ($super, inherited) {
        var elements = Ext.get(this.id).query(".pimcore_block_buttons_" + this.name);
        if(elements.length > 0) {
            for(var i=0; i<elements.length; i++) {
                $super(inherited, Ext.get(elements[i]));
            }
        }
    },

    createDropZones: function () {

        //Ext.get(this.id).addClass("pimcore_tag_areablock_hide_buttons");

        if(this.elements.length > 0) {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i]) {
                    if(i == 0) {
                        var b = Ext.DomHelper.insertBefore(this.elements[i], {
                            tag: "div",
                            index: i,
                            "class": "pimcore_area_dropzone"
                        });
                        this.addDropZoneToElement(b);
                    }
                    var a = Ext.DomHelper.insertAfter(this.elements[i], {
                        tag: "div",
                        index: i+1,
                        "class": "pimcore_area_dropzone"
                    });

                    this.addDropZoneToElement(a);
                }
            }
        } else {
            // this is only for inserting when no element is in the areablock
            var c = Ext.DomHelper.append(Ext.get(this.id), {
                tag: "div",
                index: i+1,
                "class": "pimcore_area_dropzone"
            });

            this.addDropZoneToElement(c);
        }

        // update body height on drag & drop (dnd)
        // set the body height again because adding the drop zones will usually change the height of the whole body
        pimcore.edithelpers.setBodyHeight();
    },

    addDropZoneToElement: function (el) {
        el.dropZone = new Ext.dd.DropZone(el, {

            getTargetFromEvent: function(e) {
                return el;
            },

            onNodeEnter : function(target, dd, e, data){
                Ext.fly(target).addClass('pimcore_area_dropzone_hover');
            },

            onNodeOut : function(target, dd, e, data){
                Ext.fly(target).removeClass('pimcore_area_dropzone_hover');
            },

            onNodeOver : function(target, dd, e, data){
                return Ext.dd.DropZone.prototype.dropAllowed;
            },

            onNodeDrop : function(target, dd, e, data){
                if(data.fromToolbar) {
                    this.addBlockAt(data.brick.type, target.getAttribute("index"));
                    return true;
                } else {
                    this.moveBlockTo(data.sourceEl, target.getAttribute("index"));
                    return true;
                }
            }.bind(this)
        });
    },

    removeDropZones: function () {

        //Ext.get(this.id).removeClass("pimcore_tag_areablock_hide_buttons");

        var dropZones = Ext.get(this.id).query("div.pimcore_area_dropzone");
        for(var i=0; i<dropZones.length; i++) {
            dropZones[i].dropZone.unreg();
            Ext.get(dropZones[i]).remove();
        }
    },
    
    createInitalControls: function () {
        
        var plusEl = document.createElement("div");
        plusEl.setAttribute("class", "pimcore_block_plus");

        var optionsEl = document.createElement("div");
        optionsEl.setAttribute("class", "pimcore_block_options");

        var clearEl = document.createElement("div");
        clearEl.setAttribute("class", "pimcore_block_clear");

        Ext.get(this.id).appendChild(plusEl);
        Ext.get(this.id).appendChild(optionsEl);
        Ext.get(this.id).appendChild(clearEl);

        // plus button
        var plusButton = new Ext.Button({
            cls: "pimcore_block_button_plus",
            iconCls: "pimcore_icon_plus",
            menu: [this.getTypeMenu(this, null)]
        });
        plusButton.render(plusEl);

        // plus button
        var optionsButton = new Ext.Button({
            cls: "pimcore_block_button_options",
            iconCls: "pimcore_icon_options",
            listeners: {
                click: this.optionsClickhandler.bind(this, false)
            }
        });
        optionsButton.render(optionsEl);
    },
    
    getTypeMenu: function (scope, element) {
        var menu = [];
        var groupMenu;

        if(typeof this.options.group != "undefined") {
            var groups = Object.keys(this.options.group);
            for (var g=0; g<groups.length; g++) {
                if(groups[g].length > 0) {
                    groupMenu = {
                        text: groups[g],
                        iconCls: "pimcore_icon_area",
                        hideOnClick: false,
                        menu: []
                    };

                    for (var i=0; i<this.options.types.length; i++) {
                        if(in_array(this.options.types[i].type,this.options.group[groups[g]])) {
                            groupMenu.menu.push(this.getMenuConfigForBrick(this.options.types[i], scope, element));
                        }
                    }
                    menu.push(groupMenu);
                }
            }
        } else {
            for (var i=0; i<this.options.types.length; i++) {
                menu.push(this.getMenuConfigForBrick(this.options.types[i], scope, element));
            }
        }

        return menu;
    },

    getMenuConfigForBrick: function (brick, scope, element) {
        var tmpEntry = {
            text: "<b>" + brick.name + "</b> | " + brick.description,
            iconCls: "pimcore_icon_area",
            listeners: {
                "click": this.addBlock.bind(scope, element, brick.type)
            }
        };

        if(brick.icon) {
            delete tmpEntry.iconCls;
            tmpEntry.icon = brick.icon;
        }

        return tmpEntry;
    },

    getNextKey: function () {
        var nextKey = 0;
        var currentKey;

        for (var i = 0; i < this.elements.length; i++) {
            currentKey = intval(this.elements[i].key);
            if (currentKey > nextKey) {
                nextKey = currentKey;
            }
        }

        return nextKey;
    },

    addBlock : function (element, type) {
        
        var index = this.getElementIndex(element) + 1;
        this.addBlockAt(type, index)
    },

    addBlockAt: function (type, index) {

        if(typeof this.options["limit"] != "undefined" && this.elements.length >= this.options.limit) {
            Ext.MessageBox.alert(t("error"), t("limit_reached"));
            return;
        }

        // get next heigher key
        var nextKey = this.getNextKey();
        var amount = 1;


        var args = [index, 0];

        for (var p = 0; p < amount; p++) {
            nextKey++;
            args.push({
                key: nextKey,
                type: type
            });
        }

        this.elements.splice.apply(this.elements, args);
        this.reloadDocument();
    },

    removeBlock: function (element) {

        var index = this.getElementIndex(element);

        this.elements.splice(index, 1);
        Ext.get(element).remove();

        // there is no existing block element anymore
        if (this.elements.length < 1) {
            this.createInitalControls();
        }

        // this is necessary because of the limit which is only applied when initializing
        this.reloadDocument();
    },

    moveBlockTo: function (block, toIndex) {

        //Ext.get(Ext.get(block).query(".pimcore_block_buttons")[0]).hide();

        toIndex = intval(toIndex);

        var currentIndex = this.getElementIndex(block);
        var tmpElements = [];

        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i] && this.elements[i] != block) {
                tmpElements.push(this.elements[i]);
            }
        }

        if(currentIndex < toIndex) {
            toIndex--;
        }

        tmpElements.splice(toIndex,0,block);

        var elementAfter = tmpElements[toIndex+1];
        if(elementAfter) {
            Ext.get(block).insertBefore(elementAfter);
        } else {
            // to the last position
            Ext.get(block).insertAfter(this.elements[this.elements.length-1]);
        }

        this.elements = tmpElements;

        if(this.options.reload) {
            this.reloadDocument();
        }
    },

    moveBlockDown: function (element) {

        var index = this.getElementIndex(element);

        if (index < (this.elements.length-1)) {
            this.moveBlockTo(element, index+2);
        }
    },

    moveBlockUp: function (element) {

        var index = this.getElementIndex(element);

        if (index > 0) {
            this.moveBlockTo(element, index-1);
        }
    },

    getElementIndex: function (element) {

        try {
            var key = Ext.get(element).dom.key;
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == key) {
                    var index = i;
                    break;
                }
            }
        }
        catch (e) {
            return 0;
        }

        return index;
    },


    editmodeOpen: function (element) {

        var content = Ext.get(element).query(".pimcore_area_editmode")[0];

        this.editmodeWindow = new Ext.Window({
            modal: true,
            width: 500,
            height: 330,
            title: "Edit Block",
            closeAction: "hide",
            bodyStyle: "padding: 10px;",
            closable: false,
            autoScroll: true,
            listeners: {
                afterrender: function (content) {
                    Ext.get(content).show();

                    var elements = Ext.get(content).query(".pimcore_editable");
                    for (var i=0; i<elements.length; i++) {
                        var name = elements[i].getAttribute("id").split("pimcore_editable_").join("");
                        for (var e=0; e<editables.length; e++) {
                            if(editables[e].getName() == name) {
                                if(editables[e].element) {
                                    if(typeof editables[e].element.doLayout == "function") {
                                        editables[e].element.doLayout();
                                    }
                                }
                                break;
                            }
                        }
                    }

                }.bind(this, content)
            },
            buttons: [{
                text: t("save"),
                listeners: {
                    "click": this.editmodeSave.bind(this)
                },
                icon: "/pimcore/static/img/icon/tick.png"
            }],
            contentEl: content
        });
        this.editmodeWindow.show();
    },

    editmodeSave: function () {
        this.editmodeWindow.close();

        this.reloadDocument();
    },

    createToolBar: function () {
        var areaBlockToolbarSettings = this.options["areablock_toolbar"];
        var buttons = [];
        var bricksInThisArea = [];
        var itemCount = 0;

        if(pimcore.document.tags[this.toolbarGlobalVar] != false
                                                && pimcore.document.tags[this.toolbarGlobalVar].itemCount) {
            itemCount = pimcore.document.tags[this.toolbarGlobalVar].itemCount;
        }

        for (var i=0; i<this.options.types.length; i++) {

            var brick = this.options.types[i];

            if(pimcore.document.tags[this.toolbarGlobalVar] != false) {
                if(!in_array(brick.type, pimcore.document.tags[this.toolbarGlobalVar].bricks)) {
                    bricksInThisArea.push(brick.type);
                } else {
                    continue;
                }
            } else {
                bricksInThisArea.push(brick.type);
            }

            itemCount++;


            if(!brick.icon) {
                // this contains fallback-icons
                var iconStore = ["flag_black","flag_blue","flag_checked","flag_france","flag_green","flag_grey",
                    "flag_orange","flag_pink","flag_purple","flag_red","flag_white","flag_yellow",
                    "award_star_bronze_1","award_star_bronze_2","award_star_bronze_3","award_star_gold_1",
                    "award_star_gold_1","award_star_gold_1","award_star_silver_1","award_star_silver_2",
                    "award_star_silver_3","medal_bronze_1","medal_bronze_2","medal_bronze_3","medal_gold_1",
                    "medal_gold_1","medal_gold_1","medal_silver_1","medal_silver_2","medal_silver_3"];
                brick.icon = "/pimcore/static/img/icon/" + iconStore[itemCount] + ".png";
            }

            var maxButtonCharacters = areaBlockToolbarSettings.buttonMaxCharacters;
            buttons.push({
                xtype: "button",
                tooltip: "<b>" + brick.name + "</b><br />" + brick.description,
                icon: brick.icon,
                text: brick.name.length > maxButtonCharacters ? brick.name.substr(0,maxButtonCharacters) + "..."
                                                                                                : brick.name,
                width: areaBlockToolbarSettings.buttonWidth,
                listeners: {
                    "afterrender": function (brick, v) {

                        v.dragZone = new Ext.dd.DragZone(v.getEl(), {
                            getDragData: function(e) {
                                closeCKeditors();
                                var sourceEl = v.getEl().dom;
                                if (sourceEl) {
                                    d = sourceEl.cloneNode(true);
                                    d.id = Ext.id();
                                    return v.dragData = {
                                        sourceEl: sourceEl,
                                        repairXY: Ext.fly(sourceEl).getXY(),
                                        ddel: d,
                                        fromToolbar: true,
                                        brick: brick
                                    }
                                }
                            },

                            onStartDrag: function () {
                                var areablocks = pimcore.document.tags[this.toolbarGlobalVar].areablocks;
                                for(var i=0; i<areablocks.length; i++) {
                                    if(in_array(brick.type, areablocks[i].allowedTypes)) {
                                        areablocks[i].createDropZones();
                                    }
                                }
                            }.bind(this),
                            afterDragDrop: function () {
                                var areablocks = pimcore.document.tags[this.toolbarGlobalVar].areablocks;
                                for(var i=0; i<areablocks.length; i++) {
                                    areablocks[i].removeDropZones();
                                }
                            }.bind(this),
                            afterInvalidDrop: function () {
                                var areablocks = pimcore.document.tags[this.toolbarGlobalVar].areablocks;
                                for(var i=0; i<areablocks.length; i++) {
                                    areablocks[i].removeDropZones();
                                }
                            }.bind(this),

                            getRepairXY: function() {
                                return this.dragData.repairXY;
                            }
                        });
                    }.bind(this, brick)
                }
            });
        }

        // only initialize the toolbar once, even when there are more than one area on the page
        if(pimcore.document.tags[this.toolbarGlobalVar] == false) {

            var x = areaBlockToolbarSettings["x"];
            if(areaBlockToolbarSettings["xAlign"] == "right") {
                x = Ext.getBody().getWidth()-areaBlockToolbarSettings["x"]-areaBlockToolbarSettings["width"];
            }

            var toolbar = new Ext.Window({
                title: areaBlockToolbarSettings.title,
                width: areaBlockToolbarSettings.width,
                border:false,
                shadow: false,
                resizable: false,
                autoHeight: true,
                style: "position:fixed;",
                collapsible: true,
                cls: "pimcore_areablock_toolbar",
                closable: false,
                x: x,
                y: areaBlockToolbarSettings["y"],
                items: [buttons],
                listeners: {
                    move: function (win, x, y) {
                        var scroll = Ext.getBody().getScroll();
                        win.getEl().setStyle("top", y - scroll.top + "px");
                        win.getEl().setStyle("left", x - scroll.left + "px");
                    }
                }
            });

            toolbar.show();

            pimcore.document.tags[this.toolbarGlobalVar] = {
                toolbar: toolbar,
                bricks: bricksInThisArea,
                areablocks: [this],
                itemCount: buttons.length
            };
        } else {
            pimcore.document.tags[this.toolbarGlobalVar].toolbar.add(buttons);
            pimcore.document.tags[this.toolbarGlobalVar].bricks =
                                    array_merge(pimcore.document.tags[this.toolbarGlobalVar].bricks, bricksInThisArea);
            pimcore.document.tags[this.toolbarGlobalVar].itemCount += buttons.length;
            pimcore.document.tags[this.toolbarGlobalVar].areablocks.push(this);
            pimcore.document.tags[this.toolbarGlobalVar].toolbar.doLayout();
        }

    },

    getValue: function () {
        var data = [];
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i]) {
                if (this.elements[i].key) {
                    data.push({
                        key: this.elements[i].key,
                        type: this.elements[i].type
                    });
                }
            }
        }

        return data;
    },

    getType: function () {
        return "areablock";
    }
});

pimcore.document.tags.areablocktoolbar = false;



/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.area");
pimcore.document.tags.area = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;
        this.elements = [];
        this.options = options;

        // edit button
        try {
            var editDiv = Ext.get(id).query(".pimcore_area_edit_button")[0];
            var editButton = new Ext.Button({
                cls: "pimcore_block_button_plus",
                iconCls: "pimcore_icon_edit",
                handler: this.editmodeOpen.bind(this, Ext.get(id))
            });
            editButton.render(editDiv);
        } catch (e) {
            console.log(e);
        }

    },

    setInherited: function ($super, inherited) {
        // disable masking for this datatype (overwrite), because it's actually not needed, otherwise call $super()
        this.inherited = inherited;
    },

    editmodeOpen: function (element) {

        var content = Ext.get(element).query(".pimcore_area_editmode")[0];

        this.editmodeWindow = new Ext.Window({
            modal: true,
            width: 500,
            height: 330,
            title: "Edit Block",
            closeAction: "hide",
            bodyStyle: "padding: 10px;",
            closable: false,
            autoScroll: true,
            listeners: {
                afterrender: function (content) {
                    Ext.get(content).show();

                    var elements = Ext.get(content).query(".pimcore_editable");
                    for (var i=0; i<elements.length; i++) {
                        var name = elements[i].getAttribute("id").split("pimcore_editable_").join("");
                        for (var e=0; e<editables.length; e++) {
                            if(editables[e].getName() == name) {
                                if(editables[e].element) {
                                    if(typeof editables[e].element.doLayout == "function") {
                                        editables[e].element.doLayout();
                                    }
                                }
                                break;
                            }
                        }
                    }

                }.bind(this, content)
            },
            buttons: [{
                text: t("save"),
                listeners: {
                    "click": this.editmodeSave.bind(this)
                },
                icon: "/pimcore/static/img/icon/tick.png"
            }],
            contentEl: content
        });
        this.editmodeWindow.show();
    },

    editmodeSave: function () {
        this.editmodeWindow.close();

        this.reloadDocument();
    },

    getValue: function () {
        var data = [];
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i]) {
                if (this.elements[i].key) {
                    data.push({
                        key: this.elements[i].key,
                        type: this.elements[i].type
                    });
                }
            }
        }

        return data;
    },

    getType: function () {
        return "area";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.pdf");
pimcore.document.tags.pdf = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.data = {};

        if (!options) {
            options = {};
        }

        this.options = options;


        // set width
        if (!this.options["height"]) {
            this.options.height = 100;
        }

        if (data) {
            this.data = data;
        }

        this.setupWrapper();

        this.options.name = id + "_editable";
        this.element = new Ext.Panel(this.options);

        this.element.on("render", function (el) {

            // contextmenu
            el.getEl().on("contextmenu", this.onContextMenu.bind(this));

            // register at global DnD manager
            dndManager.addDropTarget(el.getEl(), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));

            el.getEl().setStyle({
                position: "relative"
            });

            this.getBody().insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');
            this.getBody().addClass("pimcore_tag_image_empty");
        }.bind(this));

        this.element.render(id);


        // insert image
        if (this.data) {
            this.updateImage();
        }
    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.data.id) {

            menu.add(new Ext.menu.Item({
                text: t('add_hotspots'),
                iconCls: "pimcore_icon_image_add_hotspot",
                handler: function (item) {
                    item.parentMenu.destroy();

                    this.openHotspotWindow();
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('empty'),
                iconCls: "pimcore_icon_delete",
                handler: function (item) {
                    item.parentMenu.destroy();

                    this.empty();

                }.bind(this)
            }));
            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "pimcore_icon_open",
                handler: function (item) {
                    item.parentMenu.destroy();
                    pimcore.helpers.openAsset(this.data.id, "document");
                }.bind(this)
            }));

            menu.add(new Ext.menu.Item({
                text: t('show_in_tree'),
                iconCls: "pimcore_icon_fileexplorer",
                handler: function (item) {
                    item.parentMenu.destroy();
                    pimcore.helpers.selectElementInTree("asset", this.data.id);
                }.bind(this)
            }));
        }

        menu.add(new Ext.menu.Item({
            text: t('search'),
            iconCls: "pimcore_icon_search",
            handler: function (item) {
                item.parentMenu.destroy();
                this.openSearchEditor();
            }.bind(this) 
        }));

        menu.add(new Ext.menu.Item({
            text: t('upload'),
            iconCls: "pimcore_icon_upload_single",
            handler: function (item) {
                item.parentMenu.destroy();
                this.uploadDialog();
            }.bind(this)
        }));

        menu.showAt(e.getXY());
        e.stopEvent();
    },

    uploadDialog: function () {
        pimcore.helpers.assetSingleUploadDialog(this.options["uploadPath"], "path", function (res) {
            try {
                var data = Ext.decode(res.response.responseText);
                if(data["id"] && data["type"] == "document") {
                    this.resetData();
                    this.data.id = data["id"];

                    this.updateImage();
                    this.reload();
                }
            } catch (e) {
                console.log(e);
            }
        }.bind(this));
    },

    onNodeOver: function(target, dd, e, data) {
        if (this.dndAllowed(data)) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },

    onNodeDrop: function (target, dd, e, data) {

        if (data.node.attributes.type == "document") {
            this.resetData();
            this.data.id = data.node.attributes.id;

            this.updateImage();
            this.reload();

            return true;
        }
    },

    dndAllowed: function(data) {

        if(data.node.attributes.elementType!="asset" || data.node.attributes.type!="document"){
            return false;
        } else {
            return true;
        }

    },

    openSearchEditor: function () {
        pimcore.helpers.itemselector(false, this.addDataFromSelector.bind(this), {
            type: ["asset"],
            subtype: {
                asset: ["document"]
            }
        });
    },
    
    addDataFromSelector: function (item) {        
        if(item) {
            this.resetData();
            this.data.id = item.id;

            this.updateImage();
            this.reload();

            return true;
        }
    },

    resetData: function () {
        this.data = {
            id: null
        };
    },

    empty: function () {

        this.resetData();

        this.updateImage();
        this.getBody().addClass("pimcore_tag_image_empty");
        this.reload();
    },

    getBody: function () {
        // get the id from the body element of the panel because there is no method to set body's html
        // (only in configure)
        var body = Ext.get(this.element.getEl().query(".x-panel-body")[0]);
        return body;
    },

    updateImage: function () {

        var path = "";
        var existingImage = this.getBody().dom.getElementsByTagName("img")[0];
        if (existingImage) {
            Ext.get(existingImage).remove();
        }

        if (!this.data.id) {
            return;
        }

        path = "/admin/asset/get-document-thumbnail/id/" + this.data.id + "/width/" + this.element.getEl().getWidth()
                        + "/aspectratio/true?" + Ext.urlEncode(this.data);

        var image = document.createElement("img");
        image.src = path;

        this.getBody().appendChild(image);
        this.getBody().removeClass("pimcore_tag_image_empty");

        this.updateCounter = 0;
        this.updateDimensionsInterval = window.setInterval(this.updateDimensions.bind(this), 1000);
    },

    reload : function () {
        this.reloadDocument();
    },

    updateDimensions: function () {

        var image = this.element.getEl().dom.getElementsByTagName("img")[0];
        if (!image) {
            return;
        }
        image = Ext.get(image);

        var width = image.getWidth();
        var height = image.getHeight();

        if (width > 1 && height > 1) {
            this.element.setWidth(width);
            this.element.setHeight(height);

            clearInterval(this.updateDimensionsInterval);
        }

        if (this.updateCounter > 20) {
            // only wait 20 seconds until image must be loaded
            clearInterval(this.updateDimensionsInterval);
        }

        this.updateCounter++;
    },

    openHotspotWindow: function() {

        var thumbUrl = "";
        var pages = [];

        this.hotspotStore = {};
        this.hotspotMetaData = {};

        if(this.data["hotspots"]) {
            this.hotspotStore = this.data["hotspots"];
        }

        this.currentPage = null;

        for(var i=1; i<=this.data.pageCount; i++) {
            thumbUrl = "/admin/asset/get-document-thumbnail/id/"
                + this.data.id + "/width/400/height/400/contain/true/page/" + i;

            pages.push({
                style: "margin-bottom: 10px; text-align: center; cursor:pointer; ",
                bodyStyle: "min-height: 150px;",
                html: '<span id="' + this.getName() + '-page-' + i + '" style="font-size:35px; line-height: 150px;" data-src="' + thumbUrl + '">' + i + '</span>', // blank gif image
                listeners: {
                    afterrender: function (page, el) {
                        // unfortunately the panel element has no click event, so we have to add it to the image
                        // after the panel was rendered
                        var body = Ext.get(el.body);
                        body.on("click", this.hotspotEditPage.bind(this, page));
                    }.bind(this, i)
                }
            });
        }

        var pagesContainer = new Ext.Panel({
            width: 150,
            region: "west",
            autoScroll: true,
            bodyStyle: "padding: 10px;",
            items: pages
        });

        var loadingInterval = window.setInterval(function () {

            if(!pagesContainer || !pagesContainer.body || !pagesContainer.body.dom) {
                clearInterval(loadingInterval);
            } else {
                var el;
                var scroll = pagesContainer.body.getScroll();
                var startPage = Math.floor(scroll.top / 162); // 162 is the height of one thumbnail incl. border and margin
                for(var i=startPage; i<(startPage+5); i++) {
                    el = Ext.get(this.getName() + "-page-" + i);
                    if(el) {
                        el.parent().update('<img src="' + el.getAttribute("data-src") + '" height="150" />');
                    }
                }
            }
        }.bind(this), 1000);

        this.hotspotWindow = new Ext.Window({
            width: 700,
            height: 510,
            modal: true,
            closeAction: "close",
            resizable: false,
            layout: "border",
            items: [pagesContainer, {
                region: "center",
                layout: "fit",
                itemId: "pageContainer"
            }],
            bbar: ["->", {
                xtype: "button",
                iconCls: "pimcore_icon_apply",
                text: t("save"),
                handler: function () {
                    this.saveCurrentPage();
                    this.data["hotspots"] = this.hotspotStore;
                    this.hotspotWindow.close();
                }.bind(this)
            }]
        });

        this.hotspotWindow.show();
    },

    hotspotEditPage: function (page) {
        this.saveCurrentPage();

        this.currentPage = page;

        var pageContainer = this.hotspotWindow.getComponent("pageContainer");
        pageContainer.removeAll();

        var thumbUrl = "/admin/asset/get-document-thumbnail/id/"
                        + this.data.id +
            "/width/400/height/400/contain/true/page/" + page;

        var page = new Ext.Panel({
            border: false,
            bodyStyle: "background: #e5e5e5; ",
            html: '<div style="margin:0 auto; position:relative; overflow: hidden;" ' +
                'class="page"><img src="' + thumbUrl + '" /></div>',
            tbar: [{
                xtype: "button",
                text: t("add_hotspot"),
                iconCls: "pimcore_icon_add_hotspot",
                handler: this.addHotspot.bind(this)
            }],
            listeners: {
                afterrender: function (el) {
                    var el = el.body;
                    var checks = 0;
                    var detailInterval = window.setInterval(function () {

                        try {
                            checks++;

                            var div = Ext.get(el.query(".page")[0]);
                            var img = Ext.get(el.query("img")[0]);

                            if((img.getHeight() > 100 && img.getWidth() > 100) || checks > 300 || !div || !img) {
                                window.clearInterval(detailInterval);
                            }

                            if(img.getHeight() > 100 && img.getWidth() > 100) {
                                div.applyStyles({
                                    width: img.getWidth() + "px",
                                    height: img.getHeight() + "px",
                                    visibility: "visible",
                                    "margin-left": ((el.getWidth()-img.getWidth())/2) + "px",
                                    "margin-top": ((el.getHeight()-img.getHeight())/2) + "px"
                                });
                            }
                        } catch (e) {
                            // stop the timer when an error occours
                            window.clearInterval(detailInterval);
                        }
                    }, 200);

                    // add hotspots
                    var hotspots = this.hotspotStore[this.currentPage];
                    if(hotspots) {
                        for(var i=0; i<hotspots.length; i++) {
                            this.addHotspot(hotspots[i]);
                        }
                    }
                }.bind(this)
            }
        });

        pageContainer.add(page);

        pageContainer.doLayout();
    },

    addHotspot: function (config) {
        var hotspotId = "pdf-hotspot-" + uniqid();

        var pageContainerDiv = Ext.get(this.hotspotWindow.getComponent("pageContainer").body.query(".page")[0]);
        pageContainerDiv.insertHtml("beforeEnd", '<div id="' + hotspotId + '" class="pimcore_pdf_hotspot"></div>');

        var hotspotEl = Ext.get(hotspotId);

        // default dimensions
        hotspotEl.applyStyles({
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            width: "50px",
            height: "50px"
        });

        if(typeof config == "object" && config["top"]) {
            var imgEl = Ext.get(this.hotspotWindow.getComponent("pageContainer").body.query("img")[0]);
            var originalWidth = imgEl.getWidth();
            var originalHeight = imgEl.getHeight();

            hotspotEl.applyStyles({
                top: (originalHeight * (config["top"]/100)) + "px",
                left: (originalWidth * (config["left"]/100)) + "px",
                width: (originalWidth * (config["width"]/100)) + "px",
                height: (originalHeight * (config["height"]/100)) + "px"
            });

            if(config["data"]) {
                this.hotspotMetaData[hotspotId] = config["data"];
            }
        }

        hotspotEl.on("contextmenu", function (id, e) {
            var menu = new Ext.menu.Menu();

            menu.add(new Ext.menu.Item({
                text: t("add_data"),
                iconCls: "pimcore_icon_add_data",
                handler: function (id, item) {
                    item.parentMenu.destroy();

                    this.editMarkerHotspotData(id);
                }.bind(this, id)
            }));

            menu.add(new Ext.menu.Item({
                text: t("remove"),
                iconCls: "pimcore_icon_delete",
                handler: function (id, item) {
                    item.parentMenu.destroy();
                    Ext.get(id).remove();
                }.bind(this, id)
            }));

            menu.showAt(e.getXY());
            e.stopEvent();
        }.bind(this, hotspotId));


        var resizer = new Ext.Resizable(hotspotId, {
            pinned:true,
            minWidth:20,
            minHeight: 20,
            preserveRatio: false,
            dynamic:true,
            handles: 'all',
            draggable:true
        });


        return hotspotId;
    },

    editMarkerHotspotData: function (id) {

        var hotspotMetaDataWin = new Ext.Window({
            width: 600,
            height: 440,
            modal: true,
            closeAction: "close",
            resizable: false,
            autoScroll: true,
            items: [{
               xtype: "form",
               itemId: "form",
               bodyStyle: "padding: 10px;"
            }],
            tbar: [{
                xtype: "button",
                iconCls: "pimcore_icon_add",
                menu: [{
                    text: t("link"),
                    iconCls: "pimcore_icon_input",
                    handler: function () {
                        addItem("link");
                    }
                },"-",{
                    text: t("textfield"),
                    iconCls: "pimcore_icon_input",
                    handler: function () {
                        addItem("textfield");
                    }
                }, {
                    text: t("textarea"),
                    iconCls: "pimcore_icon_textarea",
                    handler: function () {
                        addItem("textarea");
                    }
                }, {
                    text: t("checkbox"),
                    iconCls: "pimcore_icon_checkbox",
                    handler: function () {
                        addItem("checkbox");
                    }
                }, {
                    text: t("object"),
                    iconCls: "pimcore_icon_object",
                    handler: function () {
                        addItem("object");
                    }
                }, {
                    text: t("document"),
                    iconCls: "pimcore_icon_document",
                    handler: function () {
                        addItem("document");
                    }
                }, {
                    text: t("asset"),
                    iconCls: "pimcore_icon_asset",
                    handler: function () {
                        addItem("asset");
                    }
                }]
            }],
            buttons: [{
                text: t("save"),
                iconCls: "pimcore_icon_apply",
                handler: function (id) {

                    var data = hotspotMetaDataWin.getComponent("form").getForm().getFieldValues();
                    var normalizedData = [];

                    // when only one item is in the form
                    if(typeof data["name"] == "string") {
                        data = {
                            name: [data["name"]],
                            type: [data["type"]],
                            value: [data["value"]]
                        };
                    }

                    if(data && data["name"] && data["name"].length > 0) {
                        for(var i=0; i<data["name"].length; i++) {
                            normalizedData.push({
                                name: data["name"][i],
                                value: data["value"][i],
                                type: data["type"][i]
                            });
                        }
                    }

                    this.hotspotMetaData[id] = normalizedData;

                    hotspotMetaDataWin.close();
                }.bind(this, id)
            }],
            listeners: {
                afterrender: function (id) {
                   if(this.hotspotMetaData && this.hotspotMetaData[id]) {
                        var data = this.hotspotMetaData[id];
                        for(var i=0; i<data.length; i++) {
                            addItem(data[i]["type"], data[i]);
                        }
                   }
                }.bind(this, id)
            }
        });

        var addItem = function (hotspotMetaDataWin, type, data) {

            var id = "item-" + uniqid();
            var valueField;

            if(!data || !data["name"]) {
                data = {
                    name: "",
                    value: ""
                };
            }

            if(type == "textfield") {
                valueField = {
                    xtype: "textfield",
                    name: "value",
                    fieldLabel: t("value"),
                    width: 400,
                    value: data["value"]
                };
            } else if(type == "textarea") {
                valueField = {
                    xtype: "textarea",
                    name: "value",
                    fieldLabel: t("value"),
                    width: 400,
                    value: data["value"]
                };
            } else if(type == "checkbox") {
                valueField = {
                    xtype: "checkbox",
                    name: "value",
                    fieldLabel: t("value"),
                    checked: data["value"]
                };
            } else if(type == "object") {
                valueField = {
                    xtype: "textfield",
                    cls: "pimcore_droptarget_input",
                    name: "value",
                    fieldLabel: t("value"),
                    value: data["value"],
                    width: 400,
                    listeners: {
                        render: function (el) {
                            // register at global DnD manager
                            dndManager.addDropTarget(el.getEl(), function (target, dd, e, data) {
                                if(data.node.attributes.elementType == "object") {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                                return Ext.dd.DropZone.prototype.dropNotAllowed;
                            }, function (target, dd, e, data) {
                                if(data.node.attributes.elementType == "object") {
                                    target.dom.value = data.node.attributes.path;
                                    return true;
                                } else {
                                    return false;
                                }
                            }.bind(this));
                        }.bind(this)
                    }
                };
            } else if(type == "asset") {
                valueField = {
                    xtype: "textfield",
                    cls: "pimcore_droptarget_input",
                    name: "value",
                    fieldLabel: t("value"),
                    value: data["value"],
                    width: 400,
                    listeners: {
                        render: function (el) {
                            // register at global DnD manager
                            dndManager.addDropTarget(el.getEl(), function (target, dd, e, data) {
                                if(data.node.attributes.elementType == "asset") {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                                return Ext.dd.DropZone.prototype.dropNotAllowed;
                            }, function (target, dd, e, data) {
                                if(data.node.attributes.elementType == "asset") {
                                    target.dom.value = data.node.attributes.path;
                                    return true;
                                } else {
                                    return false;
                                }
                            }.bind(this));
                        }.bind(this)
                    }
                };
            } else if(type == "document" || type == "link") {

                if(type == "link") {
                    data["name"] = "link";
                }

                valueField = {
                    xtype: "textfield",
                    cls: "pimcore_droptarget_input",
                    name: "value",
                    fieldLabel: t("value"),
                    value: data["value"],
                    width: 400,
                    listeners: {
                        render: function (el) {
                            // register at global DnD manager
                            dndManager.addDropTarget(el.getEl(), function (target, dd, e, data) {
                                if(data.node.attributes.elementType == "document") {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                                return Ext.dd.DropZone.prototype.dropNotAllowed;
                            }, function (target, dd, e, data) {
                                if(data.node.attributes.elementType == "document") {
                                    target.dom.value = data.node.attributes.path;
                                    return true;
                                } else {
                                    return false;
                                }
                            }.bind(this));
                        }.bind(this)
                    }
                };
            } else {
                // no valid type
                return;
            }

            hotspotMetaDataWin.getComponent("form").add({
                xtype: "fieldset",
                style: "padding: 0;",
                bodyStyle: "padding: 5px;",
                itemId: id,
                items: [{
                    xtype: "hidden",
                    name: "type",
                    value: type
                },{
                    xtype: "textfield",
                    name: "name",
                    value: data["name"],
                    fieldLabel: t("name")
                }, valueField],
                tbar: ["->", {
                    iconCls: "pimcore_icon_delete",
                    handler: function (hotspotMetaDataWin) {
                        var form = hotspotMetaDataWin.getComponent("form");
                        form.remove(form.getComponent(id));
                        hotspotMetaDataWin.doLayout();
                    }.bind(this, hotspotMetaDataWin)
                }]
            });

            hotspotMetaDataWin.doLayout();
        }.bind(this, hotspotMetaDataWin);

        hotspotMetaDataWin.show();
    },

    saveCurrentPage: function () {

        if(this.currentPage) {
            var hotspots = this.hotspotWindow.getComponent("pageContainer").body.query(".pimcore_pdf_hotspot");
            var hotspot = null;
            var metaData = null;

            var imgEl = Ext.get(this.hotspotWindow.getComponent("pageContainer").body.query("img")[0]);
            var originalWidth = imgEl.getWidth();
            var originalHeight = imgEl.getHeight();

            this.hotspotStore[this.currentPage] = [];

            for(var i=0; i<hotspots.length; i++) {
                hotspot = Ext.get(hotspots[i]);

                var dimensions = hotspot.getStyles("top","left","width","height");

                metaData = null;
                if(this.hotspotMetaData[hotspot.getAttribute("id")]) {
                    metaData = this.hotspotMetaData[hotspot.getAttribute("id")];
                }

                this.hotspotStore[this.currentPage].push({
                    top: intval(dimensions.top) * 100 / originalHeight,
                    left:  intval(dimensions.left) * 100 / originalWidth,
                    width: intval(dimensions.width) * 100 / originalWidth,
                    height: intval(dimensions.height) * 100 / originalHeight,
                    data: metaData
                });
            }

            if(this.hotspotStore[this.currentPage].length < 1) {
                delete this.hotspotStore[this.currentPage];
            }
        }
    },

    getValue: function () {
        return this.data;
    },

    getType: function () {
        return "pdf" +
            "";
    }
});


/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */




// disable reload & links, this function is here because it has to be in the header (body attribute)
function pimcoreOnUnload() {
    editWindow.protectLocation();
}


pimcore.edithelpers = {};

pimcore.edithelpers.setBodyHeight = function () {
    try {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        Ext.getBody().setHeight(height);
        Ext.get(Ext.query("html")[0]).setHeight(height);
    } catch (e) {
        console.log(e);
    }
};

pimcore.edithelpers.frame = {
    active: false,
    topEl: null,
    bottomEl: null,
    rightEl: null,
    leftEl: null,
    timeout: null
};

pimcore.edithelpers.frameElement = function (el, body) {

    if(pimcore.edithelpers.frame.active) {
        pimcore.edithelpers.unFrameElement();
    }

    var offsets;
    var borderWidth;
    var width;
    var height;

    try {
        var startDistance = 5;
        offsets = Ext.get(el).getOffsetsTo(Ext.getBody());
        var bodyOffsetLeft = intval(Ext.getBody().getStyle("margin-left"));
        var bodyOffsetTop = intval(Ext.getBody().getStyle("margin-top"));

        offsets[0] -= bodyOffsetLeft;
        offsets[1] -= bodyOffsetTop;

        offsets[0] -= startDistance;
        offsets[1] -= startDistance;

        width = Ext.get(el).getWidth() + (startDistance*2);
        height = Ext.get(el).getHeight() + (startDistance*2);
        borderWidth = 5;

        if(typeof body == "undefined") {
            body = document.body;
        }
    } catch (e) {
        return;
    }

    var top = document.createElement("div");
    top = Ext.get(top);
    top.appendTo(body);
    top.applyStyles({
        position: "absolute",
        top: (offsets[1] - borderWidth) + "px",
        left: (offsets[0] - borderWidth) + "px",
        width: (width + borderWidth*2) + "px",
        height: borderWidth + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    var bottom = document.createElement("div");
    bottom = Ext.get(bottom);
    bottom.appendTo(body);
    bottom.applyStyles({
        position: "absolute",
        top: (offsets[1] + borderWidth + height) + "px",
        left: (offsets[0] - borderWidth) + "px",
        width: (width + borderWidth*2) + "px",
        height: borderWidth + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    var left = document.createElement("div");
    left = Ext.get(left);
    left.appendTo(body);
    left.applyStyles({
        position: "absolute",
        top: (offsets[1] - borderWidth) + "px",
        left: (offsets[0] - borderWidth) + "px",
        width: borderWidth + "px",
        height: (height + borderWidth*2) + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    var right = document.createElement("div");
    right = Ext.get(right);
    right.appendTo(body);
    right.applyStyles({
        position: "absolute",
        top: (offsets[1] - borderWidth) + "px",
        left: (offsets[0] + width ) + "px",
        width: borderWidth + "px",
        height: (height + borderWidth*2) + "px",
        backgroundColor: "#a3bae9",
        zIndex: 10000
    });

    pimcore.edithelpers.frame.topEl= top;
    pimcore.edithelpers.frame.bottomEl = bottom;
    pimcore.edithelpers.frame.leftEl = left;
    pimcore.edithelpers.frame.rightEl = right;
    pimcore.edithelpers.frame.active = true;

    var animDuration = 0.35;

    pimcore.edithelpers.frame.timeout = window.setTimeout(function () {
        top.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
        bottom.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
        left.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
        right.animate( { opacity: {to: 0, from: 1} },  animDuration,  null,  'easeOut' );
    }, 500);

};


pimcore.edithelpers.unFrameElement = function () {

    if(pimcore.edithelpers.frame.active) {

        window.clearTimeout(pimcore.edithelpers.frame.timeout);

        pimcore.edithelpers.frame.topEl.remove();
        pimcore.edithelpers.frame.bottomEl.remove();
        pimcore.edithelpers.frame.leftEl.remove();
        pimcore.edithelpers.frame.rightEl.remove();

        pimcore.edithelpers.frame.active = false;
    }
};




