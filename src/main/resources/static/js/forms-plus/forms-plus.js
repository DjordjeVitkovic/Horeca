/* global formsPlus: true, console, moment */

(function (fn) {
    if (typeof jQuery === 'undefined') {
        throw 'Please load jQuery before this script.';
    }
    formsPlus = {};
    fn(jQuery);
}(function ($) {
    "use strict";

    formsPlus                                           = {
        debug                                           : false,
        initFn                                          : [],                               // Array of functions to run on init
        css                                             : {
            removeAfterSendCss                              : 'p-remove-after-send'
        },
        dateFormat                                      : 'DD.MM.YYYY hh:mm a',
        selectors                                       : {
            formGroup                                       : '.form-group',
            fieldWrap                                       : '.input-group, .p-field-group',
            validationWrap                                  : '.form-group, .p-field-group',
            form                                            : '.p-form, form'
        },
        log                                             : function(msg){
            if( formsPlus.debug && window.console ){
                console.log( msg );
            }
            return formsPlus;
        },
        pluginCheck                                     : function(elements, $err){         // Check if there is some elements
            if ( !elements.length ) {
                if ( $err ) {
                    formsPlus.log( $err );
                }
                return false;
            }
            return true;
        },
        formatNumber                                    : function(n){
            return (n + '').replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },
        hasDataString                                   : function($el, name){              // Check element has data attribute and it's string
            return $el.data(name) && typeof($el.data(name)) === 'string';
        },
        isInt                                           : function(value){
            return Number(value) === value && value % 1 === 0;
        },
        isFloat                                         : function(value){
            return value === Number(value) && value % 1 !== 0;
        },
        toNumber                                        : function(value){
            value                                       = Number( value );
            return isNaN(value) ? null : value;
        },
        getFloatLength                                  : function(value){
            if( !formsPlus.isFloat(value) ){
                return 0;
            }
            value                                       = (value + "").split('.');
            return value.length > 1 ? value[1].length : 0;
        },
        inRange                                         : function( value, min, max ){
            if( typeof(min) !== 'number' && typeof(max) !== 'number' ){
                return value;
            }
            value                                       = formsPlus.toNumber(value) || 0;
            if( typeof(min) === 'number' && value < min ){
                return min;
            }
            if( typeof(max) === 'number' && value > max ){
                return max;
            }
            return value;
        },
        getAttribute                                    : function($el, name){
            if( typeof( $el.attr(name) ) !== 'undefined' ){
                return $el.attr(name);
            }
            if( typeof( $el.attr('data-js-' + name) ) !== 'undefined' ){
                name    = ('js-' + name).replace(/-[a-z]/g, function (str) {
                    return str.charAt(1).toUpperCase();
                });
                return $el.data(name);
            }
            return;
        },
        getRangeObject                                  : function(objs, value){
            var ret                                     = false;
            $.each(objs, function(i, obj){
                if( value >= obj.from && (!ret || ret.from < obj.from) ){
                    ret                                 = obj;
                }
            });
            return ret;
        },
        find                                            : function($el, defaultSel, defaultType){
            var
                type                                    = $el.data('jsSelectorType') || defaultType || 'find',
                selector                                = $el.data('jsSelector') || defaultSel
            ;
            if( type === 'root' ){
                return $(selector);
            }
            if( !type || !$()[type] ){
                return $([]);
            }
            return $el[type](selector);
        },
        getDataOptions                                  : function($el, pref, allowed){
            var
                ret                                     = {},
                data                                    = $el.data()
            ;
            if( !pref && !allowed ){
                return data;
            }
            $.each(data, function(name, value){
                if( pref ){
                    if( !name.match("^" + pref) ){
                        return;
                    }
                    if( allowed ){
                        name                            = name.charAt( pref.length ).toLowerCase() + name.slice( pref.length + 1 );
                    }
                }
                if( allowed && $.inArray(name, allowed) === -1){
                    return;
                }
                ret[name]                               = value;
            });
            return ret;
        },
        getMoment                                       : function(value, format, useStrict){
            if( typeof(moment) === 'undefined' ){
                formsPlus.log('Please include moment.js!');
                return null;
            }
            try{
                return moment(value, format, useStrict);
            }catch(e){
                formsPlus.log('getMoment error:');
                formsPlus.log(e);
                return null;
            }
        },
        toDate                                          : function(str, parseFormats, useStrict, date){
            if( typeof(moment) === 'undefined' ){
                formsPlus.log('Please include moment.js!');
                return null;
            }
            if( str === null ){
                return null;
            }
            if( typeof(str) === 'object' && str.isValid && str.isValid() ){
                return str;
            }
            try{
                if( str === 'today' ){
                    str                                     = moment(new Date()).startOf('day');
                }else if( str === 'tomorrow' ){
                    str                                     = moment(new Date()).startOf('day').add(1, 'day');
                }else if( $.inArray(str.charAt(0), ['-', '+']) !== -1 ){
                    date                                    = date || moment(new Date()).startOf('day');
                    switch( str.charAt(0) ){
                        case '+'                                :
                            str                             = date.add( parseInt(str), str.split(' ').pop() );
                            break;
                        case '-'                                :
                            str                             = date.subtract( parseInt(str), str.split(' ').pop() );
                            break;
                    }
                }else{
                    parseFormats                            = parseFormats || formsPlus.dateFormat;
                    useStrict                               = useStrict || false;
                    str                                     = moment(str, parseFormats, useStrict );
                }
            }catch(e){
                formsPlus.log('toDate error:');
                formsPlus.log(e);
                return null;
            }
            return str;
        },
        randomId                                        : function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
                ;
            }
            return s4() + s4();
        },
        getElementDataId                                : function($el) {
            var id                                      = $el.attr('data-js-id');
            if( !id ){
                id                                      = formsPlus.randomId();
                $el.attr('data-js-id', id);
            }
            return id;
        },
        getData                                         : function($el, name, preset){
            var data                                    = $el.data(name);
            if( !data && preset ){
                data                                    = preset;
                $el.data(name, data);
            }
            return data;
        },
        getElementsDataId                               : function() {
            var ids                                     = [],
                id;
            for (var i = 0; i < arguments.length; i++) {
                id                                      = formsPlus.getElementDataId(arguments[i]);
                if( id ){
                    ids.push(id);
                }
            }
            return ids.join('-');
        },
        /*
            @arguments obj, returnObj, properties...
                obj                                     - object to get values from
                returnObj                               - if true and obj is not object returns obj
                properties...                           - one or more property to get in format
                    format:
                        'propertyName'                  - returns 'propertyName' object property or null
                        'propertyName1,propertyName2'   - returns first set object property or null
            @return
                depending on <properties...> returns single value or array of specified properties values

            @examples
                obj = 'some text'
                formsPlus.getObjProp(obj, true, 'name')                         - 'some text'

                obj = {
                    name    : 'my name',
                    title   : 'my title',
                    email   : 'mail@mail.com',
                    login   : 'nickname'
                }
                formsPlus.getObjProp(obj, false, 'text')                            - null
                formsPlus.getObjProp(obj, false, 'title')                           - 'my title'
                formsPlus.getObjProp(obj, true, 'title')                            - 'my title'
                formsPlus.getObjProp(obj, false, 'login,email')                     - 'nickname'
                formsPlus.getObjProp(obj, false, 'description,title')               - 'my title', because object doesn't have 'description' property
                formsPlus.getObjProp(obj, false, 'login', 'email')                  - ['nickname', 'mail@mail.com']
                formsPlus.getObjProp(obj, false, 'name', 'login,email', 'title')    - ['nickname', 'nickname', 'my title']
                formsPlus.getObjProp(obj, false, 'name', 'phone,email', 'address')  - ['nickname', 'mail@mail.com', null]
        */
        getObjProp                                      : function(obj, returnObj){
            if( typeof(obj) !== 'object' || arguments.length < 3 ){
                return returnObj ? obj : null;
            }
            var
                props                                   = arguments.slice(2),
                check                                   = function(obj, prop){
                    prop                                = prop.split(',');
                    var value                           = null;
                    for (var j = 0; j < prop.length; j++) {
                        if( typeof(obj[prop[j]]) !== 'undefined' ){
                            value                       = obj[prop[j]];
                        }
                    }
                    return value;
                }
            ;
            if( props.length === 1 ){
                return check(obj, props[0]);
            }else{
                var ret                                 = [];
                for (var i = 0; i < props.length; i++) {
                    ret.push( check(obj, props[i]) );
                }
                return ret;
            }
        },
        hasActiveField                                  : function($els, all){
            var isActive                                = false;
            $els.each(function(i, el){
                isActive                                = formsPlus.isActiveField($(el));
                if( (isActive && !all) || (!isActive && all) ){
                    return false;
                }
            });
            return isActive;
        },
        isActiveField                                   : function($el, byDef){
            if( $el.is('[type="checkbox"], [type="radio"]') ){
                return $el.is(':checked');
            }else if( $el.is('option') ){
                return $el.is(':selected');
            }
            return typeof(byDef) === 'undefined' ? true : byDef;
        },
        hasAttrContent                                  : function(el, value, attrCheck){
            var
                $el                                     = $(el),
                ret                                     = false
            ;
            if( !( attrCheck.length && $el.is('[' + attrCheck.join('],[') + ']') ) ){
                return ret;
            }
            var patt                                    = new RegExp("([;]|^){1}" + value.replace(/['"]+/g, '') + "([:;]|$){1}");
            $.each(attrCheck, function(i, name){
                var testStr                             = $el.attr(name);
                if( typeof(testStr) === 'string' && patt.test(testStr)){
                    ret                                 = true;
                    return false;
                }
            });
            return ret;
        },
        setFieldValue                                   : function(valObj, $field){
            var $checks;
            if( valObj.id ){
                $field                                  = $field ? $field.filter( '#' + valObj.id ) : $( '#' + valObj.id );
            }
            if( $field && $field.length ){
                if( valObj.value instanceof Array ){
                    return $field.filter('select[multiple]').first().val( valObj.value );
                }
                $checks                                 = typeof(valObj.value) !== 'object' ? $field.filter('[type="radio"], [type="checkbox"]').filter('[value="' + valObj.value + '"]' + ( valObj.value === 'on' ? ', :not([value])' : '' ) ) : $([]);
                if( $checks.length ){
                    return $checks.first().prop('checked', true).fpTriggerChange();
                }else{
                    var $el                             = $field.not('[type="radio"], [type="checkbox"]').first();
                    if( $el.data("DateTimePicker") ){
                        $el.data("DateTimePicker").date( valObj.value );
                    }else{
                        $el.val( valObj.value );
                    }
                    return $el.fpTriggerChange();
                }
            }
            return false;
        }
    };

    if (!Object.keys) {
        Object.keys = function(obj) {
            var keys = [];

            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }

            return keys;
        };
    }

    //only for filtration, heavy usage if checks a lot of elements
    $.expr[':']['fp-has-attr-content']             = function (a,i,m) {
        var
            attrCheck                                   = m[3].split(','),
            value                                       = attrCheck[0]
        ;
        return formsPlus.hasAttrContent(a, value, attrCheck.slice(1));
    };

    $.fn.fpTriggerChange                           = function(){
        var
            $els                                        = $(this),
            $radios                                     = $els.filter('[type="radio"]')
        ;
        $els                                            = $els.not($radios);
        $els.trigger('fpChange');
        $radios.each(function(i, $el){
            $el     = $($el);
            $el
                .closest('form, body').find('[name="' + $el.attr('name') + '"]')
                .trigger('fpChange')
            ;
        });
        return this;
    };

    $.event.special.fpChange       = {
        setup       : function(opts){
            var
                $el                     = $(this),
                prevent                 = true,
                isField                 = true
            ;
            opts                        = $.extend({
                preventDefault      : true,
                preventOnlyLink     : false
            }, opts || {});
            if( (opts.preventOnlyLink && !$el.is('a')) || !opts.preventDefault ){
                prevent                 = false;
            }

            if( $el.is('[type="checkbox"]') ){
                $el.on('click.fpChangeFunc', function(){
                    $el.fpTriggerChange();
                });
            }else if( $el.is('[type="radio"]') ){
                $el.closest('form, body')
                    .find('input[name="' + $el.attr('name') +'"]')
                    .filter('[type="radio"]')
                    .add($el)
                    .off('.fpChangeFunc')
                    .on('click.fpChangeFunc', function(){
                        $(this).fpTriggerChange();
                    })
                ;
            }else if( $el.is('option') ){
                $el.on('click.fpChangeFunc', function(e){
                    e.stopPropagation();
                    $el.trigger('fpChange');
                });
                var $sel                = $el.closest('select');
                if( !$sel.data('changeOpts') ){
                    $sel.on('change.fpChangeOptsFunc', function(){
                        $sel.data('changeOpts').filter(':selected, [data-js-nonselected-force]').trigger('fpChange');
                    });
                }
                $sel.data('changeOpts', ($sel.data('changeOpts') || $([])).add($el) );
            }else if( $el.is('textarea') || ( $el.is('input') && $el.is(':not([type="button"]), :not([type="submit"])') ) ){
                $el.on('blur.fpChangeFunc', function(){
                    $el.trigger('fpChange');
                });
            }else if( $el.is('select') ){
                $el.on('change.fpChangeFunc', function(){
                    $el.trigger('fpChange');
                });
            }else{
                $el.on('click.fpChangeFunc', function(e){
                    if( prevent ){
                        e.preventDefault();
                    }
                    $el.trigger('fpChange');
                });
                isField                 = false;
            }

            if( isField ){
                var $form               = $el.closest('form');
                if( $form.length ){
                    $form
                        .data('fpChangeElements', ($form.data('fpChangeElements') || $([])).add($el) )
                        .off('.fpChangeResetFunc')
                        .on('reset.fpChangeResetFunc', function(){
                            var $fEl    = $(this);
                            setTimeout(function(){
                                $fEl.data('fpChangeElements').trigger('fpChange');
                            });
                        })
                    ;
                }
            }
        },
        teardown    : function() {
            var $el                     = $(this),
                $form                   = $el.closest('form')
            ;
            $el.off('.fpChangeFunc');
            if( $el.is('option') ){
                var
                    $sel                = $el.closest('select'),
                    $els                = ($sel.data('changeOpts') || $([])).not($el)
                ;
                if( $els.length ){
                    $el.closest('select').data('changeOpts', $els );
                }else{
                    $sel.off('.fpChangeOptsFunc');
                }
            }
            if( $form.length ){
                var $cels               = $form.data('fpChangeElements');
                if( $cels ){
                    $cels               = $cels.not($el);
                    if( $cels.length ){
                        $form.data('fpChangeElements', $cels);
                    }else{
                        $form.data('fpChangeElements', null).off('.fpChangeResetFunc');
                    }
                }
            }
        }
    };
    $.event.special.destroyproxy   = {
        //only triggered when element is trully be removed
        remove: function(){
            var
                $el                     = $(this),
                funcs                   = $el.data('destroyProxyFunc')
            ;
            if( funcs ){
                $.each(funcs, function(i, func){
                    func.apply(this, []);
                });
            }
        }
    };
    $.event.special.destroyed      = {
        add     : function(o){
            if (o.handler) {
                var
                    $el                 = $(this),
                    funcs               = $el.data('destroyProxyFunc') || {}
                ;
                funcs[o.guid]           = o.handler;
                $el.data('destroyProxyFunc', funcs );
                if( !$el.data('hasDestroyProxy') ){
                    $el.data('hasDestroyProxy', true);
                    $el.on('destroyproxy', function(){});
                }
            }
        },
        remove  : function(o) {
            if (o.handler) {
                setTimeout( function(){
                    var
                        $el                 = $(this),
                        funcs               = $el.data('destroyProxyFunc')
                    ;
                    if( funcs && funcs[o.guid] ){
                        delete funcs[o.guid];
                    }
                    $el.data('destroyProxyFunc', funcs );
                }, 0 );
            }
        }
    };

    $.fn.fpInit         = function(){
        if( !formsPlus.pluginCheck(this, "Forms Plus: init - Nothing selected.") ){
            return this;
        }
        $(this).trigger('fpInitStart');
        for (var i = 0; i < this.length; i++) {
            var $container                              = $(this[i]);
            $container.trigger('fpBeforeInit');
            for (var j = 0; j < formsPlus.initFn.length; j++) {
                formsPlus.initFn[j]( $container );
            }
            $container.trigger('fpAfterInit');
        }
        $(this).trigger('fpInitEnd');
        return this;
    };
}));