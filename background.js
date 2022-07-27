var curTab = null;
var pageList = new Map();
var tempTab = null;

var winId = -1;
var status = true;

// =========一般来说只需要修改下面的几个变量=========
// 大于多少ms没有操作的标签页会被自动回收
var timeout = 100000;
// 间隔多少时间扫描一次，单位ms
var span = 100000;
// 这个Map用于存储被回收的页面，也就是需要渲染的数据
var closedPages = new Map();
// 该变量用于控制是否检测系统休眠
var idleScan = true;
// 该变量用于控制是否检测浏览器最小化
var lostFocusScan = false;



// const storage = window.localStorage

var timer = setInterval(() => {
        var date1 = new Date().getTime();
        for (let page of pageList) {
            if((date1 - page[1].time) >= timeout){
                closedPages.set(page[0], page[1]);
                let obj={};
                obj[page[0]]=page[1];
                chrome.storage.local.set(obj);
                chrome.tabs.remove(page[0]);
            }
        }
    }, span
);


function getAllPages() {
    // 取得所有标签页
    chrome.tabs.query( {}, (tabs) => {
        var date = new Date();
        for (let tab of tabs) {
            pageList.set(tab.id, {time: date.getTime(), tab: tab});
        }
        // 找到当前被激活的标签页
        chrome.tabs.query({active: true}, (tab) => {
            curTab = {id: tab[0].id, tab: {time: new Date().getTime(), tab: tab[0]}};
            pageList.delete(curTab.id);
        })

        console.log('已完成所有标签页加载');

    })
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'RecToNotNow',
        title: "将当前页面回收到现在不看",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: 'DontScan',
        title: "不检测当前标签页",
        contexts: ["all"]
    });
    getAllPages();
    chrome.storage.local.set({'timeout':100000});
    chrome.storage.local.set({'span':100000});
    chrome.storage.local.set({'idleScan':true});
    chrome.storage.local.set({'lostFocusScan':false});

    chrome.windows.getCurrent((win) => {
        if(win.id !== -1){
            console.log(win.id);
            winId = win.id;
        }
    })
});
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    chrome.storage.local.get(['timeout','span','idleScan','lostFocusScan'], function(result) {
        sendResponse("Update Option Success !");
        console.log("setting update");
        timeout=Number(result.timeout);
        span=Number(result.span);
        idleScan=Boolean(result.idleScan);
        lostFocusScan=Boolean(result.lostFocusScan);
        return true;
    })
    }
)
chrome.tabs.onUpdated.addListener(
    (id,info, tab)=> {
        console.log('update');

        if(id===null){console.log("null");}
        else
        {
            if (id !== curTab.id) {
                pageList.set(id, {time: new Date().getTime(), tab: tab});
            } else {
                curTab = {id: id, tab: {time: new Date().getTime(), tab: tab}};
            }
        }
    }
)

chrome.tabs.onActivated.addListener(
    (activeInfo) => {
        console.log('active')
        if (curTab !== null) {
            tempTab = curTab;
        }
        if (pageList.get(activeInfo.tabId) !== undefined) {
            curTab = {id: activeInfo.tabId, tab: {time: new Date().getTime(), tab: pageList.get(activeInfo.tabId)}};
        } else {
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                curTab = {id: activeInfo.tabId, tab: {time: new Date().getTime(), tab: tab}};
            })
        }
        if (tempTab !== null) {
            tempTab.tab.time = new Date().getTime();
            pageList.set(tempTab.id, tempTab.tab);
        }
        pageList.delete(activeInfo.tabId)
    }
)

chrome.tabs.onRemoved.addListener(
    (id, info) => {
        console.log('remove')
        tempTab = null;
        curTab = null;
        console.log(pageList.get(id));
        if(pageList.get(id) !== null){
            pageList.delete(id);
        }
        console.log('删除了=====>'+id);
        console.log(pageList);
    }
)

chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        console.log('click')
        if(info.menuItemId === 'RecToNotNow'){


            closedPages.set(tab.id, {time: new Date().getTime(), tab: tab});
            let obj={};
            obj[tab.id]={time: new Date().getTime(), tab: tab};
            chrome.storage.local.set(obj);
            chrome.tabs.remove(tab.id);
            curTab = null;
            console.log(closedPages);
        }else if(info.menuItemId === 'DontScan'){
            chrome.storage.local.clear();
            curTab = null;
            console.log(pageList);
        }
    }
)

if(idleScan){
    chrome.idle.onStateChanged.addListener(
        (state) => {
            console.log('idle')
            if(state == 'active'){
                getAllPages();
                timer = setInterval(() => {
                    console.log('timer');
                    var date1 = new Date().getTime();
                    for (let page of pageList) {
                        if((date1 - page[1].time) >= timeout){
                            closedPages.set(page[0], page[1]);
                            let obj={};
                            obj[page[0]]=page[1];
                            chrome.storage.local.set(obj);
                            chrome.tabs.remove(page[0]);
                            console.log(page[0]);
                        }
                    }
                }, span);;
                status = true;
            }else {
                status = false;
                pageList.clear();
                clearInterval(timer);
            }
        }
    )
}

chrome.runtime.onStartup.addListener(
    () => {
        chrome.windows.getCurrent((win) => {
            if(win.id !== -1){
                winId = win.id;
            }
        })
        chrome.storage.local.get(['timeout','span','idleScan','lostFocusScan'], function(result) {
            timeout=Number(result.timeout);
            span=Number(result.span);
            idleScan=Boolean(result.idleScan);
            lostFocusScan=Boolean(result.lostFocusScan);
        })
        console.log('startup')
        getAllPages();
        console.log(pageList);
    }
)

if(lostFocusScan){
    chrome.windows.onFocusChanged.addListener(
        (windowId) => {
            if(windowId !== -1){
                if(!status){
                    console.log('===重启回收服务===');
                    winId = windowId;
                    getAllPages();
                    timer = setInterval(() => {
                        console.log('timer');
                        var date1 = new Date().getTime();
                        for (let page of pageList) {
                            if((date1 - page[1].time) >= timeout){
                                closedPages.set(page[0], page[1]);
                                let obj={};
                                obj[page[0]]=page[1];
                                chrome.storage.local.set(obj);
                                chrome.tabs.remove(page[0]);
                                console.log(page[0]);
                            }
                        }
                    }, span);
                    status = true;
                }
            }else {
                chrome.windows.get(winId, (win) => {
                    if(win.state === 'minimized' && status){
                        status = false;
                        console.log('===暂停回收服务===');
                        pageList.clear();
                        clearInterval(timer);
                    }
                })
            }
        }
    )
}
