
function x_InitForm2(){
  _X.UnBlock();
  
  var arrTheme = [{code:'x5', label:'x5 기본형'}];
  _X.DDLB_SetData(S_THEME_ID , arrTheme, 'x5', false, true);

  // 전체 태그 가져오기
  getLayoutTags();
  // // tab sql - event 
  // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  //   if(typeof(ed_before)=="undefined") setEditor( "before" );
  // });
}

function xe_GridLayoutComplete2(a_dg, ab_allcompleted){
  if(ab_allcompleted){ 
  }
}

function x_DAO_Retrieve2(a_dg){
  return 0;
}

function xe_EditChanged2(a_obj, a_val){
  if(a_obj==S_SYS_ID) {
    drawPreview();
    //console.log(max_code_q)
  }
}

function xe_InputKeyEnter2(a_obj, a_event, a_ctrlKey, a_altKey, a_shiftKey){
}

function xe_InputKeyDown2(a_obj, a_event, a_keyCode, a_ctrlKey, a_altKey, a_shiftKey){}

function x_DAO_Save2(a_dg){
  return 100;
}

function x_DAO_ChkErr2(){
  return true;
}

function x_DAO_Saved2(){
  makePreviewFile();

  return 100;
}

function x_DAO_Insert2(a_dg, row){
  return 100;
}

function x_Insert_After2(a_dg, rowIdx){ 
}

function x_DAO_Duplicate2(a_dg, row){
  return 100;
}

function x_Duplicate_After2(a_dg, rowIdx){
}

function x_DAO_Delete2(a_dg){
  return 100;
}

function x_DAO_Excel2(a_dg){
  return 100;
}

function x_DAO_Print2(){
}

function xe_TabChanging2(a_tab, a_new_idx, a_old_idx, a_new_tab, a_old_tab){
  
}

function xe_TabChanged2(a_tab, a_new_idx, a_old_idx, a_new_tab, a_old_tab){
}

function xe_GridDataChanged2(a_dg, a_row, a_col, a_newvalue, a_oldvalue){ 
 
}

function xe_GridRowFocusChange2(a_dg, a_newrow, a_oldrow){  
  return true;
}

function xe_GridRowFocusChanged2(a_dg, a_newrow){  
}

function xe_GridItemFocusChange2(a_dg, a_newrow, a_newcol, a_oldrow, a_oldcol){
}

function xe_GridDataLoad2(a_dg){  
}

function xe_GridButtonClick2(a_dg, a_row, a_col, a_colname){ 
}

function x_ReceivedCode2(a_retVal){ 
}

function xe_GridHeaderClick2(a_dg, a_col, a_colname){
}

function xe_GridItemDoubleClick2(a_dg, a_row, a_col, a_colname){
}

function xe_GridItemChecked2(a_dg, a_itemIndex, a_checked){
}

function xe_TreeItemExpanding2(a_dg, a_itemIndex, a_rowId){
}

function xe_ChartPointClick2(a_dg, a_event){
}

function xe_ChartPointSelect2(a_dg, a_event){
}

function xe_ChartPointMouseOver2(a_dg){
}

function xe_ChartPointMouseOut2(a_dg, a_event){
}

function x_Close2() {
  return 100;
}
