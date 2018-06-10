var c = chrome;
var dict = {};
var globalcode = -2;

function getCode(url) {
    if (dict[url] == undefined) {
        var id = url.split("-").slice(-1)[0].slice(0, -1);
        if (/^\d+$/.test(id) == false) {
            return null;
        }
        var new_url = "https://cors.io/?http://moonwalk.co/moonwalk/search_as?sq=&kinopoisk_id=" + id + "&search_for=&search_year=&commit=%D0%9D%D0%B0%D0%B9%D1%82%D0%B8"
        var xhr = new XMLHttpRequest();
        xhr.open('GET', new_url, false);
        xhr.send();
        if (xhr.status == 200) {
            var response_match = xhr.responseText.match(/moonwalk.pw\/(.*?)\/iframe/g)
            if (response_match == null) {
                return null;
            } else {
                var videoid = response_match.map(function(val) {
                    return val.replace("/iframe", "")
                })[0];
                dict[url] = videoid;
                return videoid;
            }
        }
    } else {
        return dict[url]
    }
}



function doInCurrentTab(tabCallback) {
    chrome.tabs.query({
            currentWindow: true,
            active: true
        },
        function(tabArray) {
            tabCallback(tabArray[0]);
        }
    );
}

function turnOff() {
    doInCurrentTab(function(tab) {
        c.browserAction.setIcon({
            path: 'icons/inactive.png',
            tabId: tab.id
        });
    })

    c.browserAction.onClicked.addListener(function(tab) {});
}

function open_player() {
    if (globalcode != -1 && globalcode != -2) {
        buildPlayer(globalcode);
    } 
    if(globalcode == -1)
    {
        alert("Фильм не найден");
    }
    // if(globalcode == -2)
    // {
    //     chrome.tabs.create({ url: "https://www.kinopoisk.ru/" });
    // }
}

chrome.browserAction.onClicked.addListener(open_player);

function buildPlayer(code) {
    turnOff();
    $.get("player.html", function(data) {
        data = data.replace("videocode", code);
        chrome.tabs.executeScript(null, {
            code: "document.getElementsByTagName('html')[0].innerHTML=`" + data + "`"
        });
    });
}

chrome.tabs.onActivated.addListener(function(info) {
    chrome.tabs.get(info.tabId, function(change) {
        if (change.url == undefined || change.url.match(/https:\/\/(www.)*kinopoisk\.ru\/film\/..*/) == null) {
            globalcode = -2;
            chrome.browserAction.setIcon({
                path: 'icons/inactive.png',
                tabId: info.tabId
            });

        } else {
            var code = getCode(change.url);
            if (code == null) {
                globalcode = -1;
                chrome.browserAction.setIcon({
                    path: 'icons/inactive.png',
                    tabId: info.tabId
                });
            } else {
                chrome.browserAction.setIcon({
                    path: 'icons/active.png',
                    tabId: info.tabId
                });
                globalcode = code;
            }
        }
    });
});
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
    if (tab.url == undefined || tab.url.match(/https:\/\/(www.)*kinopoisk\.ru\/film\/..*/) == null) {
        chrome.browserAction.setIcon({
            path: 'icons/inactive.png',
            tabId: tabId
        });
    } else {
        var code = getCode(tab.url);
        if (code == null) {
            globalcode = -1;
            chrome.browserAction.setIcon({
                path: 'icons/inactive.png',
                tabId: tabId
            });
        } else {
            chrome.browserAction.setIcon({
                path: 'icons/active.png',
                tabId: tabId
            });
            globalcode = code;
        }
    }
});