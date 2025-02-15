//ページロード時に発火
document.addEventListener('DOMContentLoaded', loadfinish);
function loadfinish(){
      var selected = document.getElementById("m_u_home");
      var selectedchild = selected.children;
      selectedchild[0].style.backgroundColor = "#7a6c52";

      //dashboard本体のgridの幅と高さを決める
      let width = window.innerWidth;
      width = width -55;
      var columuns = Math.floor(width / 70);
      console.log(columuns);
      var i = 1;
      var columunscss = "";
      while(columuns <= i){
        columunscss += columunscss + "1fr";
        i++;
      }
      document.getElementById("dashboard").style.gridTemplateColumns = columunscss;
}


//websocket関連
const domain = window.location.hostname;
const ws = new WebSocket('wss://' + domain + "/proxy/3000/");  // サーバーのURLに接続
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
    if(query == ""){
        var list_nom = 1;
        while(list_nom <= 10){
        list_title = document.getElementById("s_" + list_nom);
        list_title.querySelector("p").textContent = "";
        list_title.querySelector("a").href = "";
        list_nom++;
        }
    }
}

//メッセージを受信
ws.onmessage = function(event){
    //console.log("受信データ:", event.data);  // データの内容を確認
    const data = JSON.parse(event.data);
    const suggestions = data[1];  // サジェスト候補リスト
    console.log(suggestions);
    const google = "https://www.google.com/search?q=";
    var list_nom = 2;
    var list_title = "";
    document.getElementById("s_1").querySelector("p").textContent = document.getElementById("search_box_input").value;
    document.getElementById("s_1").querySelector("a").href = google + document.getElementById("search_box_input").value;
        suggestions.forEach(suggestion => {
            list_title = document.getElementById("s_" + list_nom);
            list_title.querySelector("p").textContent = suggestion;
            list_title.querySelector("a").href = google + suggestion;
            list_nom++;
        });
    if(/^[a-zA-Z0-9]+$/.test(document.getElementById("search_box_input").value)){
        const hiragana = romajiToHiragana(document.getElementById("search_box_input").value);
        document.getElementById("s_1").querySelector("p").textContent = hiragana;
        document.getElementById("s_1").querySelector("a").href = google + hiragana;
    }
};



function romajiToHiragana(str) {
    // ローマ字とひらがなをマッピングするルール
    const romajiMap = {
        "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
        "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
        "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
        "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
        "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
        "ha": "は", "hi": "ひ", "fu": "ふ", "he": "へ", "ho": "ほ",
        "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
        "ya": "や", "yu": "ゆ", "yo": "よ",
        "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
        "wa": "わ", "wo": "を", "nn": "ん",

                // 濁音や半濁音の処理
                "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
                "za": "ざ", "ji": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
                "da": "だ", "ji": "ぢ", "zu": "づ", "de": "で", "do": "ど",
                "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
                "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",
        
                // 小さな文字の処理（ゃ、ゅ、ょなど）
                "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ",
                "sha": "しゃ", "shu": "しゅ", "sho": "しょ",
                "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ",
                "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ",
                "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ",
                "mya": "みゃ", "myu": "みゅ", "myo": "みょ",
                "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ",
                "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ",
                "ja": "じゃ", "zya": "じゃ", "ju": "じゅ", "jo": "じょ",
                "bya": "びゃ", "byu": "びゅ", " byo": "びょ",
                "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ",

                "-": "ー"
    };

    // ローマ字をひらがなに変換
    let hiraganaStr = '';
    let tempStr = '';
    
    for (let i = 0; i < str.length; i++) {
        tempStr += str[i];
        // マッピングがあればその部分を変換
        if (romajiMap[tempStr]) {
            hiraganaStr += romajiMap[tempStr];
            tempStr = '';  // 次の文字に備えてリセット
        }else {
            // 変換できない文字の場合、次の文字と合わせてチェック
            if (tempStr.length > 1) {
                return str;
            }
        }
    }

    return hiraganaStr;
}