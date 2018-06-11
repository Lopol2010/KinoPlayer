
var code = getCode(window.location.href);
function getCode(url) {
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
                return videoid;
            }
        }
}

function buildPlayer(code) {
    console.log(chrome.extension.getURL("pages/player.html"));
    $.get(chrome.extension.getURL("pages/player.html"), function(data) {
        document.getElementsByTagName('html')[0].innerHTML=data.replace("videocode", code);
    });
}

window.onload = function() {
    $("#headerFilm h1").css("display","inline")
    var active = chrome.extension.getURL("icons/active.png");
    var inactive = chrome.extension.getURL("icons/inactive.png");
    if(code != null){
        var r= $('<a id="show_player" style="float: left; margin-right:10px;cursor: pointer;"><img src="'+active+'" align="middle" alt="Смотреть онлайн" style="width:32px;height:32px;"></a>');
        $("#headerFilm").append(r);
        $("#show_player").click(function(){buildPlayer(code);});
    }else{
        var r= $('<a id="show_player" style="float: left; margin-right:10px;cursor: pointer;"><img src="'+inactive+'" align="middle" alt="Фильм не найден" style="width:32px;height:32px;"></a>');
        $("#headerFilm").append(r);
        $("#show_player").click(function(){alert("Фильм не найден");});
    }
};