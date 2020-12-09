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

    /* Initiate stepper */
    var
        Stepper                                       = function($el, opts){
            var context                                 = this;
            context.$el                                 = $($el);
            context.options                             = {
                css                                     : {
                    active                                  : 'active',
                    clickable                               : 'p-js-show-step',
                },
                currentStep                             : 1
            };

            $.extend(
                context.options,
                fp.getDataOptions($el, 'fpStepper', []),
                opts
            );

            var $steps                                  = context.getSteps();
            $steps.each(function(i, $step){
                $step                                   = $($step);
                var $cEl                                = $step.find('.p-step');
                if( !$cEl.length ){
                    $cEl                                = $step;
                }
                $cEl.off('.fpStepper').on('click.fpStepper', function(e){
                    e.preventDefault();
                    if( $step.hasClass( context.options.css.clickable ) ){
                        context.showStep( i + 1 );
                    }
                });
            });
            var $active                                 = $steps.filter('.active');
            if( $active.length ){
                context.options.currentStep             = $steps.index($active) + 1;
            }
            context.showStep( context.options.currentStep, false, true );

            $('body').on('fpValidationFailed.fpStepper', function(e, validator){
                setTimeout( function(){ 
                    var $field                          = $( validator.findLastActive() || validator.errorList.length && validator.errorList[ 0 ].element || []).first();
                    context.getSteps().each(function(i, $step){
                        $step                           = $($step);
                        var $block                      = fp.findBlock($step.data('jsStep'));
                        if( $block.find($field).length ){
                            context.showStep(i + 1);
                            return false;
                        }
                    });
                }, 0);
            });

            $el.data('fpStepper', context);
        }
    ;

    Stepper.prototype                                 = {
        getSteps                                        : function(){
            return this.$el.find('[data-js-step]');
        },
        getStep                                         : function(step){
            return this.getSteps().eq( step - 1 );
        },
        getCurrentStep                                  : function(asElement){
            return asElement ? this.getStep( this.options.currentStep ) : this.options.currentStep;
        },
        getNextStep                                     : function(asElement){
            return asElement ? this.getStep( this.options.currentStep + 1 ) : this.options.currentStep + 1;
        },
        getPreviousStep                                 : function(asElement){
            return asElement ? this.getStep( this.options.currentStep - 1 ) : this.options.currentStep - 1;
        },
        rejectDfd                                       : function(){
            if( this.dfd && this.dfd.state() === 'pending' ){
                this.dfd.reject();
            }
            return this;
        },
        _setActiveStep                                  : function(step){
            var
                context                     = this,
                $next                       = context.getStep( step )
            ;
            if( $next.length ){
                var
                    steps                   = context.getSteps(),
                    $current                = context.options.currentStep === step ? $([]) : context.getCurrentStep( true )
                ;
                context.options.currentStep = step;
                context.$el.trigger('fpStepBeforeShow', [context, context.options.currentStep, $next, $current]);
                fp.toggleBlock($current, $current.data('jsStep'), false);
                fp.toggleBlock($next, $next.data('jsStep'), true);
                $current.removeClass( context.options.css.active );
                $next.addClass( context.options.css.active );
                steps.removeClass( context.options.css.clickable );
                if( !$next.data('jsDisableSteps') ){
                    steps.filter(':lt(' + ( context.options.currentStep - 1 ) + ')').addClass( context.options.css.clickable );
                }
                $('html, body').animate({
                    scrollTop: context.$el.offset().top
                }, 100);
                context.$el.trigger('fpStepShown', [context, context.options.currentStep, $next, $current]);
            }
            return context;
        },
        showStep                                        : function(step, $el, force){
            var context                     = this;
            if( step > context.options.currentStep ){
                if( step === context.options.currentStep + 1 ){
                    return context.nextStep($el);
                }
                if( force ){
                    context.rejectDfd();
                    if( $el && $el.length ){
                        context.rejectDfd();
                        context.dfd         = $.Deferred()
                            .done(function(){
                                context._setActiveStep( step );
                            })
                            .fail(function(errorData){
                                if( errorData && errorData.length && typeof(errorData[0]) === 'object' && errorData[0].step && errorData[0].step !== context.currentStep ){
                                    context.showStep( errorData[0].step );
                                }
                            })
                            .always(function(){
                                context.dfd = null;
                            })
                        ;
                        context.checkStepEl($el, context.dfd);
                        return context;
                    }
                    return context._setActiveStep( step );
                }
            }else if( step !== context.options.currentStep ){
                context.rejectDfd();
                return context._setActiveStep( step );
            }else{
                context.rejectDfd();
                return context._setActiveStep( context.options.currentStep );
            }

            return context;
        },
        nextStep                                        : function($el){
            if( $el && $el.length ){
                return this.nextStepOnCheck($el);
            }
            this.rejectDfd();
            return this._setActiveStep( this.options.currentStep + 1 );
        },
        previousStep                                    : function(){
            return this.showStep( this.options.currentStep - 1 );
        },
        /*
            Show next step after events are done or don't show.
            Uses https://api.jquery.com/category/deferred-object/

            Two events are fired on $el 'fpStepPreShow' and 'fpGeneralCheck', atach your actions to them.
            Add your deferred to second argument - <dfds>:

            $('.your-element').on('fpStepPreShow', function(e, dfds, stepper){
                var myDfd       = jQuery.Deferred();
                dfds.push(myDfd);

                // some actions

                // to show after
                myDfd.resolve();

                // or to don't show step - reject it:
                // myDfd.reject();
                // or set it to return to some step:
                // myDfd.reject({step: 2});
            });
            // and than
            yourStepperInstance.nextStepOnCheck( $('.your-element') );
        */
        nextStepOnCheck                                 : function($el){
            var context                                 = this;
            context.rejectDfd();
            context.dfd                                 = $.Deferred()
                .done(function(){
                    context.nextStep();
                })
                .fail(function(errorData){
                    if( errorData && errorData.length && typeof(errorData[0]) === 'object' && errorData[0].step && errorData[0].step !== context.currentStep ){
                        context.showStep( errorData[0].step );
                    }
                })
                .always(function(){
                    context.dfd                         = null;
                })
            ;
            context.checkStepEl($el, context.dfd);
            return this;
        },

        checkStepEl                                     : function($el, dfd){
            dfd                                         = dfd || $.Deferred();
            var
                context                                 = this,
                dfds                                    = []
            ;
            setTimeout( function(){                                 // timeout so the checks will always run the last
                $el.trigger('fpStepPreShow', [dfds, context]);
                $el.trigger('fpGeneralCheck', [dfds]);              // used to attach Deferreds from validation and ajax
                $.when.apply( $, dfds )
                    .done(function(){
                        if( dfd.state() === "pending" ){
                            dfd.resolve();
                        }
                    })
                    .fail(function(){
                        if( dfd.state() === "pending" ){
                            dfd.reject(arguments);
                        }
                    })
                ;
            }, 0);
            return dfd;
        }
    };

    $.fn.fpStepper                                 = function(opts){
        if( !fp.pluginCheck(this, "Forms Plus: steps - Nothing selected.") ){
            return this;
        }

        $.each(this, function(i, $el){
            new Stepper($($el), opts);
        });
        return this;
    };

    fp.initFn.push(function($container){
        $container.find('[data-js-stepper]').fpStepper();
        $container.find('[data-js-show-step], [data-js-show-step-force]').on('click', function(e){
            var
                step,
                $el                                     = $(this),
                stepper                                 = $el.data('jsShowStep') || $el.data('jsShowStepForce'),
                force                                   = typeof( $el.data('jsShowStepForce') ) !== "undefined"
            ;
            // prevent only for links
            if( $el.is('a') ){
                e.preventDefault();
            }
            if( stepper ){
                stepper                                 = stepper.split(':');
                step                                    = stepper.length > 1 ? parseInt(stepper[1]) : false;
                stepper                                 = $('[data-js-stepper="' + stepper[0] + '"]');
            }else{
                stepper                                 = $el.closest('[data-js-stepper]');
            }
            if( stepper.length && stepper.data('fpStepper') ){
                if( step ){
                    stepper.data('fpStepper').showStep( step, $el, force );
                }else{
                    stepper.data('fpStepper').nextStepOnCheck( $el );
                }
            }
        });
    });
}));