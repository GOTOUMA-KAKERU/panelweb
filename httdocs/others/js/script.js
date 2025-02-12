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
const ws = new WebSocket('ws://bookish-broccoli-x599qqw9547qf9qjw-3000.app.github.dev');  // サーバーのURLに接続

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
    var aaa = getSuggestions(sinput.value);
});

async function getSuggestions(query) {
    const message = "se:" + query;
    ws.send(message);
}