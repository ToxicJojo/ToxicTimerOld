ToxicTimer.util = {};

String.prototype.contains = function (pItem) {
	return this.indexOf(pItem) != -1;
};


ToxicTimer.util.GetURLParameter =
	function (pParameter) {
		var pageURL = window.location.search.substring(1);
		var urlVariables = pageURL.split('&');
		for (var i = 0; i < urlVariables.length; i++) {
			var parameterName = urlVariables[i].split('=');
			if (parameterName[0] === pParameter) {
				return parameterName[1];
			}
		}
};

ToxicTimer.util.Now =
	function () {
		var date = new Date();
		return date.getTime();
};

ToxicTimer.util.GetMillisecondsFromString =
	function (pTimeString) {
		if (pTimeString === SPLIT_NOT_REACHED_STRING) {
			return SPLIT_NOT_REACHED;
		} else if (pTimeString === SPLIT_SKIPPED_STRING) {
			return SPLIT_SKIPPED;
		} else if (pTimeString === "") {
			return 0;
		}

		//[Millisecond, Seconds, Minutes, Hours]
		var timeArray = [0, 0, 0, 0];

		//Get the milliseconds
		timeArray[0] = parseInt(pTimeString.split(".")[1]);
		//If there are not milliseconds
		if (isNaN(timeArray[0])) {
			timeArray[0] = 0;
		}

		if (timeArray[0] < 100) {
			if (timeArray[0] < 10) {
				timeArray[0] *= 100;
			} else {
				timeArray[0] *= 10;
			}
		}

		var tempTimeArray = pTimeString.split(".")[0].split(":");

		for (var i = tempTimeArray.length; i > 0; i--) {
			timeArray[(tempTimeArray.length - i) + 1] = parseInt(tempTimeArray[i - 1]);
		}

		var milliseconds = (timeArray[0] + (timeArray[1] * 1000) + (timeArray[2] * 60000) + (timeArray[3] * 3600000));

		if (isNaN(milliseconds)) {
			ToxicTimer.notification.ShowError(pTimeString + " is not a valid time. Please use the format hh:mm:ss.xxx");
			return SPLIT_SKIPPED;
		} else {
			return milliseconds;
		}
};

ToxicTimer.util.FormatTime =
	function (pMilliseconds) {
		if (pMilliseconds === SPLIT_NOT_REACHED) {
			return SPLIT_NOT_REACHED_STRING;
		} else if (pMilliseconds === SPLIT_SKIPPED) {
			return SPLIT_SKIPPED_STRING;
		}

		//Append 0´s if needed.
		var FormatUnit =
			function (pUnit) {
				if (pUnit < 10) {
					return "0" + pUnit;
				} else {
					return pUnit;
				}
		};

		var timeString = "";

		if (pMilliseconds < 0) {
			pMilliseconds = -pMilliseconds;
			timeString += "-";
		}

		var hours = (Math.floor(pMilliseconds / 3600000));
		var minutes = (Math.floor(pMilliseconds / 60000) % 60);
		var seconds = (Math.floor(pMilliseconds / 1000) % 60);
		var milliSeconds = (pMilliseconds % 1000);

		if (hours > 0) {
			timeString += hours + ":";
		}

		timeString += FormatUnit(minutes) + ":";
		timeString += FormatUnit(seconds) + ".";

		if (milliSeconds < 100) {
			if (milliSeconds < 10) {
				timeString += "00" + milliSeconds;
			} else {
				timeString += "0" + milliSeconds;
			}
		} else {
			timeString += milliSeconds;
		}

		return timeString;
};