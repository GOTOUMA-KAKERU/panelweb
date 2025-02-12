//ページロード時に発火
document.addEventListener('DOMContentLoaded', loadfinish);
function loadfinish(){
      //今いるページのメニューの背景をそろえてる。
      var filepath = document.location.pathname;
      filepath = filepath.replaceAll("/","");
      filepath = "m_u_" + filepath;
      var selected = document.getElementById(filepath);
      var selectedchild = selected.children;
      selectedchild[0].style.backgroundColor = "#7a6c52";
}


//websocket関連
const domain = window.location.hostname;
const ws = new WebSocket('wss://' + domain);  // サーバーのURLに接続
console.log(ws);

const history = "../others/img/i_history.svg";
const search = "../others/img/i_search.svg";
const sinput = document.getElementById("search_box_input");

//履歴一覧を表示
sinput.addEventListener("focus", function() {
    console.log("フォーカスされました！");
});

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

};