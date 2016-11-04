$(function() {
  setTab();

  _X.UnBlock();
});

var setTab = function() {
  $("#tab-guide").append('<li role="presentation" ><a href="#grid-js" id="tab-grid-js" aria-controls="grid-js" role="tab" data-toggle="tab">Grid.js</a></li>');

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    alert($(this).attr("id"));
  });
}
