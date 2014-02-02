var ToxicTimer = {};

var SPLIT_NOT_REACHED = -1;
var SPLIT_SKIPPED = -2;
var SPLIT_NOT_REACHED_STRING = "-";
var SPLIT_SKIPPED_STRING = "???";

ToxicTimer.api = "http://localhost:8080/ToxicTimer/";

ToxicTimer.gameList = [];

ToxicTimer.currentGame = undefined;
ToxicTimer.currentRun = undefined;


ToxicTimer.LoadGameList =
	function (pGameList) {
		for (var i = 0; i < pGameList.length; i++) {
			ToxicTimer.gameList[i] = new ToxicTimer.Game(pGameList[i].id, pGameList[i].abbreviation, pGameList[i].name);
			for (var j = 0; j < pGameList[i].runs.length; j++) {
				ToxicTimer.gameList[i].runs[j] = new ToxicTimer.Run(pGameList[i].runs[j].id, pGameList[i].runs[j].name);
				for (var k = 0; k < pGameList[i].runs[j].splits.length; k++) {
					ToxicTimer.gameList[i].runs[j].splits[k] = new ToxicTimer.Split(k, pGameList[i].runs[j].splits[k].name, SPLIT_SKIPPED);
				}
			}
		}
};

ToxicTimer.GetGame =
	function (pGameId) {
		for (var i = 0; i < ToxicTimer.gameList.length; i++) {
			if (ToxicTimer.gameList[i].id === pGameId) {
				return ToxicTimer.gameList[i];
			}
		}
		return undefined;
};

ToxicTimer.Game =
	function (pId, pAbbreviation, pName) {
		this.id = pId;
		this.abbreviation = pAbbreviation;
		this.name = pName;
		this.runs = [];
		this.GetRun = function (pRunId) {
			for (var i = 0; i < this.runs.length; i++) {
				if (this.runs[i].id === pRunId) {
					return this.runs[i];
				}
			}
			return undefined;
		};
};

ToxicTimer.Run =
	function (pId, pName) {
		this.id = pId;
		this.name = pName;
		this.splits = [];
};

ToxicTimer.Split =
	function (pId, pName, pBest) {
		this.id = pId;
		this.name = pName;
		this.best = pBest;
		this.current = SPLIT_NOT_REACHED;
		this.GetDifference =
			function () {
				if (this.current === SPLIT_NOT_REACHED) {
					return SPLIT_NOT_REACHED;
				} else if (this.best === SPLIT_SKIPPED || this.current === SPLIT_SKIPPED) {
					return SPLIT_SKIPPED;
				} else {
					return this.current - this.best;
				}
		};
};