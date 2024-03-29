function setCookie(c_name,value,expiredays,cookiePath)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";expires="+exdate.toUTCString()) +
            ((cookiePath==null) ? "" : ";path="+cookiePath);
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

function displayResults(votePath, identifier) {
    var data = {};
    $.post(votePath+'.pollResults.do', data, function (result) {


        var answers = result.answerNodes;
        /* strAnswers = "";
         for (i=0; i<answers.length; i++) {
         strAnswers += "\nAnswer["+[i]+"] label : " + answers[i].label + "\nAnswer["+[i]+"] votes: " + answers[i].nbOfVotes;
         }

         alert("Question: " + result.question + "\nTotal votes: " + result.totalOfVotes + "\nanswers: " + strAnswers);
         */

        statDivTest = document.getElementById("statContainer_"+identifier);
        if (statDivTest != null) {
            statDivTest.parentNode.removeChild(statDivTest);
        }


        var statDiv = document.createElement("div");
        statDiv.id = "statContainer_"+identifier;
        // statDiv.style.zIndex = 99999;
        pollVotes = Math.floor(result.totalOfVotes);


        for (i = 0; i < answers.length; i++) {
            var statAnswerLabel = document.createElement("div");
            statAnswerLabel.id = "statContainer_"+identifier+"_label_a" + [i];
            statAnswerLabel.innerHTML = answers[i].label;


            var statAnswerValue = document.createElement("div");
            statAnswerValue.id = "statContainer_"+identifier+"_value_a" + [i];
            statAnswerValue.innerHTML = answers[i].nbOfVotes;
            answerVotes = Math.floor(answers[i].nbOfVotes);
            percentage = (answerVotes == 0 || pollVotes == 0) ? 0 : answerVotes / pollVotes * 100;
            statAnswerValue.style.width = (percentage * 1) + "%";
            statAnswerValue.className = "barPoll barPollColor" + [i % 8];

            statDiv.appendChild(statAnswerLabel);
            statDiv.appendChild(statAnswerValue);

        }

        document.getElementById("stats_"+identifier).appendChild(statDiv);
        $('#pollForm'+identifier).hide();
    }, "json");
}

function doVote(answers, votePath, identifier, cookiePath) {
	var answerUUID = null;
	$(document.forms['form_'+identifier]).find("input:checked[name='voteAnswer']").each(function() {
		answerUUID = $(this).val();
	});

     if (answerUUID == null) {
         alert("Please select an answer");
         return false;
     }

     var data = {};
     data["answerUUID"] = answerUUID;
     if (document.forms['tokenform_'+identifier]) {
         data["form-token"] = document.forms['tokenform_'+identifier].elements['form-token'].value;
     }
     $.post(votePath+'.pollVote.do', data, function(result) {


         var answers = result.answerNodes;
         /* strAnswers = "";
          for (i=0; i<answers.length; i++) {
          strAnswers += "\nAnswer["+[i]+"] label : " + answers[i].label + "\nAnswer["+[i]+"] votes: " + answers[i].nbOfVotes;
          }

          alert("Question: " + result.question + "\nTotal votes: " + result.totalOfVotes + "\nanswers: " + strAnswers);
          */

         statDivTest = document.getElementById("statContainer_"+identifier);
         if (statDivTest != null) {
             statDivTest.parentNode.removeChild(statDivTest);
         }


         var statDiv = document.createElement("div");
         statDiv.id = "statContainer_"+identifier;
         // statDiv.style.zIndex = 99999;
         pollVotes = Math.floor(result.totalOfVotes);


         for (i=0; i<answers.length; i++) {
             var statAnswerLabel = document.createElement("div");
             statAnswerLabel.id = "statContainer_"+identifier+"_label_a"+[i];
             statAnswerLabel.innerHTML = answers[i].label;


             var statAnswerValue = document.createElement("div");
             statAnswerValue.id = "statContainer_"+identifier+"_value_a"+[i];
             statAnswerValue.innerHTML = answers[i].nbOfVotes;
             answerVotes = Math.floor(answers[i].nbOfVotes);
             percentage = (answerVotes == 0 || pollVotes == 0)?0:answerVotes/pollVotes*100;
             statAnswerValue.style.width = (percentage * 1) + "%";
             statAnswerValue.className  = "barPoll barPollColor"+[i%8];

             statDiv.appendChild(statAnswerLabel);
             statDiv.appendChild(statAnswerValue);

         }

         document.getElementById("stats_"+identifier).appendChild(statDiv);
         setCookie('poll'+identifier,'true',365, cookiePath);
         $('#pollForm'+identifier).hide();
     }, "json");
}