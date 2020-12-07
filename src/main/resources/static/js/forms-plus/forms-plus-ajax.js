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

    if( !$().ajaxSubmit() ){
        return;
    }

    var
        disableButtonsCss                           = 'p-ajax-disabled',
        getAjaxOptions                              = function($el, opts){
            var
                url                                 = $el.data('jsAjaxForm'),
                options                             = $.extend(
                    {
                        dataType                        : 'json',
                        url                             : url && typeof(url) === 'string' ? url : $el.attr('action')
                    },
                    fp.getDataOptions($el, 'fpAjax', ['clearForm', 'data', 'dataType', 'forceSync', 'iframe', 'iframeSrc', 'iframeTarget', 'replaceTarget', 'resetForm', 'semantic']),
                    opts
                )
            ;
            return options;
        },
        toggleAjaxBlocks                            = function($el, action){
            if( fp.toggleBlock ){
                var dataName                        = 'jsAjax' + action.charAt(0).toUpperCase() + action.slice(1);
                if( $el.data(dataName + 'ShowBlock') ){
                    fp.toggleBlock($el, $el.data(dataName + 'ShowBlock'), true);
                }
                if( $el.data(dataName + 'HideBlock') ){
                    fp.toggleBlock($el, $el.data(dataName + 'HideBlock'), false);
                }
            }
        },
        addAjaxDataContent                          = function($form, data){
            if( fp.findBlock && typeof(data) === 'object' ){
                if( data.blocks ){
                    $.each(data.blocks, function(k, bData){
                        addAjaxDataContent($form, bData);
                    });
                    return;
                }
                if( data.block ){
                    var block                       = fp.findBlock(data.block);
                    if( block.length ){
                        if( data.content ){
                             block
                                .html(data.content)
                                .fpInit()
                            ;
                        }
                        block.show(); 
                    }
                }
                if( data.showBlocks ){
                    $.each(data.showBlocks, function(i, blockName){
                        fp.toggleBlock($form, blockName, true );
                    });
                }
                if( data.hideBlocks ){
                    $.each(data.hideBlocks, function(i, blockName){
                        fp.toggleBlock($form, blockName, false );
                    });
                }
                if( data.clearBlocks ){
                    $.each(data.clearBlocks, function(i, blockName){
                        fp.findBlock(blockName).html('');
                    });
                }
                if( data.fieldValues ){
                    $.each(data.fieldValues, function(i, valObj){
                        fp.setFieldValue(valObj);
                    });
                }
            }
        },
        ajaxSuccessFn                               = function($form, data, status, jqXHR){
            $form[0].reset();
            $form.trigger('fpAjaxDone', [jqXHR, status, data]);
            toggleAjaxBlocks($form, 'success');
            addAjaxDataContent($form, data);
        },
        ajaxFailFn                                  = function($form, data, status, jqXHR){
            $form.trigger('fpAjaxFail', [jqXHR, status, data]);
            toggleAjaxBlocks($form, 'fail');
            addAjaxDataContent($form, status === 'fpAjaxFail' ? data.errorData : {
                content : '<h4>Error - ' + status + '</h4>'
            });
        },
        bindAfterActions                            = function($form, jqXHR){
            $form.find('.' + fp.css.removeAfterSendCss).remove();

            toggleAjaxBlocks( $form, 'before' );

            $form.find('.' + disableButtonsCss).prop('disabled', true);
            var dfd                                 = $.Deferred();

            $form.off('fpGeneralCheck.fpAjax').on('fpGeneralCheck.fpAjax', function(e, dfds){
                dfds.push(dfd);
            });

            //Trigger events, if need some actions done use $<form>.on(<eventname>).
            jqXHR
                .done(function(data, status, xhr){
                    if( data.errorData ){
                        ajaxFailFn($form, data, 'fpAjaxFail', xhr);
                        dfd.reject(data.errorData);
                        return;
                    }
                    ajaxSuccessFn($form, data, status, xhr);
                    dfd.resolve('ajax');
                })
                .fail(function(xhr, status, data){
                    ajaxFailFn($form, data, status, xhr);
                    dfd.reject('ajax');
                })
                .always(function(){
                    $form.trigger('fpAjaxAlways', arguments);
                    toggleAjaxBlocks( $form, 'always' );
                    $form.find('.' + disableButtonsCss).prop('disabled', false);
                    dfd = jqXHR = null;
                })
            ;
        }
    ;

    /* sends just first form */
    $.fn.fpAjaxSubmit                          = function(opts){
        if( !fp.pluginCheck(this, "Forms Plus: ajaxSubmit - Nothing selected.") ){
            return this;
        }
        var $el                                     = $(this).eq(0);
        if( !$el.is( 'form' ) ){
            $el                                     = $el.closest('form');
        }
        if( fp.appendCaptchaHash ){
            fp.appendCaptchaHash( $el );
        }

        $el.ajaxSubmit( getAjaxOptions($el, opts) );
        bindAfterActions($el, $el.data('jqxhr'));
        return this;
    };

    /* sends ajax on submit */
    $.fn.fpAjaxForm                            = function(opts){
        if( !fp.pluginCheck(this, "Forms Plus: ajaxForm - Nothing selected.") ){
            return this;
        }
        $(this).not('[data-js-validate]').each(function(i, $el){
            $el                                     = $($el);
            $($el)
                .ajaxForm( getAjaxOptions($el, opts) )
                .off('.fpAjaxForm')
                .on({
                    'form-pre-serialize.fpAjaxForm'     : function(){
                        if( fp.appendCaptchaHash ){
                            fp.appendCaptchaHash( $(this) );
                        }
                    },
                    'form-submit-notify.fpAjaxForm'     : function(){
                        var $t                      = $(this);
                        bindAfterActions($t, $t.data('jqxhr'));
                    }
                })
            ;
        });
        return this;
    };

    // Add init function
    fp.initFn.push(function($container){
        $container.find('[data-js-ajax-form]').fpAjaxForm();
        $container.find('[data-js-ajax-submit]').off('.fpAjaxSubmit').on('click.fpAjaxSubmit', function(e){
            var $el                                 = $(this),
                $form                               = $el.is( 'form' ) ? $el : $el.closest('form')
            ;
            if( $form.is('[data-js-validate]') ){
                $form.data('submitBtn', $el);
                $form.data('ajaxSubmit', true);
                return;
            }
            e.preventDefault();
            $el.fpAjaxSubmit();
        });
    });
}));