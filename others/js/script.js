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