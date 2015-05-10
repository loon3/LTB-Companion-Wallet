//var address = $(".companion-tip-address").text();

var iconpath = chrome.extension.getURL('ltb-icon-orange-48.png');

var tipsplash = chrome.extension.getURL('tipsplash.html');

$('.companion-tip-button').each(function(i, obj) {
    var address = $(this).attr("data-address");
    var label = $(this).attr("data-label");
    var labelurl = encodeURIComponent(label);
    var tipbutton = "<div style='display: inline-block; padding: 5px;'><a href='"+tipsplash+"?address="+address+"&label="+labelurl+"' target='_blank'><img src='"+iconpath+"' height='24px' width='24px'></a></div>";

    $(this).html(tipbutton);
    
});


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


