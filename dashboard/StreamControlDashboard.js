'use strict';

$(function () {

    var $logoDisplayRadio = $('input[name=logodisplay]');
    var toggle = false;

    $logoDisplayRadio.change(function () {
        nodecg.sendMessage('xrdStreamControlDisplayLogo', $(this).val());
    });
});
