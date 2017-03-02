/**
 * Object :  mighty-win-1.2.0.js
 * @Description : ajax 차리 JavaScript
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

var _X = new Object();

var mytop = top;
var _CurSysCd = "";

var _X_AjaxResult;
var _Row_Separate = "˛";  //String.fromCharCode(6); // Record Separator 
var _Col_Separate = "¸";  //String.fromCharCode(5); // Field  Separator
var _Field_Separate = "ª";
var _Field_Separate2 = "º";
var _Param_Separate = String.fromCharCode(7); // Record Separator

//추가(2015.06.26 KYY)
if(typeof(top._CPATH)=="undefined") {top._CPATH="";}

//비활성화 시간체크를 위한 이벤트 추가(2015.04.07 KYY)
//$(this).mousemove(function(e) {if(typeof(mytop.CheckIdleTime)!="undefined"){mytop.CheckIdleTime()}});
//$(this).keypress(function(e) {if(typeof(mytop.CheckIdleTime)!="undefined"){mytop.CheckIdleTime()}});

// Functions to optimize JavaScript compression (2015.03.09 KYY)
function getElementById(id) {
  var el = null;
  try {
    el = document.getElementById(id);
  }
  catch (e) {}
  return el;
}

function createElement(el) {
  return document.createElement(el);
}    


/**
 * fn_name :  _X.ClosePopWin
 * Description : popup window close
 * param :  
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.ClosePopWin = function ()
{
  $('.menu_mid').children("div").css('display', 'none');
  $('.menu_mid').parent("div").removeClass('menu_on');  
  $('.menu_rnd').css('display', 'none');

  
};

/**
 * fn_name :  _X.SetMenuImg
 * Description : 대메뉴의 이미지 변경
 * param :  a_idx: 대메뉴 index, a_on: on/off
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.SetMenuImg = function (a_sys_cd,a_on){
  if(a_sys_cd==null || a_sys_cd=="")
    return;
  if((a_on=='over'||a_on=='out')&&_CurSysCd==a_sys_cd)
    return;
  $('#ImgSub_'+a_sys_cd)[0].src=_web_context.themePath+'/images/menu/menu' + (a_on==''||a_on=='out'?'':'_'+a_on) + '_' + a_sys_cd + '.jpg';        
  $('#ImgSub_'+a_sys_cd)[0].vspace='0'; 
};
      

/**
 * fn_name :  _X.SetSubMenu
 * Description : 서브메뉴 보기
 * param :  a_idx: 대메뉴 index, a_sys_cd: 서브시스템 코드
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.SetSubMenu = function (a_sys_cd)
{
  if(a_sys_cd==null || a_sys_cd=="")
    return;
  _X.MenuOnOff(_CurSysCd,false);
  _X.MenuOnOff(a_sys_cd,true);
  
  if(_CurSysCd!=null && _CurSysCd!="")
  {
    $("#menubar_" + _CurSysCd).hide();
  } 
  $("#menubar_" + a_sys_cd).show();

  _CurSysCd = a_sys_cd;

  return;
};

/**
 * fn_name :  _X.MenuOnOff
 * Description : 메뉴의 선택 toggle 
 * param :   a_idx: 대메뉴 index, a_on: toggle on/off
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.MenuOnOff = function(a_sys_cd,a_on){
  if(a_sys_cd==null || a_sys_cd=="")
    return;
  $('#ImgSub_'+a_sys_cd)[0].src=_web_context.themePath+'/images/menu/menu' + (a_on?'_on':'') + '_' + a_sys_cd + '.jpg';
  $('#ImgSub_'+a_sys_cd)[0].vspace='0'; 
  //$('#ImgSub_'+_X.LPad(a_idx,2,'0'))[0].src='../images/menu/menu' + (a_on?'_on':'') + '_' + _X.LPad(a_idx,2,'0') + '.jpg';
  //$('#ImgSub_'+_X.LPad(a_idx,2,'0'))[0].vspace='0'; 
};


/**
 * fn_name :  _X.OpenSheet
 * Description : mdi window open
 * param :   a_pgm_cd : 프로그램 코드
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 *   2016.12.12   이상규          conn_url 적용
 */
_X.OpenSheet = function(a_pgm_cd)
{
  var $tag = $("a[data-pgmcode="+a_pgm_cd+"]");
  if($tag) {
    var url = $tag.attr("data-openurl");
    if(url) {
      if(url.indexOf("WINOPEN?") != -1){
        var conn = _MyPgmList[a_pgm_cd]["CONN_URL"];
        if(conn){
          window.open(conn);
          return;
        }
      }
    }
  }
  
  if(_MyPgmList==null) {
    _MyPgmList = _X.XS("sm", "SM_AUTH_PGMCODE", "R_EGOVMAIN_01", new Array(_CompanyCode,_UserID), "json", "PGM_CODE");
  }
  if(_MyPgmList!=null && _MyPgmList[a_pgm_cd]!=null){
    var pgmUrl = _MyPgmList[a_pgm_cd].TEMP_TYPE + "?pcd=" + a_pgm_cd + "&" + _MyPgmList[a_pgm_cd].CONN_URL;
    _X.MDI_Open(a_pgm_cd, _MyPgmList[a_pgm_cd].PGM_NAME, pgmUrl);
  }
  else{
    _X.MsgBox("프로그램 정보가 존재하지 않습니다.");
  }
};

/**
 * fn_name :  _X.OpenPopupSheet
 * Description : window open popup
 * param :   a_pgm_cd : 프로그램 코드, a_param: 파라미터 string(get)
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */

_X.OpenPopupSheet= function(a_pgm_cd, a_param)
{
  if(_MyPgmList!=null && _MyPgmList[a_pgm_cd]!=null){
    var pgmUrl = _MyPgmList[a_pgm_cd].TEMP_TYPE + "?pcd=" + a_pgm_cd + "&" + _MyPgmList[a_pgm_cd].CONN_URL + a_param;
    window.open(pgmUrl);
  }
  else{
    _X.MsgBox("프로그램 정보가 존재하지 않습니다.");
  }
};

/**
 * fn_name :  _X.CloseSheet
 * Description : mdi window close
 * param :   a_win : window
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.CloseSheet = function(a_win) {
  a_win.mytop._X.MDI_Close(a_win.mytop._CurMenuIndex);
};


/**
 * fn_name :  _X.CloseSheetIndex
 * Description : mdi window close
 * param :   a_win : window, a_index: mdi index no
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.CloseSheetIndex = function(a_win, a_index) {
  a_win.mytop._X.MDI_Close(a_index);
};

/**
 * fn_name :  _X.AjaxCall
 * Description : jQuery Ajax 호출
 * param :   subsystem:단위시스템코드, func:호출함수, returnType:return type, 
 *       param1, ...., param20(파라미터)
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.AjaxCall = function(subsystem, func, returnType, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15, param16, param17, param18, param19, param20, callback){
  
  $.ajax({
      url : top._CPATH + '/mighty/ajax.x.do',
      type: 'POST',
      data: "params=" + _X.EncodeParam(func + _Param_Separate + returnType + _Param_Separate + subsystem + _Param_Separate + _X.IsNull(param1,"") + _Param_Separate + _X.IsNull(param2,"") + _Param_Separate + _X.IsNull(param3,"") + _Param_Separate + _X.IsNull(param4,"") + _Param_Separate + _X.IsNull(param5,"") + _Param_Separate + _X.IsNull(param6,"") + _Param_Separate + _X.IsNull(param7,"") + _Param_Separate + _X.IsNull(param8,"") + _Param_Separate + _X.IsNull(param9,"") + _Param_Separate + _X.IsNull(param10,"") + _Param_Separate + _X.IsNull(param11,"") + _Param_Separate + _X.IsNull(param12,"") + _Param_Separate + _X.IsNull(param13,"") + _Param_Separate + _X.IsNull(param14,"") + _Param_Separate + _X.IsNull(param15,"") + _Param_Separate + _X.IsNull(param16,"") + _Param_Separate + _X.IsNull(param17,"") + _Param_Separate + _X.IsNull(param18,"") + _Param_Separate + _X.IsNull(param19,"") + _Param_Separate + _X.IsNull(param20,"") + _Param_Separate + "#"),
      dataType: 'json',
      timeout: callback != null ? 10000000 : 10000,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      async: callback != null,
      cache: false,
      beforeSend: function(xhr){ 
            xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"); 
            xhr.setRequestHeader("Cache-Control","no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Progma","no-cache");
            
            if ( callback ) {
              _X.Block();
            }
       },     
      error: function(xhr, status, err) {
        _X_AjaxResult=null;
        if(xhr==null) {
          //세션이 종료된 경우 재로그인 화면 Display(2015.03.27 KYY)
          if(typeof(mytop.OpenReLogin)!="undefined") {
            _X.MsgBox('세션이 종료되어 로그인 화면으로 이동합니다.');
            mytop.OpenReLogin();
          }
        } else {
          if (xhr.status == 401) {
            alert("401 Unauthorized");
          } else if (xhr.status == 403) {
            alert("403 Forbidden");
          } else {
            _X.MsgBox("예외가 발생했습니다. 관리자에게 문의해 주시기 바랍니다.");
          }
        }
        
        if ( callback ) {
          _X.UnBlock();
          if ( typeof callback == "function" ) {
            callback(null);
          }
        }
      },
      success: function(data) {
        _X_AjaxResult=data;
        
        if ( callback ) {
          _X.UnBlock();
          if ( typeof callback == "function" ) {
            callback(data);
          }
        }
      }
  });
};

//세션 만료여부 체크
_X.ChkSession = function(){
  _X.AjaxCall("com", "ChkSession", "json");

  //세션이 종료된 경우 재로그인 화면 Display(2015.03.12 KYY)
  if(_X_AjaxResult!=null && (_X_AjaxResult.datas==null || _X_AjaxResult.result!="OK"))
    if(typeof(mytop.OpenReLogin)!="undefined") {
      mytop.OpenReLogin();
  }
};

_X.DispAjaxErrMsg = function(strAct, params) {
  if(_X_AjaxResult.datas==null) {
    //세션이 종료된 경우 재로그인 화면 Display(2015.03.12 KYY)
    if(typeof(mytop.OpenReLogin)!="undefined") {
      mytop.OpenReLogin();
    }
  } else {
    if(_X.IsAdmin())
      _X.MsgBox(strAct + '중 오류 발생(관리자용)\n\n' + _X_AjaxResult.datas + (params!=null ? '\n\n' + params : ''));
    else
      _X.MsgBox(strAct + '중 오류가 발생했습니다.');
  }
}

/**
 * fn_name :  _X.SqlSelect
 * Description : Query Select 문 실행
 * param :   subsystem:단위시스템코드, strSQL:호출함수, returnType:return type, 
 *       strMode:return row count(9:전체,1:1row), rowSepa:로우구분자,colSepa:컬럼구분자
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.SqlSelect = function(subsystem, strSQL, returnType, strMode, rowSepa, colSepa){
  if(returnType==null){returnType="array";}
  if(strMode==null){strMode="all";}
  if(rowSepa==null){rowSepa=_Row_Separate;}
  if(colSepa==null){colSepa=_Col_Separate;}
  
  _X.AjaxCall(subsystem, "SS", returnType, strSQL, strMode, rowSepa, colSepa);

  //return 값 조정 (2015.02.17 이상규)
  if(_X_AjaxResult==null)
    return "";
    
  if(_X_AjaxResult.result=="ERROR"){
    //Ajax Message 처리(2015.03.27)
    _X.DispAjaxErrMsg('데이타 조회', strSQL);
    return -1;
  } else if(_X_AjaxResult.result=="OK"){      
    if(_X_AjaxResult.datas==null || _X_AjaxResult.datas=="")
      return 0;
    else
    {
      switch(returnType.toLowerCase())
      {
        case "array":
          return _X.GetArrayData(_X_AjaxResult.datas);
        case "json":
        case "json2":
        case "xml":
          return _X_AjaxResult.datas;
      }     
    }
  }
};
_X.SS = _X.SqlSelect;

/**
 * fn_name :  _X.XS
 * Description : xml 파일에 의한 Query Select 문 실행
 * param :   subsystem:단위시스템코드,xmlFile:xml file id, xmlkey : XML 파일의 select ID값, 
 *       params:파라미터, returnType:return type,jsonKey:json 파일의 key 값, 
 *       strMode:return row count(9:전체,1:1row), rowSepa:로우구분자,colSepa:컬럼구분자
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.XS = function(subsystem, xmlFile, xmlKey, params, returnType, jsonKey, strMode, rowSepa, colSepa){ 
  if(returnType==null){returnType="array";}
  if(strMode==null){strMode="all";}
  if(rowSepa==null){rowSepa=_Row_Separate;}
  if(colSepa==null){colSepa=_Col_Separate;}
  
  //결과값 Cache처리(2015.02.28 KYY)
  if(jsonKey!=null && typeof(jsonKey)=="boolean" && jsonKey==true) {
    //Cache처리(jsonKey를 처리 여부로 사용)
    var cacheKey  = _X.ArrayToStr(params);
    var cacheData = _X.GetValue(cacheKey);
    if(cacheData!=null) {
      _X_AjaxResult = {};
      _X_AjaxResult.result = "OK";
      _X_AjaxResult.datas  = cacheData;
    } else {
      _X.AjaxCall(subsystem, "XS", returnType, xmlFile, xmlKey, _X.ArrayToStr(params), strMode, rowSepa, colSepa);
      _X.SetValue(cacheKey, _X_AjaxResult.datas);
    }   
    jsonKey=null;
  } else {
    _X.AjaxCall(subsystem, "XS", returnType, xmlFile, xmlKey, _X.ArrayToStr(params), strMode, rowSepa, colSepa);
  }
  
  //return 값 조정 (2015.02.17 이상규)
  if(_X_AjaxResult==null)
    return "";
  if(_X_AjaxResult.result=="ERROR"){
    //Ajax Message 처리(2015.03.27)
    _X.DispAjaxErrMsg('데이타 조회', xmlFile + '\t' + xmlKey  + '\r\n' + _X.ArrayToStr(params));
    return -1;
  } else if(_X_AjaxResult.result=="OK"){      
    if(_X_AjaxResult.datas==null && _X_AjaxResult.packcnt==null)
      return 0;
    else
    {
      switch(returnType.toLowerCase())
      {
        case "array":
          return _X.GetArrayData(_X_AjaxResult.datas, null, null);
        case "json":
        case "json2":
        case "jsonwithlower":
        case "jsonwithid":
          if(jsonKey=="grid")
            return _X_AjaxResult.datas;
          else
            return _X.GetJsonDataPack(_X_AjaxResult, jsonKey);
        default:
        //case "xml":
        //case "csv":
        //case "csvfile":         
        //case "csvstream":         
          return _X_AjaxResult.datas;
      }
    }
  }
};
_X.XmlSelect = _X.XS;
  

/**
 * fn_name :  _X.SaveXmlData
 * Description : 변경된 그리드 자료의 데이타를 저장
 * param :   subsystem:단위시스템코드,sqlData:저장할 데이타값, beforeSQL : 변경전 sql(사용안함), 
 *       afterSQL:변경후 sql(사용안함), returnType:return type, rowSepa:로우구분자,colSepa:컬럼구분자,
 *       fieldSepa : 필드구분자
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.SaveXmlData = function(subsystem, sqlData, beforeSQL, afterSQL, returnType, rowSepa, colSepa, fieldSepa){
  if(returnType==null){returnType="array";}
  if(rowSepa==null){rowSepa=_Row_Separate;}
  if(colSepa==null){colSepa=_Col_Separate;}
  if(fieldSepa==null){fieldSepa=_Field_Separate;}
  _X.AjaxCall(subsystem, "SXD", returnType, sqlData, beforeSQL, afterSQL, rowSepa, colSepa, fieldSepa);

  //return 값 조정 (2015.02.17 이상규)
  if(_X_AjaxResult==null)
    return "";
    
  if(_X_AjaxResult.result=="ERROR"){
    //Ajax Message 처리(2015.03.27)
    _X.DispAjaxErrMsg('작업(SXD)');
    //_X.MsgBox(_X_AjaxResult.datas);
    return -1;
  } else if(_X_AjaxResult.result=="OK"){
    if(_X_AjaxResult.datas==null)
      return 0;
    else
    {
      return _X_AjaxResult.datas;
    }
  }
};
_X.SXD = _X.SaveXmlData;
  
/**
 * fn_name :  _X.ExecProc
 * Description : 프로시저 호출처리
 * param :   subsystem:단위시스템코드,strProc:프로시저명, params:파라미터(배열)
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 *   2016.12.08   이상규         callback 함수 파라메터 여부 확인 하여 ajax 를 비동기로 호출 후 progress 표현
 */
_X.ExecProc = function(subsystem, strProc, params, callback){
  if ( callback == null ) {
    _X.AjaxCall(subsystem, "EP", "json", strProc, _X.ArrayToStr(params) );
    
    //return 값 조정 (2015.02.17 이상규)
    if(_X_AjaxResult==null)
      return "";
      
    if(_X_AjaxResult.result=="ERROR"){
      //Ajax Message 처리(2015.03.27)
      _X.DispAjaxErrMsg('작업(EP)');
      //_X.MsgBox(_X_AjaxResult.datas);
      return -1;
    } else if(_X_AjaxResult.result=="OK"){      
      if(_X_AjaxResult.datas==null)
        return 0;
      else
      {
        return _X_AjaxResult.datas;
      }
    }
  }
  else {
    var epCallBack = function (ajaxResult) {
      if ( typeof callback == "function" ) {
        if ( ajaxResult == null ) {
          callback("");
          return;
        }
          
        if ( ajaxResult.result == "ERROR" ) {
          _X.DispAjaxErrMsg('작업(EP)');
          callback(-1);
        }
        else if ( ajaxResult.result == "OK" ) {      
          if ( ajaxResult.datas == null ) {
            callback(0);
          } else {
            callback(ajaxResult.datas);
          }
        }
      }
    };
    
    _X.AjaxCall(subsystem, "EP", "json", strProc, _X.ArrayToStr(params), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, epCallBack );
  }
};
_X.EP = _X.ExecProc;

_X.ExecProc2 = function(subsystem, strProc, params){
  _X.AjaxCall(subsystem, "EP2", "json", strProc, _X.ArrayToStr(params));

  if(_X_AjaxResult==null)
    return "";
    
  if(_X_AjaxResult.result=="ERROR"){
    _X.DispAjaxErrMsg('작업(EP2)');
    return -1;
  } else if(_X_AjaxResult.result=="OK"){      
    if(_X_AjaxResult.datas==null)
      return 0;
    else
    {
      return _X_AjaxResult.datas;
    }
  }
};
_X.EP2 = _X.ExecProc2;

/**
 * fn_name :  _X.ExecSql
 * Description : execute sql 실행
 * param :   subsystem:단위시스템코드,xmlFile:xml file id, xmlkey : XML 파일의 select ID값, 
 *       params:파라미터, returnType:return type,jsonKey:json 파일의 key 값,colSepa:컬럼구분자 
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.ExecSql = function(subsystem, xmlFile, xmlKey, params, returnType, colSepa){
  if(returnType==null){returnType="array";}
  if(colSepa==null){colSepa=_Col_Separate;}

  _X.AjaxCall(subsystem, "ES", "json", xmlFile, xmlKey, _X.ArrayToStr(params),colSepa);

  if(_X_AjaxResult==null)
    return "";
  if(_X_AjaxResult.result=="ERROR"){
    //Ajax Message 처리(2015.03.27)
    _X.DispAjaxErrMsg('작업(ES)');  
    //_X.MsgBox(_X_AjaxResult.datas);
    return -1;
  } else if(_X_AjaxResult.result=="OK"){      
    if(_X_AjaxResult.datas==null)
      return 0;
    else
    {
      return _X_AjaxResult.datas;
    }
  }
};
_X.ES = _X.ExecSql;

//추가(2015.05.20 KYY)
_X.GSI = function(subsystem, xmlFile, xmlKey, returnType){
  if(returnType==null)
    returnType="json";
  _X.AjaxCall(subsystem, "GSI", returnType, xmlFile, xmlKey);

  if(_X_AjaxResult==null)
    return null;
  if(_X_AjaxResult.datas=="ERROR")
    return null;
  var sInfo;
  eval("sInfo = _X.SD('" + _X_AjaxResult.datas + "');");
  return sInfo;
}

_X.SendMail = function(from, to, cc, subject, msg, filename, smtphost, smtpid, smtppass) {
  if(!_X.IsHtml(msg)){
    msg = '<span style="color:#317ddb;font-size:14px">' + msg + '</span>';
  }
  _X.AjaxCall("sm", "SM", "json", from, to, cc, subject, msg, filename, smtphost, smtpid, smtppass);

  if(_X_AjaxResult==null)
    return "";
    
  if(_X_AjaxResult.result=="ERROR"){
    _X.DispAjaxErrMsg('메일전송', mailto + "\t" + subject + "\t" + emailBody);
  } 
  return _X_AjaxResult.datas;
  
}
_X.SM = _X.SendMail;

/**
 * fn_name :  AjaxDownFile
 * Description : ajax file download
 * param :   url: controller mapping url ,data : 파일아이디, 파일순번, method: form submit
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.AjaxDownFile = function(url, data, method){
    // url과 data를 입력받음
    if( url && data ){
        // data 는  string 또는 array/object 를 파라미터로 받는다.
        data = typeof data == 'string' ? data : jQuery.param(data);
        // 파라미터를 form의  input으로 만든다.
        var inputs = '';
        jQuery.each(data.split('&'), function(){
            var pair = this.split('=');
            inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
        });
        // request를 보낸다.
        jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
        .appendTo('body').submit().remove();
    };
};

/**
 * fn_name :  AjaxDeleteFile
 * Description : ajax file delete
 * param :   url: controller mapping url ,data : 파일아이디, 파일순번, callback: call func
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.AjaxDeleteFile = function (url, data, callback) {
  $.ajax({
    type: 'post',
    url: top._CPATH + url,
    dataType: "json",
    data : data,
    success: function(resp) {
      if( callback ) {
        callback(resp);
      }
    },
    error: function(resp) {
      _X.MsgBox("작업중 오류가 발생 하였습니다!"+resp);
    }
  });
}

/**
 * fn_name :  _X.GetArrayData
 * Description : JSON Data 값을 array 로 변환
 * param :   datas : JSON data , rowSepa:row구분자, colSepa:컬럼구분자 
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.GetArrayData = function(datas, rowSepa, colSepa){
  var array_data = new Array();
  if(rowSepa==null){rowSepa=_Row_Separate;}
  if(colSepa==null){colSepa=_Col_Separate;}

  var rowDatas = datas.split(rowSepa);
  for(var i=0; i<rowDatas.length; i++){
    var colDatas = rowDatas[i].split(colSepa);
    array_data[i] = new Array();
    for(var j=0; j<colDatas.length; j++){
      array_data[i][j] = colDatas[j];
    }
  } 
  datas = null;
  return array_data;
};

/**
 * fn_name :  _X.GetJsonData
 * Description : JSON Data 값을 KEY 값 있는 json data 로 변환
 * param :   datas : JSON data , rowSepa:row구분자, colSepa:컬럼구분자 
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.GetJsonData = function(datas, jsonKey){
  var jSonData="";
  if(datas!=null && datas != '') 
    eval("jSonData=" + datas + ";");
  datas = null;
  if(jsonKey!=null)
    _X.SetJsonKey(jSonData, jsonKey);
  return jSonData;
};

_X.GetJsonDataPack = function(ajaxResult, jsonKey){
  var jSonData = new Array();

  if(typeof(ajaxResult.schima)!="undefined") {
    var colNames = ajaxResult.schima.split(_Col_Separate);
    var packcnt = _X.ToInt(ajaxResult.packcnt);
    for(var i=0; i<packcnt; i++) {
      var packdata = ajaxResult["data_" + i].split(_Row_Separate);
      for(var j=0; j<packdata.length; j++) {
        var rowData = packdata[j].split(_Col_Separate);
        var rowJsonData = {};
        for(var k=0; k<colNames.length; k++) {
          rowJsonData[colNames[k]] = rowData[k];
        }
        jSonData.push(rowJsonData);
        rowJsonData=null;
      }
      packdata = null;
    }
  } else if(typeof(ajaxResult.packcnt)!="undefined") {
    var packcnt = _X.ToInt(ajaxResult.packcnt);
    for(var i=0; i<packcnt; i++) {
      var packdata = eval(ajaxResult["data_" + i]);
      jSonData = jSonData.concat(packdata);
      packdata = null;
    }
  } else {
    if(ajaxResult.datas!=null && ajaxResult.datas != "") 
      jSonData=eval(ajaxResult.datas);
      //eval("jSonData=" + ajaxResult.datas + ";");
    ajaxResult.datas = null;
  }
  if(jsonKey!=null)
    _X.SetJsonKey(jSonData, jsonKey);
  return jSonData;
};

_X.SetJsonKey = function(jsonData, keycol){
  //var keys = _X.Split(keycol);
  for(var i=0; i<jsonData.length; i++){
    jsonData[jsonData[i][keycol]] = jsonData[i];
  };
};

_X.EncodeParam = function(a_data){
  return _X.StrReplace(_X.StrReplace(_X.StrReplace(_X.StrReplace(_X.StrReplace(_X.StrReplace(String(a_data),'&','[(am)]'),'=','[(eq)]'),'?','[(qu))]'),'%','[(ps)]'),'#','[(Sh)]'),'+','[(pl)]');
};

_X.DecodeParam = function(a_data){
  return _X.StrReplace(_X.StrReplace(_X.StrReplace(_X.StrReplace(_X.StrReplace(_X.StrReplace(String(a_data),'[(am)]','&'),'[(eq)]','='),'[(qu))]','?'),'[(ps)]','%'),'[(Sh)]','#'),'[(pl)]','+');
};

/**
 * fn_name :  _X.CallJsp
 * Description : jQuery Ajax 실행
 * param :   pageUrl : 실행 url
 * Statements : 
 *
 *   since       author           Description
 *  ------------    --------    ---------------------------
 *   2013.02.10   김양열          최초 생성
 */
_X.CallJsp = function(pageUrl){
  $.ajax({
      url: top._CPATH + pageUrl,
      type: 'POST',
      dataType: 'json',
      timeout: 10000,
      async: true,
      cache: false
  });
  return true;
};  


//Clobal Cache 처리를 위한 로직(2015.02.28 KYY)
_X.GetValue = function(a_key){
  if(typeof(mytop._GlobalCache)=="undefined") {
    mytop._GlobalCache = new Array();
  }
  if(mytop._GlobalCache[a_key]==null)
    return null;
  else
    return mytop._GlobalCache[a_key].val;
}
_X.SetValue = function(a_key, a_value){
  if(typeof(mytop._GlobalCache)=="undefined") {
    mytop._GlobalCache = new Array();
  }
  if(mytop._GlobalCache[a_key]==null){
    var ai_idx = mytop._GlobalCache.length;
    mytop._GlobalCache[ai_idx] = {val:a_value};
    mytop._GlobalCache[a_key] = mytop._GlobalCache[ai_idx];
  }else{
    mytop._GlobalCache[a_key].val = a_value;
  }
}
_X.ClearValue = function(a_key){
  if(a_key==null)
    mytop._GlobalCache = new Array();
  else {
    if(typeof(mytop._GlobalCache)=="undefined") {
      mytop._GlobalCache = new Array();
    } else {
      _X.SetValue(a_key,null);
    }
  }
}




_X.TemplateEngine = function(html, options) {
  var re = /<%(.+?)%>/g, 
    reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
    code = 'with(obj) { var r=[];\n', 
    cursor = 0, 
    result;
  var add = function(line, js) {
    js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
      (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
    return add;
  }
  while(match = re.exec(html)) {
    add(html.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(html.substr(cursor, html.length - cursor));
  code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
  try { result = new Function('obj', code).apply(options, [options]); }
  catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
  return result;
}


/*
* fn_name :  _X.StopWatch
* Description : StopWatch 기능 구현
* param :  
* Statements : 
*
*   since        author           Description
*  ------------    --------    ---------------------------
*   2015.02.25    김양열          최초 생성
*/
_X.StopWatch =  function() {
    var startAt = [0,0,0,0,0,0,0,0,0,0];
    var lapTime = [0,0,0,0,0,0,0,0,0,0];

    var now = function() {
      return (new Date()).getTime(); 
    }; 
 
    this.start = function(a_idx) {
      if(a_idx==null) a_idx=0;
      //startAt[a_idx]  = startAt[a_idx] ? startAt[a_idx] : now();
      startAt[a_idx]  = now();
    };

    this.stop = function(a_idx) {
      if(a_idx==null) a_idx=0;
      //lapTime[a_idx]  = startAt[a_idx] ? lapTime[a_idx] + now() - startAt[a_idx] : lapTime[a_idx];
      //startAt[a_idx]  = 0; // Paused
      lapTime[a_idx]  = now();
    };

    this.reset = function(a_idx) {
      if(a_idx==null) a_idx=0;
      lapTime[a_idx] = startAt[a_idx] = 0;
    };

    this.time = function(a_idx) {
      if(a_idx==null) a_idx=0;
      //return lapTime[a_idx] + (startAt[a_idx] ? now() - startAt[a_idx] : 0); 
      return lapTime[a_idx] - startAt[a_idx]; 
    };

    this.getTime = function(a_idx) {
      if(a_idx==null) a_idx=0;
      return _X.FormatTime(this.time(a_idx));
    };
};


_X.FormatTime = function (time) {
  var h = m = s = ms = 0;

  h = Math.floor( time / (60 * 60 * 1000) );
  time = time % (60 * 60 * 1000);
  m = Math.floor( time / (60 * 1000) );
  time = time % (60 * 1000);
  s = Math.floor( time / 1000 );
  ms = time % 1000;

  return _X.LPad(h, 2) + ':' + _X.LPad(m, 2) + ':' + _X.LPad(s, 2) + ':' + _X.LPad(ms, 3);
};

_X.SD = function(src) {
  return Base64.decode(_X.StrReverse(src));
}