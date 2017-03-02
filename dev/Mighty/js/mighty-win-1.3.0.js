/**
 * Object :  mighty-win-1.2.0.js
 * @Description : Mighty-X WIINDOW 관련 RESIZE 및 window event 제어
 * @author :엑스인터넷정보 김양열
 * @since : 2013.02.10
 * @version : 1.2.9
 *
 * @Modification Information
 * <pre>
 *   since        author           Description
 *  ----------    --------    ---------------------------
 *   2013.02.10    김양열        최초생성
 */

var _Grids = new Array();
var _CurGrid = null;
var _GridRequestCnt = 0;
var _Charts = new Array();  //Chart관련 Flash 처리(2013.03.27 김양열)
var _CurChart;
var _Eval = "";
var _IsRetrieving=false;
var _ReturnValue = new Object();
var _FindCode = new Object();
var _IsModal = (window.dialogArguments?true:false);
var _IsPopup = (window.opener?true:false);
var _Caller  = (_IsModal?window.dialogArguments:(_IsPopup?window.opener:window.parent));
//추가(2015.06.29 KYY)
if(_IsModal || _IsPopup) {
  //수정(2015.06.30 KYY)
  if(document.location.href.indexOf("actionMain.do")>0) {
    mytop = window;
  } else {
    mytop = (_Caller.mytop!=null && typeof(_Caller.mytop)!="undefined" ? _Caller.mytop : _Caller.top);
  }
}
var _ParamValue;
var _RptCaller = new Object();

var _StopWatch = new _X.StopWatch();
var _EventLog  = "";

var _Pre_Win_Width  = 0;
var _Pre_Win_Height = 0;

/**
 * fn_name :  xm_BodyResize
 * Description : page resize 처리
 * param : a_init : resize 유무(true:false) 
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    --------------------------- 
 *   2013.02.10   김양열          최초 생성
 */
var xm_BodyResize = function(a_init){
  
  //화면 리사이징을 위한 조정 김억주
  var win_width   = $(window).width()-4;
  var win_height  = $(window).height()-2;

  if(a_init==null && win_width == _Pre_Win_Width && win_height == _Pre_Win_Height) {
    return;
  }
//alert(win_height);
  _Pre_Win_Width  = win_width;
  _Pre_Win_Height = win_height;

  $("#pageLayout").width(win_width);
  $("#pageLayout").height(win_height);
  
  xm_DivResize($("#pageLayout")[0], win_width, win_height, a_init);

  //Input 요소들 처리
  var cInputs = $(".detail_input,.option_input");
  for(var i=0; i<cInputs.length; i++) {
    var pWidth = $(cInputs[i]).parent().innerWidth();
    $(cInputs[i]).outerWidth(pWidth -0, true);
  }
  
  if(typeof(xe_BodyResize)!="undefined") {
    xe_BodyResize(a_init);
  }
};

/**
 * fn_name :  xm_DivResize
 * Description : page divs object resize
 * param : a_pobj : page div, a_width : page width
 *       a_height : page height, a_init : 사이즈변경유무  
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
var xm_DivResize = function(a_pobj, a_width, a_height, a_init){
  var cDivs = $(a_pobj).children("div");
  for (var i=0; i<cDivs.length; i++) {
    var cDiv = cDivs[i];
    
    if(typeof(cDiv.ResizeInfo)!="undefined")
    {
      var rInfo = cDiv.ResizeInfo;
      var new_width  = (a_init ? rInfo.init_width : 0);
      var new_height = (a_init ? rInfo.init_height : 0);

      //사이즈 증가방식 변경(2017.01.07 KYY)
      if(typeof(rInfo.anchor)!="undefined") {
        if(rInfo.anchor.x1!=0 && rInfo.anchor.x2!=0)
          new_width = rInfo.init_width + (a_width - a_pobj.ResizeInfo.init_width)*rInfo.anchor.x2; 
        if(rInfo.anchor.y1!=0 && rInfo.anchor.y2!=0) 
          new_height = rInfo.init_height + (a_height - a_pobj.ResizeInfo.init_height)*rInfo.anchor.y2;
      } else {
        if(typeof(rInfo.width_increase)!="undefined") {
          new_width = rInfo.init_width + (a_width - a_pobj.ResizeInfo.init_width)*rInfo.width_increase; 
        }
        if(typeof(rInfo.height_increase)!="undefined") {
          new_height = rInfo.init_height + (a_height - a_pobj.ResizeInfo.init_height)*rInfo.height_increase;        
        }
      }

      if(new_width>0) {
        $(cDiv).outerWidth(new_width,true);
      }
      if(new_height>0)
        $(cDiv).outerHeight(new_height,true);

      if(new_width>0 || new_height>0) {
        if($(cDiv).children("div").length>0 || $(cDiv).children("input,select").length>0){
          xm_DivResize(cDiv, new_width, new_height, a_init);
        }
      }
    }
  }

  //Input요소 처리
  for (var i=0; i<$(a_pobj).children("input,select").length; i++) {
    var cInput = $(a_pobj).children("input,select")[i];

    if(typeof(cInput.ResizeInfo)!="undefined")
    {
      var rInfo = cInput.ResizeInfo;
      var new_width  = 0;
      var new_height = 0;

      if(typeof(rInfo.anchor)!="undefined") {
        if(rInfo.anchor.x1!=0 && rInfo.anchor.x2!=0)
          new_width = rInfo.init_width + (a_width - a_pobj.ResizeInfo.init_width)*rInfo.anchor.x2;
        if(rInfo.anchor.y1!=0 && rInfo.anchor.y2!=0)
          new_height = rInfo.init_height + (a_height - a_pobj.ResizeInfo.init_height)*rInfo.anchor.y2;
      } else {
        if(typeof(rInfo.width_increase)!="undefined") {
          new_width = rInfo.init_width + (a_width - a_pobj.ResizeInfo.init_width)*rInfo.width_increase; 
        }
        if(typeof(rInfo.height_increase)!="undefined") {
          new_height = rInfo.init_height + (a_height - a_pobj.ResizeInfo.init_height)*rInfo.height_increase;        
        }
      }
      
      if(new_width>0)
        $(cInput).outerWidth(new_width, true);
      if(new_height>0)
        $(cInput).outerHeight(new_height, true);      
    }
  }

};

/**
 * fn_name :  xm_InputInitial
 * Description :object style  적용
 * param :
 *   
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
var xm_InputInitial = function(){
  //date style  적용
  $(".detail_box,.option_input_bg").find(".detail_date,.option_date,.option_date2,.search_date,.search_date2").datepicker({
         changeMonth: true,
         changeYear: true,
         dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],         
         dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],          
         monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],         
         monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
         nextText: '다음 달',
         prevText: '이전 달',
         showButtonPanel: true,          
         currentText: '오늘 날짜',          
         closeText: '닫기',
         dateFormat: "yy-mm-dd",
         
         showMonthAfterYear: true,   
         yearSuffix: ' 년 ',   
         monthSuffix: ' 월',   
         showOtherMonths: true, // 나머지 날짜도 화면에 표시   
         selectOtherMonths: true
                 
  });
  
  $(".detail_box,.option_input_bg").find(".detail_date,.option_date,.option_date2,.search_date,.search_date2").each(function (idx, elem) {
        if ($(elem).is(":input")) 
          this.value = (this.value.length==8?this.value=_X.ToString(this.value, "yyyy-mm-dd"):this.value); 
          $(elem).change(function(event) {;$(elem).val(_X.ToString(this.value, "yyyy-mm-dd"));if(!_X.ChkDate(this.value))$(elem).val("");});
     });
     
  $(".detail_box,.option_input_bg").find(".detail_yymm,.option_yymm,.option_yymm2,.search_yymm,.search_yymm2").each(function (idx, elem) {
        if ($(elem).is(":input")) 
          this.value = (this.value.length==6?this.value=_X.ToString(this.value+'01', "yyyy-mm"):this.value); 
          $(elem).change(function(event) {;$(elem).val(_X.ToString(this.value+'01', "yyyy-mm"));});
     });
     
  //버튼 jQueryUI 작업
  //$( "input[type=button], a, button" )
  $(".ui-button").not(".ui-button-icon-only")
    //.css({'font-size': '9pt','padding':'0px 0px 0px 0px','height':'21px','font-family':'맑은 고딕, Malgun Gothic' })  
    .css({'font-size': '12px','padding':'0px 0px 0px 0px','height':'22px'}) 
    .removeClass('ui-corner-all')
    .hover(
            function () {
                $(this).addClass('ui-state-hover');
            },
            function () {
                $(this).removeClass('ui-state-hover');
            }
        )
    .click(function( event ) {
      event.preventDefault();
  });
  
  //Checkbox 스타일 적용              
  var chkObjs = $(".detail_box,.option_input_bg").find('input:checkbox,input:radio');
  for(var i=0; i<chkObjs.length; i++) {
    //$(chkObjs[i]).prettyCheckable();
    //$(chkObjs[i])[0].check = function () {console.log(1);$(this).prop('checked', true).attr('checked', true).parent().find('a:first').addClass('checked'); xm_InputChanged(this);};
    //$(chkObjs[i])[0].uncheck = function () {console.log(2);$(this).prop('checked', false).attr('checked', false).parent().find('a:first').removeClass('checked'); xm_InputChanged(this);};
    //$(chkObjs[i])[0].enable = function () {$(this).removeAttr('disabled').parent().find('a:first').removeClass('disabled');};
    //$(chkObjs[i])[0].disable = function () {$(this).attr('disabled', 'disabled').parent().find('a:first').addClass('disabled');};
  };
  
  //Select 스타일 적용   
  //속도가 느림 다른걸로 변경해야 함(2015.03.10 KYY)      
  //$('select').selectBox();
  
  // mask - 박종현
  $(".detail_box,.option_input_bg").find(".detail_date .option_date .option_date2 .search_date .search_date2").inputmask("date", {yearrange: { minyear: 1900, maxyear: 9999 }}); 
  //$(".option_date").inputmask("date", {yearrange: { minyear: 1900, maxyear: 9999 }}); 
  //$(".option_date2").inputmask("date", {yearrange: { minyear: 1900, maxyear: 9999 }}); 
  //$(".search_date").inputmask("date", {yearrange: { minyear: 1900, maxyear: 9999 }}); 
  //$(".search_date2").inputmask("date", {yearrange: { minyear: 1900, maxyear: 9999 }}); 
  $(".detail_box,.option_input_bg").find(".detail_hhmm").inputmask("hh:mm", {placeholder: "00:00"});//(2015.01.27 이상규)

  $(".detail_box,.option_input_bg").find(".detail_amt").inputmask("decimal", { radixPoint: ".",  autoGroup: true, groupSeparator: ",", digits: 0, repeat: 16}); 
  $(".detail_box,.option_input_bg").find(".detail_number").inputmask("decimal", { }); 
  $(".detail_box,.option_input_bg").find(".detail_float1").inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", digits: 1, repeat: 15 }); 
  $(".detail_box,.option_input_bg").find(".detail_float2").inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", digits: 2, repeat: 14 }); 
  $(".detail_box,.option_input_bg").find(".detail_float3").inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", digits: 3, repeat: 13 }); 
  $(".detail_box,.option_input_bg").find(".detail_float4").inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", digits: 4, repeat: 12 }); 
  
  $(".detail_box,.option_input_bg").find(".detail_cust").inputmask("999-99-99999",{placeholder:" ", clearMaskOnLostFocus: true }); 
  $(".detail_box,.option_input_bg").find(".detail_register").inputmask("999999-9999999",{placeholder:" ", clearMaskOnLostFocus: true }); 
  $(".detail_box,.option_input_bg").find(".detail_zipcode").inputmask("999-999",{placeholder:" ", clearMaskOnLostFocus: true }); 
  
  //이벤트 처리  
  $(".detail_box,.option_input_bg").on('keydown','input,textarea,select', xm_InputKeyDown);
  $(".detail_box,.option_input_bg").on('change', 'input,textarea,select',xm_InputChanged);
  $(".detail_box,.option_input_bg").on('click', 'input,textarea,select',xm_InputClicked);
  $(".detail_box,.option_input_bg").on('focus', 'input,textarea,select',xm_InputFocused);
//  //Enter키 Tab처리(2015.05.12 KYY)
/*  
  $(document).on('keyup', 'input,select', function(e) {
      try {   
        if(e.keyCode == 13 && e.target.type !== 'submit') {
          var inputs =   $(document).find(":input:visible:not(disabled):not([readonly])"),
          idx = inputs.index(e.target);
          if (idx == inputs.length - 1) {
              inputs[0].select();
          } else {
            inputs[idx + 1].focus();
              inputs[idx + 1].select();
          }
        }
      } catch(e) {}
      
    }); 
*/    
};

//textarea 최대글자수 제한 처리 (2015.05.29 이상규)
var xm_InputChangeTextArea = function(a_obj){
  var setValue = function() {
    var dgObj = eval("" + a_obj.getAttribute("grid"));
    var is_Share = a_obj.SyncGrid._Share;
    if(is_Share) {a_obj.SyncGrid._Share = false;}
    dgObj.SetItem(dgObj.GetRow(), a_obj.getAttribute("id"), _X.TextAreaEnterE(a_obj.value));
    if(is_Share) {a_obj.SyncGrid._Share = true;}
  }
  
  var maxLength = a_obj.getAttribute ? parseInt(a_obj.getAttribute("maxlength")) : 100;
  if(a_obj.value.length >= maxLength) {
    alert("글자 입력수가 제한 값을 초과하였습니다.");
    a_obj.value = a_obj.value.substring(0, maxLength - 2);
    setValue();
    event.returnValue = false;
  } else {
    setValue();
  }
}
var ICT = xm_InputChangeTextArea;

/**
 * fn_name :  xm_InputKeyDown
 * Description :object keydown event 처리
 * param :
 *   
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
var xm_InputKeyDown = function(event){
  var keyCode = event.keyCode;

  if(keyCode == KEY_ENTER) {
    if(typeof(xe_InputKeyEnter)!="undefined"){
      xe_InputKeyEnter(this, event, event.ctrlKey, event.altKey, event.shiftKey);
    }
  } else {  
    if(typeof(xe_InputKeyDown)!="undefined"){
      xe_InputKeyDown(this, event, event.keyCode, event.ctrlKey, event.altKey, event.shiftKey);
    }
  }
};

/**
 * fn_name :  xm_InputChanged
 * Description :object data chagned event 처리
 * param :
 *   
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
var xm_InputChanged = function(a_obj){
  if(this.id!=undefined)
    a_obj = this;
  //Grid와 데이타 동기화 처리
  
  xm_InputSyncGrid(a_obj);
  
  /* param oldvalue 추가 (2015.11.12 이상규) */
  xm_EditChanged(a_obj, a_obj.value, a_obj.oldValue);
  
  /* radio oldvalue 적용 (2015.11.12 이상규) */
  if ( this.tagName.toLowerCase() == "input" ) {
    if ( this.type == "radio" ) {
      var radio_ = document.getElementsByName(this.name);
      for ( var i = 0, ii = radio_.length; i < ii; i++ ) {
        radio_[i].oldValue = this.value;
      }
    }
  }
};

/* checkbox, select oldvalue 적용 (2015.11.12 이상규) */
var xm_InputClicked = function(){
  if ( this.tagName.toLowerCase() == "input" ) {
    if ( this.type == "checkbox" ) {
      this.oldValue = this.checked ? "N" : "Y";
      this.value    = this.checked ? "Y" : "N";
    }
  }
  else if ( this.tagName.toLowerCase() == "select" ) {
    this.oldValue = this.value;
  }
};

/* input text oldvalue 적용 (2015.11.12 이상규) */
var xm_InputFocused = function(){
  if( this.type == "text" ){
    this.oldValue = this.value;
  }
};

var xm_EditChanged = function(a_obj, a_val, a_oldVal){
  //_X.MsgBox(a_obj.id + " : " + a_val);
  if(typeof(xe_EditChanged)!="undefined"){
    xe_EditChanged(a_obj, a_val, a_oldVal);
  }
};

var xm_InputSyncGrid = function(a_obj){
  //Grid와 데이타 동기화 처리
  if(typeof(a_obj.SyncGrid)!="undefined" && a_obj.SyncGrid.GetRow()>0){
    /*2015.02.03 이상규
      문제발생시점: 프리폼의 값이 변경될 때
      
      문제내용: xm_InputSyncGrid() 함수에서 SetItem() 함수를 호출하여 그리드의 값을 변경 하는 과정에서
                SetItem() 함수의 내부로직 중 _Share = true 상태일 때 xe_M_RealGridDataChange() 함수를 호출 함.
                xe_M_RealGridDataChange() 함수의 내부로직 중 x_GridRowSync() 호출로 인해 프리폼을 sync 하는 작업을 한번 더 하게됨.
                
      해결방법: a_obj.SyncGrid._Share = true; 상태일 때 SetItem() 에서의 x_GridRowSync(); 호출을 막기 위해 일시적으로 a_obj.SyncGrid._Share = false; 처리.*/
    var is_Share = a_obj.SyncGrid._Share;
    if(is_Share) {a_obj.SyncGrid._Share = false;}
    
    //checkbox 관련 수정(2014.06.18 ojkim1219)
    if($("#"+a_obj.id).prop('type') != undefined){  //SELECT 는 type값이 없음
      if($("#"+a_obj.id).prop('type').toUpperCase() == "CHECKBOX"){
        if($("#"+a_obj.id).prop('checked')==true){
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, 'Y');
        }else{
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, 'N');
        }
      }else{
        if(typeof(a_obj.formatString)!="undefined") {
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, $("#"+a_obj.id).inputmask());
        } else if(a_obj.SyncGrid.GetColumnTypeByName(a_obj.SyncColumn)=='datetime'){
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, _X.ToDate(a_obj.value, 'YYYY-MM-DD'));
        } else if(_X.IsNull( a_obj.SyncGrid.GetColumnTypeByName(a_obj.SyncColumn), "" ).indexOf('number') != -1 || a_obj.SyncGrid.GetColumnTypeByName(a_obj.SyncColumn)=='numeric'){
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, a_obj.value.replace(/,/gi,''));
        } else {  
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, a_obj.value);
        } 
        // class 명으로 포멧 변경 - 박종현  
        if($("#" + a_obj.id).hasClass('detail_cust')){
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, a_obj.value.replace(/-/gi,''));
        }else if($("#" + a_obj.id).hasClass('detail_register')){
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, a_obj.value.replace(/-/gi,''));
        }else if($("#" + a_obj.id).hasClass('detail_zipcode')){
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, a_obj.value.replace(/-/gi,''));
        }else if($("#" + a_obj.id).hasClass('detail_hhmm')){//(2015.01.28 이상규)
          a_obj.SyncGrid.SetItem(a_obj.SyncGrid.GetRow(), a_obj.SyncColumn, a_obj.value.replace(/:/gi,''));
        }
      }
    }
    
    if(is_Share) {a_obj.SyncGrid._Share = true;}
  } 
};

//화면에 로딩된 Flash 오브젝트 등을 Clear한다. (2013.04.07 김양열)
var xm_ClearObject = function (a_win) { 
  //alert("xm_ClearObject : " + a_win._Grids.length);
  if(a_win==null)
    return;

  if(typeof(a_win._Grids)!="undefined"){
    var glen = a_win._Grids.length;
    for(var i=glen -1; i>=0; i--)
    {
      if(a_win._Grids[i]==null)
        continue;
      var gridDiv = a_win._Grids[i]._Div;
      a_win._Grids[i].removeEvents(); //이벤트 제거 로직 추가(2013.03.31 김양열)
/*      
      if (a_win._Grids[i].addEventListener)
        removeEvent = function(ob, type, fn ) {
          ob.removeEventListener(type, fn, false );
        };
      else if (document.attachEvent)
        removeEvent = function(ob, type, fn ) {
          var eProp = type + fn;
          ob.detachEvent('on'+type, ob[eProp]);
          ob[eProp] = null;
          ob["e"+eProp] = null;
        };
*/
      if(typeof(a_win.FABridge)!="undefined" && a_win.FABridge["Grid_" + a_win._Grids[i].id]!=null) {
        a_win.FABridge["Grid_" + a_win._Grids[i].id].target.releaseASObjects();//메모리 정리(2013.04.15 김양열)
      }
      _X.removeSWF(a_win._Grids[i]);  //메모리 정리(2015.03.09 김양열)
      //alert(a_win._Grids[i].id);
      //$("#" + a_win._Grids[i].id).remove(); //메모리 정리(2013.04.07 김양열)
      _X.purge(gridDiv);
      //_X.purge(a_win._Grids[i]);
      gridDiv.innerHTML = "";
      a_win._Grids[i] = null;
    }
  }
  //Chart관련 Flash 처리(2013.03.27 김양열)
  if(typeof(a_win._Charts)!="undefined"){
    for(var i=0; i<a_win._Charts.length; i++)
    {
      var chartDiv = a_win._Charts[i]._Div;
      $("#" + a_win._Charts[i].id).remove();  //메모리 정리(2013.04.07 김양열)
      _X.removeSWF(a_win._Charts[i]); //메모리 정리(2015.03.09 김양열)
      _X.purge(chartDiv);
      
      chartDiv.innerHTML = "";
      a_win._Charts[i] = null;
    } 
  } 
  
  if(typeof(a_win._Grids)!="undefined"){  
    a_win._Grids = null;
    a_win._CurGrid = null;
    a_win._Charts = null;
    a_win._CurChart = null;
    a_win._Eval = null;
    a_win._ReturnValue = null;
    a_win._FindCode = null;
    a_win._isModal = null;
  } 
  
  if(window.addEventListener) {
    window.removeEventListener("mousedown",xm_mousedown);
  } else {
    window.detachEvent("onclick",xm_mousedown);
  }
  
  //메모리 정리(2015.03.08 KYY)
  _X.purge(a_win);
};

//grid mouse click 제어(focus)
function xm_mousedown(e) {
  if(window._Grids==null || window._Grids.length==0) return;
  if(typeof(window._GridBorder)=="undefined"||window._GridBorder==false) return;
    var elt = e.target;

    if (elt == undefined) {
        elt = e.srcElement;
    }

    if (elt instanceof HTMLObjectElement || elt instanceof HTMLEmbedElement) {
        for (var i=0;i<window._Grids.length;i++) {
            if (elt.id== window._Grids[i].id) {
              window._CurGrid = window._Grids[i];
            window._Grids[i].SetStyles({
                  "grid": {"border":"#ad5a5a,2"}
              });
            } else {
            window._Grids[i].SetStyles({
              "grid": {"border":"#ff84a3c0,1"}
            });
            }
        }
    }
}

if(window.addEventListener)
  window.addEventListener("mousedown",xm_mousedown,true);
else
  window.attachEvent("onclick",xm_mousedown);
