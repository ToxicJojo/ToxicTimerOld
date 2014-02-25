ToxicTimer.timer = {};

ToxicTimer.timer.startTime = 0;
ToxicTimer.timer.currentTime = 0;
ToxicTimer.timer.currentSplit = 0;
ToxicTimer.timer.delay = 0;

ToxicTimer.timer.state = "Ready";
ToxicTimer.timer.mode = "Run";


ToxicTimer.timer.Tick = function () {
	ToxicTimer.timer.currentTime = ToxicTimer.timer.GetCurrentTime();
	$("#timeDisplay").html(ToxicTimer.util.FormatTime(ToxicTimer.timer.currentTime));
};

ToxicTimer.timer.GetCurrentTime = function () {
	return ToxicTimer.util.Now() - ToxicTimer.timer.startTime;
};

ToxicTimer.timer.Start = function () {
	if (ToxicTimer.timer.state === "Ready" && ToxicTimer.timer.mode === "Run") {
		ToxicTimer.timer.startTime = ToxicTimer.util.Now() + ToxicTimer.timer.delay;

		ToxicTimer.timer.UI.SwitchStartSplit("Split");
		if (ToxicTimer.timer.interval) {
			window.clearInterval(ToxicTimer.timer.interval);
		}

		ToxicTimer.timer.interval = window.setInterval("ToxicTimer.timer.Tick()", 21);
		ToxicTimer.timer.state = "Running";
	} else if (ToxicTimer.timer.mode === "View" || ToxicTimer.timer.mode === "Race") {
		if (ToxicTimer.races.currentRace.started !== 0) {
			ToxicTimer.timer.startTime = ToxicTimer.races.currentRace.started;
			if (ToxicTimer.timer.interval) {
				window.clearInterval(ToxicTimer.timer.interval);
			}
			ToxicTimer.timer.interval = window.setInterval("ToxicTimer.timer.Tick()", 21);
			ToxicTimer.timer.state = "Running";
			ToxicTimer.doRace.UI.EnableButtons();
			ToxicTimer.doRace.UI.HideReadyButton();
		}
	}
};

ToxicTimer.timer.Stop = function () {
	if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
		window.clearInterval(ToxicTimer.timer.interval);

		ToxicTimer.timer.UI.SwitchStopResume("Resume");
		ToxicTimer.timer.state = "Stopped";
	}
};

ToxicTimer.timer.Resume = function () {
	if (ToxicTimer.timer.state === "Stopped" && ToxicTimer.timer.mode === "Run") {
		ToxicTimer.timer.startTime = ToxicTimer.util.Now() - ToxicTimer.timer.currentTime;
		ToxicTimer.timer.interval = window.setInterval("ToxicTimer.timer.Tick()", 21);

		ToxicTimer.timer.UI.SwitchStopResume("Stop");
		ToxicTimer.timer.state = "Running"
	}
};

ToxicTimer.timer.Split = function () {
	if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
		ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit].current = ToxicTimer.timer.GetCurrentTime();

		ToxicTimer.timer.currentSplit++;

		ToxicTimer.timer.UI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit - 1]);
		ToxicTimer.timer.UI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit]);

		if (ToxicTimer.timer.currentSplit >= ToxicTimer.currentRun.splits.length) {
			window.clearInterval(ToxicTimer.timer.interval);

			ToxicTimer.timer.UI.SwitchStartSplit("Start");
			ToxicTimer.timer.state = "Finished";
		}
	} else if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Race") {
		var splits = ToxicTimer.races.currentRace.GetRunner(ToxicTimer.doRace.runnerId).splits;

		var out = "";
		var splitReached = false;
		for (var i = 0; i < splits.length; i++) {
			if ((splits[i] === SPLIT_NOT_REACHED) && !splitReached) {
				splits[i] = ToxicTimer.util.Now() - ToxicTimer.timer.startTime;
				splitReached = true;
			}
			out += splits[i] + ";";
		}

		ToxicTimer.request.PostSplits(function () {
			$.when(ToxicTimer.request.GetRace(ToxicTimer.races.LoadRace, ToxicTimer.races.currentRace.id)).done(function () {
				ToxicTimer.viewRace.UI.ShowRace(ToxicTimer.races.currentRace);
			});
		}, ToxicTimer.races.currentRace.id, ToxicTimer.doRace.runnerCode, out);
	}
};

ToxicTimer.timer.Skip = function () {
	if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
		if (ToxicTimer.timer.currentSplit + 1 < ToxicTimer.currentRun.splits.length) {
			ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit].current = SPLIT_SKIPPED;

			ToxicTimer.timer.currentSplit++;

			ToxicTimer.timer.UI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit - 1]);
			ToxicTimer.timer.UI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit]);
		}
	} else if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Race") {
		var splits = ToxicTimer.races.currentRace.GetRunner(ToxicTimer.doRace.runnerId).splits;

		var out = "";
		var splitReached = false;
		for (var i = 0; i < splits.length; i++) {
			if ((splits[i] === SPLIT_NOT_REACHED) && !splitReached) {
				splits[i] = SPLIT_SKIPPED;
				splitReached = true;
			}
			out += splits[i] + ";";
		}

		ToxicTimer.request.PostSplits(function () {
			$.when(ToxicTimer.request.GetRace(ToxicTimer.races.LoadRace, ToxicTimer.races.currentRace.id)).done(function () {
				ToxicTimer.viewRace.UI.ShowRace(ToxicTimer.races.currentRace);
			});
		}, ToxicTimer.races.currentRace.id, ToxicTimer.doRace.runnerCode, out);
	}
};

ToxicTimer.timer.Undo = function () {
	if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
		if (ToxicTimer.timer.currentSplit > 1) {
			ToxicTimer.currentRun.splits[--ToxicTimer.timer.currentSplit].current = SPLIT_NOT_REACHED;

			ToxicTimer.timer.UI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit + 1]);
			ToxicTimer.timer.UI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit]);
		}
	} else if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Race") {
		var splits = ToxicTimer.races.currentRace.GetRunner(ToxicTimer.doRace.runnerId).splits;

		var out = "";
		var splitReached = false;
		for (var i = 0; i < splits.length; i++) {
			if (((splits[i + 1] === SPLIT_NOT_REACHED || splits[i + 1] === undefined) && splits[i] !== SPLIT_NOT_REACHED) && !splitReached) {
				splits[i] = SPLIT_NOT_REACHED;
				splitReached = true;
			}
			out += splits[i] + ";";
		}


		ToxicTimer.request.PostSplits(function () {
			$.when(ToxicTimer.request.GetRace(ToxicTimer.races.LoadRace, ToxicTimer.races.currentRace.id)).done(function () {
				ToxicTimer.viewRace.UI.ShowRace(ToxicTimer.races.currentRace);
			});
		}, ToxicTimer.races.currentRace.id, ToxicTimer.doRace.runnerCode, out);
	}
};

ToxicTimer.timer.Reset = function () {
	if ((ToxicTimer.timer.state === "Running" || ToxicTimer.timer.state === "Finished") && ToxicTimer.timer.mode === "Run") {
		window.clearInterval(ToxicTimer.timer.interval);

		ToxicTimer.timer.UI.SwitchStartSplit("Start");
		ToxicTimer.timer.UI.SwitchStopResume("Stop");

		ToxicTimer.timer.startTime = 0;
		ToxicTimer.timer.currentTime = 0;
		ToxicTimer.timer.currentSplit = 0;

		ToxicTimer.timer.state = "Ready";

		for (var i = 0; i < ToxicTimer.currentRun.splits.length; i++) {
			ToxicTimer.currentRun.splits[i].current = SPLIT_NOT_REACHED;
			ToxicTimer.timer.UI.UpdateSplit(ToxicTimer.currentRun.splits[i]);
		}

		$("#timeDisplay").html("00:00.000");
	}
};