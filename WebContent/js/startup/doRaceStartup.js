$(document).ready(function () {
	var raceId = parseInt(ToxicTimer.util.GetURLParameter("id"));
	ToxicTimer.doRace.runnerCode = parseInt(ToxicTimer.util.GetURLParameter("code"));
	ToxicTimer.doRace.runnerId = parseInt(ToxicTimer.util.GetURLParameter("runnerId"));
	$.when(ToxicTimer.request.GetGames(ToxicTimer.LoadGameList).done(function () {
		$.when(ToxicTimer.request.GetRace(ToxicTimer.races.LoadRace, raceId).done(function () {
			ToxicTimer.viewRace.UI.ShowRace(ToxicTimer.races.currentRace);

			window.setInterval(function () {
				$.when(ToxicTimer.request.GetRace(ToxicTimer.races.LoadRace, ToxicTimer.races.currentRace.id)).done(function () {
					ToxicTimer.viewRace.UI.ShowRace(ToxicTimer.races.currentRace);
					if (ToxicTimer.timer.state !== "Running") {
						ToxicTimer.timer.Start();
					}
				});
			}, 2000);

			ToxicTimer.timer.mode = "Race";

			if (ToxicTimer.races.currentRace.started === 0) {
				ToxicTimer.doRace.UI.DisableButtons();
				if (ToxicTimer.doRace.Runner().status === "hold") {
					$("#readyButton").removeClass("hidden");
				} else if (ToxicTimer.doRace.Runner().status === "ready") {
					$("#unreadyButton").removeClass("hidden");
				}
			} else {
				ToxicTimer.timer.Start();
			}
		}));
	}));
});