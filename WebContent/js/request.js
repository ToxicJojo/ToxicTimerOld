ToxicTimer.request = {};

$(document).ajaxError(function (event, jqxhr) {
	switch (jqxhr.status) {
	case 400:
		ToxicTimer.notification.ShowError("The request send to the server did not fit the excpeted format.");
		break;
	case 404:
		ToxicTimer.notification.ShowError("The requested resource is not available.");
		break;
	case 500:
		ToxicTimer.notification.ShowError("There was an internal server error while trying to answer your request.")
		break;
	default:
		ToxicTimer.notification.ShowError("An error occured while answering your request.");
		break;
	}
});

ToxicTimer.request.GetGames = function (pFunction) {
	return $.ajax({
		type: "GET",
		url: ToxicTimer.api + "get/GameList",
		processData: true,
		dataType: "json",
		success: pFunction
	});
};


ToxicTimer.request.GetRaceCount = function (pFunction) {
	return $.ajax({
		type: "GET",
		url: ToxicTimer.api + "get/RaceCount",
		processData: true,
		dataType: "json",
		success: pFunction
	});
};

ToxicTimer.request.GetRaceList = function (pFunction) {
	return $.ajax({
		type: "GET",
		url: ToxicTimer.api + "get/RaceList",
		processData: true,
		dataType: "json",
		success: pFunction
	});
};

ToxicTimer.request.GetRace = function (pFunction, pRaceId) {
	return $.ajax({
		type: "GET",
		url: ToxicTimer.api + "get/Race",
		data: "raceId=" + pRaceId,
		processData: true,
		dataType: "json",
		success: pFunction
	});
};


ToxicTimer.request.PostSplits = function (pFunction, pRaceId, pRunnerCode, pSplits) {
	return $.ajax({
		type: "POST",
		url: ToxicTimer.api + "post/Splits",
		data: "runnerCode=" + pRunnerCode + "&splits=" + pSplits + "&raceId=" + pRaceId,
		processData: true,
		dataType: "json",
		success: pFunction
	});
};

ToxicTimer.request.PostStatus = function (pFunction, pRunnerCode, pStatus) {
	return $.ajax({
		type: "POST",
		url: ToxicTimer.api + "post/Status",
		data: "runnerCode=" + pRunnerCode + "&status=" + pStatus,
		processData: true,
		dataType: "json",
		success: pFunction
	});
};

ToxicTimer.request.PostJoinRace = function (pFunction, pRaceId, pName) {
	return $.ajax({
		type: "POST",
		url: ToxicTimer.api + "post/JoinRace",
		data: "playerName=" + pName + "&raceId=" + pRaceId,
		processData: true,
		dataType: "json",
		success: pFunction,
	});
};

ToxicTimer.request.PostCreateRace = function (pFunction, pGameId, pRunId, pName) {
	console.log(pGameId + pRunId + pName);
	return $.ajax({
		type: "POST",
		url: ToxicTimer.api + "post/CreateRace",
		data: "playerName=" + pName + "&gameId=" + pGameId + "&runId=" + pRunId,
		processData: true,
		dataType: "json",
		success: pFunction,
	});
};