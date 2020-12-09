/* global formsPlus, moment */

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

    if( !$().validate ){
        return;
    }
    
    $.validator.addMethod('dotmail', function(value, element) {
        return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])+)+$/.test( value );
    }, $.validator.format("Please enter a valid email address."));
    $.validator.addMethod('filesize', function(value, element, maxSize) {
        if( this.optional( element ) ){
            return true;
        }
        if( maxSize ){
            maxSize                                 = maxSize + '';
            switch( maxSize.charAt(maxSize.length - 2).toLowerCase() ){
                case 'k'    :
                    maxSize                         = fp.toNumber(maxSize.slice(0, maxSize.length - 2)) * 1024;
                    break;
                case 'm'    :
                    maxSize                         = fp.toNumber(maxSize.slice(0, maxSize.length - 2)) * Math.pow(1024, 2);
                    break;
                case 'g'    :
                    maxSize                         = fp.toNumber(maxSize.slice(0, maxSize.length - 2)) * Math.pow(1024, 3);
                    break;
                default     :
                    maxSize                         = fp.toNumber(maxSize);
                    break;
            }
        }
        return !maxSize || (element.files[0].size <= maxSize);
    }, $.validator.format("File size should be less than {0}."));
    $.validator.addMethod("gtoday", function(value, element, format) {
        if( this.optional( element ) ){
            return true;
        }
        if( typeof(moment) === 'undefined' ){
            fp.log(element.name + ': please include moment.js!');
            return true;
        }
        if( typeof(format) !== 'string' ){
            fp.log(element.name + ': wrong format!');
            return true;
        }
        if( !value || !format ){
            return false;
        }

        var mDate                                   = fp.getMoment( value, format );
        return mDate ?
            mDate.format(format) === value && mDate.unix() >= moment( moment(Date()).format(format), format).unix()
            : false
        ;
    }, $.validator.format("Please enter valid date."));
    $.validator.addMethod("ltoday", function(value, element, format) {
        if( this.optional( element ) ){
            return true;
        }
        if( typeof(moment) === 'undefined' ){
            fp.log(element.name + ': please include moment.js!');
            return true;
        }
        if( typeof(format) !== 'string' ){
            fp.log(element.name + ': wrong format!');
            return true;
        }
        if( !value || !format ){
            return false;
        }

        var mDate                                   = fp.getMoment( value, format );
        return mDate ?
            mDate.format(format) === value && mDate.unix() <= moment( moment(Date()).format(format), format).unix()
            : false
        ;
    }, $.validator.format("Please enter valid date."));

    $.validator.addMethod("captcha", function(value, element) {
        if( this.optional( element ) ){
            return true;
        }
        var
            $el                                     = $(element),
            isValid                                 = false
        ;
        if( $().realperson ){
            var rpHash                              = function(v) { 
                var h                               = 5381;
                v                                   = (v + '').toUpperCase();
                for(var i = 0; i < v.length; i++) { 
                    h = ((h << 5) + h) + v.charCodeAt(i); 
                } 
                return h;
            };
            if( rpHash( value ) === $el.realperson('getHash') ){
                isValid                             = true; 
            }
        }else if( value ){
            isValid                                 = true;
        }
        
        return isValid;
    }, $.validator.format("Please enter correct code."));

    $.validator.addMethod("grouprequire", function(value, element, opts) {
        var
            $el                                     = $(element),
            $fields                                 = false,
            options                                 = $el.data('grouprequireOptions')
        ;
        if( !options ){
            if( typeof(opts) === 'string' ){
                options                             = opts.split(':');
                options                             = {
                    selector                        : '[data-rule-grouprequire="' + options[0] + '"], [data-rule-grouprequire^="' + options[0] + ':"]',
                    min                             : options.length > 1 && options[1] ? options[1] : 1,
                    max                             : options.length > 2 && options[2] ? options[2] : 0,
                };
            }
            $fields                                 = $( options.selector, element.form ).data('grouprequireOptions', options);
        }else{
            $fields                                 = $( options.selector, element.form );
        }
        var
            $fieldsFirst                            = $fields.eq(0),
            validator                               = ($fieldsFirst.data("validSkip") ? $fieldsFirst : $fieldsFirst.data("validSkip", $.extend({}, this))).data("validSkip"),
            count                                   = $fields.filter(function() {
                var val,
                    $element                        = $( this ),
                    type                            = this.type;

                if ( type === "radio" || type === "checkbox" ) {
                    return $element.filter(":checked").val();
                } else if ( type === "number" && typeof this.validity !== "undefined" ) {
                    return this.validity.badInput ? false : $element.val();
                }

                val = $element.val();
                if ( typeof val === "string" ) {
                    return val.replace(/\r/g, "" );
                }
                return val;
            }).length,
            isValid                                 = true
        ;

        if( count < options.min || (options.max && count > options.max) ){
            isValid                                 = false;
        }
        $fieldsFirst = count                        = null;

        // If element isn't being validated, run each grouprequire field's validation rules
        if (!$el.data("beingValidated")) {
            if( validator.checkable(element) ){
                $fields                             = $fields.not( '[name="' + $el.attr('name') + '"]' );
            }
            $fields.data("beingValidated", true);
            $fields.each(function() {
                validator.element(this);
            });
            $fields.data("beingValidated", false);
        }
        
        return isValid;
    }, $.validator.format("Please fill some of these fields."));

    $.fn.fpValidate                            = function(){
        if( !fp.pluginCheck(this, "Forms Plus: validate - Nothing selected.") ){
            return this;
        }
        var createStateMsg                          = function(){
            return $('<span>').addClass('p-field-sub-text p-validation-state');
        };
        $.each(this, function(i, $form){
            $form                                   = $($form);
            $form.validate({
                errorClass                          : 'p-field-error',
                validClass                          : 'p-field-valid',
                errorElement                        : 'span',
                ignore                              : '.p-ignore-field, .p-ignore-hidden-field:hidden',
                highlight                           : function(element, errorClass, validClass) {
                    $(element).closest(fp.selectors.validationWrap).removeClass(validClass).addClass(errorClass);
                },
                unhighlight                         : function(element, errorClass, validClass) {
                    var
                        $element                    = $(element),
                        $wrap                       = $element.closest(fp.selectors.validationWrap),
                        $subtext                    = $wrap.find('.p-validation-state') || false,
                        $icon                       = $element.data('validIcon') ? $($element.data('validIcon')) : false //Create icon for message
                    ;
                    $wrap.removeClass(errorClass);
                    if( validClass ){
                        $wrap.addClass(validClass);
                    }else{
                        $wrap.removeClass('p-field-valid');
                    }
                    if( $element.data('$fpValidationMsg') ){
                        //Remove old message;
                        $element.data('$fpValidationMsg').remove();
                        $element.data('$fpValidationMsg', null);
                    }

                    //check if valid message should be shown
                    if( validClass && $element.data('validMsg') && ($form.data('showValidMsg') || $element.data('showValidMsg')) ){
                        $subtext                    = $subtext ? $subtext : createStateMsg().appendTo($wrap);
                        if( $form.data('jsShowStateIcons') ){
                            $icon                   = ( $icon ? $icon : $( $form.data('validIcon') || '<i class="fa fa-check"></i>' ) ).appendTo($subtext);
                        }
                        //if form or element has '<any data-highlight-state-msg="true" >' then highlight all message, if not highlight just icon if any
                        if( $form.data('jsHighlightStateMsg') || $element.data('jsHighlightStateMsg') ){
                            $subtext.addClass('p-valid-text');
                        }else if( $icon ){
                            $icon.addClass('p-valid-text');
                        }
                        $element.data('$fpValidationMsg', $subtext);
                    }else if( !$subtext.html() ){
                        //If no errors - remove
                        $subtext.remove();
                    }
                },
                errorPlacement                      : function(error, element) {
                    var
                        $element                    = $(element),
                        $error                      = $(error),
                        $wrap                       = $element.closest(fp.selectors.validationWrap),
                        $subtext                    = ( $wrap.find('.p-validation-state').length ? $wrap.find('.p-validation-state')
                            : createStateMsg().appendTo($wrap) ),
                        $icon                       = $element.data('errorIcon') ? $($element.data('errorIcon')).appendTo($subtext) : false //Create icon for message
                    ;
                    if( $element.data('$fpValidationMsg') ){
                        //Remove old message;
                        $element.data('$fpValidationMsg').remove();
                    }
                    $element.data('$fpValidationMsg', $error);
                    if( !$icon && $form.data('jsShowStateIcons') ){
                        $icon                       = $( $form.data('errorIcon') || '<i class="fa fa-times"></i>' ).appendTo($subtext);
                    }
                    $subtext.append( $error );

                    //if form or element has '<any data-highlight-state-msg="true" >' then highlight all message, if not highlight just icon if any
                    if( $form.data('jsHighlightStateMsg') || $element.data('jsHighlightStateMsg') ){
                        $subtext.addClass('p-error-text');
                    }else if( $icon ){
                        $icon.addClass('p-error-text');
                    }
                },
                submitHandler                       : function(form){
                    var $form                       = $(form);
                    $form.off('fpGeneralCheck.fpValidate');
                    var $submEl                     = $form.data('submitBtn') || $form;
                    $form
                        .data('submitBtn', null)
                        .trigger('fpValidationSuccess')
                    ;
                    if( $().fpAjaxSubmit && ($form.is('[data-js-ajax-form]') || $form.data('ajaxSubmit')) ){
                        $form.data('ajaxSubmit', null);
                        $submEl.fpAjaxSubmit();
                        var jqXHR                   = $form.data('jqxhr');
                        if( !jqXHR ){
                            $form.on('fpGeneralCheck.fpValidate', function(e, dfds){
                                dfds.push($.Deferred().resolve('validation'));
                            });
                        }
                    }else{
                        if( fp.appendCaptchaHash ){
                            //because of dirrect form submit, captcha is appended in submit event, but not added to POST data..., thats why add it here.
                            fp.appendCaptchaHash( $form );
                        }
                        if( !$form.data('target') ){
                            $form.data('target', $form.prop('target'));
                        }
                        $form.prop('target', $submEl.attr('formtarget'));
                        form.submit();
                        setTimeout(function() {
                            $form.find('.' + fp.css.removeAfterSend).remove();
                            $form.prop('target', $form.data('target'));
                        });
                    }
                },
                invalidHandler                      : function(event, validator){
                    $form
                        .data('submitBtn', null)
                        .data('ajaxSubmit', null)
                        .trigger('fpValidationFailed', [validator])
                    ;
                    $form
                        .off('fpGeneralCheck.fpValidate')
                        .on('fpGeneralCheck.fpValidate', function(e, dfds){
                            dfds.push($.Deferred().reject('validation'));
                        })
                    ;
                }
            });
        });
        return this;
    };
    // Add init function
    fp.initFn.push(function($container){
        //Check if it's already being validated
        if( !$container.closest('form[data-js-validate]').length ){
            $container.find('form[data-js-validate]').fpValidate();
        }

        /*
            Trigger 'fpGeneralCheck' event for these element to run check for it's fields.
            This functionality is used for example for steps(forms-plus-steps.js) to validate current step.
        */
        $container.find('[data-js-validation-block]')
            .off('.fpValidate')
            .on('fpGeneralCheck.fpValidate', function(e, dfds){
                e.stopPropagation();
                var
                    dfd                             = $.Deferred(),
                    valid                           = true
                ;
                dfds.push(dfd);

                //Run check for all default fields
                $(this).find(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                    "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                    "[type='radio'], [type='checkbox']").each(function(i, $el){
                    if( !$($el).valid() ){
                        valid                       = false;
                    }
                });
                if( valid ){
                    dfd.resolve('validation');
                }else{
                    dfd.reject('validation');
                }
            })
        ;
        $container.find('[data-js-submit]').off('.fpSubmitBtn').on('click.fpSubmitBtn', function(){
            var $el                                 = $(this),
                $form                               = $el.is( 'form' ) ? $el : $el.closest('form')
            ;
            if( $form.is('[data-js-validate]') ){
                $form.data('submitBtn', $el);
                return;
            }
        });
    });
}));