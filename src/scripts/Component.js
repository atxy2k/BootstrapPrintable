import $ from 'jQuery';
import { throw_if, throw_unless, in_array } from './Utils';
import {isEmpty,forEach, range} from 'lodash';
import moment from 'moment';
moment.locale('es-ES');

let DefaultOptions = 
{
    lang : {
        select_empty_option : 'Select an option',
        months : {
            'january'   : 'January',
            'february'  : 'February',
            'march'     : 'March',
            'april'     : 'April',
            'may'       : 'May',
            'june'      : 'June',
            'july'      : 'July',
            'august'    : 'August',
            'september' : 'September',
            'october'   : 'October',
            'november'  : 'November',
            'december'  : 'December',
        }
    },
    date : {
        days : range(1,31),
        years : range( moment().year() - 5, moment().year() + 1 ).reverse()
    }
};
class Component
{

    constructor( $component, options = {} )
    {
        this.$component = $component;
        this.options = $.extend({}, DefaultOptions, options);
        let types_availables = ['text','textarea','select','date','select-ajax','select-object'];
        let data_target_name = $component.attr('data-target-name'); //Name
        let data_target_type = $component.attr('data-target-type'); //Type
        let data_target_label = $component.attr('data-target-label'); //Label
        let data_target_default = $component.attr('data-target-default'); //Default value
        let data_target_required = $component.attr('data-target-required'); //Required
        let data_target_origin = $component.attr('data-target-origin'); //Origin
        let data_target_origin_key = $component.attr('data-target-origin-key'); //Origin key
        let data_target_origin_value = $component.attr('data-target-origin-value'); //Origin value
        throw_if( isEmpty(data_target_name), 'The element has not *name* attribute' );
        throw_if( isEmpty(data_target_type), 'The element has not *type* attribute' );
        throw_if( isEmpty(data_target_label), 'The element has not *label* attribute' );
        throw_unless( in_array(data_target_type, types_availables), `*${data_target_type}* type is not suported. ` );
        throw_if( in_array( data_target_type, ['select','select-ajax','select-object'] ) && isEmpty(data_target_origin), 'Origin field is required' );
        throw_if( (data_target_type === 'select-object' || data_target_type === 'select-ajax') && ( isEmpty(data_target_origin_key) || isEmpty(data_target_origin_value)  ), 'Origin key and value has required for select-object' );
        if( data_target_type === 'select-object' )
        {
            data_target_origin = JSON.parse(data_target_origin);
            data_target_default = !isEmpty(data_target_default) ? JSON.parse(data_target_default) : null;
        }
        else if( data_target_type === 'select' )
        {
            let provisional = [];
            forEach( data_target_origin.split(','), (i)=>{
                provisional.push({
                    key : i.trim().toLowerCase().replace(' ','_'),
                    value : i.trim()
                });
            });
            data_target_origin = provisional;
            data_target_default = data_target_default.trim().toLowerCase().replace(' ','_');
        }
        else if( data_target_type === 'select-ajax' )
        {
            data_target_default = !isEmpty(data_target_default) ? JSON.parse(data_target_default) : null;
        }
        data_target_required = data_target_required === 'true';
        this.properties = 
        { 
            "name"      : data_target_name, 
            "type"      : data_target_type,
            "label"     : data_target_label,
            "default"   : data_target_default,
            "required"  : data_target_required,
            "origin"    : data_target_origin,
            "origin_key": data_target_origin_key,
            "origin_value": data_target_origin_value,
            "options"   : this.options
        };
    }

    build( $form )
    {
        let self = this;
        let template = require('../templates/component.twig');
        return new Promise( (resolve, reject) => {
            try
            {
                if( self.properties.type == 'select-ajax' )
                {
                    $.get( self.properties.origin, function(data)
                    {
                        self.properties.origin = data;
                        let html = template(self.properties);
                        let element = html.toDOM();
                        self.$element = $(element);
                        $form.find('.Modal-settings-content').append( self.$element );
                        resolve( self.$element );    
                    }).catch(function(err){
                        reject(err);
                    });
                }
                else
                {
                    let html = template(self.properties);
                    let element = html.toDOM();
                    self.$element = $(element);
                    $form.find('.Modal-settings-content').append( self.$element );
                    resolve( self.$element );
                }
            }
            catch( err )
            {
                reject(err);
            }
        });
    }

}

export default Component;