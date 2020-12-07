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

    var
        hasLocalStorage, hasSessionStorage,
        allowedTriggers                                 = ['interval', 'change'],
        Autosave                                      = function(el, opts){
            this.$el                                    = $(el);
            var context                                 = this,
                options                                 = $.extend(opts || {}, fp.getDataOptions(context.$el, 'jsAutosave', ['storageType', 'trigger', 'delay', 'id'])),
                id                                      = 'fpForm:' + (options.id || window.location.pathname)
            ;
            context.storage                             = options.storageType && fp._storage[options.storageType] ?
                new fp._storage[options.storageType](id, options.storage) :
                new fp._storage.local(id, options.storage)
            ;
            context.exclude                             = typeof(options.exclude) === 'string' || options.exclude === false ? options.exclude : '[type="password"], [readonly], [disabled], .p-captcha-group input, [type="hidden"]';
            context.options                             = {
                trigger                                 : $.inArray(options.trigger, allowedTriggers) === -1 ? allowedTriggers[0] : options.trigger
            };
            context.options.delay                       = typeof(options.delay) === 'undefined' ?
                (context.options.trigger === 'interval' ? 5000 : 100) :
                fp.toNumber(options.delay)
            ;
            context.timeout                             = false;
            setTimeout(function(){
                context.restore();
            });
            switch( context.options.trigger ){
                case 'interval'     :
                    context.runStore();
                    break;
                case 'change'       :
                    context.getFieldElements().on('fpChange.fpAutosave', function(){
                        if( context.timeout ){
                            clearTimeout(context.timeout);
                        }
                        context.timeout                 = setTimeout(function(){
                            context.runStore();
                            context.timeout             = false;
                        });
                    });
                    break;
            }
        },
        fpLocalStorage                                  = function(id){
            this.id                                     = id;
        },
        fpSessionStorage                                = function(id){
            this.id                                     = id;
        }
    ;
    try {
        localStorage.setItem('formsPlusTest', 'test');
        localStorage.removeItem('formsPlusTest');
        hasLocalStorage                                 = true;
    } catch(e) {
        hasLocalStorage                                 = false;
    }
    try {
        sessionStorage.setItem('formsPlusTest', 'test');
        sessionStorage.removeItem('formsPlusTest');
        hasSessionStorage                               = true;
    } catch(e) {
        hasSessionStorage                               = false;
    }
    fpLocalStorage.prototype                            = {
        isAvalable                                      : function(){
            return hasLocalStorage;
        },
        set                                             : function(value, name){
            if( this.isAvalable() ){
                localStorage.setItem(this.id + (name ? '-' + name : ''), JSON.stringify(value) );
            }
        },
        get                                             : function(name){
            if( this.isAvalable() ){
                return JSON.parse( localStorage.getItem(this.id + (name ? '-' + name : '')) );
            }
        }
    };
    fpSessionStorage.prototype                          = {
        isAvalable                                      : function(){
            return hasSessionStorage;
        },
        set                                             : function(value, name){
            if( this.isAvalable() ){
                sessionStorage.setItem(this.id + (name ? '-' + name : ''), JSON.stringify(value) );
            }
        },
        get                                             : function(name){
            if( this.isAvalable() ){
                return JSON.parse( sessionStorage.getItem(this.id + (name ? '-' + name : '')) );
            }
        }
    };
    Autosave.prototype                                = {
        get                                             : function(){
            return this.storage.get();
        },
        getFieldElements                                : function(){
            var $fields                                 = this.$el.find('input, textarea, select').not('input[type="file"]');
            if( this.exclude ){
                $fields                                 = $fields.not(this.exclude);
            }
            return $fields;
        },
        getFields                                       : function(){
            var
                obj                                     = {},
                context                                 = this
            ;
            context.getFieldElements().each(function(ind, el){
                var $el                                 = $(el);
                if( $el.is('[type="radio"], [type="checkbox"]') && !$el.is(':checked') ){
                    return;
                }
                var name                                = $el.attr('name'),
                    value                               = {
                        'id'                            : $el.attr('id'),
                        'value'                         : $el.val()
                    }
                ;
                if( typeof(obj[name]) === 'undefined' ){
                    obj[name]                           = value;
                }else{
                    if( obj[name] instanceof Array ){
                        obj[name].push(value);
                    }else{
                        obj[name]                       = [obj[name], value];
                    }
                }
            });
            return obj;
        },
        clearTimeout                                    : function(){
            if( this.delay ){
                clearTimeout(this.delay);
                this.delay                              = false;
            }
        },
        afterStore                                      : function(){
            this.$el.trigger('fpAutosave');
            if( this.options.trigger === 'interval' && this.options.delay ){
                this.runStore();
            }
        },
        store                                           : function(){
            this.clearTimeout();
            this.storage.set( this.getFields() );
            this.afterStore();
            return this;
        },
        restore                                         : function(){
            var context                                 = this,
                obj                                     = context.get()
            ;
            if( obj ){
                var $fields                             = context.getFieldElements();
                $.each(obj, function(key, value){
                    var $field                          = $fields.filter('[name="' + key + '"]');
                    if( $field.length ){
                        $fields                         = $fields.not($field);
                        if( value instanceof Array ){
                            for (var i = 0; i < value.length; i++) {
                                $field                  = $field.not(fp.setFieldValue(value[i], $field));
                            }
                        }else{
                            $field                      = $field.not(fp.setFieldValue(value, $field));
                        }
                    }
                });
            }
            return this;
        },
        runStore                                        : function(){
            var context                                 = this;
            context.clearTimeout();
            if( context.options.delay ){
                setTimeout(function(){
                    context.store();
                }, context.options.delay);
            }else{
                context.store();
            }
        }
    };

    fp._storage                                  = {
        local                                           : fpLocalStorage,
        session                                         : fpSessionStorage
    };

    $.fn.fpAutosave                                = function(opts){
        if( !fp.pluginCheck(this, "Forms Plus: autosave - Nothing selected.") ){
            return this;
        }

        $.each(this, function(i, $el){
            new Autosave($($el), opts);
        });
        return this;
    };

    fp.initFn.push(function($container){
        $container.find('[data-js-autosave]').fpAutosave();
    });
}));