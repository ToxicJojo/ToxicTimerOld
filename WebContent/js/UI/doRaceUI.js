ToxicTimer.doRace.UI = {};

$(document).ready(function () {
	$("#splitButton").bind("click", ToxicTimer.timer.Split);
	$("#skipButton").bind("click", ToxicTimer.timer.Skip);
	$("#undoButton").bind("click", ToxicTimer.timer.Undo);

	$("#readyButton").bind("click", ToxicTimer.doRace.Ready);
	$("#unreadyButton").bind("click", ToxicTimer.doRace.UnReady);

});


ToxicTimer.doRace.UI.DisableButtons = function () {
	$("#splitButton").addClass("disabled");
	$("#skipButton").addClass("disabled");
	$("#undoButton").addClass("disabled");
}

ToxicTimer.doRace.UI.EnableButtons = function () {
	$("#splitButton").removeClass("disabled");
	$("#skipButton").removeClass("disabled");
	$("#undoButton").removeClass("disabled");
}

ToxicTimer.doRace.UI.SwitchReadyButton = function (pStatus) {
	if (pStatus === "hold") {
		$("#readyButton").removeClass("hidden");
		$("#unreadyButton").addClass("hidden");
	} else if (pStatus === "ready") {
		$("#readyButton").addClass("hidden");
		$("#unreadyButton").removeClass("hidden");
	}
};

ToxicTimer.doRace.UI.HideReadyButton = function () {
	$("#unreadyButton").addClass("hidden");
	$("#readyButton").addClass("hidden");
}