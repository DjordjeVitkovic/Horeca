/* global formsPlus */

(function (fn) {
    if (typeof jQuery === 'undefined') {
        throw 'Please load jQuery before this script.';
    }
    if (typeof formsPlus === 'undefined') {
        throw 'Please load forms-plus.js before this script.';
    }
    fn(jQuery, formsPlus);
}(function ($, fp) {
    "use strict";

    // increment/decrement value by spinValue
    fp.spinValue                                 = function(value, spinValue, decr){
        value                                           = value ? parseFloat(value) : 0;
        spinValue                                       = spinValue ? parseFloat(spinValue) : 1;
        if( isNaN(spinValue) ){
            spinValue                                   = 1;
        }
        if( isNaN(value) ){
            value                                       = 0;
        }
        var
            fl1                                         = fp.getFloatLength(value),
            fl2                                         = fp.getFloatLength(spinValue),
            flRest                                      = fl1 > fl2 ? fl1 : fl2
        ;
        return (value + ( decr ? - spinValue : spinValue )).toFixed(flRest);
    };

    fp.spinFieldValue                            = function($el, value, decr){
        $el                                             = $($el);
        value                                           = value || 1;
        $el.fpSetValue( { value : fp.spinValue( $el.fpGetValue(true).value , value, decr) } );
        $el.trigger('fpSpin');
    };

    //Spinner up/down buttons
    $.fn.fpSpinner                                 = function(value){
        if( !fp.pluginCheck(this, "Forms Plus: spinner - Nothing selected.") ){
            return this;
        }
        $.each(this, function(i, $el){
            $el                                         = $($el);
            var spinFieldValue                          = function(decr){
                var $field                              = false;
                if( $el.data('jsSpinnerSelector') ){
                    $field                              = $( $el.data('jsSpinnerSelector') );
                }else{
                    $field                              = $el.closest( fp.selectors.fieldWrap ).find('input.form-control');
                }
                fp.spinFieldValue( $field, $el.data('jsSpinner') || value || 1, decr );
            };
            $el.find('.p-js-up').on('click', function(e){
                e.preventDefault();
                spinFieldValue();
            });
            $el.find('.p-js-down').on('click', function(e){
                e.preventDefault();
                spinFieldValue(true);
            });
        });
        return this;
    };


    //Wheel spinner
    $.fn.fpWheelSpinner                            = function(value){
        if( !fp.pluginCheck(this, "Forms Plus: wheel spinner - Nothing selected.") ){
            return this;
        }
        $(this)
            .off('.fpWheelSpinner')
            .on('mousewheel.fpWheelSpinner DOMMouseScroll.fpWheelSpinner', function(event){
                event.preventDefault();
                event.stopPropagation();
                var $el                                 = $(this);
                fp.spinFieldValue( $el, $el.data('jsWheelSpin') || value || 1, event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0 ? false : true );
            })
        ;
        return this;
    };


    //Down/Up arrows spinner
    $.fn.fpArrowSpinner                            = function(value){
        if( !fp.pluginCheck(this, "Forms Plus: wheel spinner - Nothing selected.") ){
            return this;
        }
        $(this).each(function(i, $el){
            $el                                         = $($el);
            if( $el.data('fpasPressInterval') ){
                clearInterval( $el.data('fpasPressInterval') );
            }
            if( $el.data('fpasClickTimer') ){
                clearTimeout( $el.data('fpasClickTimer') );
            }
            var sValue                                  = $el.data('jsArrowSpin') || value || 1;
            $el
                .off('.fpArrowSpinner')
                .data({
                    'fpasKey'                           : false,
                    'fpasFunc'                          : false,
                    'fpasClickTimer'                    : false,
                    'fpasPressInterval'                 : false
                })
                .on({
                    keydown                             : function(e){
                        if( $el.data('fpasKey') ){ return; }
                        var
                            activeKey   = e.keyCode,
                            func        = false
                        ;
                        switch(activeKey){
                            case 38: //up arrow
                                func = function(){
                                    fp.spinFieldValue( $el, sValue );
                                };
                                break;
                            case 40: //down arrow
                                func = function(){
                                    fp.spinFieldValue( $el, sValue, true );
                                };
                                break;
                        }

                        if( func ){
                            $el.data({
                                'fpasKey'               : activeKey,
                                'fpasFunc'              : func,
                                'fpasClickTimer'        : setTimeout(function(){
                                    if( $el.data('fpasClickTimer') ){
                                        clearTimeout($el.data('fpasClickTimer'));
                                        $el.data('fpasClickTimer', false);
                                    }
                                    $el.data('fpasPressInterval', setInterval(func, 20, 0, false));
                                }, 150, false)
                            });
                        }
                        else{
                            $el.data('fpasKey', false);
                        }
                    },
                    keyup       : function(e){
                        var activeKey                   = $el.data('fpasKey');
                        if( !activeKey || activeKey !== e.keyCode ){ return; }
                        if( $el.data('fpasPressInterval') ){
                            clearInterval( $el.data('fpasPressInterval') );
                        }
                        if( $el.data('fpasClickTimer') ){
                            clearTimeout( $el.data('fpasClickTimer') );
                            var func                    = $el.data('fpasFunc');
                            func();
                        }
                        $el.data({
                            'fpasKey'                   : false,
                            'fpasFunc'                  : false,
                            'fpasClickTimer'            : false,
                            'fpasPressInterval'         : false
                        });
                    }
                })
            ;
        });
        return this;
    };

    // Add init function
    fp.initFn.push(function($container){
        $container.find('[data-js-wheel-spin]').fpWheelSpinner();
        $container.find('[data-js-spinner]').fpSpinner();
        $container.find('[data-js-arrow-spin]').fpArrowSpinner();
    });
}));