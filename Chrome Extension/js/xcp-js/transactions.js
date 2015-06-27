function randomIntFromInterval(min,max) {

    return Math.floor(Math.random()*(max-min+1)+min); 
    
}

function padprefix(str, max) {   
    
    str = str.toString();
    return str.length < max ? padprefix('0' + str, max) : str;   
    
}

function hex_byte() {

    var hex_digits = "0123456789abcdef";
    var hex_dig_array = hex_digits.split('');
    
    var hex_byte_array = new Array();
        
    for (a = 0; a < 16; a++){
        for (b = 0; b < 16; b++){            
            hex_byte_array.push(hex_dig_array[a] + hex_dig_array[b]);           
        }
    }
    
    return hex_byte_array;
   
}


function rawtotxid(raw) {

    var firstSHA = Crypto.SHA256(Crypto.util.hexToBytes(raw))
    var secondSHA = Crypto.SHA256(Crypto.util.hexToBytes(firstSHA))    
   
    return reverseBytes(secondSHA);  

}


//function assetid(asset_name) {
//    
//    //asset_name.toUpperCase();
//
//    if (asset_name != "XCP"){
//    
//        var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
//        var name_array = asset_name.split("");
//    
//        var n = 0;
//    
//        for (i = 0; i < name_array.length; i++) { 
//            n *= 26;
//            n += b26_digits.indexOf(name_array[i]);
//        }    
//     
//        var asset_id = n;
//    
//    } else {
//        
//        var asset_id = 1;
//        
//    }
//    
//    return asset_id;
//    
//}

function assetid(asset_name) {
    
    //asset_name.toUpperCase();

    if(asset_name != "XCP"){
    
        var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
        var name_array = asset_name.split("");
    
        //var n = 0;
        var n_bigint = BigIntegerSM(0);
    
        for (i = 0; i < name_array.length; i++) { 
            
            //n *= 26;
            //n += b26_digits.indexOf(name_array[i]);
            
            n_bigint = BigIntegerSM(n_bigint).multiply(26);
            n_bigint = BigIntegerSM(n_bigint).add(b26_digits.indexOf(name_array[i]));
                    
        }    
     
        //var asset_id = n;
        var asset_id = n_bigint.toString(16);
    
    } else {
        
        var asset_id = (1).toString(16);
        
    }
    
    //return asset_id;
    console.log(asset_id);
    
    return asset_id;
    
}

function create_xcp_send_data(asset_name, amount) {
    
    var prefix = "1c434e54525052545900000000"; //CNTRPRTY
    var trailing_zeros = "000000000000000000000000000000000000000000000000000000000000000000";
    var asset_id = assetid(asset_name); 
    
    //var asset_id_hex = padprefix(asset_id.toString(16), 16);
    var asset_id_hex = padprefix(asset_id, 16);
    var amount_round = parseInt((amount*100000000).toFixed(0));
    
    var amount_hex = padprefix((amount_round).toString(16), 16);
    
    console.log(asset_id_hex);
    console.log(amount_hex);
                               
    var data = prefix + asset_id_hex + amount_hex + trailing_zeros; 
    
    return data;
    
}

function create_xcp_send_data_opreturn(asset_name, amount) {
    
    var prefix = "434e54525052545900000000"; //CNTRPRTY
    var asset_id = assetid(asset_name); 
    
    console.log("from cxsdo: "+asset_id);
    
    var asset_id_hex = padprefix(asset_id.toString(16), 16);
    
    var amount_round = parseInt((amount*100000000).toFixed(0));
    
    var amount_hex = padprefix((amount_round).toString(16), 16);
                               
    var data = prefix + asset_id_hex + amount_hex; 
    
    return data;
    
}

function xcp_rc4(key, datachunk) {
    
    return bin2hex(rc4(hex2bin(key), hex2bin(datachunk)));
    
}

function address_from_pubkeyhash(pubkeyhash) {
    
    var publicKey = new bitcore.PublicKey(pubkeyhash);
    var address = bitcore.Address.fromPublicKey(publicKey);
    
    //console.log(address.toString());
    return address.toString();
    
}

function addresses_from_datachunk(datachunk) {
    
    var hex_byte_array = hex_byte();
    
    var pubkey_seg1 = datachunk.substring(0, 62);
    var pubkey_seg2 = datachunk.substring(62, 124);
    var first_byte = "02";
    var second_byte;
    var pubkeyhash;
    var address1="";
    var address2="";
    var rand;
    
    while (address1.length == 0) {
        rand = randomIntFromInterval(0,255);
        
        second_byte = hex_byte_array[rand];          
        pubkeyhash = first_byte + pubkey_seg1 + second_byte;
            
        if (bitcore.PublicKey.isValid(pubkeyhash)){
            console.log(pubkeyhash);        
            var hash1 = pubkeyhash;
            var address1 = address_from_pubkeyhash(pubkeyhash);
        }    

    }
    
    while (address2.length == 0) {
        rand = randomIntFromInterval(0,255);
        
        second_byte = hex_byte_array[rand];          
        pubkeyhash = first_byte + pubkey_seg2 + second_byte;
            
        if (bitcore.PublicKey.isValid(pubkeyhash)){
            console.log(pubkeyhash);
            var hash2 = pubkeyhash;
            var address2 = address_from_pubkeyhash(pubkeyhash);
        }  

    }
         
    console.log(address1);
    console.log(address2);
    
    var data_hashes = [hash1, hash2];
    
    return data_hashes;
    
}

function isdatacorrect(data_chunk, asset, asset_total) {
            
            var asset_id = padprefix(assetid(asset),16);
            
            var assethex = data_chunk.substring(42, 26);
            var amount = data_chunk.substring(58, 42);
            //var asset_dec = parseInt(assethex, 16);
            var amount_dec = parseInt(amount, 16) / 100000000;
            
            if (asset_id == assethex && asset_total == amount_dec) {
                var correct = "yes";
            } else {
                var correct = "no";
            }
            
            return correct;
            
            console.log(correct);
}


function sendXCP(add_from, add_to, asset, asset_total, btc_total, msig_total, transfee, mnemonic) {
       
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";     
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+add_from+"/utxo";
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = (parseFloat(btc_total) + parseFloat(msig_total) + parseFloat(transfee));
        
        data.sort(function(a, b) {
            return b.amount - a.amount;
        });
        
        $.each(data, function(i, item) {

//             //chain.so
//             var txid = data[i].txid;
//             var vout = data[i].output_no;
//             var script = data[i].script_hex;
//             var value = parseFloat(data[i].amount);
            
             //insight
             var txid = data[i].txid;
             var vout = data[i].vout;
             var script = data[i].scriptPubKey;
             var amount = parseFloat(data[i].amount);
             
             amountremaining = amountremaining - amount;            
             amountremaining.toFixed(8);
    
             var obj = {
                "txid": txid,
                "address": add_from,
                "vout": vout,
                "scriptPubKey": script,
                "amount": amount
             };
            
             total_utxo.push(obj);
              
             //dust limit = 5460 
            
             if (amountremaining == 0 || amountremaining < -0.00005460) {                                 
                 return false;
             }
             
        });
    
        var utxo_key = total_utxo[0].txid;
        
        if (amountremaining < 0) {
            var satoshi_change = -(amountremaining.toFixed(8) * 100000000).toFixed(0);
        } else {
            var satoshi_change = 0;
        }
        
        console.log(asset);
        console.log(asset_total);
        
        var datachunk_unencoded = create_xcp_send_data(asset, asset_total);
        
        var correct = isdatacorrect(datachunk_unencoded, asset, asset_total); 
        
        console.log(datachunk_unencoded);
        console.log(correct + " correct");
        
        var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
        
        
        
        console.log(datachunk_encoded);
        
        var address_array = addresses_from_datachunk(datachunk_encoded);
        
        var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
        
        var scriptstring = "OP_1 33 0x"+address_array[0]+" 33 0x"+address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
        console.log(scriptstring);
        var data_script = new bitcore.Script(scriptstring);
        
        var transaction = new bitcore.Transaction();
            
        for (i = 0; i < total_utxo.length; i++) {
            transaction.from(total_utxo[i]);
        }
    
        var btc_total_satoshis = parseFloat((btc_total * 100000000).toFixed(0));
        transaction.to(add_to, btc_total_satoshis);
        
        var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));
        
        var xcpdata_msig = new bitcore.Transaction.Output({script: data_script, satoshis: msig_total_satoshis}); 
        
        transaction.addOutput(xcpdata_msig);
                  
        if (satoshi_change > 5459) {
            transaction.to(add_from, satoshi_change);
        }
        
        transaction.sign(privkey);

        var final_trans = transaction.serialize();
        
        console.log(final_trans);   
        
        //sendXCP_opreturn(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic);
       
            
        if (correct == "yes") {   
            sendBTCpush(final_trans);  //push raw tx to the bitcoin network via Blockchain.info
        } else {
            $("#sendtokenbutton").html("Error, refresh to continue...");
        }

    });
    
}

function sendXCP_opreturn(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic) {
       
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";     
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+add_from+"/utxo"; 
    
//    var source_html = "http://btc.blockr.io/api/v1/address/unspent/"+add_from;
    
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
//    $.getJSON( source_html, function( apidata ) {
        
        var amountremaining = ((parseFloat(btc_total) * 100000000) + (parseFloat(transfee)*100000000))/100000000;
        
//        var data = apidata.data.unspent;
        
        console.log(amountremaining);
        
        data.sort(function(a, b) {
            return b.amount - a.amount;
        });
        
        $.each(data, function(i, item) {
            
             var txid = data[i].txid;
             var vout = data[i].vout;
             var script = data[i].scriptPubKey;

            
//             var txid = data[i].tx;
//             var vout = data[i].n;
//             var script = data[i].script;
             var amount = parseFloat(data[i].amount);
             
             amountremaining = amountremaining - amount;            
             amountremaining.toFixed(8);
    
             var obj = {
                "txid": txid,
                "address": add_from,
                "vout": vout,
                "scriptPubKey": script,
                "amount": amount
             };
            
             total_utxo.push(obj);
              
             //dust limit = 5460 
            
             if (amountremaining == 0 || amountremaining < -0.00005460) {                                 
                 return false;
             }
             
        });
    
        var utxo_key = total_utxo[0].txid;
        
        if (amountremaining < 0) {
            var satoshi_change = -(amountremaining.toFixed(8) * 100000000).toFixed(0);
        } else {
            var satoshi_change = 0;
        }
    
        var datachunk_unencoded = create_xcp_send_data_opreturn(asset, asset_total);
        
        var check_data = "1c"+datachunk_unencoded;
        
        var correct = isdatacorrect(check_data, asset, asset_total); 
        
        console.log(correct);
        
        console.log(datachunk_unencoded);
        
        var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
        
        //var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
        
        var scriptstring = "OP_RETURN 28 0x"+datachunk_encoded;
        var data_script = new bitcore.Script(scriptstring);
        
        var transaction = new bitcore.Transaction();
            
        for (i = 0; i < total_utxo.length; i++) {
            transaction.from(total_utxo[i]);     
        }
        
        console.log(total_utxo);
    
        var btc_total_satoshis = parseFloat((btc_total * 100000000).toFixed(0));
        
        console.log(btc_total_satoshis);
        
        transaction.to(add_to, btc_total_satoshis);
        
        var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 
       
        transaction.addOutput(xcpdata_opreturn);
        
        console.log(satoshi_change);
        
        if (satoshi_change > 5459) {
            transaction.change(add_from);
        }
        
        
        
        transaction.sign(privkey);

        var final_trans = transaction.uncheckedSerialize();
        
        console.log(final_trans);
        
        
        
        if (correct == "yes") {   
            sendBTCpush(final_trans);  //push raw tx to the bitcoin network via Blockchain.info
        } else {
            $("#sendtokenbutton").html("Error, refresh to continue...");
        }

    });
    
}