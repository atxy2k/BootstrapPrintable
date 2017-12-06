require('./src/scss/app.scss');
import $ from 'jQuery';

$('#print-button').on('click', function(evt){
    if( 'preventDefault' in evt ) evt.preventDefault();
    if( 'stopPropagation' in evt ) evt.stopPropagation();
    window.print();
});
