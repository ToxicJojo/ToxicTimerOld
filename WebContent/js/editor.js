ToxicTimer.editor = {};

ToxicTimer.editor.Toogle = function () {
	if (ToxicTimer.timer.mode === "Editor") {
		ToxicTimer.timer.mode = "Run";

		ToxicTimer.timer.UI.ShowRun("EditedRun");
	} else {
		ToxicTimer.timer.Reset();
		ToxicTimer.timer.mode = "Editor";

		ToxicTimer.editor.ShowSplits(ToxicTimer.currentRun.splits);
	}
};

ToxicTimer.editor.ShowSplits = function (pSplits) {
	for (var i = 0; i < pSplits.length; i++) {
		ToxicTimer.editor.ShowSplit(pSplits[i]);
	}
};

ToxicTimer.editor.ShowSplit = function (pSplit) {
	var formStart = '<form class="form-inline">';
	var formEnd = '</form>';

	var nameCell = formStart + '<span class="glyphicon glyphicon-plus-sign insertSplit" id="insertSplit' + pSplit.id + '" ></span> ';

	if (pSplit.id !== 0) {
		nameCell += '<span class="glyphicon glyphicon-remove-sign deleteSplit"id="deleteSplit' + pSplit.id + '" ></span> ';
	}

	$("#name" + pSplit.id).html(nameCell + '<input type="text" class="form-control input-sm" value="' + pSplit.name + '" id="editName' + pSplit.id + '">' + formEnd);
	$("#best" + pSplit.id).html(formStart + '<input type="text" class="form-control input-sm" value="' + ToxicTimer.util.FormatTime(pSplit.best) + '" id="editBest' + pSplit.id + '">' + formEnd);


	$("#deleteSplit" + pSplit.id).bind("click", function () {
		ToxicTimer.currentRun.splits.splice(pSplit.id, 1);
		ToxicTimer.editor.RefreshTable();
	});

	$("#insertSplit" + pSplit.id).bind("click", function () {
		ToxicTimer.currentRun.splits.splice(pSplit.id + 1, 0, new ToxicTimer.Split(pSplit.id, "New Split", SPLIT_SKIPPED));
		ToxicTimer.editor.RefreshTable();
	});

	$("#editName" + pSplit.id).bind("blur", function () {
		ToxicTimer.currentRun.splits[pSplit.id].name = $("#editName" + pSplit.id).val();
	});

	$("#editBest" + pSplit.id).bind("blur", function () {
		ToxicTimer.currentRun.splits[pSplit.id].best = ToxicTimer.util.GetMillisecondsFromString($("#editBest" + pSplit.id).val());
	});
};

ToxicTimer.editor.RefreshTable = function () {
	for (var i = 0; i < ToxicTimer.currentRun.splits.length; i++) {
		ToxicTimer.currentRun.splits[i].id = i;
	}

	ToxicTimer.timer.UI.ShowRun("EditedRun");
	ToxicTimer.editor.ShowSplits(ToxicTimer.currentRun.splits);
};