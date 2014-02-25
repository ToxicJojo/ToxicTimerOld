ToxicTimer.doRace = {};

ToxicTimer.doRace.runnerId = undefined;
ToxicTimer.doRace.runnerCode = undefined;

ToxicTimer.doRace.Runner = function () {
	return ToxicTimer.races.currentRace.GetRunner(ToxicTimer.doRace.runnerId);
};


ToxicTimer.doRace.Ready = function () {
	ToxicTimer.request.PostStatus(ToxicTimer.doRace.UI.SwitchReadyButton, ToxicTimer.doRace.runnerCode, "ready");
};

ToxicTimer.doRace.UnReady = function () {
	ToxicTimer.request.PostStatus(ToxicTimer.doRace.UI.SwitchReadyButton, ToxicTimer.doRace.runnerCode, "hold");
};