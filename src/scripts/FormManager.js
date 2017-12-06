import $ from 'jQuery';
class FormManager
{

    constructor()
    {
        let self = this;
        this.selectors = {
            'modal'     : '.Modal-settings',
            'handler'   : '.editable'
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
    }

}

export default FormManager;