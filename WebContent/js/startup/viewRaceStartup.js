$(document).ready(function () {
	var raceId = ToxicTimer.util.GetURLParameter("id");
	$.when(ToxicTimer.request.GetGames(ToxicTimer.LoadGameList).done(function () {
		$.when(ToxicTimer.request.GetRace(ToxicTimer.races.LoadRace, raceId).done(function () {
			ToxicTimer.viewRace.UI.ShowRace(ToxicTimer.races.currentRace);
			ToxicTimer.timer.mode = "View";
			ToxicTimer.timer.Start();

			if (ToxicTimer.races.currentRace.started === 0) {
				$("#launchJoinRaceModalButton").removeClass("hidden");
			}
		}));
	}));
});