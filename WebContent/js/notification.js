ToxicTimer.notification = {};

ToxicTimer.notification.ShowError = function (pErrorMessage) {
	document.getElementById("notificationDiv").innerHTML = '<div class="alert alert-danger alert-dismissable">' +
		'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + pErrorMessage + '</strong></div>';
};

ToxicTimer.notification.ShowWarning = function (pWarningMessage) {
	document.getElementById("notificationDiv").innerHTML = '<div class="alert alert-warning alert-dismissable">' +
		'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + pWarningMessage + '</strong></div>';
};

ToxicTimer.notification.ShowSuccess = function (pSuccessMessage) {
	document.getElementById("notificationDiv").innerHTML = '<div class="alert alert-success alert-dismissable">' +
		'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + pSuccessMessage + '</strong></div>';
};

ToxicTimer.notification.ShowInfo = function (pInfoMessage) {
	document.getElementById("notificationDiv").innerHTML = '<div class="alert alert-info alert-dismissable">' +
		'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + pInfoMessage + '</strong></div>';
};