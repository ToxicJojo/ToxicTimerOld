ToxicTimer.timer = {};

ToxicTimer.timer.startTime = 0;
ToxicTimer.timer.currentTime = 0;
ToxicTimer.timer.currentSplit = 0;
ToxicTimer.timer.delay = 0;

ToxicTimer.timer.state = "Ready";
ToxicTimer.timer.mode = "Run";


ToxicTimer.timer.Tick =
	function () {
		ToxicTimer.timer.currentTime = ToxicTimer.timer.GetCurrentTime();
		$("#timeDisplay").html(ToxicTimer.util.FormatTime(ToxicTimer.timer.currentTime));
};

ToxicTimer.timer.GetCurrentTime =
	function () {
		return ToxicTimer.util.Now() - ToxicTimer.timer.startTime;
};

ToxicTimer.timer.Start =
	function () {
		if (ToxicTimer.timer.state === "Ready" && ToxicTimer.timer.mode === "Run") {
			ToxicTimer.timer.startTime = ToxicTimer.util.Now() + ToxicTimer.timer.delay;

			ToxicTimer.timerUI.SwitchStartSplit("Split");
			if (ToxicTimer.timer.interval) {
				window.clearInterval(ToxicTimer.timer.interval);
			}

			ToxicTimer.timer.interval = window.setInterval("ToxicTimer.timer.Tick()", 21);
			ToxicTimer.timer.state = "Running";
		}
};

ToxicTimer.timer.Stop =
	function () {
		if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
			window.clearInterval(ToxicTimer.timer.interval);

			ToxicTimer.timerUI.SwitchStopResume("Resume");
			ToxicTimer.timer.state = "Stopped";
		}
};

ToxicTimer.timer.Resume =
	function () {
		if (ToxicTimer.timer.state === "Stopped" && ToxicTimer.timer.mode === "Run") {
			ToxicTimer.timer.startTime = ToxicTimer.util.Now() - ToxicTimer.timer.currentTime;
			ToxicTimer.timer.interval = window.setInterval("ToxicTimer.timer.Tick()", 21);

			ToxicTimer.timerUI.SwitchStopResume("Stop");
			ToxicTimer.timer.state = "Running"
		}
};

ToxicTimer.timer.Split =
	function () {
		if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
			ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit].current = ToxicTimer.timer.GetCurrentTime();

			ToxicTimer.timer.currentSplit++;

			ToxicTimer.timerUI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit - 1]);
			ToxicTimer.timerUI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit]);

			if (ToxicTimer.timer.currentSplit >= ToxicTimer.currentRun.splits.length) {
				window.clearInterval(ToxicTimer.timer.interval);

				ToxicTimer.timerUI.SwitchStartSplit("Start");
				ToxicTimer.timer.state = "Finished";
			}
		}
};

ToxicTimer.timer.Skip =
	function () {
		if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
			if (ToxicTimer.timer.currentSplit + 1 < ToxicTimer.currentRun.splits.length) {
				ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit].current = SPLIT_SKIPPED;

				ToxicTimer.timer.currentSplit++;

				ToxicTimer.timerUI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit - 1]);
				ToxicTimer.timerUI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit]);
			}
		}
};

ToxicTimer.timer.Undo =
	function () {
		if (ToxicTimer.timer.state === "Running" && ToxicTimer.timer.mode === "Run") {
			if (ToxicTimer.timer.currentSplit > 1) {
				ToxicTimer.currentRun.splits[--ToxicTimer.timer.currentSplit].current = SPLIT_NOT_REACHED;

				ToxicTimer.timerUI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit + 1]);
				ToxicTimer.timerUI.UpdateSplit(ToxicTimer.currentRun.splits[ToxicTimer.timer.currentSplit]);
			}
		}
};

ToxicTimer.timer.Reset =
	function () {
		if ((ToxicTimer.timer.state === "Running" || ToxicTimer.timer.state === "Finished") && ToxicTimer.timer.mode === "Run") {
			window.clearInterval(ToxicTimer.timer.interval);

			ToxicTimer.timerUI.SwitchStartSplit("Start");
			ToxicTimer.timerUI.SwitchStopResume("Stop");

			ToxicTimer.timer.startTime = 0;
			ToxicTimer.timer.currentTime = 0;
			ToxicTimer.timer.currentSplit = 0;

			ToxicTimer.timer.state = "Ready";

			for (var i = 0; i < ToxicTimer.currentRun.splits.length; i++) {
				ToxicTimer.currentRun.splits[i].current = SPLIT_NOT_REACHED;
				ToxicTimer.timerUI.UpdateSplit(ToxicTimer.currentRun.splits[i]);
			}

			$("#timeDisplay").html("00:00.000");
		}
};