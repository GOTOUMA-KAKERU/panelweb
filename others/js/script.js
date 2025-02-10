//ページロード時に発火
document.addEventListener('DOMContentLoaded', loadfinish);
function loadfinish(){
    fetch('../others/common/menu.html')
    .then(response => {
      if (!response.ok) {
       throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('menu_inport').innerHTML = html;

      //今いるページのメニューの背景をそろえてる。
      var filepath = document.location.pathname;
      filepath = filepath.replaceAll("/","");
      filepath = "m_u_" + filepath;
      var selected = document.getElementById(filepath);
      var selectedchild = selected.children;
      selectedchild[0].style.backgroundColor = "#7a6c52";
    })
    .catch(error => {
      console.error('Error loading the menu:', error);
    })
}