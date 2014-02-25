ToxicTimer.viewRace.UI = {};

$(document).ready(function () {
	$("#joinRaceButton").bind("click", function () {
		ToxicTimer.request.PostJoinRace(ToxicTimer.races.EnterRace, ToxicTimer.races.currentRace.id, $("#nameInput").val());
	});
});

ToxicTimer.viewRace.UI.ShowRace = function (pRace) {
	$("#splits").html("");
	$("#gameName").html(pRace.game.name);
	$("#runName").html(pRace.run.name);

	var nameRow = '<th></th>';

	for (var i = 0; i < pRace.runner.length; i++) {
		var label = "";
		if (pRace.runner[i].status === "hold") {
			label = ' <span class="label label-danger"> Hold</span>';
		} else if (pRace.runner[i].status === "ready") {
			label = ' <span class = "label label-success"> Ready</span>'
		} else if (pRace.runner[i].status === "finished") {
			label = ' <span class = "label label-primary"> Finished</span>'
		}
		nameRow += '<th>' + pRace.runner[i].name + label + '</th>';
	}

	$("#nameRow").html(nameRow);

	for (var i = 0; i < pRace.run.splits.length; i++) {
		ToxicTimer.viewRace.UI.ShowRow(pRace, i);
	}

};


ToxicTimer.viewRace.UI.ShowRow = function (pRace, pRow) {
	var row = ' <tr id="splitRow' + pRow + '">';
	row += ' <td id="name' + pRow + '"> ' + pRace.run.splits[pRow].name + ' </td>';

	var times = [];
	var bestTime = 0;
	for (var i = 0; i < pRace.runner.length; i++) {
		times[i] = pRace.runner[i].splits[pRow];
		if (((times[i] !== SPLIT_NOT_REACHED && times[i] !== SPLIT_SKIPPED)) && (bestTime === 0 || times[i] < bestTime)) {
			bestTime = times[i];
		}
	}

	for (var i = 0; i < pRace.runner.length; i++) {
		var className;
		if (pRace.runner[i].splits[pRow] === SPLIT_NOT_REACHED) {
			className = "";
		} else if (pRace.runner[i].splits[pRow] > bestTime) {
			className = "raceBehind";
		} else if (pRace.runner[i].splits[pRow] === SPLIT_SKIPPED) {
			className = "raceSkip";
		} else if (pRace.runner[i].splits[pRow] === bestTime) {
			className = "raceLead";
		}

		var timeCell = '<td class="' + className + '" id="runnerTime' + i + pRow + '">' + ToxicTimer.util.FormatTime(pRace.runner[i].splits[pRow]) + '</td> ';

		row += timeCell;
	}

	$("#splits").append(row);
};