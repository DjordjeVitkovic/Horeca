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

    // Slider
    if( $().slider ){
        $.fn.fpSlider                              = function(opts, fpOpts){
            if( !fp.pluginCheck(this, "Forms Plus: slider - Nothing selected.") ){
                return this;
            }
            var
                css                                     = {
                    tooltip                             : 'p-sl-tip',
                    icon                                : 'p-sl-icon'
                },
                sel                                     = {
                    slider                              : '.ui-slider',
                    handle                              : '.ui-slider-handle',
                    tooltip                             : '.' + css.tooltip,
                    icon                                : '.p-sl-icon',
                    value                               : '.p-js-value',
                    groupWrap                           : '.p-slider-item',
                    wrap                                : '[data-js-slider]'
                },
                getSlFormated                           = function(value, format){
                    return format.replace('{value}', function(){
                        return value;
                    });
                },
                getSlValueObj                           = function(slider, format, ui, index){
                    index                               = index || '';
                    var
                        names                           = {
                            value                       : 'value' + index,
                            min                         : 'min' + index,
                            max                         : 'max' + index,
                            fValue                      : 'fValue' + index,
                            fMin                        : 'fMin' + index,
                            fMax                        : 'fMax' + index,
                        },
                        ret                             = {}
                    ;
                    if( slider.option('range') === true ){
                        ret[names.min]                  = ui ? ui.values[0] : slider.values(0);
                        ret[names.max]                  = ui ? ui.values[1] : slider.values(1);
                        ret[names.fMin]                 = getSlFormated( ret[names.min], format);
                        ret[names.fMax]                 = getSlFormated( ret[names.max], format);
                        ret[names.value]                = ret[names.min] + ':' + ret[names.max];
                        ret[names.fValue]               = ret[names.fMin] + ' - ' + ret[names.fMax];
                    }else{
                        ret[names.value]                = ui ? ui.value : slider.value();
                        ret[names.fValue]               = getSlFormated(ui ? ui.value : slider.value(), format);
                    }
                    return ret;
                },
                setSlHandleIcon                         = function($handle, rangeIcons, mainIcon, value){
                    var
                        icon                            = fp.getRangeObject( rangeIcons, value ),
                        $icon                           = $handle.find(sel.icon)
                    ;
                    if( !icon ){
                        if( $icon.data('icon') !== 'default' ){
                            $icon
                                .data('icon', 'default')
                                .html(mainIcon)
                            ;
                        }
                    }else if( $icon.data('icon') !== icon.id ){
                        $icon
                            .data('icon', icon.id)
                            .html(icon.icon)
                        ;
                    }
                },
                setSlIcon                               = function(slider, rangeIcons, mainIcon, ui){
                    if( rangeIcons ){
                        if( ui && ui.handle ){
                            setSlHandleIcon( $(ui.handle), rangeIcons, mainIcon, ui.value );
                        }else{
                            var $handles                = slider.element.find(sel.handle);
                            if( slider.option('range') === true ){
                                setSlHandleIcon( $handles.first(), rangeIcons, mainIcon, slider.values(0) );
                                setSlHandleIcon( $handles.last(), rangeIcons, mainIcon, slider.values(1) );
                            }else{
                                setSlHandleIcon( $handles, rangeIcons, mainIcon, slider.value() );
                            }
                        }
                    }else{
                        slider.element.find(sel.icon).html(mainIcon);
                    }
                }
            ;
            $(this).each(function(i, $el){
                $el                                     = $($el);
                if( !$el.find('[data-js-slider-block]').length ){
                    return;
                }
                var
                    $field                              = $( $el ).find('[data-js-slider-field]'),
                    fpOptions                           = $.extend({
                            count                       : $el.is('[data-slider-group]') ? $el.find('[data-js-slider-block]').length : 1,
                            showTooltips                : true,
                            format                      : '{value}',
                        }, fpOpts, fp.getDataOptions( $el, 'slider', ['showTooltips', 'icon', 'rangeIcons', 'format', 'name'] )),
                    options                             = $.extend({
                            range                       : 'min'
                        }, opts, fp.getDataOptions( $el, 'slider', ['step', 'range', 'orientation'] ), {
                            min                         : Number( $field.attr('min') || $field.data('jsMin') || 0 ),
                            max                         : Number( $field.attr('max') || $field.data('jsMax') || 100 )
                        }),
                    setSlElsValues                      = function(slider, ui, $handles){
                        var
                            slValueObj                  = getSlValueObj( slider, fpOptions.format, ui )
                        ;
                        if( fpOptions.showTooltips ){
                            if( fpOptions.rangeIcons ){
                                setSlIcon( slider, fpOptions.rangeIcons, fpOptions.icon, ui );
                            }
                            if( ui && ui.handle ){
                                $(ui.handle).find( sel.tooltip ).text( ui.value );
                            }else{
                                var $tips               = $handles.find( sel.tooltip );
                                if( slider.option('range') === true ){
                                    $tips.first().text( slValueObj.fMin );
                                    $tips.last().text( slValueObj.fMax );
                                }else{
                                    $tips.text( slValueObj.fValue );
                                }
                            }
                        }
                        slider.element.closest( fpOptions.isGroup ? sel.groupWrap : sel.wrap ).find( sel.value ).fpSetValue( slValueObj );

                        if( fpOptions.isGroup ){
                            var
                                $sliders                = $el.find(sel.slider),
                                curNum                  = $sliders.index(slider.element) + 1,
                                tmp                     = $.extend({}, slValueObj)
                            ;
                            slValueObj                  = {};
                            $.each(tmp, function(n, v){
                                slValueObj[n + curNum]  = v;
                            });
                            $sliders.each(function(ind, $sl){
                                ++ind;
                                if( ind === curNum ){
                                    return;
                                }
                                $.extend(slValueObj, getSlValueObj( $($sl).data('uiSlider'), fpOptions.format, false, ind ));
                            });
                        }
                        $field
                            .add( $(fpOptions.name ? '[data-slider-bound="' + fpOptions.name + '"]' : []) )
                            .fpSetValue(slValueObj)
                        ;
                    },
                    buildSlValue                        = function(valueObj, rangeObj, currentValues, index){
                        var
                            values                      = false,
                            valueName                   = index ? 'value' + index : 'value'
                        ;
                        currentValues                   = currentValues || [];
                        if( options.range === true ){
                            var names                   = {
                                min                     : index ? 'min' + index : 'min',
                                max                     : index ? 'max' + index : 'max',
                            };
                            values                      = [
                                currentValues.length ? currentValues[0] : rangeObj.min,
                                currentValues.length > 0 ? currentValues[1] : rangeObj.min
                            ];
                            if( valueObj.hasOwnProperty( names.min ) && valueObj.hasOwnProperty( names.max ) ){
                                values[0]               = fp.inRange( valueObj[names.min], rangeObj.min, rangeObj.max );
                                values[1]               = fp.inRange( valueObj[names.max], values[0], rangeObj.max );
                            }else if( valueObj.hasOwnProperty( names.min ) ){
                                values[0]               = fp.inRange( valueObj[names.min], rangeObj.min, rangeObj.max );
                                values[1]               = fp.inRange( values[1], values[0], rangeObj.max );
                            }else if( valueObj.hasOwnProperty( names.max ) ){
                                values[1]               = fp.inRange( valueObj[names.max], rangeObj.min, rangeObj.max );
                                values[0]               = fp.inRange( values[0], rangeObj.min, values[1] );
                            }
                        }else if( valueObj.hasOwnProperty( valueName ) ){
                            values                      = [fp.inRange( valueObj[valueName], rangeObj.min, rangeObj.max )];
                        }else{
                            values                      = currentValues || [rangeObj.min];
                        }
                        return values;
                    },
                    setSlValue                          = function(slider, values, index){
                        var slValues                    = slider.values();
                        if( !slValues.length ){
                            slValues                    = [slider.value()];
                        }
                        values                          = buildSlValue(values, {
                            min                         : slider.option('min'),
                            max                         : slider.option('max')
                        }, slValues, index);
                        if( values.length > 1 ){
                            slider.values( values );
                        }
                        if( options.range !== true ){
                            slider.value( values[0] );
                        }
                    }
                ;
                fpOptions.isGroup                       = fpOptions.count > 1 ? true : false;

                if( $field.length && !$field.data('jsValueFormat') ){
                    //Set default format
                    if( fpOptions.isGroup ){
                        var tmpFormat                   = [];
                        for (var num = 1; num < fpOptions.count + 1; num++) {
                            tmpFormat.push( options.range === true ? '{min' + num + '}:{max' + num + '}' : '{value' + num + '}' );
                        }
                        $field.data( 'jsValueFormat', tmpFormat.join(';') );
                        tmpFormat                       = null;
                    }else{
                        $field.data( 'jsValueFormat', options.range === true ? '{min}:{max}' : '{value}' );
                    }
                }

                var fValues                             = fpOptions.values || ($field.length ? $field.fpGetValue(true) : {});
                $el.find('[data-js-slider-block]').each(function(ind, $slider){
                    var slOptions                       = $.extend({}, options);
                    slOptions.values                    = buildSlValue(fValues, {
                        min         : slOptions.min,
                        max         : slOptions.max
                    }, false, fpOptions.isGroup ? ind + 1 : false);
                    if( slOptions.values.length === 1 ){
                        slOptions.value                 = slOptions.values[0];
                        slOptions.values                = false;
                    }
                    $slider                             = $($slider);
                    if( slOptions.range ){
                        $slider.addClass( 'p-slider-range' + (slOptions.range === true ? '' : '-' + slOptions.range) );
                    }
                    $slider.on({
                        'slidecreate.fpSlider'              : function(){
                            var
                                $wrap                   = $(this),
                                $handles                = $wrap.find( sel.handle ),
                                slider                  = $wrap.data('uiSlider')
                            ;
                            if( fpOptions.showTooltips ){
                                if( fpOptions.icon || fpOptions.rangeIcons ){
                                    $( '<span>' )
                                        .addClass( css.icon )
                                        .appendTo( $handles )
                                        .html(fpOptions.icon )
                                    ;
                                }
                                $( '<span>' )
                                    .addClass( css.tooltip )
                                    .appendTo( $handles )
                                ;
                            }
                            setSlElsValues(slider, false, $handles);
                        },
                        'slidechange.fpSlider'              : function(){
                            var
                                $wrap                   = $(this),
                                $handles                = $wrap.find( sel.handle ),
                                slider                  = $wrap.data('uiSlider')
                            ;
                            setSlElsValues(slider, false, $handles);
                        },
                        'slide.fpSlider'                    : function( event, ui ){
                            setSlElsValues($(this).data('uiSlider'), ui);
                        }
                    })
                    .slider(slOptions);
                    slOptions                           = null;
                });
                fValues                                 = null;
                if( fpOptions.name ){
                    $('[data-slider-bound="' + fpOptions.name + '"]').on('change.fpSlider', function(){
                        var
                            $slider     = $el.find( sel.slider ),
                            fieldValues = $(this).fpGetValue(true)
                        ;

                        if( fpOptions.isGroup ){
                            $slider.each(function(ind, $sl){
                                setSlValue( $($sl).data('uiSlider'), fieldValues, ++ind );
                            });
                        }else{
                            setSlValue( $slider.data('uiSlider'), fieldValues );
                        }
                    });
                }
            });
            return this;
        };
        // Add init function
        fp.initFn.push(function($container){
            $container.find('[data-js-slider]').fpSlider();
        });
    }
}));