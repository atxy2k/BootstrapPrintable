import { filter } from 'lodash';
function throw_if( condition = false, exception )
{
    if( condition ) throw exception;
}

function throw_unless( condition = true, exception )
{
    if( !condition ) throw exception;
}

function in_array( item, _array )
{
    let items = filter(_array, function(i){
        return i === item;
    });
    return items.length > 0;
}

function number_month( string_month )
{
    if( string_month == 'january'   )
    {
        return 1;
    }
    if( string_month == 'february'  )
    {
        return 2;
    }
    if( string_month == 'march'     )
    {
        return 3;
    }
    if( string_month == 'april'     )
    {
        return 4;
    }
    if( string_month == 'may'       )
    {
        return 5;
    }
    if( string_month == 'june'      )
    {
        return 6;
    }
    if( string_month == 'july'      )
    {
        return 7;
    }
    if( string_month == 'august'    )
    {
        return 8;
    }
    if( string_month == 'september' )
    {
        return 9;
    }
    if( string_month == 'october'   )
    {
        return 10;
    }
    if( string_month == 'november'  )
    {
        return 11;
    }
    if( string_month == 'december'  )
    {
        return 12;
    }
}

function month_from_number(number)
{
    return ['january','february','march','april', 'may', 'june', 'july', 'august', 'september', 'october', 'november','december'][number-1];
}

module.exports =  {
    throw_if, 
    throw_unless,
    in_array,
    number_month,
    month_from_number
}

