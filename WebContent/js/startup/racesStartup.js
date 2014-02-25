$(document).ready(function () {
	$.when(ToxicTimer.request.GetGames(ToxicTimer.LoadGameList)).done(function () {
		var innerHTML = '<option value="-1">All Games</option>';
		var innerHTML2 = "";
		for (var i = 0; i < ToxicTimer.gameList.length; i++) {
			innerHTML += '<option value="' + ToxicTimer.gameList[i].id + '">' + ToxicTimer.gameList[i].name + '</option>';
			innerHTML2 += '<option value="' + ToxicTimer.gameList[i].id + '">' + ToxicTimer.gameList[i].name + '</option>';
		}


		$("#gameSelect").html(innerHTML2);
		$("#gameFilter").html(innerHTML);
		$.when(ToxicTimer.request.GetRaceList(ToxicTimer.races.LoadRaceList)).done(function () {
			ToxicTimer.races.UI.ShowRaceList(ToxicTimer.races.raceList);
		});
	});
});