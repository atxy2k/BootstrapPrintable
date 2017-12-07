import $ from 'jQuery';
import Component from './Component';
import {isNull, forEach} from 'lodash';
class FormManager
{

    constructor( settings = {} )
    {
        let self = this;
        let components = [];
        this.selectors = {
            modal     : '.Modal-settings',
            handler   : '.editable',
            body      : '.print-page'
        };
        $(this.selectors.handler).on('click', function(evt)
        {
            if( 'preventDefault' in evt ) evt.preventDefault();
            if( 'stopPropagation' in evt ) evt.stopPropagation();
            $(self.selectors.modal).addClass('visible');
        });
        $(this.selectors.modal).find('.Modal-settings-header').find('a').on('click', function(evt){
            if( 'preventDefault' in evt ) evt.preventDefault();
            if( 'stopPropagation' in evt ) evt.stopPropagation();
            $(self.selectors.modal).removeClass('visible');
        });
        $(this.selectors.handler).each(function(){
            let component = new Component( $(this), settings );
            component.build( $(self.selectors.modal).find('form') ).then(()=>{
                component.bindEvents(self);
                components.push(component);
            }, (err) => {
                throw err;
            });
        });
        $(this.selectors.modal).find('form').on('submit', function(evt){
            if( 'preventDefault' in evt ) evt.preventDefault();
            if( 'stopPropagation' in evt ) evt.stopPropagation();
            forEach( components, function( component ){
                component.commit();
                $(self.selectors.modal).removeClass('visible');
            });
        });
    }

}

export default FormManager;