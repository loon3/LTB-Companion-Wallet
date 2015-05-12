var bitcore = require('bitcore');

$( document ).ready(function() {  
    
     var thisurl = window.location.href;
     var addressfromurl = parseURLParams(thisurl);
     var sendtoaddress = addressfromurl["address"][0];
     var addresslabel = addressfromurl["label"][0];
    var isxcpurl = addressfromurl["isxcp"][0];
    
    if (isxcpurl != "true") {
        $( "button.dropdown-toggle" ).toggleClass( "disabled" );
        $( "button.dropdown-toggle" ).css( "opacity", "1" );
    }
    
    $("#tip-label").html(addresslabel);
    $("#tip-address").html(sendtoaddress);

getExtStorage();
    
    var JsonFormatter = {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            return cipherParams;
        }
        };
    
    $("form").submit(function (e) {
      e.preventDefault();
    //};

   // $("#pinButton").click(function () {
        
        var pin = $("#inputPin").val();
        
        $("#inputPin").val("");
        
        chrome.storage.local.get(["passphrase"], function (data)
        {         
            var decrypted = CryptoJS.AES.decrypt(data.passphrase, pin, { format: JsonFormatter });          
            var decrypted_passphrase = decrypted.toString(CryptoJS.enc.Utf8);
            
            console.log(decrypted_passphrase.length);
            
            if (decrypted_passphrase.length > 0) {
                
                $("#pinsplash").hide();
                $(".hideEncrypted").show();
                
                existingExtPassphrase(decrypted.toString(CryptoJS.enc.Utf8));
                
            } 
        });
    });
    
    $( "#walletaddresses" ).change(function () {
        
        $("#sendtokenbutton").html("Send");
            $("#sendtoamount").val("");
            $("#sendtokenbutton").prop('disabled', false);
    
        var addr = $(this).val();
                    
        $("#xcpaddress").html(addr);
    
        getAssetsandBalances(addr);
        
        
        
        $(".selectedtoken").html("");
        
        
                    
    });
    
    $(document).on("click", '.singleasset', function (event) {  
  
          var insidediv = $(this).html();
        
          $("#assetdisplayed").html(insidediv);

          $(".selectedtoken").html("<div style='padding-top: 10px;'><input type='button' class='btn btn-default' id='tipsendbutton' value='Click'></div>");
        
          $("#sendtokenbutton").html("Send");
            $("#sendtoamount").val("");
            $("#sendtokenbutton").prop('disabled', false);
    
      
        
    });    
    
    
    $(document).on("click", '#sendtokenbutton', function (event) {  
        if ($("#sendtokenbutton").html() == "Click to continue") {
            
            $("#sendtokenbutton").html("Send");
            $("#sendtoamount").val("");
            $("#sendtokenbutton").prop('disabled', false);
            
        } else {
            
            sendtokenaction();  
            
        }
    });
    
    
});