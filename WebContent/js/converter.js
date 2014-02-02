ToxicTimer.converter = {};

ToxicTimer.converter.ConvertFromWSplit =
	function (pInput) {
		var lines = pInput.split('\n');
		var splits = [];
		var runName = lines[0].substring(6);

		for (var i = 1; i < lines.length; i++) {
			if (lines[i].search("Size=") != -1) {
				for (var j = i + 1; lines[j].search("Icons=") === -1; j++) {
					var name = lines[j].split(',')[0];
					var best = parseFloat(lines[j].split(',')[2]) * 1000;

					splits[(j - i) - 1] = new ToxicTimer.Split((j - i) - 1, name, best);
				}
			}
		}
		var run = new ToxicTimer.Run(-1, runName);
		run.splits = splits;
		return run;
};