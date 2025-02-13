//ページロード時に発火
document.addEventListener('DOMContentLoaded', loadfinish);
function loadfinish(){
      var selected = document.getElementById("m_u_home");
      var selectedchild = selected.children;
      selectedchild[0].style.backgroundColor = "#7a6c52";
}


//websocket関連
const domain = window.location.hostname;
const ws = new WebSocket('wss://' + domain);  // サーバーのURLに接続
console.log(ws);

const i_history = "../others/img/i_history.svg";
const i_search = "../others/img/i_search.svg";
const sinput = document.getElementById("search_box_input");
var select_li = 1;

//履歴一覧を表示
sinput.addEventListener("focus", function() {
    console.log("フォーカスされました！");
    select_bg();
});
//候補をカーソルで移動
sinput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
        if(select_li <= 9){
            select_li += 1;
            select_bg();
        }else{
            select_li = 1;
            select_bg();
        }
    } else if (event.key === "ArrowUp") {
        if(select_li >= 2){
            select_li -= 1;
            select_bg();
        }else{
            select_li = 10;
            select_bg();
        }
    } else if (event.key === "Enter") {
        var link = document.getElementById("s_" + select_li).querySelector("a").href;
        if(link != ""){
            window.location.href = link;
        }
    }
});
function select_bg(){
    var i = 1;
    while(i <= 10){
        document.getElementById("s_" + i).style.backgroundColor = "#fff";
        i += 1;
    }
    document.getElementById("s_" + select_li).style.backgroundColor = "#ddd";
}


//検索候補表示
sinput.addEventListener("input" , function(){
        console.log(sinput.value);
        getSuggestions(sinput.value);
});
//検索候補取得リクエストする
async function getSuggestions(query) {
    var message = "se:" + query;
    ws.send(message);
}

//メッセージを受信
ws.onmessage = function(event){
    const data = JSON.parse(event.data);
    const suggestions = data[1];  // サジェスト候補リスト
    console.log(suggestions);
    const google = "https://www.google.com/search?q=";
    var list_nom = 2;
    var list_title = "";
    document.getElementById("s_1").querySelector("p").textContent = document.getElementById("search_box_input").value;
    document.getElementById("s_1").querySelector("img").src = i_search;
    document.getElementById("s_1").querySelector("a").href = google + document.getElementById("search_box_input").value;
        suggestions.forEach(suggestion => {
            list_title = document.getElementById("s_" + list_nom);
            list_title.querySelector("p").textContent = suggestion;
            list_title.querySelector("a").href = google + suggestion;
            list_nom++;
        });
};