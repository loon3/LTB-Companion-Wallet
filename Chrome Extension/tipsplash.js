function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function getExtStorage()
{
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen"], function (data)
    {
        if ( data.firstopen == false ) {
        
            if ( data.encrypted == false) {
            
                $("#pinsplash").hide();
                $(".hideEncrypted").show();
                  
                existingExtPassphrase(data.passphrase);
            
            } else if ( data.encrypted == true) {
            
                
                $(".hideEncrypted").hide();
                $("#pinsplash").show();
               
            } 
       
        } else {
            
            $("#tipsendcomplete").html("<div align='center'><div style='padding: 50px 0 30px 0; font-size: 18px; width: 480px;'>Click on the LTB Companion Wallet icon to the right of your browser address bar to set up your wallet.</div><div><img src='setupss.png'></div></div>");
            
            $("#yourtxid").hide();
        }
    });
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

function existingExtPassphrase(string) {
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#passphrasefromstorage").html(string);
       
    
//    convertPassphrase(m2);
    assetDropdown(m2);
//    
//    $('#allTabs a:first').tab('show')
}

function convertPassphrase(m){
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    var derived = HDPrivateKey.derive("m/0'/0/" + 0);
    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
    var pubkey = address1.toString();    
    
//    $("#xcpaddressTitle").show();
//    $("#xcpaddress").html(pubkey);
    
//    getPrimaryBalance(pubkey);
    
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
        
        if (i == 0) {
            $("#xcpaddress").html(pubkey);
            getAssetsandBalances(pubkey);
            
        }
    }
}




function getAssetsandBalances(add) {
    
    getBTCBalance(add);
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+add;
    
    var source_html = "https://counterpartychain.io/api/balances/"+add;
    
    var xcp_source_html = "http://counterpartychain.io/api/address/"+add;
    
    $( ".assetselect" ).html("");
    $("#assetdisplayed").html("");
    
    
    
    $.getJSON( xcp_source_html, function( data ) {  
        //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 
        
        var xcpbalance = parseFloat(data.xcp_balance).toFixed(8);    
        
        if (xcpbalance == 'NaN' || typeof xcpbalance === 'undefined') {
            xcpbalance = 0;
        }
    
        $.getJSON( source_html, function( data ) {
            
            //$(".assetselect").append("<option label='BTC'>BTC - Balance: "+btcbalance+"</option>");
            
            var xcpicon = "http://counterpartychain.io/content/images/icons/xcp.png";
            
            if (xcpbalance != 0) {
                
                $("#tokendropdown").show();
            
                var xcphtml = "<div class='row' style='width: 315px;'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+xcpicon+"'></div><div class='col-xs-10'><div class='assetname'>XCP</div><div>Balance: <span class='assetqty'>"+xcpbalance+"</span></div><div id='assetdivisible' style='display: none;'>yes</div></div></div>";
                
                
                $("#assetdisplayed").html(xcphtml);
                
                $(".assetselect").append("<li role='presentation'><a class='singleasset' role='menuitem' tabindex='-1' href='#'>"+xcphtml+"</a></li>");
        
            }
            
            if (data.data.length == 0) {
                $(".assetselect").append("<li role='presentation'><div style='padding: 10px;'>You have no tokens at this address.</div></li>");
                $("#tokendropdown").hide();
            }
        
            $.each(data.data, function(i, item) {
                var assetname = data.data[i].asset;
                var assetbalance = data.data[i].amount; //.balance for blockscan
                if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}
                
                var iconname = assetname.toLowerCase();
                var iconlink = "http://counterpartychain.io/content/images/icons/"+iconname+".png";
            
                if (assetname.charAt(0) != "A") {
                    
                    $("#tokendropdown").show();
                    
                    var assethtml = "<div class='row' style='width: 315px;'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+iconlink+"'></div><div class='col-xs-10'><div class='assetname'>"+assetname+"</div><div>Balance: <span class='assetqty'>"+assetbalance+"</span></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";
                    
                 
                    $(".assetselect").append("<li role='presentation'><a class='singleasset' role='menuitem' tabindex='-1' href='#'>"+assethtml+"</a></li>");
                    
                    var assetdisplayed = $("#assetdisplayed").html();
                    
                    if (assetdisplayed.length == 0) {
                          
                        $("#assetdisplayed").html(assethtml);
                        
                    }
        
                } 

            });
            

        
        });
        
    });
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

function showBTCtransactions(transactions) {
    
    if (transactions == 0) {
              
        $("#btcbalance").html("<div style='font-size: 12px;'>Deposit bitcoin to send tokens from this address.<span id='txsAvailable' style='display: none;'>"+transactions.toFixed(0)+"</span></div>");        
        $("#tokendropdown").hide();        
    } else {
    
        $("#btcbalance").html("<div style='font-size: 12px;'>You can perform <span id='txsAvailable'>"+transactions.toFixed(0)+"</span> transactions</div>");
        $("#tokendropdown").show();
                
    }
        
            //var titletext = data + " satoshis";

            //$("#btcbalbox").prop('title', titletext);       
            $("#btcbalbox").show();
}


function sendtokenaction() {
    
            $("#sendtokenbutton").html("Sending...");
            $("#sendtokenbutton").prop('disabled', true);
            
            var currenttokenhtml = $("#assetdisplayed").find(".assetname");
            var currenttoken = currenttokenhtml.html();
            var assetbalance = $("#assetdisplayed").find(".assetqty");

            var currentbalance = assetbalance.html();
      
            var pubkey = $("#xcpaddress").html();
            //var currenttoken = $(".currenttoken").html();
            
            //var sendtoaddress = $("#sendtoaddress").html();
    
            var thisurl = window.location.href;
            var addressfromurl = parseURLParams(thisurl);
            var sendtoaddress = addressfromurl["address"][0];
    
            console.log(sendtoaddress);
    
            var sendtoamount_text = $("#sendtoamount").val();
            var sendtoamount = parseFloat(sendtoamount_text);
                       
            var isdivisible = $("#assetdisplayed").find("#assetdivisible");
    
            var divisible = isdivisible.text();
            
     
            if (bitcore.Address.isValid(sendtoaddress)){
                
                if (isNaN(sendtoamount) == true || sendtoamount <= 0 || $.isNumeric( sendtoamount ) == false) {
                
                    $("#sendtoamount").val("Invalid Amount");
                    $("#sendtokenbutton").html("Click to continue");
                    $("#sendtokenbutton").prop('disabled', false);
                
                } else {
                    
                    console.log(sendtoamount);
                    console.log(currentbalance);
            
                    if (sendtoamount > currentbalance) {
            
                        $("#sendtoamount").val("Insufficient Funds");
                        $("#sendtokenbutton").html("Click to continue");
                        $("#sendtokenbutton").prop('disabled', false);
                
                    } else {
                        
                        console.log(divisible);
                        
                        
                        
                        if(divisible == "no"){
            
                            sendtoamount = Math.floor(sendtoamount) / 100000000;
            
                        } 
            
                        console.log(sendtoamount);
                        
                        var txsAvailable = $("#txsAvailable").html();
                        
                        if (currenttoken == "BTC") {
                    
                            //sendBTC(pubkey, sendtoaddress, sendtoamount, minersfee);
                        
                        } else if (txsAvailable > 1) {
                            
                            var btc_total = 0.0000547;  //total btc to receiving address
                            var minersfee = 0.0001;
                            var mnemonic = $("#passphrasefromstorage").html();
                            
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

//                    var userid = $("#sendtoaddress").val().toLowerCase();
//
//                    $.getJSON( "https://letstalkbitcoin.com/api/v1/users/"+userid, function( data ) {
//
//                            success = true;
//                            $("#sendtoaddress").val(data.profile.profile["ltbcoin-address"]["value"]);
//                            sendtokenaction();
//
//                    });
//
//                    setTimeout(function() {
//                        if (!success) {
//                            $("#sendtoaddress").val("Invalid Address");
//                            $("#sendtokenbutton").html("Refresh to continue");
//                        }
//                    }, 1500);


            }
            
}


