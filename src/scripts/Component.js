import $ from 'jQuery';
import { throw_if, throw_unless, in_array, number_month, month_from_number } from './Utils';
import {isEmpty,forEach, range, isNull, find,has,isObject} from 'lodash';
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
        years : range( moment().year() - 10, moment().year() + 1 ).reverse(),
        format : 'MMMM DD, YYYY.'
    }, 
    options : 
    {
        onChange : null, //When event change
        preBuild : null, //Clean value
        commit    : null
    }
};
class Component
{

    constructor( $component, options = {} )
    {
        this.$component = $component;
        this.options = $.extend({}, DefaultOptions, options);
        this.provisional_date = {
            day     : null,
            month   : null,
            year    : null
        };
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
        else if( data_target_type === 'date' && !isEmpty(data_target_default) )
        {
            let provisional = data_target_default.split('-');
            console.log(month_from_number(parseInt(provisional[1])));
            data_target_default = 
            { 
                year : provisional[0],
                month : month_from_number(parseInt(provisional[1])),
                day : provisional[2],
            };
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
                        $form.find('.Modal-settings-content').append( $(element) );
                        self.$element = $form.find('.Modal-settings-content').children().last();
                        resolve( self.$element );    
                    }).catch(function(err){
                        reject(err);
                    });
                }
                else
                {
                    let html = template(self.properties);
                    let element = html.toDOM();
                    $form.find('.Modal-settings-content').append( $(element) );
                    self.$element = $form.find('.Modal-settings-content').children().last();
                    resolve( self.$element );
                }
            }
            catch( err )
            {
                reject(err);
            }
        });
    }

    bindEvents($manager)
    {
        let self = this;
        if( this.properties.type == 'text' )
        {
            this.$element.find('input[type=text]').on('keyup', function( evt ){
                if( !isNull(self.options.options.onChange) ) self.options.options.onChange( self.properties.name, evt, $(this).val(), self.properties, self.$element );
            });
        }
        else if( this.properties.type == 'textarea' )
        {
            this.$element.find('textarea').on('keyup', function( evt ){
                if( !isNull(self.options.options.onChange) ) self.options.options.onChange( self.properties.name, evt, $(this).val(), self.properties, self.$element );
            });
        }
        else if( this.properties.type == 'select'  )
        {
            this.$element.find('select').on('change', function( evt ){
                let value = $(this).val();
                let result = find(self.properties.origin, function(item){
                    return item.key === value;
                });
                if( !isNull(self.options.options.onChange) ) self.options.options.onChange( self.properties.name, evt, result, self.properties, self.$element );
            });
        }
        else if( this.properties.type == 'select-object' || this.properties.type == 'select-ajax' )
        {
            this.$element.find('select').on('change', function( evt ){
                let value = $(this).val();
                let result = find(self.properties.origin, function(item){
                    return item[self.properties.origin_key] == value;
                });
                if( !isNull(self.options.options.onChange) ) self.options.options.onChange( self.properties.name, evt, result, self.properties, self.$element );
            });
        }
        else if( this.properties.type == 'date' )
        {
            this.$element.find('select').on('change', function(evt)
            {
                let value = $(this).val();
                let type  = $(this).data('type');
                if( type == 'day' )
                {
                    self.provisional_date.day = value <10 ? `0${value}` : ''+value;
                }
                else if( type == 'month' )
                {
                    let n = number_month(value);
                    self.provisional_date.month = n <10 ? `0${n}` : ''+value;
                }
                else if( type == 'year' )
                {
                    self.provisional_date.year = value <10 ? `0${value}` : ''+value;
                }
                if( (!isNull( self.provisional_date.day ) && !isNull( self.provisional_date.month ) && !isNull( self.provisional_date.year )) && (!isEmpty( self.provisional_date.day ) && !isEmpty( self.provisional_date.month ) && !isEmpty( self.provisional_date.year )) )
                {
                    let dateString = `${self.provisional_date.year}-${self.provisional_date.month}-${self.provisional_date.day}`;
                    let result = moment(dateString);
                    if( result.isValid() )
                    {
                        if( !isNull(self.options.options.onChange) ) self.options.options.onChange( self.properties.name, evt, result, self.properties, self.$element );
                    }
                }
            });
        }
    }

    commit()
    {
        let self = this;
        let value = has(this.options.options.preBuild, this.properties.name )   ? 
            this.options.options.preBuild[this.properties.name](this.getValue()) : this.getValue();
        if( has(this.options.options.commit,this.properties.name) )
        {
            this.options.options.commit[this.properties.name]( 
                value, 
                this.$component,
                this.properties,
                this.$element
            );
        }
        else
        {
            if( moment.isMoment(value) )
            {
                this.$component.html(value.format( this.options.date.format ));
            }
            else if( isObject( value ) )
            {
                if( this.properties.type == 'select' )
                {
                    this.$component.html(value.value);
                }
                else if( this.properties.type == 'select-object' || this.properties.type == 'select-ajax' )
                {
                    this.$component.html(value[this.properties.origin_value]);
                }
            }
            else
            {
                this.$component.html( value );
            }
        }
    }

    getValue()
    {
        let self = this;
        let response = null;
        if( this.properties.type == 'text' )
        {
            return this.$element.find('input[type=text]').val();
        }
        else if( this.properties.type == 'textarea' )
        {
            return this.$element.find('textarea').val();
        }
        else if( this.properties.type == 'select' )
        {
            let value = this.$element.find('select').val();
            return find(self.properties.origin, function(item){
                return item.key === value;
            });
        }
        else if( this.properties.type == 'select-object' || this.properties.type == 'select-ajax' )
        {
            let value = this.$element.find('select').val();
            return find(self.properties.origin, function(item){
                return item[self.properties.origin_key] == value;
            });
        }
        else if( this.properties.type == 'date' )
        {
            if( (!isNull( self.provisional_date.day ) && !isNull( self.provisional_date.month ) && !isNull( self.provisional_date.year )) && (!isEmpty( self.provisional_date.day ) && !isEmpty( self.provisional_date.month ) && !isEmpty( self.provisional_date.year )) )
            {
                let dateString = `${self.provisional_date.year}-${self.provisional_date.month}-${self.provisional_date.day}`;
                let result = moment(dateString);
                if( result.isValid() )
                {
                    return result;
                }
            }
        }
    }

}

export default Component;