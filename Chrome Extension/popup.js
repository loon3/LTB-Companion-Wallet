
function getNews(){
     var source_html = "https://letstalkbitcoin.com/api/v1/blog/posts?limit=5";
      
    $("#newsStories").html("<div align='center' style='padding-top: 30px;'>Loading...</div>");
    
    $.getJSON( source_html, function( data ) {
    
        $("#newsStories").html("");
        
        $.each(data.posts, function(i, item) {
           
        var date = data.posts[i]["publishDate"];
            
        var title = data.posts[i]["title"];
        var url = data.posts[i]["url"];
        var image = data.posts[i]["coverImage"];
        
        //console.log(image);
        
        var title_display = "<a class='newslink' href='https://letstalkbitcoin.com/blog/post/"+url+"'><div class='newsArticle' align='center'><img src='"+image+"' height='240px' width='240px'><div class='lead' style='padding: 20px 0 0 0;'>"+title+"</div><div style='padding: 5px 0 10px 0;' class='small'>Published "+date.substring(0,10)+"</div></div></a>";
        
        //console.log(data); 
        
        $("#newsStories").append(title_display);
            
        });
        
    });
}

function searchLTBuser(username){

     var source_html = "https://letstalkbitcoin.com/api/v1/users?search="+username;
      
    $("#ltbDirectorySearchResults").html("<div align='center' style='padding-top: 10px;'>Loading...</div>");
    
    $.getJSON( source_html, function( data ) {
    
        $("#ltbDirectorySearchResults").html("");

        $.each(data.users, function(i, item) {
            
            var username = data.users[i]["username"];
            
            var avatar = data.users[i]["avatar"];
            
            var registered = data.users[i]["regDate"];
            
            if (i > 0) {
                $("#ltbDirectorySearchResults").append("<hr>");
            }
            
            
            $("#ltbDirectorySearchResults").append("<div style='display: inline-block; padding: 0 20px 10px 0;'><img src='"+avatar+"' height='64px' width='64px'></div>");        
            $("#ltbDirectorySearchResults").append("<div style='display: inline-block;' class='ltbDirectoryUsername'>"+username+"</div>");  
            $("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>Date Registered:</i><br>"+registered.substring(0,10)+"</div>");
            
            if(data.users[i]["profile"] == null || data.users[i]["profile"]["ltbcoin-address"] == undefined) {
                $("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>LTBCOIN Address:</i><br>No Address Listed</div>");
            } else {
                var ltbaddress = data.users[i]["profile"]["ltbcoin-address"]["value"];
                $("#ltbDirectorySearchResults").append("<div class='ltbDirectoryAddress'><i>LTBCOIN Address:</i><br><div class='movetosend' style='display: inline-block;'>"+ltbaddress+"</div></div>");  
            }
            
            
            
        });
        
    });      
            
}


function setEncryptedTest() {
    
    chrome.storage.local.set(
                    {
                        'encrypted': true
                    }, function () {
                    
                       getStorage();
                    
                    });
    
}


function setPinBackground() {

                    var randomBackground = Math.floor(Math.random() * 6);
            
                    var bg_link = "url('/pin_bg/"+randomBackground+".jpg')";
            
                    $("#pinsplash").css("background-image", bg_link);
                    $("#pinsplash").css("background-size", "330px 330px"); 

}
    
    
    
function getStorage()
{
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen"], function (data)
    {
        if ( data.firstopen == false ) {
            
            $(".bg").css("min-height", "200px");
            
            $("#welcomesplash").hide();
        
            if ( data.encrypted == false) {
            
                existingPassphrase(data.passphrase);
            
            } else if ( data.encrypted == true) {
            
                $(".hideEncrypted").hide();
            
                $("#pinsplash").show();
                $("#priceBox").hide();
        
            } else {
                
                newPassphrase();
                
            }
       
        } else {
            
            $("#welcomesplash").show();
            
        }
            
    });
}






function copyToClipboard(text){
                var copyDiv = document.createElement('div');
                copyDiv.contentEditable = true;
                document.body.appendChild(copyDiv);
                copyDiv.innerHTML = text;
                copyDiv.unselectable = "off";
                copyDiv.focus();
                document.execCommand('SelectAll');
                document.execCommand("Copy", false, null);
                document.body.removeChild(copyDiv);
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
    //var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;
    
    var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    
    $.getJSON( source_html, function( data ) { 
        
        var bitcoinparsed = parseFloat(data) / 100000000;
        
        //var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8);
        
        
        
        
        $("#btcbalhide").html(bitcoinparsed);
        
        var transactions = (parseFloat(data) / 15470) ;
        
        //var transactions = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance))/ 0.0001547;
        
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
    
    
if (currenttoken == "XCP") {
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
   var source_html = "http://counterpartychain.io/api/address/"+pubkey;
    
    
    $.getJSON( source_html, function( data ) {  
        //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 
        
        var assetbalance = data.xcp_balance;
        
        if (typeof assetbalance === 'undefined') {
            assetbalance = 0;
        }
        
        assetbalance = parseFloat(assetbalance).toString(); 
        
        $("#isdivisible").html("yes");
    
        $("#xcpbalance").html("<span id='currentbalance'>" + assetbalance + "</span><span class='unconfirmedbal'></span><br><div style='font-size: 22px; font-weight: bold;'><span id='currenttoken'>" + currenttoken + "</span>");
        $('#assetbalhide').html(assetbalance);
        
        getRate(assetbalance, pubkey, currenttoken);
        
    });
    
} else {  
    
    
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
    
}
    
    if (typeof assetbalance === 'undefined') {
            $("#xcpbalance").html("<span id='currentbalance'>0</span><span class='unconfirmedbal'></span><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
            $('#assetbalhide').html(0);
            getRate(0, pubkey, currenttoken);
    }

}

function getPrimaryBalanceBTC(pubkey){
        
    //var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;
    
    var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    
    $.getJSON( source_html, function( data ) { 
        
        var bitcoinparsed = parseFloat(data) / 100000000;
        //var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8);
        
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
        
        $("#ltbPrice").html(Number(ltbprice.toFixed(0)).toLocaleString('en'));
        $("#ltbPrice").data("ltbcoin", { price: ltbprice.toFixed(0) });
            
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
            var ltbrate = $("#ltbPrice").data("ltbcoin").price;
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
    $("#yournewpassphrase").html(phraseList);
    
    chrome.storage.local.set(
                    {
                        'passphrase': phraseList,
                        'encrypted': false,
                        'firstopen': false
                        
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



function manualPassphrase(passphrase) {
//    var string = $('#manualMnemonic').val().trim().toLowerCase();
//    $('#manualMnemonic').val("");
    
    
    var string = passphrase.trim().toLowerCase();
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#newpassphrase").html(string);
       
    
    
    
    chrome.storage.local.set(
                    {
                        'passphrase': string,
                        'encrypted': false,
                        'firstopen': false
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
    
    var xcp_source_html = "http://counterpartychain.io/api/address/"+add;
    
    $( "#alltransactions" ).html("");
    
    
    $.getJSON( xcp_source_html, function( data ) {  
        //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 
        
        var xcpbalance = parseFloat(data.xcp_balance).toFixed(8);    
        
        if (typeof xcpbalance === 'undefined') {
            xcpbalance = 0;
        }
    
        $.getJSON( source_html, function( data ) {
        
            var btcbalance = $("#btcbalhide").html();
        
            $( "#allassets" ).html("<div class='btcasset row'><div class='col-xs-2' style='margin-left: -10px;'><img src='bitcoin_48x48.png'></div><div class='col-xs-10'><div class='assetname'>BTC</div><div class='movetowallet'>Send</div><div class='assetqty'>"+btcbalance+"</div></div></div>");
            
            var xcpicon = "http://counterpartychain.io/content/images/icons/xcp.png";
            
            if (xcpbalance != 0) {
            
            $( "#allassets" ).append("<div class='xcpasset row'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+xcpicon+"'></div><div class='col-xs-10'><div class='assetname'>XCP</div><div class='movetowallet'>Send</div><div class='assetqty'>"+xcpbalance+"</div></div></div>");
        
            }
        
        
            $.each(data.data, function(i, item) {
                var assetname = data.data[i].asset;
                var assetbalance = data.data[i].amount; //.balance for blockscan
                if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}
                
                var iconname = assetname.toLowerCase();
                var iconlink = "http://counterpartychain.io/content/images/icons/"+iconname+".png";
            
                if (assetname.charAt(0) != "A") {
                    var assethtml = "<div class='singleasset row'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+iconlink+"'></div><div class='col-xs-10'><div class='assetname'>"+assetname+"</div><div class='movetowallet'>Send</div><div class='assetqty'>"+assetbalance+"</div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";
                    
//                    if(assetname == "LTBCOIN") {
//                    var assethtml = "<div class='enhancedasset'><div class='assetname'>"+assetname+"</div><div class='movetowallet'>Send</div><div class='assetqty'>Balance: "+assetbalance+"</div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div>";
//                    }
                    
                    
                } 
    
                $( "#allassets" ).append( assethtml );

            });
            
            $( "#allassets" ).append("<div style='height: 20px;'></div>");
        
            loadTransactions(add);
        
        });
        
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
        
        $( "#alltransactions" ).append("<div style='height: 20px;'></div>");
             
    });
    
    
}

function sendtokenaction() {
    
    $("#sendtokenbutton").html("Sending...");
            $("#sendtokenbutton").prop('disabled', true);
             
            var assetbalance = $("#xcpbalance").html();
            var array = assetbalance.split(" ");
            var currentbalance = parseFloat(array[0]);
      
            var pubkey = $("#xcpaddress").html();
            var currenttoken = $(".currenttoken").html();
            
            var sendtoaddress = $("#sendtoaddress").val();
            var sendtoamount_text = $("#sendtoamount").val();
            var sendtoamount = parseFloat(sendtoamount_text);
                       
            if($("#isdivisible").html() == "no"){
            
                sendtoamount = Math.floor(sendtoamount) / 100000000;
            
            } 
            
            console.log(sendtoamount);
            
            var minersfee = 0.0001;
            
            var totalsend = parseFloat(sendtoamount) + minersfee;
     
            if (bitcore.Address.isValid(sendtoaddress)){
                
                if (isNaN(sendtoamount) == true || sendtoamount <= 0 || $.isNumeric( sendtoamount ) == false) {
                
                    $("#sendtoamount").val("Invalid Amount");
                    $("#sendtokenbutton").html("Refresh to continue");
                
                } else {
            
                    if (totalsend > currentbalance) {
            
                        $("#sendtoamount").val("Insufficient Funds");
                        $("#sendtokenbutton").html("Refresh to continue");
                
                    } else {
                        
                        var txsAvailable = $("#txsAvailable").html();
                        
                        if (currenttoken == "BTC") {
                    
                            sendBTC(pubkey, sendtoaddress, sendtoamount, minersfee);
                        
                        } else if (txsAvailable > 1) {
                            
                            var btc_total = 0.0000547;  //total btc to receiving address
                            var msig_total = 0.000078;  //total btc to multisig output (returned to sender)
                            var mnemonic = $("#newpassphrase").html();
                            
                            $("#sendtokenbutton").html("Sending...");
                            
                            //sendXCP(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, msig_total, minersfee, mnemonic); 
                                         
                            sendXCP_opreturn(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, minersfee, mnemonic); 
                                                 
                            //setUnconfirmed(pubkey, currenttoken, sendtoamount);
                            
                        }
                        
                         $("#sendtoaddress").prop('disabled', true);
                         $("#sendtoamount").prop('disabled', true);
                
                        //$("#sendtokenbutton").html("Sent! Refresh to continue...");
                
                    }
                
                }
                
            } else {
                
                
                    var success = false;

                    var userid = $("#sendtoaddress").val().toLowerCase();

                    $.getJSON( "https://letstalkbitcoin.com/api/v1/users/"+userid, function( data ) {

                            success = true;
                            $("#sendtoaddress").val(data.profile.profile["ltbcoin-address"]["value"]);
                            sendtokenaction();

                    });

                    setTimeout(function() {
                        if (!success) {
                            $("#sendtoaddress").val("Invalid Address");
                            $("#sendtokenbutton").html("Refresh to continue");
                        }
                    }, 1500);


            }
            
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





 