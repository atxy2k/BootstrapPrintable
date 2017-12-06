require('./src/scss/app.scss');
import $ from 'jQuery';
import Printable from './src/scripts/FormManager.js';

$('#print-button').on('click', function(evt){
    if( 'preventDefault' in evt ) evt.preventDefault();
    if( 'stopPropagation' in evt ) evt.stopPropagation();
    window.print();
});

window.Printable = Printable;
