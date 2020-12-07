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

    fp.css.template                              = 'js-template-block';
    fp.selectors.template                        = '.' + fp.css.template;
    fp.selectors.block                           = '.p-block';
    fp.selectors.addBlockClosest                 = fp.selectors.block + ', ' + fp.selectors.formGroup;
    fp.selectors.removeBlockClosest              = '.p-block, ' + fp.selectors.fieldWrap;
    fp.allowedPositions                          = ['append', 'before', 'after', 'prepend'];
    fp.createFromTemplate                        = function($parent, position, $template, $creator, groupName, max){
        //Don't add-block if no template found or it reached max number of copies
        var tID                                         = $template.attr('data-js-id') || $template.attr('data-js-template'),
            _groupName                                  = groupName || fp.getElementsDataId($parent) + '-' + tID,
            templateCount                               = fp.getData($template, 'jsTemplateCount', {}),
            count                                       = $('[data-js-block-group="' + _groupName + '"]').length
        ;
        if( max && _groupName && count >= max ){
            return $([]);
        }
        
        if( !templateCount[_groupName] ){
            templateCount[_groupName]                   = count;
        }
        ++templateCount[_groupName];

        if( $.inArray(position, fp.allowedPositions) < 0 ){
            position                                    = fp.allowedPositions[0];
        }

        var $block                                      = $( $template.html().replace(/\{\$i\}/g, templateCount[_groupName]) );

        $parent[position]( $block );
        $block                                          = $block
            .filter('*')
            .data({
                'jsCreator'                             : $creator
            })
            .addClass(fp.css.template)
        ;
        if( _groupName ){
            $block.attr('data-js-block-group', _groupName);
        }
        $block.trigger('fpCreateBlock');
        return $block;
    };
    fp.removeBlock                               = function($block){
        if( $block.data('jsCreator') && $block.data('jsBlockGroup') ){
            //Check if can remove block
            var
                $creator                                = $block.data('jsCreator'),
                min                                     = $creator.data('jsAddBlockMin') || false,
                groupName                               = $block.data('jsBlockGroup')
            ;
            if( min && $('[data-js-block-group="' + groupName + '"]').length <= min ){
                return;
            }
        }
        $block.trigger('fpRemoveBlock').remove();
    };
    fp.toggleBlockRelatedStatus                   = function($block, state){
        if( !($block.length || $block.data('jsBlock')) ){
            return $block;
        }
        var
            blockName                                   = $block.data('jsBlock'),
            dataAttrs                                   = [
                'data-js-related-block',
                'data-js-show-block',
                'data-js-hide-block',
                'data-js-toggle-block'
            ],
            selectors                                   = ':fp-has-attr-content("' + blockName + '",' + dataAttrs.join(',') + ')',
            $els                                        = $( '[' + dataAttrs.join('],[') + ']' ).filter(selectors),
            $radios                                     = $els.filter('[type="radio"]'),
            $checked                                    = $([])
        ;
        state                                           = typeof(state) === 'boolean' ? state : $block.is(':hidden');
        $els.each(function(i, $rBlock){
            $rBlock                                     = $($rBlock);
            var
                shownClass                              = $rBlock.data('jsRelatedShownClass'),
                hiddenClass                             = $rBlock.data('jsRelatedHiddenClass'),
                toggledClass                            = $rBlock.data('jsRelatedToggledClass')
            ;
            if( toggledClass ){
                $rBlock.toggleClass(toggledClass, state);
            }
            if( shownClass ){
                $rBlock.toggleClass(shownClass, state);
            }
            if( hiddenClass ){
                $rBlock.toggleClass(hiddenClass, !state);
            }
            if( $rBlock.is('option, [type="checkbox"], [type="radio"]') && !$rBlock.is('[data-js-block-no-check]') ){
                if( $checked.filter($rBlock).length ){
                    return;
                }
                var
                    prop                                = $rBlock.is('option') ? 'selected' : 'checked',
                    value                               = fp.hasAttrContent($rBlock, blockName, ['data-js-hide-block']) ? !state : state
                ;
                if( $rBlock.prop( prop ) !== value ){
                    if($rBlock.is('[type="radio"]')){
                        var $related                        = $rBlock.closest('form, body').find( $radios ).filter('[name="' + $rBlock.attr('name') +'"]');
                        $checked                            = $checked.add($related);
                        if( $related.length > 1 ){
                            var
                                $hRel                       = $related.filter(':fp-has-attr-content("' + blockName + '",data-js-hide-block)'),
                                $sRel                       = $related.filter(':fp-has-attr-content("' + blockName + '",data-js-show-block)')
                            ;
                            if((
                                    state && ( $hRel.not(':checked').length || $sRel.filter(':checked').length )
                                ) || (
                                    !state && ( $hRel.filter(':checked').length || $sRel.not(':checked').length )
                                )
                            ){
                                return;
                            }
                        }
                    }
                    $rBlock.prop( prop, value).fpTriggerChange();
                }
            }
        });
    };
    fp.showBlock                                 = function($block){
        $block.show( $block.data('jsShowDuration') || $block.data('jsAnimationDuration') || 0 );
        fp.toggleBlockRelatedStatus($block, true);
        $block.trigger('fpBlockShow');
        return $block;
    };
    fp.hideBlock                                 = function($block){
        $block.hide( $block.data('jsHideDuration') || $block.data('jsAnimationDuration') || 0 );
        fp.toggleBlockRelatedStatus($block, false);
        $block.trigger('fpBlockHide');
        return $block;
    };
    fp.findBlock                                 = function(blockName){
        if( !blockName ){
            return $([]);
        }
        var blocks                                      = blockName.split(';');
        if( blocks.length > 1 ){
            //if more than 1 block - run toggle for each block
            var
                $block,
                $blocks                                 = $([])
            ;
            for (var i = 0; i < blocks.length; i++) {
                $block                                  = fp.findBlock(blocks[i]);
                if( $block ){
                    $blocks                             = $blocks.add( $block );
                }
            }
            return $blocks;
        }
        blockName                                       = blockName.split(':')[0];
        return $('[data-js-block="' + blockName + '"]').eq(0);
    };
    fp.toggleBlock                               = function($el, options, state){
        var $block;
        if( typeof(options) === 'string' ){
            var blocks                                  = options.split(';');
            if( blocks.length > 1 ){
                //if more than 1 block - run toggle for each block
                var $blocks                             = $([]);
                for (var i = 0; i < blocks.length; i++) {
                    $block                              = fp.toggleBlock($el, blocks[i], state);
                    if( $block ){
                        $blocks                         = $blocks.add( $block );
                    }
                }
                return $blocks.length ? $blocks : false;
            }
            options                                     = options.split(':');
            options.blockName                           = options[0];
            options.templateName                        = options.length > 0 ? options[1] : false;
        }
        if( !options || !options.blockName ){
            return false;
        }

        $block                                          = $('[data-js-block="' + options.blockName + '"]').eq(0);
        state                                           = typeof(state) === 'boolean' ? state : !$block.is(':visible');

        if($el.is('[type="radio"]')){
            var $related                        = $el.closest('form, body').find('[type="radio"][name="' + $el.attr('name') +'"]').not($el);
            if( $related.length > 0 ){
                var
                    $hRel                       = $related.filter(':checked').filter(':fp-has-attr-content("' + options.blockName + '",data-js-hide-block)'),
                    $sRel                       = $related.filter(':checked').filter(':fp-has-attr-content("' + options.blockName + '",data-js-show-block)')
                ;
                if((
                        !state && $sRel.length && fp.hasAttrContent($el, options.blockName, ['data-js-show-block'])
                    ) || (
                        state && $hRel.length && fp.hasAttrContent($el, options.blockName, ['data-js-hide-block'])
                    )
                ){
                    return $block.length ? $block : false;
                }
            }
        }

        if( state ){
            if( !$block.is(':visible') ){
                if( !$block.length && options.templateName ){
                    var
                        position                        = $el.data('jsInsertPosition') || options.position || 'append',
                        $template                       = $('[data-js-template="' + options.templateName + '"]'),
                        $parent                         = fp.find($el, fp.selectors.block, 'closest')
                    ;
                    if( !$template.length ){
                        return;
                    }
                    $block                              = fp.createFromTemplate($parent, position, $template, $el).fpInit();
                    $block.attr('data-js-block', options.blockName);
                }

                if( $block.length ){
                    fp.showBlock( $block );

                    if( $block.data('jsToggleGroup') ){
                        $('[data-js-toggle-group="' + $block.data('jsToggleGroup') + '"]:visible')
                            .not($block)
                            .each(function(i, $hideBlock){
                                $hideBlock                  = $($hideBlock);
                                if( $hideBlock.is( fp.selectors.template ) ){
                                    fp.toggleBlockRelatedStatus($hideBlock, false);
                                    fp.removeBlock( $hideBlock );
                                }else{
                                    fp.hideBlock( $hideBlock );
                                }
                            })
                        ;
                    }
                }else{
                    return false;
                }
            }
            return $block.length ? $block : false;
        }
        if( $block.length ){
            if( options.templateName ){
                fp.toggleBlockRelatedStatus($block, false);
                fp.removeBlock( $block );
            }else{
                fp.hideBlock( $block );
                return $block;
            }
        }

        return false;
    };

    fp.triggerToggleBlock                        = function($el, blockName, value){
        var temp                                        = typeof(value) === 'undefined' ? 'none' : value,
            isActive                                    = fp.isActiveField($el, 'none')
        ;
        fp.toggleBlock($el, blockName, isActive === 'none' ? value : (temp ? isActive : !isActive) );
    };

    // Add init function
    fp.initFn.push(function($container){
        $container.find('[data-js-add-block]').each(function(i, $el){
            $el                                         = $($el);
            if( !fp.hasDataString($el, 'jsAddBlock') ){
                return;
            }
            var
                position                                = $el.data('jsInsertPosition'),
                $template                               = $('[data-js-template="' + $el.data('jsAddBlock') + '"]'),
                addBlockGroup                           = $el.data('jsAddBlockGroup') || false,
                max                                     = $el.data('jsAddBlockMax') || false,
                min                                     = $el.data('jsAddBlockMin') || false,
                $toEl                                   = fp.find($el, fp.selectors.addBlockClosest, 'closest')
            ;
            if( !$template.length ){
                return;
            }
            
            if( !$toEl.length ){
                $toEl                                   = $el;
            }
            $el.off('.pAddBlock').off('.pAddBlock').on('fpChange.pAddBlock.pBlockForced', {
                    preventOnlyLink     : true
                }, function(){
                    fp.createFromTemplate($toEl, position, $template, $el, addBlockGroup, max).fpInit();
                    $toEl.trigger('fpAddBlock');
                }
            );
            if( min && addBlockGroup ){
                var
                    count                               = $('[data-js-block-group="' + addBlockGroup + '"]').length,
                    $els                                = $([])
                ;
                if( count < min ){
                    for (var j = 0; j < min; j++) {
                        $els                            = $els.add( fp.createFromTemplate($toEl, position, $template, $el, addBlockGroup, max) );
                    }
                    $els.fpInit();
                    $toEl.trigger('fpAddBlock');
                }
                count = $els = null;
            }
        });

        $container.find('[data-js-remove-block]').off('.pRemoveBlock').on('fpChange.pRemoveBlock.pBlockForced', {
                preventOnlyLink     : true
            }, function(){
                var
                    $el                                     = $(this),
                    $toRemoveBlock                          = fp.find($el, fp.selectors.removeBlockClosest, 'closest')
                ;
                if( !$toRemoveBlock.length ){
                    return;
                }
                fp.removeBlock($toRemoveBlock);
            }
        );

        $container.find('[data-js-show-block]').off('.pShowBlock').on('fpChange.pShowBlock.pBlockForced', {
                preventOnlyLink     : true
            }, function(){
                fp.triggerToggleBlock($(this), $(this).data('jsShowBlock'), true);
            }
        );

        $container.find('[data-js-hide-block]').off('.pHideBlock').on('fpChange.pHideBlock.pBlockForced', {
                preventOnlyLink     : true
            }, function(){
                fp.triggerToggleBlock($(this), $(this).data('jsHideBlock'), false);
            }
        );
        $container.find('[data-js-toggle-block]').off('.pToggleBlock').on('fpChange.pToggleBlock.pBlockForced', {
                preventOnlyLink     : true
            }, function(){
                fp.triggerToggleBlock($(this), $(this).data('jsToggleBlock'));
            }
        );

        $container.find('[data-js-hide-toggle-group]').off('.pHideToggleGroup').on('fpChange.pHideToggleGroup.pBlockForced', {
                preventOnlyLink     : true
            }, function(){
                var
                    $el                                     = $(this),
                    name                                    = $el.data('jsHideToggleGroup')
                ;
                if( fp.isActiveField( $el ) ){
                    $('[data-js-toggle-group="' + name + '"]:visible')
                        .each(function(i, $hideBlock){
                            $hideBlock                          = $($hideBlock);
                            if( $hideBlock.is( fp.selectors.template ) ){
                                fp.toggleBlockRelatedStatus($hideBlock, false);
                                fp.removeBlock( $hideBlock );
                            }else{
                                fp.hideBlock( $hideBlock );
                            }
                        })
                    ;
                }
            }
        );

        $container.find('[data-js-show-group-block]').off('.pShowGroupedBlock').on('fpChange.pShowGroupedBlock.pBlockForced', {
                preventOnlyLink     : true
            }, function(){
                var
                    $el                                     = $(this),
                    $els                                    = $('[data-js-show-group-block="' + $el.data('jsShowGroupBlock') + '"]'),
                    hasActive                               = fp.hasActiveField( $els )
                ;
                if( hasActive ){
                    fp.triggerToggleBlock($el, $el.data('jsActionBlock'), true);
                    $els.not($el).each(function(i, el){
                        var $sEl                            = $(el);
                        fp.toggleBlock($sEl, $sEl.data('jsActionBlock'), false );
                    });
                }else{
                    $els.each(function(i, el){
                        var $sEl                            = $(el);
                        fp.toggleBlock($sEl, $sEl.data('jsActionBlock'), true );
                    });
                }
            }
        );

        $container.find('[data-js-force-block-action]').each(function(i, el){
            $(el).triggerHandler('fpChange.pBlockForced');
        });
    });
}));