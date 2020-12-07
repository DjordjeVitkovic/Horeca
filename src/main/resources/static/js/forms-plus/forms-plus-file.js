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

    // Multiupload
    if ($().fileupload) {
        $.fn.fpMultiupload                         = function(opts){
            if( !fp.pluginCheck(this, "Forms Plus: multiupload - Nothing selected.") ){
                return this;
            }
            $.each(this, function(i, $el){
                $el                                     = $($el);
                var options                             = $.extend({
                    // Uncomment the following to send cross-domain cookies:
                    //xhrFields                          : {withCredentials: true},
                    pasteZone                           : $el,
                    autoUpload                          : false,
                    uploadTemplateId                    : 'p-form-template-upload',
                    downloadTemplateId                  : 'p-form-template-download',
                    filesContainer                      : $el.find('.p-files-blocks'),
                    previewMaxWidth                     : 640,
                    previewMaxHeight                    : 640
                }, opts);
                $el.fileupload(options);
            });
            return this;
        };
        // Add init function
        fp.initFn.push(function($container){
            $container.find('[data-js-multiupload]').fpMultiupload();
        });
    }
}));