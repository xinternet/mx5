$(function() {
  setTab();

  _X.UnBlock();
});

var setTab = function() {
  $("#tab-guide").append('<li role="presentation" ><a href="#guide-content" id="grid-js" aria-controls="guide-content" role="tab" data-toggle="tab">Grid.js</a></li>');

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    switch($(this).attr("id")) {
      case "guide-index" :
        $("#guide-content iframe").prop("src", "https://xinternet.github.io/mx5/docs/index.html");
        break;
      case "grid-js" :
        $("#guide-content iframe").prop("src", "https://xinternet.github.io/mx5/docs/grid.js.html");
        break;
    }
  });
}
