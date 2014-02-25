ToxicTimer.races.UI = {};

$(document).ready(function () {
	$("#gameFilter").bind("change",
		function () {
			ToxicTimer.races.UI.FilterByGame(parseInt(this.value));
		}
	);

	$("#gameSelect").bind("change", function () {
		ToxicTimer.races.UI.LoadRunList(parseInt(this.value));
	});

	$("#createRaceButton").bind("click", function () {
		ToxicTimer.races.CreateRace(
			$("#gameSelectNewRace").val(),
			$("#runSelect").val(),
			$("#nameInput").val())
	});
});


ToxicTimer.races.UI.LoadRunList = function (pGameId) {
	ToxicTimer.currentGame = ToxicTimer.GetGame(pGameId);

	if (ToxicTimer.currentGame !== undefined) {
		var innerHTML = "";
		for (var i = 0; i < ToxicTimer.currentGame.runs.length; i++) {
			innerHTML += '<option value="' + ToxicTimer.currentGame.runs[i].id + '">' + ToxicTimer.currentGame.runs[i].name + '</option>';
		}
		$("#runSelect").html(innerHTML);
	} else {
		ToxicTimer.notification.ShowError("Could not find a game with the id: " + pGameId);
	}
};

ToxicTimer.races.UI.FilterByGame = function (pGameId) {
	if (pGameId !== -1) {
		var temp = [];
		var index = 0;
		for (var i = 0; i < ToxicTimer.races.raceList.length; i++) {
			if (ToxicTimer.races.raceList[i].game.id === pGameId) {
				temp[index] = ToxicTimer.races.raceList[i];
				index++;
			}
		}
		ToxicTimer.races.UI.ShowRaceList(temp);
	} else {
		ToxicTimer.races.UI.ShowRaceList(ToxicTimer.races.raceList);
	}
};

ToxicTimer.races.UI.ShowRaceList = function (pRaces) {

	var thumbnailsTpl = "";

	for (var i = 0; i < pRaces.length; i++) {

		var runnerTpl = "";
		for (var j = 0; j < pRaces[i].runner.length; j++) {
			runnerTpl += pRaces[i].runner[j].name + "<br>";
		}

		var game = pRaces[i].game;

		if (i % 4 === 0) {
			thumbnailsTpl += '<div class="row">'
		}

		thumbnailsTpl += '<div class="col-lg-3">';
		thumbnailsTpl += '<div class="thumbnail">';
		thumbnailsTpl += '<h4>' + game.name + '</h4>';
		thumbnailsTpl += '<p><b>Run: </b>' + pRaces[i].run.name + '</p>';
		thumbnailsTpl += '<a href="viewRace.html?id=' + pRaces[i].id + '" class="thumbnail">';
		thumbnailsTpl += '<img src="http://c15111072.r72.cf2.rackcdn.com/' + game.abbreviation + '.jpg" style="width: 300px; height: 200px;" alt="">';
		thumbnailsTpl += '</a><p>';
		thumbnailsTpl += '<div class="caption">';
		thumbnailsTpl += '<span class="pull-left" rel="tooltip" data-html="true" data-placement="right" title="' + runnerTpl + '">' + pRaces[i].runner.length + ' Entrants</span><span class="pull-right" id="raceTime' + i + '">00:00:0</span></p>';
		thumbnailsTpl += '</div></div></div>';

		if (i % 4 === 3) {
			thumbnailsTpl += '</div>'
		}


	}
	$("#raceThumbnails").html("");
	$("#raceThumbnails").html(thumbnailsTpl);

	$('[rel=tooltip]').tooltip();

	ToxicTimer.races.UI.UpdateThumbnails();

};

ToxicTimer.races.UI.UpdateThumbnails = function () {
	for (var i = 0; i < ToxicTimer.races.raceList.length; i++) {
		if (ToxicTimer.races.raceList[i].started === 0) {
			$("#raceTime" + i).html("Entry open");
		} else if (ToxicTimer.races.raceList[i].started === -1) {
			$("#raceTime" + i).html("Race Over");
		} else {
			$("#raceTime" + i).html(
				ToxicTimer.util.FormatTime(ToxicTimer.util.Now() - ToxicTimer.races.raceList[i].started).split(".")[0]);
		}
	}
	window.setTimeout(ToxicTimer.races.UI.UpdateThumbnails, 1000);
};