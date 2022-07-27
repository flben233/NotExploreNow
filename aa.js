var i=1;


function  close(){
    $('#myModal').modal('hide');
}






var ids=[];
window.onload=function (){



    var ay=[];
chrome.storage.local.get(null, function(result) {

    // var views = chrome.extension.getBackgroundPage();
     console.log(result);
        for(let el in result){

            console.log(el)
            if(!isNaN(Number(el))){
                console.log("Into array"+el);
                ay.push(result[el]);
                ids.push(el);
            }
        }

        for(let i=ay.length-1;i>=0;i--){

            if(ay[i].tab.url!=null&&ay[i].tab.url!=='undefined')
            addNew(ay[i].time,ay[i].tab.url,ay[i].tab.favIconUrl,ay[i].tab.title,ay[i].tab.id);
        }
        if(ay.length===0){
            let HTML="<div class='row animate__animated animate__flipInX overflow-hidden' id='row"+i+"'  style='margin-bottom: 10px; margin-top:10px '>\n" +
                "                <div class=\"col-md-12\">\n" +
                "                    <div class=\"card\" style=\"width: 18rem;\">\n" +
                "                        <div class=\"card-body\">\n" +
                "                            <p class='card-title'>No Page Recycled !</p>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>"
            document.getElementById("container").innerHTML+=HTML;
        }
     });
 }


const but=document.getElementById("settings");
but.addEventListener('click',function (){




    chrome.storage.local.remove(ids);
    ids=[];
    location.reload();

});




function d(a){

    let row="row"+a;
    let tab="tab"+a;
    document.getElementById(row).classList.add("visually-hidden");
    chrome.storage.local.remove(document.getElementById(tab).value);
    location.reload();
}
function addNew(date,urll,favicon,title,tabId){

    let HTML="<div class='row animate__animated animate__flipInX overflow-hidden' id='row"+i+"'  style='margin-bottom: 10px; margin-top:10px '>\n" +
        "                <div class=\"col-md-12\">\n" +
        "<input type='hidden' id='tab"+i+"' value='"+tabId+"'>"+
        "                    <div class=\"card\" style=\"width: 18rem;\">\n" +
        "                        <div class=\"card-body\">\n" +
        "                            <p class='card-title'>"+new Date(date).getHours()+":"+new Date(date).getMinutes()+"  Recycle Page</p>\n" +
        "              <p>     <img src='"+favicon+"'>        <a href='"+urll+"' class='card-link'>"+title+"</a></p> " +
        "<div class='btn btn-primary'  id='button"+i+"'>Ignore</div>"+
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>"

    document.getElementById("container").innerHTML+=HTML;
    for(let temp = 1;temp<=i;temp++){
        let but="button"+temp;
        let button = document.getElementById(but);
        button.addEventListener("click", function () {
            d(temp);
        });
    }
    i++;

}


