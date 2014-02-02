ToxicTimer.request = {};

ToxicTimer.request.GetGames =
	function (pFunction) {
		return $.ajax({
			type: "GET",
			url: ToxicTimer.api + "get/GameList",
			processData: true,
			dataType: "jsonp",
			timeout: 2500,
			success: pFunction,
			error: function (pXOptions, pTextMessage) {
				if (pTextMessage === "error") {
					ToxicTimer.notification.ShowError("The request to load the gamelist failed.The server might be offline.");
				}
			}
		});
};