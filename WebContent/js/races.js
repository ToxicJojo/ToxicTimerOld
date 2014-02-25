ToxicTimer.races = {};

ToxicTimer.races.raceList = [];
ToxicTimer.races.currentRace = undefined;

ToxicTimer.races.LoadRaceList = function (pRaceList) {
	for (var i = 0; i < pRaceList.length; i++) {
		var runner = [];
		for (var j = 0; j < pRaceList[i].runner.length; j++) {
			runner[j] = new ToxicTimer.Runner(
				pRaceList[i].runner[j].id,
				pRaceList[i].runner[j].name,
				pRaceList[i].runner[j].status,
				pRaceList[i].runner[j].splits);
		}
		ToxicTimer.races.raceList[i] = new ToxicTimer.Race(
			pRaceList[i].id,
			pRaceList[i].started,
			ToxicTimer.GetGame(pRaceList[i].gameId),
			ToxicTimer.GetGame(pRaceList[i].gameId).GetRun(pRaceList[i].runId),
			runner);
	}
}

ToxicTimer.races.LoadRace = function (pRace) {
	var runner = [];
	for (var i = 0; i < pRace.runner.length; i++) {
		runner[i] = new ToxicTimer.Runner(
			pRace.runner[i].id,
			pRace.runner[i].name,
			pRace.runner[i].status,
			pRace.runner[i].splits
		);
	}
	ToxicTimer.races.currentRace = new ToxicTimer.Race(
		pRace.id,
		pRace.started,
		ToxicTimer.GetGame(pRace.gameId),
		ToxicTimer.GetGame(pRace.gameId).GetRun(pRace.runId),
		runner);
}

ToxicTimer.races.CreateRace = function (pRaceId, pRunId, pName) {
	ToxicTimer.request.PostCreateRace(
		ToxicTimer.races.EnterRace,
		pRaceId,
		pRunId,
		pName);
};

ToxicTimer.races.EnterRace = function (pResponse) {
	if (pResponse !== "NameTaken") {
		var args = pResponse.split(';')
		if (args[2] === undefined) {
			window.location = "doRace.html?id=" + ToxicTimer.races.currentRace.id + "&runnerId=" + args[0] + "&code=" + args[1];
		} else {
			window.location = "doRace.html?id=" + args[2] + "&runnerId=" + args[0] + "&code=" + args[1];
		}
	} else {
		$("#nameFormGroup").addClass("has-error");
		$("#nameLabel").html("Nickname already taken!");
	}
};