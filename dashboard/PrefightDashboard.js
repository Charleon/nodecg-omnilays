'use strict';

$(function () {

// DOM objects
    var $prefight_playerOneDropDown = $('#prefight_playerOneName');
    var $prefight_playerTwoDropDown = $('#prefight_playerTwoName');
    var $prefight_sendToViewButton = $('#prefight_update_button');
    var $prefight_hideButton = $('#prefight_hide_button');
    var $prefight_playerOneCharacter = $('#prefight_playerOneCharacter');
    var $prefight_playerTwoCharacter = $('#prefight_playerTwoCharacter');
    var $prefight_matchType = $('#prefight_Type');

// Initialize replicants we will use
    var playerPersistantDataReplicant = nodecg.Replicant("playerPersistantData");
    playerPersistantDataReplicant.on("change", function (oldValue, newValue) {
        if (typeof newValue === 'undefined') {
            return;
        }
        // When we boot up the dashboard, update dropdowns with the saved playernames
        updatePlayerDropdowns(newValue);
    });

    var PrefightScreenDataReplicant = nodecg.Replicant("prefightScreenData");
    PrefightScreenDataReplicant.on("change", function (oldValue, newValue) {
        // The dashboard does not care for when this data gets updated.
        // Only the view does.
    });

    $prefight_hideButton.click(function () {
        nodecg.sendMessage('hidePrefightWindow', null);
    });

    $prefight_sendToViewButton.click(function () {
        var updateData = {};
        updateData.playerOneName = $prefight_playerOneDropDown.find("option:selected").val();
        updateData.playerTwoName = $prefight_playerTwoDropDown.find("option:selected").val();
        updateData.playerOneCharacter = $prefight_playerOneCharacter.find("option:selected").val();
        updateData.playerTwoCharacter = $prefight_playerTwoCharacter.find("option:selected").val();
        updateData.matchStyle = $prefight_matchType.val();
        PrefightScreenDataReplicant.value = updateData;
    });

    function updatePlayerDropdowns(data) {
        var listItems = '';

        // Create the <option> elements for the drop down list.
        for (var i = 0; i < data.players.length; i++) {
            listItems += "<option value='" + data.players[i].sNickName + "'>" + data.players[i].sNickName + "</option>";
        }

        $prefight_playerOneDropDown.html(listItems);
        $prefight_playerTwoDropDown.html(listItems);
    }
});
