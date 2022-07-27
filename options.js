window.onload=function (){


    const button=document.getElementById("submit")
    button.addEventListener('click',function () {

        submitSetting();

    })
    chrome.storage.local.get(['timeout','span','idleScan','lostFocusScan'], function(result) {

        console.log(result);

       let timeout=Number(result.timeout)/1000;
       let  span=Number(result.span)/1000;
       let  idleScan=Boolean(result.idleScan);
       let lostFocusScan=Boolean(result.lostFocusScan);
       document.getElementById("timeout").value=timeout;
       document.getElementById("span").value=span;
       document.getElementById("idleScan").checked=idleScan;
       document.getElementById("lostFocusScan").checked=lostFocusScan;

    })

}

function submitSetting(){
    console.log("into setting");
    chrome.runtime.sendMessage({1:"FuckYou !"}, function(response) {
    });
    let timeout=Number(document.getElementById("timeout").value)*1000
    let span=Number(document.getElementById("span").value)*1000
    let idle= Boolean(document.getElementById("idleScan").checked)
    let lost= Boolean(document.getElementById("lostFocusScan").checked)
    chrome.storage.local.set({'timeout':timeout});
    chrome.storage.local.set({'span':span});
    chrome.storage.local.set({'idleScan':idle});
    chrome.storage.local.set({'lostFocusScan':lost});

    window.close();

    document.getElementById("col").innerHTML="  <div class=\"card\"  style='margin-bottom: 10px; margin-top:10px '>\n" +
        "                <div class=\"card-body\">\n" +
        "                    Update Success !" +
        "                </div>\n" +
        "            </div>";

}

