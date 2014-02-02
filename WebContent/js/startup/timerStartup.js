$(document).ready(function () {
	$.when(ToxicTimer.request.GetGames(ToxicTimer.LoadGameList)).done(function () {
		var gameId = ToxicTimer.util.GetURLParameter("gameId");
		var runId = ToxicTimer.util.GetURLParameter("runId");

		if (gameId !== undefined) {
			ToxicTimer.currentGame = ToxicTimer.GetGame(parseInt(gameId));
			if (runId !== undefined && ToxicTimer.currentGame !== undefined) {
				ToxicTimer.currentRun = ToxicTimer.currentGame.GetRun(parseInt(runId));
			}
		}
		if (ToxicTimer.currentGame === undefined) {
			ToxicTimer.currentGame = ToxicTimer.gameList[0];
		}

		var innerHTML = "";
		for (var i = 0; i < ToxicTimer.gameList.length; i++) {
			innerHTML += '<option value="' + ToxicTimer.gameList[i].id + '">' + ToxicTimer.gameList[i].name + '</option>';
		}

		$("#gameSelect").html(innerHTML);
		//Load the selects and trigger them to load a run.
		$("#gameSelect").val(ToxicTimer.currentGame.id);
		$("#gameSelect").change();
		if (ToxicTimer.currentRun !== undefined) {
			$("#runSelect").val(ToxicTimer.currentRun.id);
		}
		$("#runSelect").change();
	})
});