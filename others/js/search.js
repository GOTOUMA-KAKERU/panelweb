const history = "../others/img/i_history.svg";
const search = "../others/img/i_search.svg";
const input = document.getElementById("search_box_input");

//履歴一覧を表示
input.addEventListener("focus", function() {
    console.log("フォーカスされました！");
});

//検索候補表示
input.addEventListener("input" , function(){
    var aaa = getSuggestions("あほ");
});

async function getSuggestions(query) {
    const proxy = "https://crosproxy.io/?";
    const url = `${proxy}https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`;
    try {
        const response = await fetch(url);
        const suggestions = await response.json();
        console.log(suggestions); // サジェスト結果を表示
        return suggestions;
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}