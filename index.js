require('./src/scss/app.scss');
import $ from 'jQuery';
import Printable from './src/scripts/FormManager.js';

String.prototype.toDOM=function(){
    var d=document
       ,i
       ,a=d.createElement("div")
       ,b=d.createDocumentFragment();
    a.innerHTML=this;
    while(i=a.firstChild)b.appendChild(i);
    return b;
};

$('#print-button').on('click', function(evt){
    if( 'preventDefault' in evt ) evt.preventDefault();
    if( 'stopPropagation' in evt ) evt.stopPropagation();
    window.print();
});

window.Printable = Printable;
