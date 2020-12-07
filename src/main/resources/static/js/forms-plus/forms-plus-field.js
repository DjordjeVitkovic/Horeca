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
    
    $.fn.getCursorPosition = function() {
        var input = this.get(0);
        if (!input){
            return; // No (input) element found
        }
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    };

    //Mask
    if( $().mask ){
        $.mask.definitions['h']                    = "[A-Fa-f0-9]";
        $.mask.definitions['~']                    = "[+-]";
        $.fn.fpMask                                = function(opts){
            if( !fp.pluginCheck(this, "Forms Plus: mask - Nothing selected.") ){
                return this;
            }
            for (var i = 0; i < this.length; i++) {
                var
                    $el                                 = $(this[i]),
                    options                             = $.extend({}, opts, fp.getDataOptions( $el, 'js', ['mask', 'placeholder'] )),
                    mask                                = options.mask + ''
                ;
                if( !mask ){
                    continue;
                }else{
                    delete options.mask;
                }
                $el.mask( mask, options );
            }
            return this;
        };
        // Add init function
        fp.initFn.push(function($container){
            $container.find('input[data-js-mask]').fpMask();
        });
    }

    // Add init function
    fp.initFn.push(function($container){
        //Toggle type
        $container.find('[data-js-toggle-type]')
            .off('.pToggleType')
            .on('click.pToggleType', function(e){
                e.preventDefault();
                var $el                                 = $(this);
                if( !fp.hasDataString( $el, 'jsToggleType' ) ){
                    return;
                }
                var
                    $container                          = $el.closest( fp.selectors.fieldWrap ),
                    $field                              = $container.find('input.form-control'),
                    $tContent                           = $container.find('[data-js-toggle-content]')
                ;
                
                if( $container.hasClass('p-field-toggled') ){
                    $container.removeClass('p-field-toggled');
                    $field.attr('type', $field.data('jsOriginalType') );
                    $tContent.each(function(n, $t){
                        $t                              = $($t);
                        $t.html($t.data('jsOriginalContent') );
                    });
                }else{
                    if( !$field.data('jsOriginalType') ){
                        $field.data('jsOriginalType', $field.attr('type'));
                    }
                    $container.addClass('p-field-toggled');
                    $field.attr('type', $el.data('jsToggleType') );
                    $tContent.each(function(n, $t){
                        $t                              = $($t);
                        if( !$t.data('jsOriginalContent') ){
                            $t.data('jsOriginalContent', $t.html());
                        }
                        $t.html($t.data('jsToggleContent') );
                    });
                }
            })
        ;
        
        //Toggle class
        $container.find('[data-js-toggle-class]')
            .off('.pToggleClass')
            .on('click.pToggleClass', function(e){
                e.preventDefault();
                var $el                                 = $(this);
                if( !fp.hasDataString( $el, 'jsToggleClass' ) ){
                    return;
                }
                $el.closest( fp.selectors.fieldWrap ).toggleClass( $el.data('jsToggleClass') );
            })
        ;


        //clickout
        $container.find('[data-js-clickout-remove-class], [data-js-clickout-add-class]')
            .off('.fpClickOut')
            .on('mousedown.fpClickOut', function(e){
                e.stopPropagation();
            })
        ;

        //check input
        $container.find('.p-check-input .input-group').find('input, select, textarea')
            .off('.fpCheckInput')
            .on('click.fpCheckInput keyup.fpCheckInput blur.fpCheckInput', function(){
                var $el                                 = $(this).closest('.p-check-input').find('input.p-check-input');
                $el.prop('checked', $el.is(':checked') || !!this.value).fpTriggerChange();
            })
        ;
        //check group toggle
        $container.find('[data-js-toggle-check-group]')
            .off('.fpToggleCheckGroup')
            .on('click.fpToggleCheckGroup', function(){
                var $el                                 = $(this);
                if( fp.hasDataString( $el, 'jsToggleCheckGroup' ) ){
                    $('[data-js-check-group="' + $el.data('jsToggleCheckGroup') + '"]')
                        .filter('[type="checkbox"],[type="radio"]')
                        .prop('checked', $el.is(':checked'))
                        .fpTriggerChange()
                    ;
                }
            })
        ;
        $container.find('[data-js-untoggle-check-group]')
            .off('.fpToggleCheckGroup')
            .on('click.fpUntoggleCheckGroup', function(){
                var $el                                 = $(this);
                if( fp.hasDataString( $el, 'jsUntoggleCheckGroup' ) ){
                    $('[data-js-check-group="' + $el.data('jsUntoggleCheckGroup') + '"]')
                        .filter('[type="checkbox"],[type="radio"]')
                        .prop('checked', !$el.is(':checked'))
                        .fpTriggerChange()
                    ;
                }
            })
        ;
        $container.find('[data-js-check-group]')
            .off('.fpCheckGroup')
            .on('fpChange.fpCheckGroup', function(){
                var $el                                 = $(this);
                if( fp.hasDataString( $el, 'jsCheckGroup' ) ){
                    var
                        group                           = $el.data('jsCheckGroup'),
                        $uncheck                        = $([])
                    ;
                    if( $el.is(':checked') ){
                        $uncheck                        = $uncheck.add('[data-js-untoggle-check-group="' + group + '"]');
                        if( fp.hasDataString( $el, 'jsCheckSubGroup' ) ){
                            $uncheck                    = $uncheck.add('[data-js-check-group="' + group + '"][data-js-check-sub-group!="' + $el.data('jsCheckSubGroup') + '"]');
                        }
                    }else{
                        $uncheck                        = $uncheck.add('[data-js-toggle-check-group="' + group + '"]');
                    }

                    $uncheck
                        .filter('[type="checkbox"]')
                        .prop('checked', false)
                        .fpTriggerChange()
                    ;
                }
            })
        ;

        $container.find('[data-js-check-default-group]')
            .off('.fpCheckGroup')
            .on('fpChange.fpCheckGroup',{
                preventOnlyLink     : true
            }, function(){
                var $el                                 = $(this),
                    $check                              = $([])
                ;
                if( !fp.isActiveField($el) || fp.hasDataString( $el, 'jsGroupCheck' ) && $('[data-js-check-group="' + $el.data('jsGroupCheck') + '"]:checked').length ){
                    return;
                }
                if( fp.hasDataString( $el, 'jsCheckDefaultGroup' ) ){
                    $check                              = $check.add('[data-js-default-check-group~="' + $el.data('jsCheckDefaultGroup') + '"]');
                }
                $check
                    .filter('[type="checkbox"]')
                    .prop('checked', true)
                    .fpTriggerChange()
                ;
            })
        ;

        //sub checkboxes
        $container.find('[data-js-sub-check]')
            .off('.fpSubCheck')
            .on('fpChange.fpSubCheck', function(){
                var $el                                 = $(this);
                if( fp.hasDataString( $el, 'jsSubCheck' ) && $el.is(':checked') ){
                    $('[data-js-check-name="' + $el.data('jsSubCheck') + '"]')
                        .filter('[type="checkbox"],[type="radio"]')
                        .prop('checked', true)
                        .fpTriggerChange()
                    ;
                }
            })
        ;
        $container.find('[data-js-check-name]')
            .off('.fpCheckNameSub')
            .on({
                'fpChange.fpCheckNameSub'   : function(){
                    var $el                                 = $(this);
                    if( fp.hasDataString( $el, 'jsCheckName' ) && !$el.is(':checked')){
                        $('[data-js-sub-check="' + $el.data('jsCheckName') + '"]')
                            .filter('[type="checkbox"],[type="radio"]')
                            .prop('checked', false)
                            .fpTriggerChange()
                        ;
                    }
                },
                'click.fpCheckNameSub'      : function(){
                    var $el                                 = $(this);
                    if( fp.hasDataString( $el, 'jsCheckName' ) && $el.is(':checked')){
                        var $sub                            = $('[data-js-sub-check="' + $($el).data('jsCheckName') + '"]')
                            .filter('[type="checkbox"],[type="radio"]')
                        ;
                        if( !$sub.filter(':checked').length ){
                            $sub
                                .filter('[data-js-sub-default]')
                                .prop('checked', true)
                                .fpTriggerChange()
                            ;
                        }
                    }
                }
            })
        ;
        $container.find('[data-js-input-group]')
            .off('.fpInputGroup')
            .on({
                'focus.fpInputGroup'        : function(){
                    var
                        $el                             = $(this),
                        $group                          = $('[data-js-input-group="' + $el.data('jsInputGroup') + '"]'),
                        ind                             = $group.index($el),
                        $test                           = false
                    ;
                    $el.data('prevValue', $el.val());
                    if( ind > 0 ){
                        for (var i = ind - 1; i >= 0; i--) {
                            $el                         = $group.eq(i);
                            if( $el.attr('maxlength') && fp.toNumber($el.attr('maxlength')) > $el.val().length ){
                                $test                   = $el;
                            }else{
                                break;
                            }
                        }
                        if( $test ){
                            $test.focus();
                        }
                    }
                },
                'keydown.fpInputGroup'      : function(e){
                    var
                        $el                             = $(this),
                        value                           = $el.val()
                    ;
                    if( e.which !== 8 || value ){
                        return;
                    }
                    var
                        $group                          = $('[data-js-input-group="' + $el.data('jsInputGroup') + '"]'),
                        ind                             = $group.index($el) - 1
                    ;
                    $group.eq(ind).focus();
                },
                'keypress.fpInputGroup'     : function(e){
                    var
                        $el                             = $(this),
                        value                           = $el.val()
                    ;

                    if( !($el.attr('maxlength') && fp.toNumber($el.attr('maxlength')) === value.length && e.charCode !== 0) ){
                        return;
                    }
                    var
                        character                       = String.fromCharCode(e.charCode),
                        $group                          = $('[data-js-input-group="' + $el.data('jsInputGroup') + '"]'),
                        pos                             = $el.getCursorPosition(),
                        ind                             = $group.index($el) + 1
                    ;
                    if(pos === fp.toNumber($el.attr('maxlength'))){
                        if( ind >= $group.length ){
                            return;
                        }
                        $el                             = $group.eq(ind).focus();
                        pos                             = 0;
                        value                           = $el.val();
                        if( value === '' ){
                            $el.val(character);
                            return;
                        }
                    }
                    $el.val(value.slice(0, pos) + character + value.slice(pos + 1));
                    $el[0].setSelectionRange(pos+1,pos+1);
                }
            })
        ;

        fp.inputReg                              = {
            number                                      : new RegExp("^(?:\\-)?([0-9]*)(?:\\.[0-9]*)?$"),
            letters                                     : new RegExp("^[a-zA-Z]?$")
        };

        $container.find('input[data-js-input-type]')
            .off('.fpInputType')
            .each(function(i, el){
                var $el                                 = $(el),
                    type                                = $el.data('jsInputType')
                ;
                if( fp.inputReg[type] ){
                    $el.data('jsInputType_reg', fp.inputReg[type]);
                    $el.on({
                        'keypress.fpInputType'          : function(e){
                            var $_el                    = $(this),
                                reg                     = $el.data('jsInputType_reg')
                            ;

                            if( reg && e.charCode ){
                                var
                                    value                   = $_el.val(),
                                    character               = String.fromCharCode(e.charCode),
                                    pos                     = $_el.getCursorPosition()
                                ;
                                if( character && !reg.test(value.slice(0, pos) + character + value.slice(pos + 1 )) ){
                                    return false;
                                }
                            }
                        }
                    });
                }
            })
        ;


        $('body')
            .off('.fpClickOut')
            .on('mousedown', function(){
                $('[data-js-clickout-remove-class], [data-js-clickout-add-class]').each(function(i, $el){
                    $el                                 = $($el);
                    if( fp.hasDataString( $el, 'jsClickoutRemoveClass' ) ){
                        $el.closest( fp.selectors.fieldWrap ).removeClass( $el.data('jsClickoutRemoveClass') );
                    }
                    if( fp.hasDataString( $el, 'jsClickoutAddClass' ) ){
                        $el.closest( fp.selectors.fieldWrap ).addClass( $el.data('jsClickoutAddClass') );
                    }
                });
            })
        ;
    });
}));