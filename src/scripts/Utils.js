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

module.exports =  {
    throw_if, 
    throw_unless,
    in_array
}

