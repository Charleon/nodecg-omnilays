'use strict';
$(function () {

// Buttons for interaction with view or manipulating dashboardpanel values
    var $updateButton = $('#OMNILays-update-button');
    var $swapButton = $('#OMNILays-swap-update');
    var $playersAddButton = $('#OMNILays-add-button');
    var $playersRemoveButton = $('#OMNILays-remove-button');
    var $playersRemoveAllButton = $('#OMNILays-remove-all-button');
    var $playersChangeNickButton = $('#OMNILays-change-nickname-button');
    var $playerOnePlusScoreButton = $('#player1PlusScore');
    var $playerTwoPlusScoreButton = $('#player2PlusScore');
// Other DOM objects
    var $p1DropDownMenu = $('#p1NickName-dropdown');
    var $p2DropDownMenu = $('#p2NickName-dropdown');
    var $removeDropDownMenu = $('#playerRemove-dropdown');
    var $changeDropDownMenu = $('#playerChange-dropdown');
    var $playerNickToChangeToInput = $('#playerNick-changeto-input');
    var $operationResult = $('#operationResult');


// Initialize jquery UI elements
    $updateButton.button();
    $swapButton.button();
    $playersAddButton.button();
    $playersRemoveButton.button();
    $playersRemoveAllButton.button();
    $playersChangeNickButton.button();

    $('#xrd-p1Score').spinner();
    $('#xrd-p2Score').spinner();

    $playerOnePlusScoreButton.button({
        icons: { primary: "ui-icon-plus"},
        text: false
    });

    $playerTwoPlusScoreButton.button({
        icons: { primary: "ui-icon-plus"},
        text: false
    });

    $("#matchStyleRadios").buttonset();

// Initialize replicants we will use
    var playerPersistantDataReplicant = nodecg.Replicant("playerPersistantData");
    playerPersistantDataReplicant.on("change", function (oldValue, newValue) {
        // When we boot up the dashboard, update dropdowns with loaded values
        if (typeof newValue !== 'undefined' && newValue != '') {
            updatePlayerDropDowns(newValue);
            return;
        }
        else if (typeof oldValue === 'undefined' || typeof newValue === 'undefined') {
            return;
        }

        // We trigger this onChange when a playerscore gets updated,
        // however we don't care about it here. We can distinguish if there
        // has been a meaningful change by comparing the length of the playerdata.
        if ((oldValue.players.length == newValue.players.length) && newValue.updateFlag == false) {

        }
        else {
            updatePlayerDropDowns(newValue);
            newValue.updateFlag = false;
        }
    });

    var matchScreenPlayerUpdateDataReplicant = nodecg.Replicant("matchScreenPlayerUpdateData");
    matchScreenPlayerUpdateDataReplicant.on("change", function (oldValue, newValue) {
        // The dashboard does not care about the updated values.
    });

    /* onChange Logic for ocmponents ***************/
    /***********************************************/
    $changeDropDownMenu.change(function () {
        $playerNickToChangeToInput.val($(this).val());
    });

    /* Logic for buttons ***************************/
    /***********************************************/
    $updateButton.click(function () {
        updateMatchStats();
    });

    $playerOnePlusScoreButton.click(function() {
        var p1ScoreVariable = Number($('#xrd-p1Score').val());
        p1ScoreVariable++;
        $('#xrd-p1Score').val(p1ScoreVariable);

        updateMatchStats();
    });

    $playerTwoPlusScoreButton.click(function() {
        var p2ScoreVariable = Number($('#xrd-p2Score').val());
        p2ScoreVariable++;
        $('#xrd-p2Score').val(p2ScoreVariable);

       updateMatchStats();
    });

    function updateMatchStats() {
        // Do not indicate an update to the view if both players have the same value or have the standard values
        if ($p1DropDownMenu.find("option:selected").text() == $p2DropDownMenu.find("option:selected").text() ||
            $p1DropDownMenu.find("option:selected").text() == "Player 1" ||
            $p2DropDownMenu.find("option:selected").text() == "Player 2") {
            setOperationResult("Won't update players with identical names or default value", false);
            return;
        }

        var viewUpdateData = getPlayerData($("#p1NickName-dropdown option:selected").text(), $("#p2NickName-dropdown option:selected").text());
        var matchStyle = $('input[name=matchstyle]:checked').val();
        viewUpdateData.players[0].nScore = $('#xrd-p1Score').val();
        viewUpdateData.players[1].nScore = $('#xrd-p2Score').val();
        viewUpdateData.matchStyle = matchStyle;

        // When we set this replicant value, the view will get notified
        matchScreenPlayerUpdateDataReplicant.value = viewUpdateData;

        setOperationResult('Update sent to view', true);
    }

    $swapButton.click(function () {
        if ($p1DropDownMenu.find("option:selected").text() == $p2DropDownMenu.find("option:selected").text() ||
            $p1DropDownMenu.find("option:selected").text() == "Player 1" ||
            $p2DropDownMenu.find("option:selected").text() == "Player 2") {
            setOperationResult('Will not swap players with default values or players with same nick', false);
            return;
        }

        var p1Val = $p1DropDownMenu.find("option:selected").val();
        var p2Val = $p2DropDownMenu.find("option:selected").val();
        var p1Score = $('#xrd-p1Score').val();
        var p2Score = $('#xrd-p2Score').val();

        $p1DropDownMenu.val(p2Val);
        $p2DropDownMenu.val(p1Val);
        $('#xrd-p1Score').val(p2Score);
        $('#xrd-p2Score').val(p1Score);

        setOperationResult('Successfully Swapped players', true);
    });

    $playersAddButton.click(function () {
        // Avoid adding players if user hasn't yet typed in anything
        if ($('#playerNickName').val() == "") {
            setOperationResult('Sorry! will not add player with an empty name ', false);
            return;
        }

        var playerContainer = playerPersistantDataReplicant.value;
        if (typeof playerContainer === 'undefined' || playerContainer =="") {
            playerContainer = createPlayerContainer();
        }

        var playerData = createPlayerData();
        var foundPlayer = false;

        if (playerContainer.players.length > 0) {
            for (var i = 0; i < playerContainer.players.length; i++) {
                if (playerContainer.players[i].sNickName == $('#playerNickName').val()) {
                    //If we found player, update his flag instead, keep score intact, it might be in use!
                    playerContainer.players[i].sFlag = playerData.sFlag;
                    foundPlayer = true;
                    break;
                }
            }
        }

        if (!foundPlayer) {
            playerContainer['players'].push(playerData);
        }

        // Reset name field to avoid several accidental pushes.
        $('#playerNickName').val('');

        // Store the array with the added new player
        playerPersistantDataReplicant.value = playerContainer;
        setOperationResult('Successfully added player ' + playerData.sNickName, true);

    });

    $playersChangeNickButton.click(function () {
        var playerNameToChangeTo = $playerNickToChangeToInput.val();
        var playerNameToChange = $changeDropDownMenu.find("option:selected").text();

        if (playerNameToChangeTo == '') {
            setOperationResult('Sorry, Will not change player nick to empty', false);
            return;
        }

        if (playerNameToChange == playerNameToChangeTo) {
            setOperationResult('Please make a meaningful change to player name', false);
            return;
        }

        var playerContainer = playerPersistantDataReplicant.value;
        for (var i = 0; i < playerContainer.players.length; i++) {
            if (playerContainer.players[i].sNickName == playerNameToChange) {
                playerContainer.players[i].sNickName = $playerNickToChangeToInput.val();
                playerContainer.updateFlag = true;
                playerPersistantDataReplicant.value = playerContainer;
                setOperationResult('Changed player ' + playerNameToChange + ' to ' + playerNameToChangeTo, true);
                $playerNickToChangeToInput.val('');
                return;
            }
        }
    });

    $playersRemoveButton.click(function () {
        var playerNameRemove = $("#playerRemove-dropdown").find("option:selected").text();
        var playerContainer = playerPersistantDataReplicant.value;

        for (var i = 0; i < playerContainer.players.length; i++) {
            if (playerContainer.players[i].sNickName == playerNameRemove) {
                playerContainer.players.splice(i, 1);
                playerPersistantDataReplicant.value = playerContainer;
                setOperationResult('Removed player ' + playerNameRemove, true);
                return;
            }
        }
    });

    $playersRemoveAllButton.click(function () {
        var isOk = confirm("ALL players will be removed from the dashboard and you will need to add new players manually");
        if (isOk) {
            playerPersistantDataReplicant.value = createPlayerContainer();
        }
    });

    /* Controlling panel components ********************/
    /***************************************************/
    function updatePlayerDropDowns(playerArray) {
        if(!playerArray || !playerArray.players || playerArray.players.length <= 0) {
            var listItems = "<option value='Player 1'>" + 'Player 1' + "</option>";
            $p1DropDownMenu.html(listItems);
            $p2DropDownMenu.html(listItems);
            $removeDropDownMenu.html(listItems);
            $changeDropDownMenu.html(listItems);
            return;
        }

        // First We need to save the textual value that was selected
        // so that we can set the correct value after we update the list.
        // If we can't find the name in the resultinglist, at least try to set it
        // to the same value as before, there is a chance that the nickname got changed!
        var p1SelectedNickName = $('#p1NickName-dropdown option:selected').text();
        var p1SelectedNickNameValue = $p1DropDownMenu.prop('selectedIndex');

        var p2SelectedNickName = $('#p2NickName-dropdown option:selected').text();
        var p2SelectedNickNameValue = $p2DropDownMenu.prop('selectedIndex');
        var listItems = '';

        // Create the <option> elements for the drop down list.
        for (var i = 0; i < playerArray.players.length; i++) {
            listItems += "<option value='" + playerArray.players[i].sNickName + "'>" + playerArray.players[i].sNickName + "</option>";
        }

        $p1DropDownMenu.html(listItems);
        $p2DropDownMenu.html(listItems);
        $removeDropDownMenu.html(listItems);
        $changeDropDownMenu.html(listItems);

        var playerData = findPlayerName(p1SelectedNickName);

        if (playerData != false) {
            $p1DropDownMenu.val(p1SelectedNickName);
        }
        else {
            $p1DropDownMenu.find("option").eq(p1SelectedNickNameValue).prop('selected', true);
        }

        var playerData2 = findPlayerName(p2SelectedNickName);

        if (playerData2 != false) {
            $p2DropDownMenu.val(p2SelectedNickName);
        }
        else {
            $p2DropDownMenu.find("option").eq(p2SelectedNickNameValue).prop('selected', true);
        }
    }

    /* Read and set player data ************************/
    /***************************************************/
    function createPlayerContainer() {
        return {"players": []};
    }

    function createPlayerData() {
        return {'sNickName': $('#playerNickName').val(), 'sFlag': $('#xrd-p1Flag').val(), 'nScore': 0};
    }

    function getPlayerData(p1NickName, p2NickName) {
        var playerDatas = createPlayerContainer();
        var playerContainer = playerPersistantDataReplicant.value;
        var player1Data = 0;
        var player2Data = 0;
        // Loop until we have found both players or reached the end of the list of players
        // Save data temporary in sequence since we want p1 before p2 in the final returned variable
        for (var i = 0; i < playerContainer.players.length; i++) {
            if (playerContainer.players[i].sNickName == p1NickName) {
                player1Data = playerContainer.players[i];
            }
            else if (playerContainer.players[i].sNickName == p2NickName) {
                player2Data = playerContainer.players[i];
            }
            if (player1Data != 0 && player2Data != 0) {
                break;
            }
        }

        playerDatas['players'].push(player1Data);
        playerDatas['players'].push(player2Data);

        return playerDatas;
    }

    /* Utility *****************************/
    /***************************************/
    function findPlayerName(playerName) {
        var playerContainer = playerPersistantDataReplicant.value;
        for (var i = 0; i < playerContainer.players.length; i++) {
            if (playerContainer.players[i].sNickName == playerName) {
                return playerContainer.players[i];
            }
        }
        return false;
    }

    function setOperationResult(text, isOperationPositive) {
        if (isOperationPositive) {
            $operationResult.css('color', 'green');
        }
        else {
            $operationResult.css('color', 'red');
        }
        $operationResult.html(text);
    }
});
