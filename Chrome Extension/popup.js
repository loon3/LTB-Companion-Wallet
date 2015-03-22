function setEncryptedTest() {
    
    chrome.storage.local.set(
                    {
                        'encrypted': true
                    }, function () {
                    
                       getStorage();
                    
                    });
    
}
    
    
    
function getStorage()
{
    chrome.storage.local.get(["passphrase", "encrypted"], function (data)
    {
        if ( data.encrypted == false) {
            
            existingPassphrase(data.passphrase);
            
        } else if ( data.encrypted == true) {
            
            $(".hideEncrypted").hide();
            
            $("#pinsplash").show();
            $("#priceBox").hide();
        
        } else {
            newPassphrase();
        }
        //getRate();
    });
}



//function getBlockHeight(){
//     var source_html = "https://insight.bitpay.com/api/sync";
//       
//    $.getJSON( source_html, function( data ) {
//    
//        var block = data.blockChainHeight;
//        return block;
//        
//    });
//}


function showBTCtransactions(transactions) {
            
            //$("#btcbalance").html("<div style='font-size: 12px;'>You can perform "+transactions.toFixed(0)+" transactions</div><div id='depositBTC' align='center' style='margin: 5px; cursor: pointer; text-decoration: underline; font-size: 11px; color: #999;'>Deposit bitcoin for transaction fees</div>");
    
            $("#btcbalance").html("<div style='font-size: 12px;'>You can perform <span id='txsAvailable'>"+transactions.toFixed(0)+"</span> transactions</div>");
        
            //var titletext = data + " satoshis";

            //$("#btcbalbox").prop('title', titletext);       
            $("#btcbalbox").show();
}

function qrdepositDropdown() {
            
            var currentaddr = $("#xcpaddress").html();
            
            $("#btcbalance").html("Deposit bitcoin for transaction fees<div style='margin: 20px 0 10px 0; font-size: 10px; font-weight: bold;'>"+currentaddr+"</div><div id='btcqr' style='margin: 10px auto 20px auto; height: 100px; width: 100px;'></div><div>Cost per transaction is 0.00015470 BTC</div></div>");
                                  
            var qrcode = new QRCode(document.getElementById("btcqr"), {
    			text: currentaddr,
    			width: 100,
    			height: 100,
    			colorDark : "#000000",
    			colorLight : "#ffffff",
    			correctLevel : QRCode.CorrectLevel.H
				});
            
            
            //$("#btcbalbox").prop('title', ""); 
            $("#btcbalbox").show();
}

function getBTCBalance(pubkey) {
    var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    
    $.getJSON( source_html, function( data ) { 
        
        var bitcoinparsed = parseFloat(data) / 100000000;
        
        $("#btcbalhide").html(bitcoinparsed);
        
        var transactions = (parseFloat(data) / 15470) ;
        
        //if (transactions >= 2) {// to include escrow amount req'd and tx fee
        
           showBTCtransactions(transactions);
            
        //} 
        
//        else {
//            
//           qrdepositDropdown(); 
//            
//        }
        
    });
}

function getPrimaryBalanceXCP(pubkey, currenttoken) {
    
//    var source_html = "https://insight.bitpay.com/api/sync";
//       
//    $.getJSON( source_html, function( data ) {
//    
//        var block = data.blockChainHeight;
//              
//    });
    
    
//    chrome.storage.local.get('unconfirmedtx', function (data)
//        {
//            if(isset(data)){
//                $.each(data.tx
//        }, function(){
//        
//        });
    //console.log(pubkey);
    //console.log(currenttoken);
    
    
    var source_html = "https://counterpartychain.io/api/balances/"+pubkey;
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
    
    $.getJSON( source_html, function( data ) {     
        
        
        $.each(data.data, function(i, item) {
            var assetname = data.data[i].asset;
            
            if(assetname == currenttoken) {
                var assetbalance = data.data[i].amount; 
                
                if(assetbalance.indexOf('.') !== -1)
                {
                    $("#isdivisible").html("yes");
                } else {
                    $("#isdivisible").html("no");
                }
                
                assetbalance = parseFloat(assetbalance).toString(); 
                
  
                //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance);   
                $("#xcpbalance").html("<span id='currentbalance'>" + assetbalance + "</span><span class='unconfirmedbal'></span><br><div style='font-size: 22px; font-weight: bold;'><span id='currenttoken'>" + currenttoken + "</span>");
                $('#assetbalhide').html(assetbalance);
                getRate(assetbalance, pubkey, currenttoken);
                     
            }
        });
                    
    });
    
    if (typeof assetbalance === 'undefined') {
            $("#xcpbalance").html("<span id='currentbalance'>0</span><span class='unconfirmedbal'></span><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
            $('#assetbalhide').html(0);
            getRate(0, pubkey, currenttoken);
    }
}

function getPrimaryBalanceBTC(pubkey){
        
    var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    
    $.getJSON( source_html, function( data ) { 
        
        var bitcoinparsed = parseFloat(data) / 100000000;
        
        $("#xcpbalance").html(bitcoinparsed + "<br><div style='font-size: 22px; font-weight: bold;'>BTC</div>");
        
//        if (bitcoinparsed.toFixed(8) == 0) {
//            $("#btcsendbox").hide();
//        } else {
//            $("#btcsendbox").show();
//        }
        
        getRate(bitcoinparsed, pubkey, "BTC");
        
        
    });
}

function getPrimaryBalance(pubkey){
    
    $("#btcsendbox").hide();
    
    var currenttoken = $(".currenttoken").html();
   
    if (currenttoken != "BTC") {
        
        getPrimaryBalanceXCP(pubkey, currenttoken);
        
    } else {
    
        getPrimaryBalanceBTC(pubkey);
    
    }
        
}


function getRate(assetbalance, pubkey, currenttoken){
    
    if ($("#ltbPrice").html() == "...") {
    
    $.getJSON( "http://joelooney.org/ltbcoin/ltb.php", function( data ) {
  
        var ltbprice = 1 / parseFloat(data.usd_ltb);     
        
        $("#ltbPrice").html(ltbprice.toFixed(0));
        
            
        if (currenttoken == "LTBCOIN") {
            var usdValue = parseFloat(data.usd_ltb) * parseFloat(assetbalance);
        
            $("#xcpfiatValue").html(usdValue.toFixed(2)); 
            $("#switchtoxcp").hide();
            $("#fiatvaluebox").show();
        } else {
            $("#fiatvaluebox").hide();
            $("#switchtoxcp").show();
        }
        
        
    });
    
    } else {
        
        if (currenttoken == "LTBCOIN") {
            var ltbrate = $("#ltbPrice").html();
            var usdrate = 1 / parseFloat(ltbrate);
            var usdValue = usdrate * parseFloat(assetbalance);
            $("#xcpfiatValue").html(usdValue.toFixed(2));
            $("#switchtoxcp").hide();
            $("#fiatvaluebox").show();
        } else if (currenttoken == "BTC") {
            
            //var btcrate = $("#btcPrice").html();
            //var usdValue = btcrate * parseFloat(assetbalance);
            //$("#xcpfiatValue").html(usdValue.toFixed(2));
            
            $("#fiatvaluebox").hide();
            $("#switchtoxcp").show();
            
            
        } else {
            $("#fiatvaluebox").hide();
            $("#switchtoxcp").show();
        }        
        
        
        
    }
    
    getBTCBalance(pubkey);
}


function convertPassphrase(m){
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    var derived = HDPrivateKey.derive("m/0'/0/" + 0);
    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
    var pubkey = address1.toString();    
    
    $("#xcpaddressTitle").show();
    $("#xcpaddress").html(pubkey);
    
    getPrimaryBalance(pubkey);
    
}

function assetDropdown(m)
{
    $(".addressselect").html("");
    
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
                
                 
    for (var i = 0; i < 5; i++) {
                            
        var derived = HDPrivateKey.derive("m/0'/0/" + i);
        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
        var pubkey = address1.toString();
                            
        //$(".addressselect").append("<option label='"+pubkey.slice(0,8)+"...'>"+pubkey+"</option>");
        
        $(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
    }
}

function newPassphrase()
{
    
    
    m = new Mnemonic(128);
    m.toWords();
    var str = m.toWords().toString();
    var res = str.replace(/,/gi, " ");
    var phraseList = res; 
    
    $("#newpassphrase").html(phraseList);
    
    chrome.storage.local.set(
                    {
                        'passphrase': phraseList,
                        'encrypted': false
                    }, function () {
                        
                        $(".hideEncrypted").show();
                        convertPassphrase(m);
                        assetDropdown(m);
                        $('#allTabs a:first').tab('show');
                    
                    });

   
}

function existingPassphrase(string) {
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#newpassphrase").html(string);
       
    
    convertPassphrase(m2);
    assetDropdown(m2);
    
    $('#allTabs a:first').tab('show')
}



function manualPassphrase() {
    var string = $('#manualMnemonic').val().trim().toLowerCase();
    $('#manualMnemonic').val("");
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#newpassphrase").html(string);
       
    
    
    
    chrome.storage.local.set(
                    {
                        'passphrase': string,
                        'encrypted': false
                    }, function () {
                    
                        convertPassphrase(m2);
                        assetDropdown(m2);
    
                        $(".hideEncrypted").show();
                        $("#manualPassBox").hide();
                        
                        
                         $('#allTabs a:first').tab('show')
                      
                    
                    });
}





function loadAssets(add) {
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+add;
    
    var source_html = "https://counterpartychain.io/api/balances/"+add;
    
    
    
    $.getJSON( source_html, function( data ) {
        
        var btcbalance = $("#btcbalhide").html();
        
        $( "#allassets" ).html("<div class='btcasset'><div class='assetname'>BTC</div><div class='movetowallet'>Send</div><div class='assetqty'>Balance: "+btcbalance+"</div></div>");

        
        $.each(data.data, function(i, item) {
            var assetname = data.data[i].asset;
            var assetbalance = data.data[i].amount;
            if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}
            
            if (assetname.charAt(0) != "A") {
                var assethtml = "<div class='singleasset'><div class='assetname'>"+assetname+"</div><div class='movetowallet'>Send</div><div class='assetqty'>Balance: "+assetbalance+"</div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div>";
            } 
    
            $( "#allassets" ).append( assethtml );

        });
        
        loadTransactions(add);
        
    });
}

/*function updateBTC(pubkey){

    var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    
    $.getJSON( source_html, function( data ) { 
        $("#xcpbalance").html(data);
    });
};*/




    		function makedSignedMessage(msg, addr, sig)
    		{
        		var qtHdr = [
      			"<pre>-----BEGIN BITCOIN SIGNED MESSAGE-----",
      			"-----BEGIN BITCOIN SIGNATURE-----",
      			"-----END BITCOIN SIGNATURE-----</pre>"
    			];
                
                return qtHdr[0]+'\n'+msg +'\n'+qtHdr[1]+'\nVersion: Bitcoin-qt (1.0)\nAddress: '+addr+'\n\n'+sig+'\n'+qtHdr[2];
    		}
    		
    		function getprivkey(inputaddr, inputpassphrase){
    			//var inputaddr = $('#inputaddress').val();
    			
    			//var string = inputpassphrase.val().trim().toLowerCase();
                //string = string.replace(/\s{2,}/g, ' ');
                var array = inputpassphrase.split(" ");
                
                m2 = new Mnemonic(array);
                
                var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m2.toHex(), bitcore.Networks.livenet);
                
                 
                        for (var i = 0; i < 50; i++) {
                            
                            var derived = HDPrivateKey.derive("m/0'/0/" + i);
                            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
                            var pubkey = address1.toString();
                            
                            if (inputaddr == pubkey) {
                            var privkey = derived.privateKey.toWIF();
                            break;
                            
                            }
                        }
                
                return privkey;
    		}
    		
    		
    		
    		function signwith(privkey, pubkey, message) {
    			
    			
    			
    			//var message = "Message, message";
      			var p = updateAddr(privkey, pubkey);
      			
      			if ( !message || !p.address ){
        		return;
      			}

      			message = fullTrim(message);

      			
        		var sig = sign_message(p.key, message, p.compressed, p.addrtype);
   

      			sgData = {"message":message, "address":p.address, "signature":sig};

      			signature_final = makedSignedMessage(sgData.message, sgData.address, sgData.signature);
    			
    			return signature_final;
    
    		}

function twodigits(n){
    return n > 9 ? "" + n: "0" + n;
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp*1000);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = twodigits(month) + '-' + twodigits(date) + '-' + year + ' | ' + twodigits(hour) + ':' + twodigits(min) + ':' + twodigits(sec) ;
  return time;
}



function loadTransactions(add) {

    //{"address":"1CWpnJVCQ2hHtehW9jhVjT2Ccj9eo5dc2E","asset":"LTBCOIN","block":348621,"quantity":"-50000.00000000","status":"valid","time":1426978699,"tx_hash":"dc34bbbf3fa02619b2e086a3cde14f096b53dc91f49f43b697aaee3fdec22e86"}

    var source_html = "https://counterpartychain.io/api/transactions/"+add;
    
    
    
    $.getJSON( source_html, function( data ) {
        
        $( "#alltransactions" ).html("");
        
        $.each(data.data, function(i, item) {
            
            var assetname = data.data[i].asset;
            
            if (assetname.charAt(0) != "A") {
            
            var address = data.data[i].address;
            
            var quantity = data.data[i].quantity;
            var time = data.data[i].time;
            
            var translink = "https://counterpartychain.io/transaction/"+data.data[i].tx_hash;
            var addlink = "https://counterpartychain.io/address/"+address;
            
            if (parseFloat(quantity) < 0) {
                var background = "senttrans";
                var transtype = "<span class='small'>Sent to </span>";
            } else {
                var background = "receivedtrans";
                var transtype = "<span class='small'>Received from </span>";
            }
             
  
            var assethtml = "<div class='"+background+"'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>"+assetname+"</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>"+quantity+"</div></div><div class='col-xs-6'><div class='addresstrans'>"+transtype+"<br><a href='"+addlink+"' style='color: #fff;'>"+address.substring(0, 12)+"...</a></div><div class='small' style='bottom: 0;'><a href='"+translink+"' style='color: #fff;'>"+timeConverter(time)+"</a></div></div></div></div>";
             
    
            $( "#alltransactions" ).append( assethtml );
                
            }

        });
             
    });
    
    
}



//function setUnconfirmed(sendaddress, sendasset, sendamount) {
//    
//    var currentbalance = parseFloat($("#assetbalhide").html());
//    var finalbalance = currentbalance - parseFloat(sendamount);
//    var unconfirmedamt = parseFloat(sendamount)*(-1);
//    
//    
//    
//    var tx = {asset: sendasset, txamount: unconfirmedamt, postbalance: finalbalance};
//    
//    var txfinal = {address: sendaddress, tx: tx};
//      
//    chrome.storage.local.get(function(data) {
//        if(typeof(data["unconfirmedtx"]) !== 'undefined' && data["unconfirmedtx"] instanceof Array) { 
//            data["unconfirmedtx"].push(txfinal);
//        } else {
//            data["unconfirmedtx"] = [txfinal];
//        }
//        
//        chrome.storage.local.set(data); 
//        
//        
//        
//    });
//
//}





 