'use strict';

$(function() {
    var isCommentatorOneNameShowing = false;
    var isCommentatorOneTwitterShowing = false;
    var isCommentatorTwoNameShowing = false;
    var isCommentatorTwoTwitterShowing = false;

    var commentatorScreenUpdateDataReplicant = nodecg.Replicant("commentatorScreenUpdateDataReplicant");
    commentatorScreenUpdateDataReplicant.on("change", function (oldValue, newValue) {
        if(typeof newValue === 'undefined') {
            return;
        }

        updateCommentatorPanels(newValue);
    });

    function updateCommentatorPanels(newValue) {
        updateCommentator(newValue, 1);
        updateCommentator(newValue, 2);
    }

    function updateCommentator(updateData, commentatorIndex) {
        /* Commentator one ********************************/
        if(commentatorIndex == 1) {
            if (updateData.c1Name == '') {
                // Hide the whole panel if name is empty
                if (isCommentatorOneNameShowing) {
                    hideTwitterSection($("#commentator-one-twitter"), true);
                    hideNameSection(1, true);
                    return;
                }
            }

            // If we have not yet shown the Panel and we have a valid name!
            if (updateData.c1Name != "" && isCommentatorOneNameShowing == false) {
                // We show the name panel
                showNameSection(updateData.c1Name, 0, $("#commentator-one-name-text"), true);

                // And if we have something in the Twitter section of the dashboard..
                if (updateData.c1Twitter != '') {
                    // We show the Twittersection too!
                    showTwitterSection(updateData.c1Twitter, 1, $("#commentator-one-twitter-text"), $("#commentator-one-twitter"), true);
                }
            }
            // We might show the Name Panel but not yet the twitterpanel. We need to show it since Twittername in Dashboard is something!
            else if (isCommentatorOneNameShowing && !isCommentatorOneTwitterShowing && updateData.c1Twitter != '') {
                // If the name should differ, we change it with a transition
                if (updateData.c1Name != $("#commentator-one-name-text").html()) {
                    setCommentatorField($("#commentator-one-name-text"), updateData.c1Name);
                }
                // And show the Twitter-panel accordingly.
                showTwitterSection(updateData.c1Twitter, 0, $("#commentator-one-twitter-text"), $("#commentator-one-twitter"), true);
            }
            // We might show both panels, but Twittername might differ from the one displayed!
            else if (isCommentatorOneTwitterShowing && updateData.c1Twitter != '' && updateData.c1Twitter != $("#commentator-one-twitter-text").html()) {
                if (updateData.c1Name != $("#commentator-one-name-text").html()) {
                    // If the name is updated, we update it too with a transition.
                    setCommentatorField($("#commentator-one-name-text"), updateData.c1Name);
                }
                // Update the twittername with a transition
                setCommentatorField($("#commentator-one-twitter-text"), updateData.c1Twitter);
            }
            // We are showing both panels, but Twitterfield is now empty
            else if (isCommentatorOneTwitterShowing && updateData.c1Twitter == '') {
                if ($("#commentator-one-name-text").html() != updateData.c1Name) {
                    // Just in case, we check if the name differs from the displayed one, and if so, change with a transition
                    setCommentatorField($("#commentator-one-name-text"), updateData.c1Name);
                }
                // No Twitterhandle whatsoever, best to hide the Twitterpanel.
                hideTwitterSection($("#commentator-one-twitter"), true);
            }
            else if (updateData.c1Name != $("#commentator-one-name-text").html() && updateData.c1Name != '') {
                // Just update the Name!
                setCommentatorField($("#commentator-one-name-text"), updateData.c1Name);
            }
        }
        else if(commentatorIndex == 2) {
            /* Commentator two, exactly the same logic ********************************/
            if (updateData.c2Name == '') {
                if (isCommentatorTwoNameShowing) {
                    hideTwitterSection($("#commentator-two-twitter"), false);
                    hideNameSection(1, false);
                    return;
                }
            }

            if (updateData.c2Name != "" && isCommentatorTwoNameShowing == false) {
                showNameSection(updateData.c2Name, 0, $("#commentator-two-name-text"), false);

                if (updateData.c2Twitter != '') {
                    showTwitterSection(updateData.c2Twitter, 1, $("#commentator-two-twitter-text"), $("#commentator-two-twitter"), false);
                }
            }
            else if (isCommentatorTwoNameShowing && !isCommentatorTwoTwitterShowing && updateData.c2Twitter != '') {
                if (updateData.c2Name != $("#commentator-two-name-text").html()) {
                    setCommentatorField($("#commentator-two-name-text"), updateData.c2Name);
                }
                showTwitterSection(updateData.c2Twitter, 0, $("#commentator-two-twitter-text"), $("#commentator-two-twitter"), false);
            }
            else if (isCommentatorTwoTwitterShowing && updateData.c2Twitter != '' && updateData.c2Twitter != $("#commentator-two-twitter-text").html()) {
                if (updateData.c2Name != $("#commentator-two-name-text").html()) {
                    setCommentatorField($("#commentator-two-name-text"), updateData.c2Name);
                }
                setCommentatorField($("#commentator-two-twitter-text"), updateData.c2Twitter);
            }
            else if (isCommentatorTwoTwitterShowing && updateData.c2Twitter == '') {
                if ($("#commentator-two-name-text").html() != updateData.c2Name) {
                    setCommentatorField($("#commentator-two-name-text"), updateData.c2Name);
                }
                hideTwitterSection($("#commentator-two-twitter"),false);
            }
            else if (updateData.c2Name != $("#commentator-two-name-text").html() && updateData.c2Name != '') {
                setCommentatorField($("#commentator-two-name-text"), updateData.c2Name);
            }
        }
    }

    // Function just sets the text of the DOM element
    function updateSelectorText($textDivToUpdate, newName) {
        $textDivToUpdate.html(newName);
    }

    // Transition to change text from current to NameText
    function setCommentatorField($selector, nameText) {
        var tm = new TimelineMax({paused: true});
        tm.to($selector, 0.3, {opacity: '0',  ease: Quad.easeOut },'0');
        tm.to($selector, 0.3, {opacity: '1', onStart:updateSelectorText, onStartParams:[$selector, nameText] ,ease: Quad.easeOut },'0.3');
        tm.play();
    }

    // Transition for the twitterfield
    function showTwitterSection(newName, delay, $twitterTextSelector, $twitterDivSelector, isCommentatorOne) {
        var tm = new TimelineMax({paused: true});
        if(isCommentatorOne) {
            tm.to($twitterDivSelector, 0.7, {
                transform: 'translate(40px, 60px)',
                opacity: '1',
                onComplete: setCommentatorField,
                onCompleteParams: [$twitterTextSelector, newName],
                ease: Quad.easeOut
            }, delay);
            isCommentatorOneTwitterShowing = true;
        }
        else {
            tm.to($twitterDivSelector, 0.7, {
                transform: 'translate(-40px, 60px) scaleX(-1)',
                opacity: '1',
                onComplete: setCommentatorField,
                onCompleteParams: [$twitterTextSelector, newName],
                ease: Quad.easeOut
            }, delay);
            isCommentatorTwoTwitterShowing = true;
        }
        tm.play();
    }

    //Transition to hide the twitterfield
    function hideTwitterSection($twitterWindowSelector, isCommentatorOne) {
        var tm = new TimelineMax({paused: true});

        if(isCommentatorOne) {
            tm.to($twitterWindowSelector, 0.7, {transform: 'translate(0px, 0px)', onStart: setCommentatorField, onStartParams:[$("#commentator-one-twitter-text"),''],  ease: Quad.easeOut },'0.0');
            isCommentatorOneTwitterShowing = false;
        }
        else {
            tm.to($twitterWindowSelector, 0.7, {transform: 'translate(0px, 0px) scaleX(-1)', onStart: setCommentatorField, onStartParams:[$("#commentator-two-twitter-text"),''],  ease: Quad.easeOut },'0.0');
            isCommentatorTwoTwitterShowing = false;
        }
        tm.play();
    }

    function showNameSection(newName, delay, $NameTextSelector, isCommentatorOne) {
        var tm = new TimelineMax({paused: true});
        if (isCommentatorOne) {
            tm.fromTo($("#commentator-one-container"), 1, {
                    transform: 'translate(-200px, 600px) rotate(0deg)',
                    opacity: '0',
                    ease: Quad.easeIn
                },
                {
                    transform: 'translate(200px, 500px) rotate(5deg)',
                    opacity: '1',
                    onComplete: setCommentatorField,
                    onCompleteParams: [$NameTextSelector, newName],
                    ease: Quad.easeInOut
                }, delay);
            isCommentatorOneNameShowing = true;
        }
        else {
            var screenWidth = $('#window-container').css('width').replace("px","");
            var transformationStringBefore = createTransformationStringWithOffset((Number(screenWidth) + Number(200)), 600, 0, 0);
            var afterPosition = (Number(screenWidth) - Number(200) - getElementWidth($('#commentator-two-name')));
            var transformationStringAfter = createTransformationStringWithOffset(afterPosition, 530, 0, 0) + " rotate(-5deg)";

            tm.fromTo($("#commentator-two-container"), 1, {
                    transform: transformationStringBefore,
                    opacity: '0',
                    ease: Quad.easeIn
                },
                {
                    transform: transformationStringAfter,
                    opacity: '1',
                    onComplete: setCommentatorField,
                    onCompleteParams: [$NameTextSelector, newName],
                    ease: Quad.easeInOut
                }, delay);
            isCommentatorTwoNameShowing = true;
        }

        tm.play();
    }

    function hideNameSection(delay, isCommentatorOne) {
        var tm = new TimelineMax({paused: true});
        var trueDelay = delay;
        if (isCommentatorOne) {
            if (!isCommentatorOneTwitterShowing) {
                trueDelay = 0;
            }

            tm.fromTo($("#commentator-one-container"), 1, {
                    transform: 'translate(200px, 500px) rotate(5deg)',
                    opacity: '1',
                    ease: Quad.easeInOut
                },
                {
                    transform: 'translate(-200px, 600px) rotate(0deg)',
                    opacity: '0',
                    onStart: setCommentatorField,
                    onStartParams: [$("#commentator-one-name-text"), ''],
                    ease: Quad.easeIn
                }, trueDelay);
            isCommentatorOneNameShowing = false;
        }
        else {
            if (!isCommentatorTwoTwitterShowing) {
                trueDelay = 0;
            }
            var screenWidth = $('#window-container').css('width').replace("px","");
            var transformationStringAfter = createTransformationStringWithOffset((Number(screenWidth) + Number(200)), 600, 0, 0);
            var afterPosition = (Number(screenWidth) - Number(200) - getElementWidth($('#commentator-two-name')));
            var transformationStringBefore = createTransformationStringWithOffset(afterPosition, 530, 0, 0) + " rotate(-5deg)";
            tm.fromTo($("#commentator-two-container"), 1, {
                    transform: transformationStringBefore,
                    opacity: '1',
                    ease: Quad.easeInOut
                },
                {
                    transform: transformationStringAfter,
                    opacity: '0',
                    onStart: setCommentatorField,
                    onStartParams: [$("#commentator-two-name-text"), ''],
                    ease: Quad.easeIn
                }, trueDelay);
            isCommentatorTwoNameShowing = false;
        }
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
