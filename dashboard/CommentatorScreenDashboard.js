'use strict';
$(function () {
    //Update button that sends to the view
    var $commentatorUpdateButton = $("#commentatorUpdateButton");

    // Initialize jquery UI elements
    $commentatorUpdateButton.button();

    //Replicant used to sync data with the view
    var commentatorScreenUpdateDataReplicant = nodecg.Replicant("commentatorScreenUpdateDataReplicant");
    commentatorScreenUpdateDataReplicant.on("change", function (oldValue, newValue) {
        if (typeof newValue === 'undefined') {
            return;
        }
        // If we reload dashboard, automatically fill in the last used values
        $("#commentator_one_name").val(newValue.c1Name);
        $("#commentator_one_twitter").val(newValue.c1Twitter);
        $("#commentator_two_name").val(newValue.c2Name);
        $("#commentator_two_twitter").val(newValue.c2Twitter);
    });

    /* Logic for buttons ***************************/
    /***********************************************/
    $commentatorUpdateButton.click(function () {
        // Create an object to hold all the data we want to sync. Will be used
        // By the view.
        var commentatorUpdateData = {};
        commentatorUpdateData.c1Name = $("#commentator_one_name").val();
        commentatorUpdateData.c1Twitter = $("#commentator_one_twitter").val();
        commentatorUpdateData.c2Name = $("#commentator_two_name").val();
        commentatorUpdateData.c2Twitter = $("#commentator_two_twitter").val();

        // Assign value to the replicant. At this point the view will get it.
        commentatorScreenUpdateDataReplicant.value = commentatorUpdateData;
    });
});


