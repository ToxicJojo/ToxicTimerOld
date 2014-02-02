ToxicTimer.timerUI = {};

//Setting up events
$(document).ready(function () {
	$("#gameSelect").bind("change", function () {
		ToxicTimer.timerUI.LoadRunList(parseInt(this.value));
	});

	$("#runSelect").bind("change", function () {
		if (ToxicTimer.timer.mode === "Editor") {
			$("#editorButton").click();
		}
		ToxicTimer.timerUI.ShowRun(parseInt(this.value));
	});

	$("#delayInput").bind("blur", function () {
		if (ToxicTimer.util.GetMillisecondsFromString($("#delayInput").val()) === SPLIT_SKIPPED) {
			ToxicTimer.timer.delay = 0;
		} else {
			ToxicTimer.timer.delay = ToxicTimer.util.GetMillisecondsFromString($("#delayInput").val());
		}
		if (ToxicTimer.timer.state !== "Running" && ToxicTimer.timer.state !== "Stopped") {
			$("#timeDisplay").html(ToxicTimer.util.FormatTime(-ToxicTimer.timer.delay));
		}
	})

	$("#startSplitButton").bind("click", ToxicTimer.timer.Start);
	$("#stopResumeButton").bind("click", ToxicTimer.timer.Stop);
	$("#skipButton").bind("click", ToxicTimer.timer.Skip);
	$("#undoButton").bind("click", ToxicTimer.timer.Undo);
	$("#resetButton").bind("click", ToxicTimer.timer.Reset);
	$("#fileInput").bind("change", ToxicTimer.timerUI.LoadRunFromFile);
	$("#editorButton").bind("click", ToxicTimer.editor.Toogle);
	$("#loadFileButton").bind("click", function () {
		$("#fileInput").click();
	});
});

ToxicTimer.timerUI.SwitchStartSplit =
	function (pSwitchTo) {
		$("#startSplitButton").unbind("click");
		if (pSwitchTo === "Split") {
			$("#startSplitButton").bind("click", ToxicTimer.timer.Split);
			$("#startSplitText").html("Split");
		} else {
			$("#startSplitButton").bind("click", ToxicTimer.timer.Start);
			$("#startSplitText").html("Start");
		}
};

ToxicTimer.timerUI.SwitchStopResume =
	function (pSwitchTo) {
		$("#stopResumeButton").unbind("click");
		if (pSwitchTo === "Stop") {
			$("#stopResumeButton").bind("click", ToxicTimer.timer.Stop);
			$("#stopResumeText").html("Stop");
			$("#stopResumeIcon").removeClass("glyphicon-forward")
			$("#stopResumeIcon").addClass("glyphicon-stop");
		} else {
			$("#stopResumeButton").bind("click", ToxicTimer.timer.Resume);
			$("#stopResumeText").html("Resume");
			$("#stopResumeIcon").removeClass("glyphicon-stop")
			$("#stopResumeIcon").addClass("glyphicon-forward");
		}
};

ToxicTimer.timerUI.LoadRunList =
	function (pGameId) {
		ToxicTimer.currentGame = ToxicTimer.GetGame(pGameId);

		if (ToxicTimer.currentGame !== undefined) {
			var innerHTML = '<option value="0">New Run</option>';
			for (var i = 0; i < ToxicTimer.currentGame.runs.length; i++) {
				innerHTML += '<option value="' + ToxicTimer.currentGame.runs[i].id + '">' + ToxicTimer.currentGame.runs[i].name + '</option>';
			}

			$("#runSelect").html(innerHTML);
		} else {
			ToxicTimer.notification.ShowError("Could not find a game with the id: " + pGameId);
		}
};

ToxicTimer.timerUI.LoadRunFromFile =
	function (pEvent) {
		ToxicTimer.io.LoadFile(pEvent, (function (pFileString) {
			ToxicTimer.currentRun = ToxicTimer.converter.ConvertFromWSplit(pFileString);

			ToxicTimer.timerUI.ShowRun(-1);
		}));
};

ToxicTimer.timerUI.ShowRun =
	function (pRunId) {
		ToxicTimer.timer.Reset();
		//If the id is 0 its a new run.
		//Don´t get the run from the gamelist if it was loaded from a file (-1).
		//Don´t get the run from the gamelist if it was edited.
		if (pRunId === 0) {
			ToxicTimer.currentRun = new ToxicTimer.Run(0, "New Run");
			ToxicTimer.currentRun.splits[0] = new ToxicTimer.Split(0, "New Split", SPLIT_SKIPPED);
		} else if (pRunId !== -1 && pRunId !== "EditedRun") {
			ToxicTimer.currentRun = ToxicTimer.currentGame.GetRun(pRunId);
		}

		if (ToxicTimer.currentRun !== undefined) {
			$("#runName").html('<h5>' + ToxicTimer.currentGame.name + '<small> ' + ToxicTimer.currentRun.name + '</small></h5>');
			$("#splits").html("");

			for (var i = 0; i < ToxicTimer.currentRun.splits.length; i++) {
				ToxicTimer.timerUI.ShowSplit(ToxicTimer.currentRun.splits[i]);
			}

			$("#split0").addClass("warning");
		} else {
			ToxicTimer.notification.ShowError("Could not find a run with the id: " + pRunId);
		}
};

ToxicTimer.timerUI.ShowSplit =
	function (pSplit) {
		var nameCell = '<td id="name' + pSplit.id + '">' + pSplit.name + '</td>';
		var bestCell = '<td id="best' + pSplit.id + '">' + ToxicTimer.util.FormatTime(pSplit.best) + '</td>';
		var liveCell = '<td id="live' + pSplit.id + '">' + SPLIT_NOT_REACHED_STRING + '</td>';
		var differenceCell = '<td id="difference' + pSplit.id + '">' + SPLIT_NOT_REACHED_STRING + '</td>';

		var row = '<tr id="split' + pSplit.id + '">';
		row += nameCell + bestCell + liveCell + differenceCell + "</tr>";

		$("#splits").append(row);
};

ToxicTimer.timerUI.UpdateSplit =
	function (pSplit) {
		if (pSplit !== undefined) {
			$("#live" + pSplit.id).html(ToxicTimer.util.FormatTime(pSplit.current));

			if (pSplit.id === ToxicTimer.timer.currentSplit) {
				$("#split" + pSplit.id).addClass("warning");
				$("#difference" + pSplit.id).html(ToxicTimer.util.FormatTime(SPLIT_NOT_REACHED));
			} else {
				$("#difference" + pSplit.id).html(ToxicTimer.util.FormatTime(pSplit.GetDifference()));
				$("#split" + pSplit.id).removeClass();

				if (pSplit.GetDifference() === SPLIT_SKIPPED) {
					$("#split" + pSplit.id).addClass("info");
				} else if (pSplit.GetDifference() > 0) {
					$("#split" + pSplit.id).addClass("danger");
				} else if ((pSplit.GetDifference() <= 0) && (pSplit.GetDifference() !== SPLIT_NOT_REACHED)) {
					$("#split" + pSplit.id).addClass("success");
				}
			}
		}
};