/*
Input Mask plugin extentions
http://github.com/RobinHerbots/jquery.inputmask
Copyright (c) 2010 - 2012 Robin Herbots
Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
Version: 1.0.2

Optional extentions on the jquery.inputmask base
*/
(function($) {
    //extra definitions
    $.extend($.inputmask.defaults.definitions, {
        'A': { //auto uppercasing
            validator: "[A-Za-z]",
            cardinality: 1,
            casing: "upper"
        },
        'F': {
            "validator": "[0-9\(\)\.\+/ ]",
            "cardinality": 1,
            'prevalidator': null
        }
    });
})(jQuery);