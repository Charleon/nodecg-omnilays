'use strict';

$(function() {
    var $winsPicture = $("#winsPicture");
    var $losesPicture = $("#losesPicture");
    var playWinLoseAnimation = true;
    initializeContent();

    /**********************/
    /* Listen for messages*/
    /**********************/

    nodecg.listenFor('xrdStreamControlDisplayLogo', function(data) {
        var tm = new TimelineMax({paused: true});
        if(data == "On")
        {
            tm.to($('.XrdLogo'), 0.5, {opacity: '0.65', ease: Quad.easeIn }, '0.0');
        }
        else if (data == "Off")
        {
            tm.to($('.XrdLogo'), 0.5, {opacity: '0', ease: Quad.easeIn }, '0.0');
        }
        tm.play();
    });

    /**********************/
    /* Replicant logic    */
    /**********************/
    var matchScreenPlayerUpdateDataReplicant = nodecg.Replicant("matchScreenPlayerUpdateData");
    matchScreenPlayerUpdateDataReplicant.on("change", function (oldValue, newValue) {
        // Don't do anything if we don't have any data to work with.
        if(typeof newValue === 'undefined' || newValue == '') {
            return;
        }
        if(newValue === true) {
            return;
        }

        //View has received the update and applied the desired action
        updatePlayers(newValue);
        matchScreenPlayerUpdateDataReplicant.value = true;
    });

    function initializeContent() {

        var transformationString = createTransformationStringWithOffset(-200,50, 0,0);
        $winsPicture.css('transform', transformationString);
        $losesPicture.css('transform', transformationString);
        $winsPicture.css('opacity', 0);
        $losesPicture.css('opacity',0);
    }

    function updatePlayers(playerData) {
        var p1new = false;
        var p2new = false;
        var tm = new TimelineMax({paused: true});

        if($('#p1tag').text().toUpperCase() !== playerData.players[0].sNickName.toUpperCase()) {
            tm.to($('#player1'), 0.8, {transform: 'translate(170px,-100px)', ease: Quad.easeIn }, '0.0');
            p1new = true;
        }
        if($('#p2tag').text().toUpperCase() !== playerData.players[1].sNickName.toUpperCase()) {
            tm.to($('#player2'), 0.8, {transform: 'translate(825px,-100px)', ease: Quad.easeIn }, '0.0');
            p2new = true;
        }

        if (p1new || p2new) {
            initializeContent();
        }
        else {
            setText(playerData);
        }

        if(p1new) {
            tm.to($('#player1'), 0.9, {transform: 'translate(108px,60px)', ease: Quad.easeOut, onStart:setText, onStartParams: [playerData]}, '0.8');
        }
        if (p2new) {
            tm.to($('#player2'), 0.9, {transform: 'translate(870px,60px)', ease: Quad.easeOut, onStart:setText, onStartParams: [playerData]}, '0.8');
        }
        tm.play();
    }

    function setText(playerData) {

        var tm = new TimelineMax({paused: true});
        var scoreWhenPlayerHasWon = Number(playerData.matchStyle);
        var hasAnyPlayerWon = playerData.players[0].nScore >= scoreWhenPlayerHasWon ||
                              playerData.players[1].nScore >= scoreWhenPlayerHasWon;
        var p1ScoreHigherThanBefore = Number($('#p1score').text()) < Number(playerData.players[0].nScore);
        var p2ScoreHigherThanBefore = Number($('#p2score').text()) < Number(playerData.players[1].nScore)
        $('#p1tag').text(playerData.players[0].sNickName.toUpperCase());
        if($('#p1score').text() != playerData.players[0].nScore) {
            if(!hasAnyPlayerWon) {
                var scoreColor = '';
                var bgColor = '';
                var bgColorDeactivate = '';
                if (p1ScoreHigherThanBefore) {
                    scoreColor = "#00ff00";
                    bgColor = "rgba(50,235,50,0.2)";
                    bgColorDeactivate = "rgba(50,235,50,0)"
                }
                else {
                    scoreColor = "#dd0000";
                    bgColor = "rgba(255,0,0,0.2)";
                    bgColorDeactivate = "rgba(255,0,0,0)"
                }
                tm.to($('#p1score'), 0.2, {transform: 'scale(1.5,1.5)', color: scoreColor, ease: Quad.easeIn}, '0');
                tm.to($('#p1score'), 0.2, {transform: 'scale(1,1)', color: '#ffffff', ease: Quad.easeIn}, '0.2');
                tm.to($('#p1tag'), 0.2, { background: bgColor, ease: Quad.easeIn}, '0');
                tm.to($('#p1tag'), 0.2, { background: bgColorDeactivate, ease: Quad.easeIn}, '0.2');
            }
            $('#p1score').text(playerData.players[0].nScore);
        }
        else {
            tm.to($('#p1score'), 0.2, {transform: 'scale(1,1)', color: '#ffffff', ease: Quad.easeIn}, '0');
        }

        $('#p2tag').text(playerData.players[1].sNickName.toUpperCase());
        if($('#p2score').text() != playerData.players[1].nScore) {
            if(!hasAnyPlayerWon) {
                var scoreColor = '';
                var bgColor = '';
                var bgColorDeactivate = '';
                if (p2ScoreHigherThanBefore) {
                    scoreColor = "#00ff00";
                    bgColor = "rgba(50,235,50,0.2)";
                    bgColorDeactivate = "rgba(50,235,50,0)"
                }
                else {
                    scoreColor = "#dd0000";
                    bgColor = "rgba(255,0,0,0.2)";
                    bgColorDeactivate = "rgba(255,0,0,0)"
                }
                tm.to($('#p2score'), 0.2, {transform: 'scale(1.5,1.5)', color: scoreColor, ease: Quad.easeIn}, '0');
                tm.to($('#p2score'), 0.2, {transform: 'scale(1,1)', color: '#ffffff', ease: Quad.easeOut}, '0.2');
                tm.to($('#p2tag'), 0.2, { background: bgColor, ease: Quad.easeIn}, '0');
                tm.to($('#p2tag'), 0.2, { background: bgColorDeactivate, ease: Quad.easeIn}, '0.2');
            }
            $('#p2score').text(playerData.players[1].nScore);
        }
        else {
            tm.to($('#p2score'), 0.2, {transform: 'scale(1,1)', color: '#ffffff', ease: Quad.easeIn}, '0');
        }

        if(playerData.players[0].nScore >= scoreWhenPlayerHasWon) {
            triggerWinLosePanels(true);
        }
        else if(playerData.players[1].nScore >= scoreWhenPlayerHasWon) {
            triggerWinLosePanels(false);
        }
        else {
            initializeContent();
        }

        if(playerData.players[0].sFlag) {
            $('#p1flag').attr('class', 'flag flag-' + playerData.players[0].sFlag.toLowerCase());
        }
        if(playerData.players[1].sFlag) {
            $('#p2flag').attr('class', 'flag flag-' + playerData.players[1].sFlag.toLowerCase());
        }
        tm.play();
    }

    function triggerWinLosePanels(didPlayer1Win) {
        if(!playWinLoseAnimation) {
            return;
        }

        var tm = new TimelineMax({paused: true});

        var player2PanelCoordinates = getElementCoordinates($('#player2'));
        var player2InitialTransformationString = createTransformationStringWithOffset($('#window-container').css('width').replace("px",""),50, 200,0);
        var player2TransformationString = createTransformationStringWithOffset(player2PanelCoordinates.xPos,50, 50, 0);
        var player1PanelCoordinates = getElementCoordinates($('#player1'));
        var player1InitialTransformationString = createTransformationStringWithOffset(-200,50, 0,0);
        var player1TransformationString = createTransformationStringWithOffset(player1PanelCoordinates.xPos,50, 100, 0);

        $winsPicture.css('opacity', 1);
        $losesPicture.css('opacity', 1);
        playWinLoseAnimation = false;

        if(didPlayer1Win == true) {
            tm.fromTo($winsPicture, 0.9, {transform: player1InitialTransformationString},{transform: player1TransformationString , ease: Quad.easeIn}, '0');
            tm.to($winsPicture, 0.2, {transform: player1TransformationString +' scale(1.5,1.5)', ease: Quad.easeIn}, '0.9');
            tm.to($winsPicture, 0.2, {transform: player1TransformationString +' scale(1,1)', ease: Quad.easeIn}, '1.1');
            tm.to($winsPicture, 1.5, {opacity: 0 , ease: Quad.easeIn}, '1.3');
            tm.to($winsPicture, 0, {transform: player1InitialTransformationString , ease: Quad.easeIn}, '2.8');

            tm.fromTo($losesPicture, 0.9, {transform: player2InitialTransformationString},{transform: player2TransformationString , ease: Quad.easeIn}, '0');
            tm.to($losesPicture, 0.2, {transform: player2TransformationString +' scale(1.5,1.5)', ease: Quad.easeIn}, '0.9');
            tm.to($losesPicture, 0.2, {transform: player2TransformationString +' scale(1,1)', ease: Quad.easeIn}, '1.1');
            tm.to($losesPicture, 1.5, {opacity: 0 , ease: Quad.easeIn}, '1.3');
            tm.to($losesPicture, 0, {transform: player2InitialTransformationString , ease: Quad.easeIn, onStart: allowWinLoseAnimation}, '2.8');

            tm.to($('#p1score'), 0.2, {transform: 'scale(1.5,1.5)', color: '#FFD700', ease: Quad.easeIn}, '0');
            tm.to($('#p1score'), 1, {transform: 'scale(1.0,1.0)', color: '#FFD700', ease: Quad.easeIn}, '1.5');

            tm.to($('#p2score'), 0.2, {transform: 'scale(1.5,1.5)', color: '#dd1100', ease: Quad.easeIn}, '0');
            tm.to($('#p2score'), 1, {transform: 'scale(1.0,1.0)', color: '#dd1100', ease: Quad.easeIn}, '1.5');

            tm.to($('#p1tag'), 0.2, { background: 'rgba(0,255,0,0.2)', ease: Quad.easeIn}, '0');
            tm.to($('#p1tag'), 0.2, { background: 'rgba(255,0,0,0)', ease: Quad.easeIn}, '0.2');

            tm.to($('#p2tag'), 0.2, { background: 'rgba(255,0,0,0.2)', ease: Quad.easeIn}, '0');
            tm.to($('#p2tag'), 0.2, { background: 'rgba(255,0,0,0)', ease: Quad.easeIn}, '0.2');
        }
        else {
            tm.fromTo($winsPicture, 0.9, {transform: player2InitialTransformationString},{transform: player2TransformationString , ease: Quad.easeIn}, '0');
            tm.to($winsPicture, 0.2, {transform: player2TransformationString +' scale(1.5,1.5)', ease: Quad.easeIn}, '0.9');
            tm.to($winsPicture, 0.2, {transform: player2TransformationString +' scale(1,1)', ease: Quad.easeIn}, '1.1');
            tm.to($winsPicture, 1.5, {opacity: 0 , ease: Quad.easeIn}, '1.3');
            tm.to($winsPicture, 0, {transform: player2InitialTransformationString , ease: Quad.easeIn}, '2.8');

            tm.fromTo($losesPicture, 0.9, {transform: player1InitialTransformationString},{transform: player1TransformationString , ease: Quad.easeIn}, '0');
            tm.to($losesPicture, 0.2, {transform: player1TransformationString +' scale(1.5,1.5)', ease: Quad.easeIn}, '0.9');
            tm.to($losesPicture, 0.2, {transform: player1TransformationString +' scale(1,1)', ease: Quad.easeIn}, '1.1');
            tm.to($losesPicture, 1.5, {opacity: 0 , ease: Quad.easeIn}, '1.3');
            tm.to($losesPicture, 0, {transform: player1InitialTransformationString , ease: Quad.easeIn, onStart: allowWinLoseAnimation}, '2.8');

            tm.to($('#p2score'), 0.2, {transform: 'scale(1.5,1.5)', color: '#FFD700', ease: Quad.easeIn}, '0');
            tm.to($('#p2score'), 1, {transform: 'scale(1.0,1.0)', color: '#FFD700', ease: Quad.easeIn}, '1.5');

            tm.to($('#p1score'), 0.2, {transform: 'scale(1.5,1.5)', color: '#dd1100', ease: Quad.easeIn}, '0');
            tm.to($('#p1score'), 1, {transform: 'scale(1.0,1.0)', color: '#dd1100', ease: Quad.easeIn}, '1.5');

            tm.to($('#p1tag'), 0.2, { background: 'rgba(255,0,0,0.2)', ease: Quad.easeIn}, '0');
            tm.to($('#p1tag'), 0.2, { background: 'rgba(255,0,0,0)', ease: Quad.easeIn}, '0.2');

            tm.to($('#p2tag'), 0.2, { background: 'rgba(0,255,0,0.2)', ease: Quad.easeIn}, '0');
            tm.to($('#p2tag'), 0.2, { background: 'rgba(255,0,0,0)', ease: Quad.easeIn}, '0.2');
        }

        tm.play();
    }

    function allowWinLoseAnimation() {
        playWinLoseAnimation = true;
    }
    // $element is supposed to be a jQuerySelector
    function getElementCoordinates($element) {
        var style = window.getComputedStyle($element.get(0));  // Need the DOM object
        var matrix = new WebKitCSSMatrix(style.WebkitTransform);
        return {xPos: matrix.m41, yPos:matrix.m42};
    }

    function createTransformationString(xPos, yPos) {
        return "translate("+
            xPos+"px"+
            ","+
            yPos+"px"+
            ")";
    }

    function createTransformationStringWithOffset(xPos, yPos,xOffset,yOffset) {
        var finalPosX = Number(xPos) + Number(xOffset);
        var finalPosY = Number(yPos) + Number(yOffset);
        return createTransformationString(finalPosX, finalPosY);
    }
});
