'use strict';
$(function () {

    var roundRobinConfiguration = nodecg.Replicant("roundRobinConfiguration");
    roundRobinConfiguration.on("change", function(oldValue, newValue){
        if (typeof newValue !== 'undefined' && newValue !== '') {
            $('#roundRobbinViewTable').css("left", newValue.windowPosition.posX);
            $('#roundRobbinViewTable').css("top", newValue.windowPosition.posY);
            $('#roundRobbinViewTable').html(newValue.tableData);
        }
    });

    nodecg.listenFor('xrdRoundRobinShowHide', function(data) {
        var tm = new TimelineMax({paused: true});
        if (data == true)
        {
            tm.to($('#roundRobbinViewTable'), 0.5, {opacity: '1', ease: Quad.easeIn }, '0.0');
            tm.to($('#roundRobbinViewTable'), 0.5, {zoom: '1', ease: Quad.easeIn }, '0.0');
            tm.to($('.roundRobinPlayerTopCorner'), 0.5, {transform: 'rotate(0deg)', ease: Quad.easeIn }, '0.0');
        }
        else
        {
            tm.to($('#roundRobbinViewTable'), 0.5, {opacity: '0', ease: Quad.easeIn }, '0.0');
            tm.to($('#roundRobbinViewTable'), 0.5, {zoom: '0.7', ease: Quad.easeIn }, '0.0');
            tm.to($('.roundRobinPlayerTopCorner'), 0.5, {transform: 'rotate(-90deg)', ease: Quad.easeIn }, '0.0');
        }
        tm.play();
    });
});
