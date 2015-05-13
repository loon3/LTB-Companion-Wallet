//var address = $(".companion-tip-address").text();

var iconpath = chrome.extension.getURL('ltb-icon-orange-48.png');

var tipsplash = chrome.extension.getURL('tipsplash.html');

$('.companion-tip-button').each(function(i, obj) {
    
    var address = $(this).attr("data-address");
    var label = $(this).attr("data-label");
//    var isxcp = $(this).attr("data-isxcp");
    var tokens = $(this).attr("data-tokens");
    
    var labelurl = encodeURIComponent(label).replace(/[!'()*]/g, escape);
    var tokensurl = encodeURIComponent(tokens);
    
    var tipbutton = "<div style='display: inline-block; padding: 5px;'><a href='"+tipsplash+"?address="+address+"&label="+labelurl+"&tokens="+tokensurl+"' target='_blank'><img src='"+iconpath+"' height='24px' width='24px'></a></div>";
    
    //"&isxcp="+isxcp+

    $(this).html(tipbutton);
    
});

if (document.location.hostname == "chain.so") {

    $('kbd').each(function(i, obj) {
    
        if (i == 0) {
            
            console.log($(this).text());
            
            var txid = $(this).text();
            
            get_xcp_encoded_opreturn(txid, function(utxo_hash, data_chunk, sendaddress, confirmation_text){
	        
                console.log(utxo_hash);

                //$("#arc").html(data_chunk);
                var asset = data_chunk.substring(42, 26);
                var amount = data_chunk.substring(58, 42);
                var asset_dec = parseInt(asset, 16);
                console.log(asset_dec);
                var amount_dec = parseInt(amount, 16) / 100000000;
                console.log(amount_dec);
                var assetnamed = assetname(asset_dec);
                
                console.log(assetnamed);
                
                
                var source_html = "https://counterpartychain.io/api/asset/"+assetnamed;
                
                $.getJSON( source_html, function( data ) {
                    
                    if (data.divisible == 0) { amount_dec = Math.round(amount_dec * 100000000); }
                    
                    
                    $( "<div align='center' style='padding: 10px; background-color: #666;  border: solid 10px #666; color: #fff; margin: 20px auto 40px auto; width: 480px;'><div class='row'><div class='col-xs-12'><div class='lead'>Counterparty Data Detected!</div><div style='margin-bottom: 15px;'>"+confirmation_text+"</div></div></div><div class='row' style='background-color: #fafafa; color: #000; padding-top: 10px; border: solid 3px #7EB06A;'><div class='col-xs-6'><p align='center'>Counterparty Asset:</p><p style='font-size: 24px; font-weight: bold; color: #7EB06A;'>"+assetnamed+"</p></div><div class='col-xs-6'><p align='center'>Amount Sent:</p><p style='font-size: 24px; font-weight: bold; color: #7EB06A;' >"+amount_dec+"</p></div><p style='font-size: 16px; padding-top: 30px;' >Sent to: <a href='https://counterpartychain.io/transaction/"+txid+"'>"+sendaddress+"</a></p></div><div align='center' class='small' style='margin: 10px 0 -10px 0;'>Data parsed by the LTB Companion Wallet</div></div>" ).insertAfter( ".row:first" );
                });
            });
            
            
            
        }
    });
}

function get_xcp_encoded_opreturn(tx_id, callback) {
    
    
    var source_html = "https://chain.so/api/v2/get_tx/BTC/"+tx_id;
    //var source_html = "https://blockchain.info/rawtx/"+tx_id+"?format=json&cors=true";
    
    var target_tx = new Array(); 
     
    $.getJSON( source_html, function( target_tx ) {
        
        var tx_index = target_tx.data.inputs[0].from_output.txid;
        //var tx_index = target_tx.inputs[0].prev_out.tx_index;
        
        //console.log(tx_index);
            
        var target_address = target_tx.data.outputs[0].address;
        
        var confirmations = target_tx.data.confirmations;
        
        if (confirmations == 0) {
            var confirmation_text = "Unconfirmed";
        } else if (confirmations == 1) {
            var confirmation_text = "1 confirmation";
        } else {
            var confirmation_text = confirmations + " confirmations";
        }
        
        $.each(target_tx.data.outputs, function(i, item) {
            
            
            
            if ((target_tx.data.outputs[i].address == "nonstandard")){
                var target_script = target_tx.data.outputs[i].script;
                var xcp_pubkey_data = target_script.substring(10);
                

                
                var source_html_tx_index = "https://chain.so/api/v2/get_tx/BTC/"+tx_index;
    
                    $.getJSON( source_html_tx_index, xcp_pubkey_data, function( data ) {
        
                        //console.log(data.hash);
                        //console.log(xcp_pubkey_data);
        
                        var xcp_decoded = xcp_rc4(data.data.txid, xcp_pubkey_data);

			            xcp_decoded = "1c"+xcp_decoded; //add first byte to simulate OP_CHECKMULTISIG
        
                        callback(data.data.txid, xcp_decoded, target_address, confirmation_text);
        
                    });
                
            }
            
            
        });
            
    });
        
}

function rc4(key, str) {
	
    //https://gist.github.com/farhadi/2185197
    
    var s = [], j = 0, x, res = '';
	for (var i = 0; i < 256; i++) {
		s[i] = i;
	}
	for (i = 0; i < 256; i++) {
		j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
	}
	i = 0;
	j = 0;
	for (var y = 0; y < str.length; y++) {
		i = (i + 1) % 256;
		j = (j + s[i]) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
		res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
	}
	return res;
    
}


function xcp_rc4(key, datachunk) {
    
    return bin2hex(rc4(hex2bin(key), hex2bin(datachunk)));
    
}

function hex2bin(hex) {

        var bytes = [];
        var str;
        
        for (var i = 0; i < hex.length - 1; i += 2) {

                var ch = parseInt(hex.substr(i, 2), 16);
                bytes.push(ch);

        }

        str = String.fromCharCode.apply(String, bytes);
        return str;
    
};

function bin2hex(s) {

        // http://kevin.vanzonneveld.net

        var i, l, o = "",
                n;

        s += "";

        for (i = 0, l = s.length; i < l; i++) {
                n = s.charCodeAt(i).toString(16);
                o += n.length < 2 ? "0" + n : n;
        }

        return o;
    
}; 


function assetname(assetid) {

    if(assetid != 1){
    
        var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
        var letter_array = b26_digits.split("");
        var asset_name = "";
        var div;
        var rem;
        
        while (assetid > 0) { 
            
            div = Math.floor(assetid/26);
            rem = assetid % 26;
            
            assetid = div;
            
            asset_name = asset_name + letter_array[rem];
            
        }    
        
        var final_name = asset_name.split("").reverse().join("");
    
    } else {
        
        var final_name = "XCP";
        
    }
    
    return final_name;
    
}

//var address = $("companion-tip-button").attr("data-address");
//var label = $("#companion-tip-button").attr("data-label");
//
//var labelurl = encodeURIComponent(label);
//
//var iconpath = chrome.extension.getURL('ltb-icon-orange-48.png');
//
//var tipsplash = chrome.extension.getURL('tipsplash.html');
//
//var tipbutton = "<div style='display: inline-block; padding: 5px;'><a href='"+tipsplash+"?address="+address+"&label="+labelurl+"'><img src='"+iconpath+"' height='24px' width='24px'></a></div>";
//
//
//
//$("#companion-tip-button").html(tipbutton);


