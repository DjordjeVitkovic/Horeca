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
    
    // DateTimePicker
    if( $().datetimepicker ){
        moment.locale('en');
        fp.setMinDate                            = function($el, date, asBase){
            if( !date ){
                return;
            }
            var picker                                  = $el.data("DateTimePicker");
            date                                        = fp.toDate(date, $el.data('dateFormat'));
            if( picker ){
                var min;
                if( asBase && ($el.data('dateMinDate') || $el.data('jsMinDate')) ){
                    var
                        parseFormats                    = picker.extraFormats() || [],
                        format                          = picker.format()
                    ;
                    min                                 = fp.toDate(
                        $el.data('jsMinDate') || $el.data('dateMinDate'),
                        $.inArray( format, parseFormats ) < 0 ? parseFormats.push( format ) : parseFormats,
                        picker.useStrict(),
                        date
                    );
                }
                if( !min || date.unix() > min.unix() ){
                    min                                 = date;
                }
                picker.minDate( min );
            }else{
                $el.fpSetValue( date );
            }
        };
        $.fn.fpDateTimePicker                      = function(opts){
            if( !fp.pluginCheck(this, "Forms Plus: date time picker - Nothing selected.") ){
                return this;
            }
            $(this).each(function(i, $el){
                $el                                     = $($el);
                $el.data('jsValueCache', null);
                var
                    elIsRtl                             = $el.css('direction') === 'rtl' || !!(opts && opts.rtl),
                    parseInputDate                      = function(inputDate){
                        //Fix for setting date from options/data attributes, added tommorow, +/- days/weeks/months - http://momentjs.com/docs/#/manipulating/add/
                        if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                            inputDate                   = moment(inputDate);
                        } else {
                            var picker                  = $el.data("DateTimePicker"),
                                parseFormats, format, useStrict
                            ;
                            if( picker ){
                                parseFormats            = picker.extraFormats() || [];
                                format                  = picker.format();
                                useStrict               = picker.useStrict();
                            }else{
                                parseFormats            = options.extraFormats || [];
                                format                  = $el.data('dateFormat') || options.format || fp.dateFormat;
                                useStrict               = options.useStrict || false;
                            }
                            if( $.inArray( format, parseFormats ) < 0 ) {
                                parseFormats.push( format );
                            }

                            inputDate                   = fp.toDate(inputDate, parseFormats, useStrict);
                        }
                        return inputDate;
                    },
                    options                             = $.extend({
                        format                  : fp.dateFormat,
                        locale                  : moment.locale(),
                        extraFormats            : [fp.dateFormat],
                        keepOpen                : true,
                        widgetPositioning       : {horizontal : elIsRtl ? 'right' : 'auto'},
                        //debug                   : true,
                        icons                   : {
                            time: 'fa fa-clock-o',
                            date: 'fa fa-calendar',
                            up: 'fa fa-chevron-up',
                            down: 'fa fa-chevron-down',
                            previous: 'fa fa-chevron-' + (elIsRtl ? 'right' : 'left'),
                            next: 'fa fa-chevron-' + (elIsRtl ? 'left' : 'right'),
                            today: 'fa fa-calendar-check-o',
                            clear: 'fa fa-calendar-times-o',
                            close: 'fa fa-times'
                        },
                        parseInputDate          : parseInputDate
                    }, opts || {})
                ;
                $el.datetimepicker(options);
                var picker                                  = $el.datetimepicker(options).data("DateTimePicker");
                if( $el.data('jsMinDate') ){
                    picker.minDate( parseInputDate($el.data('jsMinDate')) );
                }
                if( $el.data('jsMaxDate') ){
                    picker.maxDate( parseInputDate($el.data('jsMaxDate')) );
                }
                if( $('[data-js-min-field="' + $el.attr('name') + '"]').length ){
                    $el.on('dp.change', function(e){
                        $('[data-js-min-field="' + $el.attr('name') + '"]').each(function(j, $field){
                            fp.setMinDate( $($field), e.date, true );
                        });
                    });
                }
            });
            return this;
        };
        // Add init function
        fp.initFn.push(function($container){
            $container.find('[data-js-datetimepick]:not([type="hidden"])').fpDateTimePicker();
            $container.find('[data-js-inline-datetimepick]').fpDateTimePicker({
                'inline'        : true
            });
        });
    }

    // ColorPicker
    if( $().spectrum ){
        $.fn.fpColorPicker                         = function(opts){
            if( !fp.pluginCheck(this, "Forms Plus: color picker - Nothing selected.") ){
                return this;
            }
            $(this).each(function(i, $el){
                $el                                     = $($el);
                var options                             = $.extend({
                    appendTo                            : $el.closest(fp.selectors.form).length ? $el.closest(fp.selectors.form) : 'body',
                    preferredFormat                     : 'hex'
                }, opts || {});
                $el.spectrum(options);
            });
            return this;
        };
        // Add init function
        fp.initFn.push(function($container){
            $container.find('[data-js-colorpick]:not([type="hidden"])').fpColorPicker();
            $container.find('[data-js-inline-colorpick]').fpColorPicker({
                'flat'                                  : true
            });
        });
    }

    // captcha
    if( $().realperson ){
        fp.appendCaptchaHash                     = function($form){
            if( !$().realperson ){
                return;
            }
            /*
                sometimes captcha is adding hash field after submit...
                this code add captcha hash, so it always be set before ajax
            */
            var $captcha                                = $form.find('[data-js-captcha]:not([type="hidden"])');
            $captcha.each(function(i, $c){
                $c                                      = $($c);
                var name                                = $c.realperson('option', 'hashName').replace(/\{n\}/, $c.attr('name'));
                $form.find('input[name="' + name + '"]').remove();
                $form.append('<input type="hidden" class="' + fp.css.removeAfterSendCss + '" name="' + name +
                    '" value="' + $c.realperson('getHash') + '">');
            });
        };
        $.realperson.fpFormats                     = {
            format1                                     : [['   *   ', '  ***  ', '  ***  ', ' **  * ', ' ***** ', '**    *', '**    *'], ['****** ', '**    *', '**    *', '****** ', '**    *', '**    *', '****** '], [' ***** ', '**    *', '**     ', '**     ', '**     ', '**    *', ' ***** '], ['****** ', '**    *', '**    *', '**    *', '**    *', '**    *', '****** '], ['*******', '**     ', '**     ', '****   ', '**     ', '**     ', '*******'], ['*******', '**     ', '**     ', '****   ', '**     ', '**     ', '**     '], [' ***** ', '**    *', '**     ', '**     ', '**  ***', '**    *', ' ***** '], ['**    *', '**    *', '**    *', '*******', '**    *', '**    *', '**    *'], ['*******', '  **   ', '  **   ', '  **   ', '  **   ', '  **   ', '*******'], ['     **', '     **', '     **', '     **', '     **', '*    **', ' ***** '], ['**    *', '**  ** ', '****   ', '**     ', '****   ', '**  ** ', '**    *'], ['**     ', '**     ', '**     ', '**     ', '**     ', '**     ', '*******'], ['*     *', '**   **', '*** * *', '** *  *', '**    *', '**    *', '**    *'], ['*     *', '**    *', '***   *', '** *  *', '**  * *', '**   **', '**    *'], [' ***** ', '**    *', '**    *', '**    *', '**    *', '**    *', ' ***** '], ['****** ', '**    *', '**    *', '****** ', '**     ', '**     ', '**     '], [' ***** ', '**    *', '**    *', '**    *', '**  * *', '**   * ', ' **** *'], ['****** ', '**    *', '**    *', '****** ', '**  *  ', '**   * ', '**    *'], [' ***** ', '**    *', '**     ', ' ***** ', '     **', '*    **', ' ***** '], ['*******', '  **   ', '  **   ', '  **   ', '  **   ', '  **   ', '  **   '], ['**    *', '**    *', '**    *', '**    *', '**    *', '**    *', ' ***** '], ['**    *', '**    *', ' **  * ', ' **  * ', '  ***  ', '  ***  ', '   *   '], ['**    *', '**    *', '**    *', '** *  *', '*** * *', '**   **', '*     *'], ['**    *', ' **  * ', '  ***  ', '   *   ', '  ***  ', ' **  * ', '**    *'], ['**    *', ' **  * ', '  ***  ', '  **   ', '  **   ', '  **   ', '  **   '], ['*******', '    ** ', '   **  ', '  **   ', ' **    ', '**     ', '*******'], ['  ***  ', ' *   * ', '*   * *', '*  *  *', '* *   *', ' *   * ', '  ***  '], ['   *   ', '  **   ', ' * *   ', '   *   ', '   *   ', '   *   ', '*******'], [' ***** ', '*     *', '      *', '     * ', '   **  ', ' **    ', '*******'], [' ***** ', '*     *', '      *', '    ** ', '      *', '*     *', ' ***** '], ['    *  ', '   **  ', '  * *  ', ' *  *  ', '*******', '    *  ', '    *  '], ['*******', '*      ', '****** ', '      *', '      *', '*     *', ' ***** '], ['  **** ', ' *     ', '*      ', '****** ', '*     *', '*     *', ' ***** '], ['*******', '     * ', '    *  ', '   *   ', '  *    ', ' *     ', '*      '], [' ***** ', '*     *', '*     *', ' ***** ', '*     *', '*     *', ' ***** '], [' ***** ', '*     *', '*     *', ' ******', '      *', '     * ', ' ****  ']],
        };
        $.fn.fpCaptcha                             = function(opts){
            if( !fp.pluginCheck(this, "Forms Plus: captcha - Nothing selected.") ){
                return this;
            }
            $(this).each(function(i, $el){
                $el                                     = $($el);
                var options                             = {};
                
                $.extend(options, opts || {}, fp.getDataOptions( $el, 'captcha', ['length', 'regenerate', 'dot', 'hashName'] ));
                if( $el.data('captchaFormat') && $.realperson.fpFormats[ $el.data('captchaFormat') ] ){
                    options.dots                        = $.realperson.fpFormats[ $el.data('captchaFormat') ];
                }
                if( $el.data('captchaNumbers') ){
                    options.chars                       = $.realperson.alphanumeric;
                }else if( $el.data('captchaNumbersOnly') ){
                    options.chars                       = '0123456789';
                    options.dots                        = (options.dots || $.realperson.defaultDots).slice(-10);
                }

                $el.realperson(options);
            });
            return this;
        };
        // Add init function
        fp.initFn.push(function($container){
            $container.find('[data-js-captcha]:not([type="hidden"])').each(function(i, el){
                var $el                                 = $(el);
                $el.fpCaptcha();
                $el.closest('form[data-js-reset-captcha]').off('.pCaptchaReset').on('fpAjaxAlways.pCaptchaReset reset.pCaptchaReset', function(){
                    $el.realperson('option', {});
                });
            });
        });
    }


    // Image upload: shows file name and/or image.
    $.fn.fpImageupload                             = function(){
        if( !fp.pluginCheck(this, "Forms Plus: imageupload - Nothing selected.") ){
            return this;
        }
        $.each(this, function(i, $el){
            $el                                         = $($el);
            var reader                                  = false,
                $form                                   = $el.closest('form')
            ;
            if( typeof(FileReader) !== 'undefined' ){
                /*
                    IE 10 and above, and modern browsers

                    Creates FileReader to load selected image and display it
                */
                reader = new FileReader();
                
                reader.onloadstart                      = function(){
                    $el.removeClass('p-has-file'); //Hide old image
                };
                reader.onload                           = function (e) {
                    //Show new image
                    $el.find('.p-preview')
                        .empty()
                        .html('<img src="' + e.target.result + '" alt="" />');
                    $el.addClass('p-has-preview');
                };
            }
            
            // Set change event, unset any previous
            $el.find('input[type="file"]').off('change.fpImageUpload').on('change.fpImageUpload', function(){
                var files                               = this.files ? this.files : this.currentTarget.files;
                if( files.length ){
                    if(reader){
                        // IE 10 and above, and modern browsers
                        reader.readAsDataURL( files[0] );
                    }else{
                        // old browsers, that doesn't support FileReader: will display name of selected image
                        $el.addClass('p-has-file');
                    }
                    $el.find('.p-preview-name')
                        .text( this.value )
                        .attr( 'title', this.value )
                    ;
                }else{
                    $el
                        .removeClass('p-has-preview')
                        .removeClass('p-has-file')
                        .find('.p-preview').empty()
                    ;
                    $el.find('.p-preview-name')
                        .text( "" )
                        .attr( 'title', '' )
                    ;
                }
                
            });

            if( $form && $form.length ){
                $form
                    .data('fpImageupload', ($form.data('fpImageupload') || $([])).add($el) )
                    .off('.fpImageupload')
                    .on('reset.fpImageupload', function(){
                        var $formEl                     = $(this);
                        setTimeout(function(){
                            $formEl.data('fpImageupload').each(function(i, fEl){
                                $(fEl).find('input[type="file"]').triggerHandler('change.fpImageUpload');
                            });
                        });
                    })
                ;
                $el.on('destroyed.fpImageupload', function(){
                    var $formEl                         = $el.closest('form');
                    if( $formEl && $formEl.length ){
                        $formEl.data('fpImageupload', ($formEl.data('fpImageupload') || $([])).not(this) );
                    }
                });
            }
        });
        return this;
    };

    // Add init function
    fp.initFn.push(function($container){
        $container.find('.p-file-wrap [type="file"]')
            .off('change.pFile')
            .each(function(i, el){
                var $el                                 = $(el),
                    $form                               = $el.closest('form');
                $el.on('change.pFile', function(){
                    var $f                              = $(this).closest('.form-group'),
                        $old                            = $f.find('.p-old-file')
                    ;
                    $f.find('.form-control').val(!this.value && $old.length ? $old.attr('data-ao-value') || $old.val() : this.value);
                }).triggerHandler('change.pFile');
                if( $form && $form.length ){
                    $form
                        .data('pFile', ($form.data('pFile') || $([])).add($el) )
                        .off('.pFile')
                        .on('reset.pFile', function(){
                            var $formEl                     = $(this);
                            setTimeout(function(){
                                $formEl.data('pFile').each(function(i, fEl){
                                    $(fEl).triggerHandler('change.pFile');
                                });
                            });
                        })
                    ;
                    $el.on('destroyed.pFile', function(){
                        var $formEl                         = $el.closest('form');
                        if( $formEl && $formEl.length ){
                            $formEl.data('pFile', ($formEl.data('pFile') || $([])).not(this) );
                        }
                    });
                }
            })
        ;
        $container.find('[data-js-image-upload]').fpImageupload();
    });
}));