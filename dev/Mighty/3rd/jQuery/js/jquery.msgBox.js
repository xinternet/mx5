$.messageBox = {
    Buttons : {
        OK: 1,
        OKCancel: 2,
        YesNo: 3,
        YesNoCancel: 4,
        RetryCancel: 5,
        AbortRetryIgnore: 6
    }, 
    Icon: {
        Information: 'message-box-dialog-icon-information',
        Error:'message-box-dialog-icon-error',
        Exclamation:'message-box-dialog-icon-exclamation',
        Question:'message-box-dialog-icon-question',
        None:'message-box-dialog-icon-none',
        Ok: 'message-box-dialog-icon-information'
    },
    _dlg: null, 

    
    show: function(options){
        var defaultOptions = {
            text: '텍스값을 입력 하세요!',
            caption: '알림',
            buttons: $.messageBox.Buttons.OK,
            icon: $.messageBox.Icon.Information,
            modal: true, 
            resizable: false,
            width: 420,
            height: 260,
        };
        if( typeof options == "string"){
            options = {
                text: options
            };
        }
        
        options = $.extend(defaultOptions, options);
        
    
        var dlg = $.messageBox._getDialogObject();

        //set message
        dlg.find('.message-box-dialog-text').html(options.text);
        
        //setting icons
        dlg.find('.message-box-dialog-icon').attr('class', 'message-box-dialog-icon ' + options.icon);

        var buttons = {};
        
        if( options.buttons == $.messageBox.Buttons.OK){
            buttons.OK = function(){
                if( options.ok ){
                    options.ok(1);
                }
                $.messageBox._cleanUp();
            }
        }
        if(options.buttons == $.messageBox.Buttons.OKCancel){
            buttons.OK = function(){
                if( options.ok ){
                    options.ok(1);
                }
                $.messageBox._cleanUp();
            }
            buttons.Cancel = function(){
                if( options.Cancel ){
                    options.Cancel(2);
                }
                $.messageBox._cleanUp();
            }
        }
        if( options.buttons == $.messageBox.Buttons.YesNo){
            buttons.Yes = function(){
                if( options.yes ){
                    options.yes(1);
                }
                $.messageBox._cleanUp();
            }
            
            buttons.No = function(){
                if( options.no ){
                    options.no(2);
                }
                $.messageBox._cleanUp();
            }
        }

        if( options.buttons == $.messageBox.Buttons.YesNoCancel){
            buttons.Yes = function(){
                if( options.yes ){
                    options.yes(1);
                }
                $.messageBox._cleanUp();
            }
            
            buttons.No = function(){
                if( options.no ){
                    options.no(2);
                }
                $.messageBox._cleanUp();
            }
            buttons.Cancel = function(){
                if( options.Cancel ){
                    options.Cancel(3);
                }
                $.messageBox._cleanUp();
            }
        }
        if( options.buttons == $.messageBox.Buttons.RetryCancel){
            buttons.Retry = function(){
                if( options.retry ){
                    options.retry(1);
                }
                $.messageBox._cleanUp();
            }
            buttons.Cancel = function(){
                if( options.Cancel ){
                    options.Cancel(2);
                }
                $.messageBox._cleanUp();
            }
        }
        
        if( options.buttons == $.messageBox.Buttons.AbortRetryIgnore){
            buttons.Abort = function(){
                if( options.abort ){
                    options.abort(1);
                }
                $.messageBox._cleanUp();
            }
            buttons.Retry = function(){
                if( options.retry){
                    options.retry(2);
                }
                $.messageBox._cleanUp();
            }
            buttons.Ignore = function(){
                if( options.ignore ){
                    options.ignore(3);
                }
                $.messageBox._cleanUp();
            }
        }
        
        dlg.dialog({
            title: options.caption,
            modal: options.modal,
            width: options.width,
            resizable: options.resizable,
            buttons: buttons,
            close: function(event, ui) { $(this).dialog('close');}
        });
    },
    _cleanUp: function(){
        var dlg = $.messageBox._getDialogObject();
        dlg.dialog('destroy');
    },
    _getDialogObject: function(){
        var uniqueId = 'dialog-' + (new Date()).getTime();
        if( $.messageBox.dlg == null){
            $.messageBox.dlg = $('<div id="' + uniqueId + '" style="display: none;" class="message-box-dialog"><div class="message-box-dialog-icon"></div><div class="message-box-dialog-text"></div></div>');
            $(document.body).append($.messageBox.dlg);
        }
        return $.messageBox.dlg;
    }
}