// -------Varables-----
var videoCtrlBar = $(".video-ctrl-bar");
var barHeight = videoCtrlBar.outerHeight();
var video = $(".main-video");
var videoCtnr = $(".video-ctnr");
var videoGet = $(".main-video").get(0);
var videoCtnrGet = $(".video-ctnr").get(0);
var fadeTimer;
var soundBar = $('.sound-outer');
var soundButton = $("#video-sound");
var playOrPauseBtn = $('#video-play-pause');
var fullScreenBtn = $("#fullscreen");
var spinner = $('.spinner-outer');
var spinnerTimeOut;
var speedRateBar = $(".speed-outer");
var speedButton = $('#video-speed');
var speedRateSpan = speedRateBar.find('span');
var videoGear = $('#video-gear');
var captionsBtn = $('#closed-caption');
var currentPos = [];
var videoDuration;
var updateCurrentTime;
var clickingVol = false;




// ------Functions-------
function showBar() {
    videoCtrlBar.css("top", -barHeight);
    videoCtrlBar.css("opacity", 1);
}


function hideBar() {
    videoCtrlBar.css("top", -32);
}


function toggleFullScreen() {


    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {

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



        $("body").css("cursor", "auto");
        showBar();
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(function() {
            hideBar();
            $("body").css("cursor", "none");
        }, 3300);

    } else {

        clearTimeout(fadeTimer);


    }
}



function fadeInSpinner() {

    spinnerTimeOut = setTimeout(function(){

    spinner.fadeIn();

    }, 500);
}



function videoHover() {
    $(".main-video, .video-ctrl-bar").hover(showBar,
        function() {
            if (!videoGet.paused && !clickingVol) {
                hideBar();
            }

        });
}


function videoSpinner() {

        spinner.css("top", video.offset().top + (video.outerHeight()/2));
        spinner.width(50);
        spinner.height(50);

}

function playOrPause() {

    if(videoGet.currentTime == videoDuration) {


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
// -------Code-----

videoCtrlBar.hide();

var waitVideoCanPlay = setInterval(

    function() {


        if (videoGet.readyState > 3) {

            videoCtrlBar.show();

            positionControlDiv(soundBar, soundButton);
            positionControlDiv(speedRateBar, speedButton);
            $(".video-ctnr > *:not(.spinner-outer), .transcription").css("opacity",1);


            clearTimeout(spinnerTimeOut);
            spinner.hide();

            videoSpinner();


            clearInterval(waitVideoCanPlay);
        }
    }, 100);





$(showBar);



playOrPauseBtn.click(playOrPause);

video.click(playOrPause);



for (var i = 0; i < videoGet.textTracks.length; i++) {
   videoGet.textTracks[i].mode = 'hidden';
}

captionsBtn.click(function(){

    var trackGet = videoGet.textTracks[0];

    if(trackGet.mode == 'hidden') {
        trackGet.mode = 'showing';
        captionsBtn.find('span').addClass('active');

    } else {

        trackGet.mode = 'hidden';
        captionsBtn.find('span').removeClass('active');
    }


});



$(".transcription").css("top", -barHeight);

fullScreenBtn.click(toggleFullScreen);



videoHover();

$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange MSFullscreenChange", function() {

    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {

        $('.video-ctrl-bar, .main-video, .video-ctnr').removeClass("js-video-full");
        videoCtrlBar.css("position", "relative");
        videoCtrlBar.removeClass("js-godown");
        videoCtnr.height("auto");
        video.removeClass("js-vertical-center");
        videoCtnr.css("background", "none");
        $("body").css("cursor", "auto");
        showBar();
        fullScreenBtn.find('img').attr('src', "svgs/fullscreen.svg");
        clearTimeout(fadeTimer);
        videoSpinner();



    } else {

        $('.video-ctrl-bar, .main-video, .video-ctnr').addClass("js-video-full");
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




$(document).mousemove(function(event) {





    if (!document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {


        videoHover();

    } else {



        if (event.pageX !== currentPos[0] && event.pageY !== currentPos[1]) {
            currentPos = [event.pageX, event.pageY];

            $(".main-video, .video-ctrl-bar").off("mouseenter mouseleave");

            fadeElemInFull();



        }
    }

});










fadeInSpinner();



var waitDurationLoad = setInterval(

    function() {



        if (videoGet.readyState > 0) {

            videoDuration = videoGet.duration;

            var durationTimeConverted;

            durationTimeConverted = convertTime(videoDuration);

            $('.video-time #total-time').text(durationTimeConverted);



            clearInterval(waitDurationLoad);


        }
    }, 100);












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
    var progFull = $('#video-progress').width();
    var loadedFraction = goodEndTime / videoDuration;

    $(".progress-loaded").width(loadedFraction * progFull);





}


function loadedProgInterval() {

    var updateProg;

    updateProg = setInterval(


        function() {

            loadedProg();


            if ($(".progress-loaded").width() == $("#video-progress").width()) {

                clearInterval(updateProg);

            }

        }, 1000

    );


}



function currentProgGet() {

    var progFraction = videoGet.currentTime / videoDuration;

    $(".progress-current").width(progFraction * $('#video-progress').width());
}




video.one('timeupdate', function(){

    loadedProgInterval();


});


video.on('seeking', function() {


    loadedProg();
    displayTime();
    highlightFragment(transcriptionArray);



});


function currentProgSet(event) {

    var progFull = $('#video-progress').width();
    var xRelPos = event.pageX - $('#video-progress').offset().left;
    var progFraction = xRelPos / progFull;
    $(".progress-current").width(progFraction * progFull);
    videoGet.currentTime = progFraction * videoDuration;

}

$('.outer-video-progress').mousedown(function(event) {

    event.preventDefault();

    currentProgSet(event);



});




video.on("waiting", function() {



    loadedProg();

    clearInterval(updateCurrentTime);

    fadeInSpinner();

    video.one("timeupdate", function() {

    displayTimeInterval();
    clearTimeout(spinnerTimeOut);
    spinner.hide();

    } );


});







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

    $(".video-time #current-time").text(currentTimeConverted);


}



function displayTimeInterval() {



    if(updateCurrentTime != undefined) {
      clearInterval(updateCurrentTime);
    }

    updateCurrentTime = setInterval(function() {

        displayTime();

    }, 1000);
}




video.on("timeupdate", currentProgGet);


video.on("ended", function() {

    playOrPauseBtn.find("img").attr("src", "svgs/replay.svg");
    $("body").css("cursor", "auto");
    showBar();
    clearInterval(updateCurrentTime);
})




// buffer

// -----end-----


// --------Volume------



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


$(window).resize(function(){
    positionControlDiv(soundBar, soundButton);
    positionControlDiv(speedRateBar, speedButton);
    updateVol();
});

function setVol(event) {
    var sFull = $(".sound-level").height();
    var offsetParent = $(".sound-level").offset().top;
    var yRelPos = sFull - (event.pageY - offsetParent);
    var volFraction = yRelPos / sFull;
    if (volFraction > .97) {
        volFraction = 1;
        yRelPos = sFull;
    } else if (volFraction < .03) {
        volFraction = 0;
        yRelPos = 0;
    }

    if (volFraction >= 0 && volFraction <= 1) {
        $(".sound-current").height(yRelPos);
        $(".main-video").get(0).volume = volFraction;
    }
}

function updateVol() {
    var sFull = $(".sound-level").height();
    var videoVol = $(".main-video").get(0).volume;
    var newHeight = videoVol * sFull;
    var videoMut = $(".main-video").get(0).muted;


    if (videoMut || videoVol == 0) {
        $(".sound-current").height(0);
        $("#mute-path, #scnd-vlm-path").show();


    } else {

        $(".sound-current").height(newHeight);
        $("#mute-path").hide();

        if (videoVol <= .5) {
            $("#scnd-vlm-path").hide();
        } else {
            $("#scnd-vlm-path").show();
        }


    }

}

updateVol();
videoGet.defaultPlaybackRate = 1;
function setNewRate(x) {

    videoGet.playbackRate = x;


}


speedRateSpan.click(function(e){

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

    var videoMut = $(".main-video").get(0).muted;
    if (videoMut) {

        videoGet.muted = false;

    } else {

        videoGet.muted = true;
    }

});





var clickingProg = false;
$(".outer-video-progress").mousedown(function() {

    clickingProg = true;

});




soundBar.mousedown(function(event) {

    $(".main-video").get(0).muted = false;
    clickingVol = true;
    setVol(event);
    event.preventDefault();

});





var clicking = false;


$(document).mousedown(function(){

    clicking = true;

});
$(document).mouseup(function(e) {



    if (cursorIsNotOver(e, soundBar) && clickingVol) {

        soundBar.fadeOut();


        $('body').css('cursor', 'auto');


        if (!videoGet.paused) {

            if (cursorIsNotOver(e, video)) {

                hideBar();
            }



        }

    }


    $('body').css('cursor', 'auto');


    clickingVol = false;
    clickingProg = false;
    clicking = false;

});
$(document).mousemove(function(event) {




    if (clickingVol) {
        setVol(event);
        $('body').css('cursor', 'pointer');
    }

    if (clickingProg) {

        currentProgSet(event);
        $('body').css('cursor', 'pointer');
    }
});


$(".main-video").on("volumechange", function() {

    updateVol();

});



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
}]


var originalText = $('.transcription').html();
var fragHighlighted;
var fragment;



function wrapFragments(array) {

   for (var i = 0; i < array.length; i++) {

        var fragment = array[i].fragment;
        var fragExist = $('.transcription').text().search(fragment);

        if(fragExist) {
        var fragWithSpan = "<span>" + fragment + "</span>";
        var newText = $('.transcription').html().replace(fragment, fragWithSpan);
        $('.transcription').html(newText);
        }

   }



}


var fragmentObj;

function highlightFragment(array) {

        var currentT = videoGet.currentTime;
        if(fragmentObj != undefined) {
        if(currentT > fragmentObj.start && currentT < fragmentObj.end) {
          return
        }
      }
        for (var i = 0; i < array.length; i++) {
                    var fragment = array[i].fragment;
                    var start = array[i].start;
                    var end = array[i].end;
                    var fragExist = $('.transcription').text().search(fragment);


            if( fragExist != -1 && currentT >= start && currentT < end  ){

            $('.transcription').find('span').removeClass('current');
            $('.transcription').find('span').filter(function(){return $(this).text() == fragment;}).addClass('current');

            fragmentObj = array[i];

            return;
        }

        }



}



wrapFragments(transcriptionArray);




$('.transcription span').click(function(){

    var clickedFragment = $(this).text();

    for (var i = 0; i < transcriptionArray.length; i++) {

                var fragment = transcriptionArray[i].fragment;
                var start = transcriptionArray[i].start;
                var fragExist = $('.transcription').text().search(fragment);

              if(fragment == clickedFragment) {

                videoGet.currentTime = start;
                currentProgGet();
                return;
              }
    }

}
);

video.on('timeupdate', function(){

    highlightFragment(transcriptionArray);

});


var cursorOnSoundBar = false;

soundBar.hover(



    function() {

        cursorOnSoundBar = true;

    },

    function() {

        cursorOnSoundBar = false;

    }


);



function cursorIsNotOver(e, element) {

    if (e.pageY < element.offset().top ||
                e.pageY > element.offset().top + element.outerHeight() ||
                e.pageX < element.offset().left ||
                e.pageX > element.offset().left + element.outerWidth()) {

        return true;
    } else {
        return false;
    }

};


speedButton.hover(

        function(){

            if(!clicking) {

        speedRateBar.fadeIn();
        }

        },

        function(e){

            if(cursorIsNotOver(e, speedRateBar)) {
        speedRateBar.fadeOut();
        }
        }


);

speedRateBar.mouseleave(

        function(e) {

        if (cursorIsNotOver(e, speedButton)) {
            speedRateBar.fadeOut();

        }


    });




soundButton.hover(

    function() {

        if (!clicking) {
            soundBar.fadeIn();
        }

    },

    function(e) {



        if (!clickingVol) {



            if (cursorIsNotOver(e, soundBar)) {


                soundBar.fadeOut();

            }



        }

    }



);



soundBar.mouseleave(

    function(e) {

        if (cursorIsNotOver(e, soundButton) && !clickingVol) {
            soundBar.fadeOut();

        }


    }

);



// --------------------End-----------------
