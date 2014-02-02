ToxicTimer.io = {};

ToxicTimer.io.LoadFile =
	function (pEvent, pFunction) {
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			var fileToLoad = document.getElementById("fileInput").files[0];

			var fileReader = new FileReader();
			fileReader.onload =
				function (fileLoadedEvent) {
					var textFromFileLoaded = fileLoadedEvent.target.result;
					pFunction(textFromFileLoaded);
			};
			fileReader.readAsText(fileToLoad, "UTF-8");
		} else {
			ToxicTimer.notification.ShowError("Your broswer seems to not support file loading.");
		}
};