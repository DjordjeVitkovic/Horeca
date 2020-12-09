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

    if( !$().autocomplete ){
        return;
    }

    var optsSel                                     = '.fp-au-option';
    $.fn.fpAutocomplete                        = function(opts){
        if( !fp.pluginCheck(this, "Forms Plus: autocomplete - Nothing selected.") ){
            return this;
        }
        $(this).each(function(i, el){
            var $el                                 = $(el),
                source                              = $el.data('jsAutocomplete'),
                $rootEl, $els
            ;
            if( source && typeof(source) === 'string' ){
                switch( source.charAt(0) ){
                    case '!':
                        source                      = source.slice(1).split(',');
                        break;
                    case '#':
                        $rootEl                     = $(source);
                        break;
                    case '*':
                        $rootEl                     = fp.findBlock(source.slice(1));
                        break;
                    case '@':
                        source                      = source.slice(1);
                }

            }else if( typeof(source) !== 'object' ){
                $rootEl                             = $el.closest(fp.selectors.fieldWrap);
            }
            if( $rootEl ){
                source                              = [];
                $els                                = $rootEl.find(optsSel);
                if( $els.length ){
                    $els.each( function(i, opt){
                        var $opt                    = $(opt);
                        source.push({
                            label                   : $opt.data('label') || $opt.data('value'),
                            value                   : $opt.data('value')
                        });
                    });
                }
            }
            var options                             = $.extend({
                appendTo                            : $el.closest(fp.selectors.fieldWrap),
                source                              : source
            }, fp.getDataOptions( $el, 'autocomplete', ['autoFocus', 'delay', 'disabled', 'minLength', 'position'] ), opts || {});
            $el.autocomplete(options);
        });
        return this;
    };
    // Add init function
    fp.initFn.push(function($container){
        $container.find('[data-js-autocomplete]').fpAutocomplete();
    });
}));