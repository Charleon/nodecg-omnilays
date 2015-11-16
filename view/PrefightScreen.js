'use strict';
$(function () {
    var $p1NamePrefight = $('#p1NamePrefight');
    var $p2NamePrefight = $('#p2NamePrefight');
    var $p1NamePrefightText = $('#p1NamePrefight-text');
    var $p2NamePrefightText = $('#p2NamePrefight-text');
    var $matchTypePrefight = $('#matchTypePrefight');
    var $matchTypePrefightText = $('#matchTypePrefight-text');
    var $sidebarLeftPrefight = $('#sidebarLeftPrefight');
    var $sidebarRightPrefight = $('#sidebarRightPrefight');
    var $characterAreaPrefight = $('#characterAreaPrefight');
    var isHidden = true;

    nodecg.listenFor('hidePrefightWindow', function() {
        if(!isHidden) {
            deactivateScreen();
        }
    });

    var PrefightScreenDataReplicant = nodecg.Replicant("prefightScreenData");
    PrefightScreenDataReplicant.on("change", function (oldValue, newValue) {
        if(typeof newValue === 'undefined') {
            return;
        }
        if(isHidden) {
            initiateScreen(newValue);
        }
    });

    function initiateScreen(data) {
        initiateSidebars();
        initiateMatchType(data);
        initiateCharacterArea(data);
        initiatePlayerPanels(data);
        isHidden = false;
    }

    function deactivateScreen() {
        deactivateCharacterArea();
        deactivateMatchtype();
        deactivateSidebars();
        deactivatePlayerPanels();
        isHidden = true;
    }

    function deactivatePlayerPanels() {
        var tm = new TimelineMax({paused: true});
        var startPositionPlayerOnePanel = createTransformationStringWithOffset(0, 0, 0, 0) + " scale(0.75,0.75)";
        var midPositionPlayerOnePanel = createTransformationStringWithOffset(150, 20, 0, 0) + " scale(1,1)";
        var endPositionPlayerOnePanel = $p1NamePrefight.css('transform');
        var playerTwoPanelWidth = $p2NamePrefight.css('width').replace("px","");
        var xPosition = Number($("#window-container").css("width").replace("px","")) - Number(playerTwoPanelWidth);
        var startPositionPlayerTwoPanel =  $p2NamePrefight.css('transform');
        var midPositionPlayerTwoPanel = createTransformationStringWithOffset(xPosition - 150, 20, 0, 0) + " scale(1,1)";
        var endPositionPlayerTwoPanel = createTransformationStringWithOffset(xPosition - 150, 150, 300, -150) + " scale(0.95,0.95)";

       tm.fromTo($p1NamePrefight, 0.9, {
                transform: endPositionPlayerOnePanel,
                opacity: '1',
                ease: Quad.easeInOut
            },
            {
                transform: midPositionPlayerOnePanel,
                opacity: '1',
                ease: Quad.easeOut
            }, '0');
        tm.fromTo($p1NamePrefight, 1, {
                transform: midPositionPlayerOnePanel,
                opacity: '1',
                ease: Quad.easeInOut,
            },
            {
                transform: startPositionPlayerOnePanel,
                opacity: '0',
                ease: Quad.easeInOut,
            }, '0.9');

        tm.fromTo($p2NamePrefight, 0.9, {
                transform: startPositionPlayerTwoPanel,
                opacity: '1',
                ease: Quad.easeInOut
            },
            {
                transform: midPositionPlayerTwoPanel,
                opacity: '1',
                ease: Quad.easeOut
            }, '0');
        tm.fromTo($p2NamePrefight, 1, {
                transform: midPositionPlayerTwoPanel,
                opacity: '1',
                ease: Quad.easeInOut,
            },
            {
                transform: endPositionPlayerTwoPanel,
                opacity: '0',
                ease: Quad.easeInOut,
            }, '0.9');
        tm.play();
    }

    function deactivateSidebars() {
        var tm = new TimelineMax({paused: true});
        var leftSideBarTransform = $sidebarLeftPrefight.css('transform');
        var rightSideBarTransform = $sidebarRightPrefight.css('transform');
        tm.fromTo($sidebarLeftPrefight, 0.5, {
                transform: leftSideBarTransform,
                opacity: '1',
                ease: Quad.easeInOut
            },
            {
                transform: 'translate(0px, -25px)',
                opacity: '1',
                ease: Quad.easeIn
            }, '0');
        tm.fromTo($sidebarLeftPrefight, 1, {
                transform: 'translate(0px, -25px)',
                opacity: '1',
                ease: Quad.easeInOut,
            },
            {
                transform: 'translate(-100px, 0px)',
                opacity: '0',
                ease: Quad.easeInOut,
            }, '0.5');

        var sidebarRightTranslationStart = createTransformationStringWithOffset($("#window-container").css("width").replace("px",""), 0, 100, 0) + " scaleX(-1)";
        var sidebarRightTranslationEnd = createTransformationStringWithOffset($("#window-container").css("width").replace("px",""), 0, -66, -25) + " scaleX(-1)";

        tm.fromTo($sidebarRightPrefight, 0.5, {
                transform: rightSideBarTransform,
                opacity: '1',
                ease: Quad.easeInOut
            },
            {
                transform: sidebarRightTranslationEnd,
                opacity: '1',
                ease: Quad.easeIn
            }, '0');
        tm.fromTo($sidebarRightPrefight, 1, {
                transform: sidebarRightTranslationEnd,
                opacity: '1',
                ease: Quad.easeInOut,
            },
            {
                transform: sidebarRightTranslationStart,
                opacity: '0',
                ease: Quad.easeInOut,
            }, '0.5');
        tm.play();
    }
    function deactivateMatchtype() {
        var tm = new TimelineMax({paused: true});
        var matchPositionWidth = $matchTypePrefight.css("width").replace("px",'');
        var xPosition = Number($("#window-container").css("width").replace("px",""))/2 - (matchPositionWidth/2);
        var startPositionMatchType = createTransformationStringWithOffset(xPosition, $("#window-container").css("height").replace("px",""), 0, 100);
        var midPositionMatchType = createTransformationStringWithOffset(xPosition, $("#window-container").css("height").replace("px",""), 0, -150);
        var endPositionMatchType = $matchTypePrefight.css("transform");

        tm.fromTo($matchTypePrefight, 0.7, {
                transform: endPositionMatchType,
                opacity: '1',
                ease: Quad.easeInOut
            },
            {
                transform: midPositionMatchType,
                opacity: '1',
                ease: Quad.easeOut
            }, '0');
        tm.fromTo($matchTypePrefight, 1, {
                transform: midPositionMatchType,
                opacity: '1',
                ease: Quad.easeInOut,
            },
            {
                transform: startPositionMatchType,
                opacity: '0',
                ease: Quad.easeInOut,
            }, '0.7');
        tm.play();
    }

    function deactivateCharacterArea() {
        var tm = new TimelineMax({paused: true});
        var startPositionCharacterArea = createTransformationStringWithOffset(0, 400, 0, 100) + " scale(0.75,0.75)";
        var midPositionCharacterArea = createTransformationStringWithOffset(0, 300, 0, -150) + " scale(1,1)";
        var endPositionCharacterArea = $characterAreaPrefight.css('transform');
        var $p1CharPicture = $characterAreaPrefight.find("#p1Character");
        var $p2CharPicture = $characterAreaPrefight.find("#p2Character");
        var p1Transform = $p1CharPicture.css('transform');
        var p2Transform = $p2CharPicture.css('transform');

        tm.fromTo($characterAreaPrefight, 0.9, {
                transform: endPositionCharacterArea,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: midPositionCharacterArea,
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '0');
        tm.fromTo($characterAreaPrefight, 1, {
                transform: midPositionCharacterArea,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: startPositionCharacterArea,
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            }, '1.0');

        tm.fromTo($p1CharPicture, 0.7, {
                transform: p1Transform,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(0.9,0.9)",
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '0');
        tm.fromTo($p1CharPicture, 1, {
                transform: "scale(0.9,0.9)",
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(0,0)",
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            }, '0.7');

        tm.fromTo($p2CharPicture, 0.7, {
                transform: p2Transform,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(0.9,0.9)",
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '0');
        tm.fromTo($p2CharPicture, 1, {
                transform: "scale(0.9,0.9)",
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(0,0)",
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            }, '0.7');
        tm.play();
    }

    function initiatePlayerPanels(data) {
        var tm = new TimelineMax({paused: true});

        var startPositionPlayerOnePanel = createTransformationStringWithOffset(0, 0, 0, 0) + " scale(0.75,0.75)";
        var midPositionPlayerOnePanel = createTransformationStringWithOffset(150, 20, 0, 0) + " scale(1,1)";
        var endPositionPlayerOnePanel = createTransformationStringWithOffset(150, 20, 0, 0) + " scale(0.95,0.95)";
        var playerTwoPanelWidth = $p2NamePrefight.css('width').replace("px","");
        var xPosition = Number($("#window-container").css("width").replace("px","")) - Number(playerTwoPanelWidth);
        var startPositionPlayerTwoPanel = createTransformationStringWithOffset(xPosition, 0, 0, 0) + " scale(0.75,0.75)";
        var midPositionPlayerTwoPanel = createTransformationStringWithOffset(xPosition - 150, 20, 0, 0) + " scale(1,1)";
        var endPositionPlayerTwoPanel = createTransformationStringWithOffset(xPosition - 150, 20, 0, 0) + " scale(0.95,0.95)";

        $p1NamePrefightText.html(data.playerOneName);
        tm.fromTo($p1NamePrefight, 1.5, {
                transform: startPositionPlayerOnePanel,
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: midPositionPlayerOnePanel,
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '0');
        tm.fromTo($p1NamePrefight, 4, {
                transform: midPositionPlayerOnePanel,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: endPositionPlayerOnePanel,
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '3');
        $p2NamePrefightText.html(data.playerTwoName);
        tm.fromTo($p2NamePrefight, 1.5, {
                transform: startPositionPlayerTwoPanel,
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: midPositionPlayerTwoPanel,
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '0');
        tm.fromTo($p2NamePrefight, 4, {
                transform: midPositionPlayerTwoPanel,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: endPositionPlayerTwoPanel,
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '3');
        tm.play();
    }

    function initiateCharacterArea(data) {
        var tm = new TimelineMax({paused: true});
        var startPositionCharacterArea = createTransformationStringWithOffset(0, 400, 0, 100) + " scale(0.75,0.75)";
        var midPositionCharacterArea = createTransformationStringWithOffset(0, 300, 0, -150) + " scale(1,1)";
        var endPositionCharacterArea = createTransformationStringWithOffset(0, 310, 0, -170) + " scale(0.95,0.95)";
        var p1CharacterClassString = getCharacterClassString(data.playerOneCharacter);
        var p2CharacterClassString = getCharacterClassString(data.playerTwoCharacter);
        var characterAreaDOMString = '<div id="p1Character" ' + p1CharacterClassString + '></div><div id="p2Character" ' + p2CharacterClassString + '></div>';
        $characterAreaPrefight.html(characterAreaDOMString);
        var $p1CharPicture = $characterAreaPrefight.find("#p1Character");
        var $p2CharPicture = $characterAreaPrefight.find("#p2Character");
        $p1CharPicture.css("opacity",'0');
        $p2CharPicture.css("opacity",'0');

        tm.fromTo($characterAreaPrefight, 1.5, {
                transform: startPositionCharacterArea,
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: midPositionCharacterArea,
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '0');
        tm.fromTo($characterAreaPrefight, 4, {
                transform: midPositionCharacterArea,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: endPositionCharacterArea,
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '3');

        tm.fromTo($p1CharPicture, 1.5, {
                transform: "scale(0,0)",
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(1,1)",
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '1.5');
        tm.fromTo($p1CharPicture, 4, {
                transform: "scale(1,1)",
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(0.9,0.9)",
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '3.0');

        tm.fromTo($p2CharPicture, 1.5, {
                transform: "scale(0,0)",
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(1,1)",
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '2.0');
        tm.fromTo($p2CharPicture, 4, {
                transform: "scale(1,1)",
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: "scale(0.9,0.9)",
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '3.5');
        tm.play();
    }

    function getCharacterClassString(name) {
        var classString = "class='";
        switch(name) {
            case "Sol Badguy":
                classString += "characterSol'";
                break;
            case "Ky Kiske":
                classString += "characterKy'";
                break;
            case "Sin Kiske":
                classString += "characterSin'";
                break;
            case "Zato-1":
                classString += "characterZato'";
                break;
            case "Venom":
                classString += "characterVenom'";
                break;
            case "Potemkin":
                classString += "characterPotemkin'";
                break;
            case "Elphelt":
                classString += "characterElphelt'";
                break;
            case "Bedman":
                classString += "characterBedman'";
                break;
            case "Slayer":
                classString += "characterSlayer'";
                break;
            case "May":
                classString += "characterMay'";
                break;
            case "Axl Low":
                classString += "characterAxl'";
                break;
            case "Chipp":
                classString += "characterChipp'";
                break;
            case "Millia":
                classString += "characterMillia'";
                break;
            case "Faust":
                classString += "characterFaust'";
                break;
            case "Ramlethal":
                classString += "characterRam'";
                break;
            case "Ino":
                classString += "characterIno'";
                break;
        }
        return classString;
    }

    function initiateMatchType(data) {
        var tm = new TimelineMax({paused: true});
        var matchPositionWidth = $matchTypePrefight.css("width").replace("px",'');
        var xPosition = Number($("#window-container").css("width").replace("px",""))/2 - (matchPositionWidth/2);
        var startPositionMatchType = createTransformationStringWithOffset(xPosition, $("#window-container").css("height").replace("px",""), 0, 100);
        var midPositionMatchType = createTransformationStringWithOffset(xPosition, $("#window-container").css("height").replace("px",""), 0, -150);
        var endPositionMatchType = createTransformationStringWithOffset(xPosition, $("#window-container").css("height").replace("px",""), 0, -170);

        $matchTypePrefightText.html(data.matchStyle)
        tm.fromTo($matchTypePrefight, 1.5, {
                transform: startPositionMatchType,
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: midPositionMatchType,
                opacity: '1',
                ease: Quad.easeOut,
                immediateRender: false
            }, '0');
        tm.fromTo($matchTypePrefight, 4, {
                transform: midPositionMatchType,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: endPositionMatchType,
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '3');
        tm.play();
    }

    function initiateSidebars() {
        var tm = new TimelineMax({paused: true});
        tm.fromTo($sidebarLeftPrefight, 1.5, {
                transform: 'translate(-100px, 0px)',
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: 'translate(0px, -25px)',
                opacity: '1',
                ease: Quad.easeIn,
                immediateRender: false
            }, '0');
        tm.fromTo($sidebarLeftPrefight, 4, {
                transform: 'translate(0px, -25px)',
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: 'translate(0px, 0px)',
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '1.5');

        var sidebarRightTranslationStart = createTransformationStringWithOffset($("#window-container").css("width").replace("px",""), 0, 100, 0) + " scaleX(-1)";
        var sidebarRightTranslationEnd = createTransformationStringWithOffset($("#window-container").css("width").replace("px",""), 0, -66, -25) + " scaleX(-1)";
        var sidebarRightTranslationFinal = createTransformationStringWithOffset($("#window-container").css("width").replace("px",""), 0, -66, 0) + " scaleX(-1)";

        tm.fromTo($sidebarRightPrefight, 1.5, {
                transform: sidebarRightTranslationStart,
                opacity: '0',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: sidebarRightTranslationEnd,
                opacity: '1',
                ease: Quad.easeIn,
                immediateRender: false
            }, '0');
        tm.fromTo($sidebarRightPrefight, 4, {
                transform: sidebarRightTranslationEnd,
                opacity: '1',
                ease: Quad.easeInOut,
                immediateRender: false
            },
            {
                transform: sidebarRightTranslationFinal,
                opacity: '1',
                ease: Quad.easeInOut,
                repeat: -1,
                yoyo: true,
                immediateRender: false
            }, '1.5');
        tm.play();
    }

    function createTransformationStringWithOffset(xPos, yPos,xOffset,yOffset) {
        var finalPosX = Number(xPos) + Number(xOffset);
        var finalPosY = Number(yPos) + Number(yOffset);
        return createTransformationString(finalPosX, finalPosY);
    }

    function createTransformationString(xPos, yPos) {
        return "translate("+
            xPos+"px"+
            ","+
            yPos+"px"+
            ")";
    }
    function getElementWidth($selector) {
        return $selector.css("width").replace("px", "");
    }
});
