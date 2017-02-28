// -------------------------------------------------
// -----------------Global Variables-----------------------
// -------------------------------------------------
var body = $("body");
var video = $(".main-video");
var videoCtnr = $(".video-ctnr");
var videoGet = $(".main-video").get(0);
var videoCtnrGet = $(".video-ctnr").get(0);
var soundBar = $('.sound-outer');
var soundButton = $("#video-sound");
var playOrPauseBtn = $('#video-play-pause');
var fullScreenBtn = $("#fullscreen");
var spinner = $('.spinner-outer');
var speedRateBar = $(".speed-outer");
var speedButton = $('#video-speed');
var videoGear = $('#video-gear');
var captionsBtn = $('#closed-caption');
var outerVideoProg = $('.outer-video-progress');
var transcription = $('.transcription');
var videoProgressFull = $('#video-progress');
var videoLoadedBar = $('.progress-loaded');
var videoProgressCurrent = $(".progress-current");
var currentTimePlace = $(".video-time #current-time");
var totalTimePlace = $('.video-time #total-time');
var soundLevelFull = $(".sound-level");
var soundLevelCurrent = $(".sound-current");
var mutePath = $("#mute-path");
var scndVolumePath = $("#scnd-vlm-path");
var videoCtrlBar = $(".video-ctrl-bar");
var barHeight = videoCtrlBar.outerHeight();
var clickingVol = false;
var clickingProg = false;
var clicking = false;
var cursorOnSoundBar = false;
var currentPos = [];
var videoDuration;
var updateCurrentTime;
var fragmentObj;
var fadeTimer;
var spinnerTimeOut;
var transcriptionArray = [{
	fragment: "Now that we've looked at the architecture of the internet, let's see how you might",
	start: .240,
	end: 4.130,
}, {
	fragment: "connect your personal devices to the internet inside your house.",
	start: 4.130,
	end: 7.535,
}, {
	fragment: "Well there are many ways to connect to the internet, and",
	start: 7.535,
	end: 11.270,
}, {
	fragment: "most often people connect wirelessly.",
	start: 11.270,
	end: 13.960,
}, {
	fragment: "Let's look at an example of how you can connect to the internet.",
	start: 13.960,
	end: 17.940,
}, {
	fragment: "If you live in a city or a town, you probably have a coaxial cable for",
	start: 17.940,
	end: 22.370,
}, {
	fragment: "cable Internet, or a phone line if you have DSL, running to the outside of",
	start: 22.370,
	end: 26.880,
}, {
	fragment: "your house, that connects you to the Internet Service Provider, or ISP.",
	start: 26.880,
	end: 30.920,
}, {
	fragment: "If you live far out in the country, you'll more likely have",
	start: 32.100,
	end: 34.730,
}, {
	fragment: "a dish outside your house, connecting you wirelessly to your closest ISP, or",
	start: 34.730,
	end: 39.430,
}, {
	fragment: "you might also use the telephone system.",
	start: 39.430,
	end: 41.190,
}, {
	fragment: "Whether a wire comes straight from the ISP hookup outside your house, or",
	start: 42.350,
	end: 46.300,
}, {
	fragment: "it travels over radio waves from your roof,",
	start: 46.300,
	end: 49.270,
}, {
	fragment: "the first stop a wire will make once inside your house, is at your modem.",
	start: 49.270,
	end: 53.760,
}, {
	fragment: "A modem is what connects the internet to your network at home.",
	start: 53.760,
	end: 57.780,
}, {
	fragment: "A few common residential modems are DSL or",
	start: 57.780,
	end: 60.150,
}];
// -------------------------------------------------
// -----------------End Global Variables-----------------------
// -------------------------------------------------
// -------------------------------------------------
// -----------------Functions-----------------------
// -------------------------------------------------
function showBar() {
	videoCtrlBar.css("top", -barHeight);
	videoCtrlBar.css("opacity", 1);
}

function hideBar() {
	videoCtrlBar.css("top", -32);
}

function toggleFullScreen() {
	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		if (videoCtnrGet.requestFullscreen) {
			videoCtnrGet.requestFullscreen();
		} else if (videoCtnrGet.msRequestFullscreen) {
			videoCtnrGet.msRequestFullscreen();
		} else if (videoCtnrGet.mozRequestFullScreen) {
			videoCtnrGet.mozRequestFullScreen();
		} else if (videoCtnrGet.webkitRequestFullscreen) {
			videoCtnrGet.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

function fadeElemInFull() {
	if (!videoGet.paused) {
		body.css("cursor", "auto");
		showBar();
		clearTimeout(fadeTimer);
		fadeTimer = setTimeout(function() {
			hideBar();
			body.css("cursor", "none");
		}, 3300);
	} else {
		clearTimeout(fadeTimer);
	}
}

function fadeInSpinner() {
	spinnerTimeOut = setTimeout(function() {
		spinner.fadeIn();
	}, 500);
}

function videoHover() {
	video.add(videoCtrlBar).hover(showBar, function() {
		if (!videoGet.paused && !clickingVol) {
			hideBar();
		}
	});
}

function videoSpinner() {
	spinner.css("top", video.offset().top + (video.outerHeight() / 2));
	spinner.width(50);
	spinner.height(50);
}

function playOrPause() {
	if (videoGet.currentTime == videoDuration) {
		videoGet.currentTime = 0;
		videoGet.play();
		playOrPauseBtn.find('img').attr('src', "svgs/pause.svg");
		displayTimeInterval();
	} else if (videoGet.paused) {
		videoGet.play();
		playOrPauseBtn.find('img').attr('src', "svgs/pause.svg");
		displayTimeInterval();
	} else {
		videoGet.pause();
		playOrPauseBtn.find('img').attr('src', "svgs/play.svg");
		showBar();
		clearInterval(updateCurrentTime);
		spinner.hide();
		clearTimeout(spinnerTimeOut);
	}
}

function loadedProg() {
	var endTimes = [];
	for (var i = 0; i < videoGet.buffered.length; i++) {
		var tRangeStart = videoGet.buffered.start(i);
		var tRangeEnd = videoGet.buffered.end(i);
		if (tRangeStart <= videoGet.currentTime) {
			endTimes.push(tRangeEnd);
		}
	}
	var goodEndTime = endTimes[endTimes.length - 1];
	var progFull = videoProgressFull.width();
	var loadedFraction = goodEndTime / videoDuration;
	videoLoadedBar.width(loadedFraction * progFull);
}

function loadedProgInterval() {
	var updateProg;
	updateProg = setInterval(function() {
		loadedProg();
		if (videoLoadedBar.width() == videoProgressFull.width()) {
			clearInterval(updateProg);
		}
	}, 1000);
}

function currentProgGet() {
	var progFraction = videoGet.currentTime / videoDuration;
	videoProgressCurrent.width(progFraction * videoProgressFull.width());
}

function currentProgSet(event) {
	var progFull = videoProgressFull.width();
	var xRelPos = event.pageX - videoProgressFull.offset().left;
	var progFraction = xRelPos / progFull;
	if (progFraction > 1) {
		progFraction = 1;
	} else if (progFraction < 0) {
		progFraction = 0;
	}
	videoProgressCurrent.width(progFraction * progFull);
	videoGet.currentTime = progFraction * videoDuration;
}

function convertTime(seconds) {
	var minutesTime;
	var secondsTime;
	var formattedTime;
	var hoursTime = seconds / 3600;
	var hoursTimeFloor = Math.floor(hoursTime);
	if (hoursTime >= 1) {
		minutesTime = (seconds % 3600) / 60;
	} else {
		minutesTime = seconds / 60;
	}
	var minutesTimeFloor = ('0' + Math.floor(minutesTime)).slice(-2);
	if (minutesTime >= 1) {
		secondsTime = (seconds % 3600) % 60;
	} else {
		secondsTime = seconds;
	}
	var secondsTimeFloor = ('0' + Math.floor(secondsTime)).slice(-2);
	if (hoursTime < 1) {
		formattedTime = minutesTimeFloor + ":" + secondsTimeFloor;
	} else {
		formattedTime = hoursTimeFloor + ":" + minutesTimeFloor + ":" + secondsTimeFloor;
	}
	return formattedTime;
}

function displayTime() {
	var currentTimeConverted;
	currentTimeConverted = convertTime(videoGet.currentTime);
	currentTimePlace.text(currentTimeConverted);
}

function displayTimeInterval() {
	if (updateCurrentTime != undefined) {
		clearInterval(updateCurrentTime);
	}
	updateCurrentTime = setInterval(function() {
		displayTime();
	}, 1000);
}

function positionControlDiv(relative, absolute) {
	var absPosY = absolute.position().top;
	var absPosX = absolute.position().left;
	var absWidth = absolute.outerWidth();
	var relOuterWidth = relative.outerWidth();
	var relOuterHeight = relative.outerHeight()
	var relPosX = absPosX + ((absWidth - relOuterWidth) / 2);
	relative.css("top", absPosY - (relOuterHeight - 2));
	relative.css("left", relPosX);
}

function setVol(event) {
	var sFull = soundLevelFull.height();
	var offsetParent = soundLevelFull.offset().top;
	var yRelPos = sFull - (event.pageY - offsetParent);
	var volFraction = yRelPos / sFull;
	if (volFraction > .97) {
		volFraction = 1;
	} else if (volFraction < .03) {
		volFraction = 0;
	}
	soundLevelCurrent.height(volFraction * sFull);
	videoGet.volume = volFraction;
}

function updateVol() {
	var sFull = soundLevelFull.height();
	var videoVol = videoGet.volume;
	var newHeight = videoVol * sFull;
	var videoMut = videoGet.muted;
	if (videoMut || videoVol == 0) {
		soundLevelCurrent.height(0);
		mutePath.add(scndVolumePath).show();
	} else {
		soundLevelCurrent.height(newHeight);
		mutePath.hide();
		if (videoVol <= .5) {
			scndVolumePath.hide();
		} else {
			scndVolumePath.show();
		}
	}
}

function setNewRate(x) {
	videoGet.playbackRate = x;
}

function wrapFragments(array) {
	for (var i = 0; i < array.length; i++) {
		var fragment = array[i].fragment;
		var fragExist = transcription.text().search(fragment);
		if (fragExist) {
			var fragWithSpan = "<span>" + fragment + "</span>";
			var newText = transcription.html().replace(fragment, fragWithSpan);
			transcription.html(newText);
		}
	}
}

function highlightFragment(array) {
	var currentT = videoGet.currentTime;
	if (fragmentObj != undefined) {
		if (currentT > fragmentObj.start && currentT < fragmentObj.end) {
			return
		}
	}
	for (var i = 0; i < array.length; i++) {
		var fragment = array[i].fragment;
		var start = array[i].start;
		var end = array[i].end;
		var fragExist = transcription.text().search(fragment);
		if (fragExist != -1 && currentT >= start && currentT < end) {
			transcription.find('span').removeClass('current');
			transcription.find('span').filter(function() {
				return $(this).text() == fragment;
			}).addClass('current');
			fragmentObj = array[i];
			return;
		}
	}
}

function cursorIsNotOver(e, element) {
	if (e.pageY < element.offset().top || e.pageY > element.offset().top + element.outerHeight() || e.pageX < element.offset().left || e.pageX > element.offset().left + element.outerWidth()) {
		return true;
	} else {
		return false;
	}
}
// -------------------------------------------------
// -----------------End Functions-----------------------
// -------------------------------------------------
// -------------------------------------------------
// -----------------Code-----------------------
// -------------------------------------------------
videoCtrlBar.hide();
transcription.css("top", -barHeight);
showBar();
videoHover();
fadeInSpinner();
wrapFragments(transcriptionArray);
updateVol();
var waitVideoCanPlay = setInterval(function() {
	if (videoGet.readyState > 3) {
		videoCtrlBar.show();
		positionControlDiv(soundBar, soundButton);
		positionControlDiv(speedRateBar, speedButton);
		$(".video-ctnr > *:not(.spinner-outer)").add(transcription).css("opacity", 1);
		clearTimeout(spinnerTimeOut);
		spinner.hide();
		videoSpinner();
		clearInterval(waitVideoCanPlay);
	}
}, 100);
playOrPauseBtn.click(playOrPause);
video.click(playOrPause);
video.one('timeupdate', function() {
	loadedProgInterval();
});
video.on('seeking', function() {
	loadedProg();
	displayTime();
	highlightFragment(transcriptionArray);

});
video.on("waiting", function() {
	loadedProg();
	clearInterval(updateCurrentTime);
	fadeInSpinner();
	video.one("timeupdate", function() {
		displayTimeInterval();
		clearTimeout(spinnerTimeOut);
		spinner.hide();
	});
});
video.on("ended", function() {
	playOrPauseBtn.find("img").attr("src", "svgs/replay.svg");
	body.css("cursor", "auto");
	showBar();
	clearInterval(updateCurrentTime);
	outerVideoProg.on('click.afterEnd', function(){
		playOrPauseBtn.find("img").attr("src", "svgs/play.svg");
		outerVideoProg.off('click.afterEnd');
		playOrPauseBtn.off('click.afterEnd');
		console.log("afaa");
	});
	playOrPauseBtn.on('click.afterEnd', function(){
		outerVideoProg.off('click.afterEnd');
		playOrPauseBtn.off('click.afterEnd');
		console.log("afaa");
	});
});
video.on('timeupdate', function() {
	currentProgGet();
	highlightFragment(transcriptionArray);
});
video.on("volumechange", function() {
	updateVol();
});
for (var i = 0; i < videoGet.textTracks.length; i++) {
	videoGet.textTracks[i].mode = 'hidden';
}
captionsBtn.click(function() {
	var trackGet = videoGet.textTracks[0];
	if (trackGet.mode == 'hidden') {
		trackGet.mode = 'showing';
		captionsBtn.find('span').addClass('active');
	} else {
		trackGet.mode = 'hidden';
		captionsBtn.find('span').removeClass('active');
	}
});
fullScreenBtn.click(toggleFullScreen);
outerVideoProg.mousedown(function(event) {
	event.preventDefault();
	currentProgSet(event);
	clickingProg = true;
});
$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange MSFullscreenChange", function() {
	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		videoCtrlBar.add(video).add(videoCtnr).removeClass("js-video-full");
		videoCtrlBar.css("position", "relative");
		videoCtrlBar.removeClass("js-godown");
		videoCtnr.height("auto");
		video.removeClass("js-vertical-center");
		videoCtnr.css("background", "none");
		body.css("cursor", "auto");
		showBar();
		fullScreenBtn.find('img').attr('src', "svgs/fullscreen.svg");
		clearTimeout(fadeTimer);
		videoSpinner();
	} else {
		videoCtrlBar.add(video).add(videoCtnr).addClass("js-video-full");
		videoCtrlBar.css("position", "absolute");
		videoCtrlBar.addClass("js-godown");
		videoCtnr.height("100vh");
		video.addClass("js-vertical-center");
		videoCtnr.css("background", "black");
		showBar();
		fullScreenBtn.find('img').attr('src', "svgs/fullscreen-exit.svg");
		fadeElemInFull();
		spinner.css("top", "50%");
		spinner.width(70);
		spinner.height(70);
	}
	positionControlDiv(soundBar, soundButton);
	positionControlDiv(speedRateBar, speedButton);
	loadedProg();
	currentProgGet();
});
$(document).mousedown(function() {
	clicking = true;
});
$(document).mouseup(function(e) {
	if (cursorIsNotOver(e, soundBar) && clickingVol) {
		soundBar.fadeOut();
		body.css('cursor', 'auto');
		if (!videoGet.paused) {
			if (cursorIsNotOver(e, video)) {
				hideBar();
			}
		}
	}
	body.css('cursor', 'auto');
	clickingVol = false;
	clickingProg = false;
	clicking = false;
});
$(document).mousemove(function(event) {
	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		videoHover();
	} else {
		if (event.pageX !== currentPos[0] && event.pageY !== currentPos[1]) {
			currentPos = [event.pageX, event.pageY];
			video.add(videoCtrlBar).off("mouseenter mouseleave");
			fadeElemInFull();
		}
	}
	if (clickingVol) {
		setVol(event);
		body.css('cursor', 'pointer');
	}
	if (clickingProg) {
		currentProgSet(event);
		body.css('cursor', 'pointer');
	}
});
var waitDurationLoad = setInterval(function() {
	if (videoGet.readyState > 0) {
		videoDuration = videoGet.duration;
		var durationTimeConverted;
		durationTimeConverted = convertTime(videoDuration);
		totalTimePlace.text(durationTimeConverted);
		clearInterval(waitDurationLoad);
	}
}, 100);
$(window).resize(function() {
	positionControlDiv(soundBar, soundButton);
	positionControlDiv(speedRateBar, speedButton);
	updateVol();
});
videoGet.defaultPlaybackRate = 1;
speedRateBar.find('span').click(function(e) {
	var speed = $(e.target);
	var speedShow = speedButton.find('span');
	var speedTxt = speed.text();
	var speedNum = parseFloat(speedTxt, 10);
	setNewRate(speedNum);
	speedShow.text(speedNum + "x");
	speedRateBar.find('span').removeClass('active-speed');
	speed.addClass('active-speed');
});
soundButton.click(function() {
	var videoMut = videoGet.muted;
	if (videoMut) {
		videoGet.muted = false;
	} else {
		videoGet.muted = true;
	}
});
soundButton.hover(function() {
	if (!clicking) {
		soundBar.fadeIn();
	}
}, function(e) {
	if (!clickingVol) {
		if (cursorIsNotOver(e, soundBar)) {
			soundBar.fadeOut();
		}
	}
});
soundBar.mousedown(function(event) {
	videoGet.muted = false;
	clickingVol = true;
	setVol(event);
	event.preventDefault();
});
soundBar.hover(function() {
	cursorOnSoundBar = true;
}, function() {
	cursorOnSoundBar = false;
});
soundBar.mouseleave(function(e) {
	if (cursorIsNotOver(e, soundButton) && !clickingVol) {
		soundBar.fadeOut();
	}
});
transcription.find('span').click(function() {
	var clickedFragment = $(this).text();
	for (var i = 0; i < transcriptionArray.length; i++) {
		var fragment = transcriptionArray[i].fragment;
		var start = transcriptionArray[i].start;
		var fragExist = transcription.text().search(fragment);
		if (fragment == clickedFragment) {
			videoGet.currentTime = start;
			currentProgGet();
			return;
		}
	}
});
speedButton.hover(function() {
	if (!clicking) {
		speedRateBar.fadeIn();
	}
}, function(e) {
	if (cursorIsNotOver(e, speedRateBar)) {
		speedRateBar.fadeOut();
	}
});
speedRateBar.mouseleave(function(e) {
	if (cursorIsNotOver(e, speedButton)) {
		speedRateBar.fadeOut();
	}
});
// -------------------------------------------------
// -------------------------------------------------
// -----------------End Code-----------------------
// -------------------------------------------------
