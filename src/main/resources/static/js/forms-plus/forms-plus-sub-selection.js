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

    var fpGetDataKeys = function ($el, name){
            var keys = $el.data(name + '_cache'),
                ind
            ;
            if( !keys ){
                var dataKeys = $el.data(name + '');
                keys = [];
                if( dataKeys ){
                    if (typeof dataKeys === 'string'){
                        dataKeys = dataKeys.split(',');
                    }else if ( !(dataKeys instanceof Array) ){
                        dataKeys = [dataKeys];
                    }
                    for (ind = 0; ind < dataKeys.length; ind++) {
                        keys.push( typeof dataKeys[ind] === 'string' ? $.trim(dataKeys[ind]) : dataKeys[ind]);
                    }
                }
                $el.data(name + '_cache', keys);
            }
            return keys;
        },
        fpGetValueKeys = function ($el){
            var keys = $el.data('fpValueKeys_cache'),
                ind
            ;
            if( !keys ){
                var dataKeys = $el.val();
                keys = [];
                if( dataKeys ){
                    if (typeof dataKeys === 'string'){
                        dataKeys = dataKeys.split(',');
                    }else if ( !(dataKeys instanceof Array) ){
                        dataKeys = [dataKeys];
                    }
                    for (ind = 0; ind < dataKeys.length; ind++) {
                        keys.push( typeof dataKeys[ind] === 'string' ? $.trim(dataKeys[ind]) : dataKeys[ind]);
                    }
                }
                $el.data('fpValueKeys_cache', keys);
            }
            return keys;
        },
        fpCanShowOpt = function ($opt, value){
            var keys = fpGetDataKeys($opt, 'jsOptionKeys');
            if( !value ){
                return !keys.length;
            }else{
                var vals = value instanceof Array ? value : [value];
                for (var ind = 0; ind < vals.length; ind++) {
                    if( $.inArray(vals[ind], keys) !== -1 ){
                        return true;
                    }
                }
                return false;
            }
        },
        addAjaxRequest = function($el, selOpts, promise){
            var dfd = $.Deferred(),
                request = $.ajax({
                        url : $el.data('jsSubSelectionUrl'),
                        beforeSend : function(jqXHR, settings){
                            $el.trigger('fpSubSelectionBeforeAjax', [jqXHR, settings, selOpts]);
                        },
                        data : {
                            'keys' : selOpts.keys,
                            'name' : $el.data('name') || $el.attr('name') || ''
                        }
                    })
                    .done(function(data, status, jqXHR){
                        if (typeof data === 'object') {
                            if (data.result){
                                if (!$el.is('select') || typeof data.result === 'string') {
                                    if ($el.is('input,textarea')){
                                        $el.val(data.result);
                                    }else{
                                        $el.append( $(data.result).addClass('p-options-loaded') );
                                    }
                                }else if ($el.is('select')) {
                                    $.each(data.result, function(key, option){
                                        if( typeof option !== 'object' ){
                                            option = { content : option };
                                        }
                                        var $option = $('<option/>')
                                            .attr({
                                                'value' : option.value || key,
                                                'data-js-option-loaded' : ''
                                            })
                                            .addClass('p-options-loaded')
                                            .html(option.content)
                                        ;
                                        if( option.hasOwnProperty('keys') ){
                                            $option.attr('data-js-option-keys', option.keys instanceof Array ? option.keys.join(',') : option.keys);
                                        }
                                        if( option.data ){
                                            $option.data(option.data);
                                        }
                                        if( option.attr ){
                                            $option.attr(option.attr);
                                        }
                                        $el.append($option);
                                    });
                                }
                                if( data.found ){
                                    selOpts.found = true;
                                }
                            }
                        }
                        $el.trigger('fpSubSelectionAjaxDone', [jqXHR, status, data, selOpts]);
                    })
                    .fail(function(jqXHR, status, data){
                        $el.trigger('fpSubSelectionAjaxFail', [jqXHR, status, data, selOpts]);
                    })
                    .always(function(){
                        dfd.resolve();
                    })
            ;
            promise.fail(function(){
                request.abort();
            });
            return dfd;
        },
        doSelection = function($el, selOpts){
            $el.find('[data-js-option-keys]').not('[data-js-option-loaded]').each(function(j, opt){
                var $opt = $(opt);
                if( fpCanShowOpt($opt, selOpts.keys) ){
                    $opt.closest(selOpts.selector).removeClass('p-unavailable');
                    selOpts.found = true;
                }
            });
            if(selOpts.found){
                $el.find('[data-js-option-default]').closest(selOpts.selector).addClass('p-unavailable');
                $el.find('[data-js-option-found]').closest(selOpts.selector).removeClass('p-unavailable');
            }else{
                $el.find('[data-js-option-default]').closest(selOpts.selector).removeClass('p-unavailable');
                $el.find('[data-js-option-found]').closest(selOpts.selector).addClass('p-unavailable');
            }
            if( $el.is('select') ){
                $el.find('option').each(function(i, opt){
                    var $opt = $(opt);
                    if( $opt.css('display') !== 'none' ){
                        $opt.prop("selected", true);
                        return false;
                    }
                });
                $el.trigger('fpChange');
            }else if ($el.is('textarea, input')){
                $el.trigger('fpChange');
            }else{
                $el.find('textarea, input, select').trigger('fpChange');
            }
        },
        resetValues = function($el, selOpts){
            // reset values
            $el.find('.p-options-loaded').remove();
            $el.find('[data-js-option-keys]').closest(selOpts.selector).addClass('p-unavailable');
            $el.find('[data-js-option-default]').closest(selOpts.selector).removeClass('p-unavailable');
            $el.find('[data-js-option-found]').closest(selOpts.selector).addClass('p-unavailable');
            if( $el.is('select') ){
                $el.find('option').each(function(i, opt){
                    var $opt = $(opt);
                    if( $opt.css('display') !== 'none' ){
                        $opt.prop("selected", true);
                        return false;
                    }
                });
                $el.trigger('fpChange');
            }else if ($el.is('textarea, input')){
                $el.val('').trigger('fpChange');
            }else{
                $el.find(':checked').prop('checked', false).trigger('fpChange');
                $el.find(':selected').prop('selected', false).trigger('fpChange');
                $el.find('textarea, input[type="text"]').val('').trigger('fpChange');
            }
            
        },
        getValueKeys = function($els){
            var $selOpt,
                keys = [],
                ret = []
            ;
            $els.each(function(i, el){
                var $el = $(el);
                if ($el.is('select')) {
                    $selOpt = $el.find(':selected');
                    keys = keys.concat($selOpt.is('[data-js-option-keys]') ? fpGetDataKeys($selOpt, 'jsOptionKeys') : fpGetValueKeys($selOpt));
                }else if ($el.is('[type="checkbox"], [type="radio"]')) {
                    if( $el.is(':checked') ){
                        keys = keys.concat($el.is('[data-js-option-keys]') ? fpGetDataKeys($el, 'jsOptionKeys') : fpGetValueKeys($el));
                    }
                }else{
                    keys = keys.concat($el.is('[data-js-option-keys]') ? fpGetDataKeys($el, 'jsOptionKeys') : fpGetValueKeys($el));
                }
            });
            if( $els.length > 1 ){
                for (var i = 0; i < keys.length; i++) {
                    if( $.inArray(keys[i], ret) === -1 ){
                        ret.push(keys[i]);
                    }
                }
            }
            return keys.sort();
        }
    ;

    fp.initFn.push(function($container){
        $container.find('[data-js-sub-selection]').each(function(i, el){
            var $sel = $(el),
                $valueFields = $($sel.data('jsSubSelection')),
                selector = $sel.is('select') ? 'option' : '.p-sub-option',
                showOptions = function(){
                    var keys = getValueKeys($valueFields),
                        str = keys.join(',')
                    ;
                    if( $sel.data('fpSubKeys__selected') !== str ){
                        $sel.data('fpSubKeys__selected', str);
                    }else{
                        return;
                    }
                    if( $sel.data('jsSubSelection__dfd') ){
                        $sel.data('jsSubSelection__dfd').reject();
                    }
                    var dfd = $.Deferred().done(function(){
                            doSelection($sel, props);
                        }),
                        dfds = [],
                        props = {
                            found : false,
                            keys : keys,
                            selector : selector
                        }
                    ;
                    $sel.data('jsSubSelection__dfd', dfd);
                    $sel.trigger('fpSubSelectionBefore', [props, dfd.promise(), dfds]);

                    resetValues($sel, props);
                    if($sel.data('jsSubSelectionUrl')){
                        var ajaxDfd = addAjaxRequest($sel, props, dfd.promise());
                        dfds.push(ajaxDfd);
                    }

                    $.when.apply( $, dfds )
                        .done(function(){
                            dfd.resolve();
                            $sel.trigger('fpSubSelectionDone', [props]);
                        })
                        .fail(function(){
                            dfd.reject();
                            $sel.trigger('fpSubSelectionFail', [props]);
                        })
                        .always(function(){
                            $sel.data('jsSubSelection__dfd', false);
                        })
                    ;
                }
            ;
            if( $valueFields.length ){
                $valueFields
                    .off('.fpSubSelection')
                    .on('fpChange.fpSubSelection', showOptions)
                ;
                showOptions();
            }
        });
    });
}));