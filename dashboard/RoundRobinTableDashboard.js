'use strict';

// Textarea and select clone() bug workaround | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Motivation.
// jQuery's clone() method works in most cases, but it fails to copy the value of textareas and select elements. This patch replaces jQuery's clone() method with a wrapper that fills in the
// values after the fact.

// An interesting error case submitted by Piotr Przybył: If two <select> options had the same value, the clone() method would select the wrong one in the cloned box. The fix, suggested by Piotr
// and implemented here, is to use the selectedIndex property on the <select> box itself rather than relying on jQuery's value-based val().
$(function () {

    (function (original) {
        jQuery.fn.clone = function () {
            var result           = original.apply(this, arguments),
                my_textareas     = this.find('textarea').add(this.filter('textarea')),
                result_textareas = result.find('textarea').add(result.filter('textarea')),
                my_selects       = this.find('select').add(this.filter('select')),
                result_selects   = result.find('select').add(result.filter('select'));

            for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
            for (var i = 0, l = my_selects.length;   i < l; ++i) result_selects[i].selectedIndex = my_selects[i].selectedIndex;

            return result;
        };
    }) (jQuery.fn.clone);

    $.fn.exists = function () {
        return this.length !== 0;
    }


//DOM objects
    var $numberOfPlayers = $('#roundrobin-number-players');
    var $posX = $('#roundrobin-number-posx');
    var $posY = $('#roundrobin-number-posy');
    var $hideShowButton = $('.OMNILays-roundrobin-toggleshow');
    var $createTableButton = $('.OMNILays-roundrobin-create');
    var $sendTableToViewButton =$('.OMNILays-roundrobin-update');
    var $createPlayerContainerDiv = $('#roundrobin-create-player-container');
    var $table = $('#roundrobin-table');

    var valuesLoaded = false;
    var toggle = false;
    var roundRobinConfigurationContainer = '';

// Initialize replicants we will use
    var roundRobinConfiguration = nodecg.Replicant("roundRobinConfiguration");
    roundRobinConfiguration.on("change", function(oldValue, newValue){
        if(typeof newValue === 'undefined' || newValue == '') {
            return;
        }
        if(!valuesLoaded) {
            if (typeof newValue.windowPosition.posX !== "undefined" && Number(newValue.windowPosition.posX) > 0) {
                $posX.val(newValue.windowPosition.posX);
            }
            else {
                $posX.val(0);
            }
            if (typeof newValue.windowPosition.posY !== "undefined" && Number(newValue.windowPosition.posY) > 0) {
                $posY.val(newValue.windowPosition.posY);
            }
            else {
                $posY.val(0);
            }
            valuesLoaded = true;
        }
    });

    var playerPersistantDataReplicant = nodecg.Replicant("playerPersistantData");
    playerPersistantDataReplicant.on("change", function (oldValue, newValue) {
        if(typeof newValue === 'undefined' || newValue == '') {
            return;
        }
        // When we boot up the dashboard, update dropdowns with saved player names
        updateRoundRobinPlayers(newValue);
    });

//Initialize
    $('#roundRobinPositionInputs').hide();
    $hideShowButton.hide();
    $sendTableToViewButton.hide();

    $posX.change(saveConfiguration);
    $posY.change(saveConfiguration);

    function saveConfiguration(){
        if(roundRobinConfigurationContainer == undefined)
        {
            roundRobinConfigurationContainer = {};
        }
        roundRobinConfigurationContainer.tablePosX = $posX.val();
        roundRobinConfigurationContainer.tablePosY = $posY.val();
        roundRobinConfiguration.value = roundRobinConfigurationContainer;
    }

    /**************/
    /*Button logic*/
    /**************/

    $hideShowButton.click(function() {
        nodecg.sendMessage('xrdRoundRobinShowHide', toggle);
        toggle = !toggle;
    });

    $sendTableToViewButton.click(function() {

        var tableClone =$('#roundrobin-table').clone();
        tableClone.find(".playerSpecificResult").each(function(){
            if($(this).val() == "U") {
                $(this).parent().html('');
            }
            else
            {
                switch($(this).val()) {
                    case 'L':
                        $(this).parent().html("<div class='roundRobinLost'></div>");
                        break;
                    case 'W':
                        $(this).parent().html("<div class='roundRobinWon'></div>");
                        break;
                    default:
                        $(this).parent().html($(this).val());
                        break;
                }
            }
        });

        tableClone.find(".roundRobinPlayerTopRow").each(function(){
            $(this).html("<div class='rotatedText'>"+$(this).html()+"</div>");
        });

        var tableConfiguration = {};
        tableConfiguration.tableData = tableClone.html();
        var position = {};
        position.posX =$posX.val();
        position.posY =$posY.val();
        tableConfiguration.windowPosition = position;
        roundRobinConfiguration.value = tableConfiguration;
    });

    $createTableButton.click(function() {
        if($numberOfPlayers.val() > 5) {
            $numberOfPlayers.val(5);
            alert("Max 5 player supported in this release :(");
        }
        else if($numberOfPlayers.val() <= 0) {
            $numberOfPlayers.val(0)
            return;
        }
        var createPlayerHtmlString = '';
        var listItems = '';
        var playerArray = playerPersistantDataReplicant.value;

        // Create the <option> elements for the drop down list.
        for (var i = 0; i < playerArray.players.length; i++) {
            listItems += "<option value='" + playerArray.players[i].sNickName + "'>" + playerArray.players[i].sNickName + "</option>";
        }

        for(var i=0;i<$numberOfPlayers.val();i++)
        {
            createPlayerHtmlString +=
                "<div class='row'>"+
                "<div class='form-group col-xs-1'></div>"+
                "<div class='form-group col-xs-10' style='padding-right: 2px'>" +
                "<select class='form-control roundrobin-nameselect' id='roundrobin-player-"+(i+1)+"'>" +
                "<option value='Disabled'> None </option>" +
                listItems +
                "</select> Player "+(i+1)+" Nick" +
                "</div>" +
                "</div>" +
                "</div>";
        }
        createPlayerHtmlString += "<hr>";
        $createPlayerContainerDiv.html(createPlayerHtmlString);
        $(".roundrobin-nameselect").change(updatePlayerNamesInTable);
        regenerateTable();

        $('#roundRobinPositionInputs').show();
        $hideShowButton.show();
        $sendTableToViewButton.show();
    });

    function getInputResultString(matrixX,matrixY)
    {
        return ''+
            '<select class="form-control playerSpecificResult" id="roundRobinResult'+matrixX+matrixY+'">"' +
            '<option selected="selected" class="roundRobinResultOption">U</option>' +
            '<option class="roundRobinResultOption">W</option>' +
            '<option class="roundRobinResultOption">L</option>' +
            '<option class="roundRobinResultOption">0</option>' +
            '<option class="roundRobinResultOption">1</option>' +
            '<option class="roundRobinResultOption">2</option>' +
            '<option class="roundRobinResultOption">3</option>' +
            '<option class="roundRobinResultOption">4</option>' +
            '<option class="roundRobinResultOption">5</option>' +
            '</select>';
    }

    function updateRoundRobinPlayers(data)
    {
        var listItems = '';
        // Create the <option> elements for the drop down list.
        for (var i = 0; i < data.players.length; i++) {
            listItems += "<option value='" + data.players[i].sNickName + "'>" + data.players[i].sNickName + "</option>";
        }

        $(".roundrobin-nameselect").each(function(){
            var player = {'name':"", 'index':0};
            player.name= $(this).find("option:selected").text();
            player.index = $(this).prop('selectedIndex');
            $(this).html(listItems);
            if($(this).find("option:contains("+player.name+")").exists()) {
                $(this).val(player.name);
            }
            else {
                $(this).find("option").eq(player.index).prop('selected', true);
            }
        });
        updatePlayerNamesInTable();
    }
    function updatePlayerNamesInTable() {
        var amountOfRowsAndColumns = Number($numberOfPlayers.val()) + 1;
        for(var i=0;i<amountOfRowsAndColumns;i++) {
            $('#roundRobinPlayerLeftRow'+i).text($("#roundrobin-player-"+i+" option:selected").text());
            $('#roundRobinPlayerTopRow'+i).text($("#roundrobin-player-"+i+" option:selected").text());
        }

    }
    function regenerateTable()
    {
        var tableHtmlString = '';
        var amountOfRowsAndColumns = Number($numberOfPlayers.val()) + 1;
        for(var i=0;i<amountOfRowsAndColumns;i++)
        {
            tableHtmlString += "<tr>";
            for(var j=0;j<amountOfRowsAndColumns;j++)
            {
                tableHtmlString += "<td ";

                if(i == j && i != 0)
                {
                    // Where PlayerX Meets PlayerX, we don't need to display any results
                    tableHtmlString += "class='roundRobinUnusedField'";
                }
                else if(i!=0 && j!=0)
                {
                    // Where i or j isn't 0, we can be sure that a score needs to be filled in
                    tableHtmlString += "class='roundRobinPlayerResult'";
                }

                if(i == 0 && j != 0) {
                    // The top row will only contain player names
                    tableHtmlString += "class='roundRobinPlayerTopRow'";
                    tableHtmlString += "id='roundRobinPlayerTopRow"+j+"'";
                }
                else if(i == 0 && j == 0)
                {
                    // The top left corner will contain a logo!
                    tableHtmlString += "class='roundRobinPlayerTopCorner'"
                }
                else if(i != 0 && j == 0)
                {
                    // The leftmost column will only show player names
                    tableHtmlString += "class='roundRobinPlayerLeftRow'";
                    tableHtmlString += "id='roundRobinPlayerLeftRow"+i+"'";
                }
                tableHtmlString +=">";

                if(i == 0)
                {
                    if(j != i)
                    {
                        // The top row will only contain player names, here the actual names are printed out
                        tableHtmlString += $('#roundrobin-player-' + (j) + " option:selected").html();
                    }
                }

                if(j == 0)
                {
                    if(i > 0)
                    {
                        // The left column will only contain player names, here the actual names are printed out
                        tableHtmlString += $('#roundrobin-player-' + (i) + " option:selected").text();
                    }
                }

                if(i!=0 && j!=0 && i!=j)
                {
                    // This will select the points of the matrix that will need a drop down for player score!
                    tableHtmlString += getInputResultString(j,i);
                }
                tableHtmlString += "</td>";
            }
            tableHtmlString += "</tr>";
        }

        $table.html(tableHtmlString);

        // need to improve this. For now we need to shrink the table to fit it in the panel
        $table.css('transform', 'scale(0.75,0.75)');

        // Logic for automatically filling in the opposing value in the table, e.g Mark W against Ross,
        // Then Ross automatically L against Mark. Saves some interaction!
        $(".playerSpecificResult").change(function(){
            var numberPattern = /\d+/g;
            var id = $(this).attr('id');
            var optionValue = $(this).val();
            var optionValueToSet = getOptionValueToSet(optionValue);
            var theMatrixNumber = id.match(numberPattern);
            var $adjacentMatrixSelectElement = $('#roundRobinResult' + reverse(theMatrixNumber[0]));
            if(optionValueToSet != "U") {
                $adjacentMatrixSelectElement.val(optionValueToSet);
            }
        });
    }

    function reverse(s){
        return s.split("").reverse().join("");
    }

    function getOptionValueToSet(input){
        switch(input)
        {
            case 'W':
                return 'L';
            case 'L':
                return 'W';
            case 'U':
                return 'U';
            default:
                return 'U';
        }
    }
});