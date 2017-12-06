jQuery(document).ready(function(){
    jQuery('#print-button').click(function(event){
        event.preventDefault();
        window.print();
    });
});

jQuery(window).load(function(){
    //reFormat();
});

function reFormat()
{
    var $pagesContainer = jQuery('.print-container');
    var removeList = [];
    var edited = false;
    jQuery('.print-page').each(function(printPage){
        if (printPage > 100) return false;

        $currentPage = jQuery(this);
        if ($currentPage.hasClass('page-ready')) return true;
        edited = true;

        jQuery('.print-block', $currentPage).each(function(printBlock) {
            var $block = jQuery(this);
            var pageHeight = $currentPage.outerHeight();
            var blockHeight = $block.outerHeight();
            var blockTop = $block.position().top;
            offsetSize = pageHeight - (blockHeight + blockTop);
            if (offsetSize < 0) {

                var appened = false;
                // Pasar a la siguiente página
                var $nextPage = $currentPage.next();
                if (!$nextPage.hasClass('print-page')) {
                    $nextPage = jQuery('<div class="print-page"></div>').appendTo($pagesContainer);
                }

                // Revisar si el bloque contiene una tabla
                $table = jQuery('table', $block);
                if ($table.length && $table.position().top + blockTop < pageHeight) {
                    var tableHeight = $table.outerHeight();
                    var tableTop = blockTop + blockHeight - tableHeight;
                    var offsetTableSize = pageHeight - (tableHeight + tableTop);
                    if (offsetTableSize < 0) {
                        var $newTable = $table.clone();
                        var removeRows = [];
                        jQuery('tbody tr', $table).each(function(rowIndex){
                            var $row = $(this);
                            var rowHeight = $row.outerHeight();
                            var rowTop = $row.position().top;
                            var offsetRowSize = pageHeight - (tableTop + rowTop + rowHeight + jQuery('thead', $table).outerHeight());
                            if (offsetRowSize > 0) {
                                removeRows.push(jQuery('tbody tr',$newTable).eq(rowIndex));
                            }
                            else {
                                removeList.push($row);
                            }
                        });
                        jQuery.each(removeRows, function(index, element){
                            element.remove();
                        });
                        appened = true;
                        jQuery('<div class="print-block"></div>').prependTo($nextPage).append($newTable);
                    }
                }

                if  (!appened) {
                    $nextPage.prepend($block.clone());
                    removeList.push($block);
                }

            }
        });
        jQuery.each(removeList, function(index, element) {
            element.remove();
        });
        removeList = [];
        $currentPage.addClass('page-ready');
    });
    if (edited) {
        reFormat();
    }
}