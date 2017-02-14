

// Things to do

// Decrease size of control on small screens

// update volume icon according to volume level

// insert other controlers, such as cc speen

// implement close caption and highlight transcription while playing



var videoCtrlBar = $(".video-ctrl-bar");
var barHeight = videoCtrlBar.outerHeight();
var video = $(".main-video");
var videoCtnr = $(".video-ctnr");
var videoGet = $(".main-video").get(0);
var videoCtnrGet = $(".video-ctnr").get(0);
var fadeTimer;





// ------Functions-------
function showBar() {
    videoCtrlBar.css("top", -barHeight);
    videoCtrlBar.css("opacity", 1);
}


function hideBar() {
    videoCtrlBar.css("top", -27);
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


  // $('.video-ctrl-bar, .main-video, .video-ctnr').toggleClass("js-video-full");

  // video.toggleClass("js-video-full");

}

function fadeElemInFull() {

        if (!videoGet.paused) {

                // If is playing

                
              $("body").css("cursor", "auto");
                showBar();
            clearTimeout(fadeTimer);
            fadeTimer = setTimeout(function() {
                hideBar();
                $("body").css("cursor", "none");
            }, 3300);

        } else {
            // If is not playing
            clearTimeout(fadeTimer);


        }
    }

function videoHover() {
$(".main-video, .video-ctrl-bar").hover(showBar,        
        function() {
        if(!videoGet.paused && !clicking) {
            hideBar();
        }

    });
}
// -------Code-----

$(showBar);


$("#video-play-pause").click( function() {

	if(videoGet.paused) {

	videoGet.play();
	$(this).find('img').attr('src', "svgs/pause.svg");


} else {



	videoGet.pause();
	$(this).find('img').attr('src', "svgs/play.svg");
    showBar();

	}

});

$("#fullscreen").click( function() {

    // do something when sound is clicked


});




$(".transcription").css("top", -barHeight);

$("#fullscreen").click(toggleFullScreen);



videoHover();

$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange MSFullscreenChange", function() {

    if(!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {

            $('.video-ctrl-bar, .main-video, .video-ctnr').removeClass("js-video-full");
            videoCtrlBar.css("position", "relative");
            videoCtrlBar.removeClass("js-godown");
            videoCtnr.height("auto");
            video.removeClass("js-vertical-center");
            videoCtnr.css("background", "none");
            $("body").css("cursor", "auto");
            showBar();
            $("#fullscreen").find('img').attr('src', "svgs/fullscreen.svg");
            clearTimeout(fadeTimer);


    } else {

          $('.video-ctrl-bar, .main-video, .video-ctnr').addClass("js-video-full");
              videoCtrlBar.css("position", "absolute");
              videoCtrlBar.addClass("js-godown");
              videoCtnr.height("100vh");
              video.addClass("js-vertical-center");
              videoCtnr.css("background", "black");
              showBar();
              $("#fullscreen").find('img').attr('src', "svgs/fullscreen-exit.svg");
              fadeElemInFull();


    }

    positionVol();

}); 

var currentPos = [];

// var last_moved=0;
$(document).mousemove(function(e) {



    

        if (!document.fullscreenElement && 
            !document.mozFullScreenElement && 
            !document.webkitFullscreenElement && 
            !document.msFullscreenElement) {

                    // If is not in fullscreen
                videoHover();
                    // do something
        } else {

            // var now = e.timeStamp; 
            // if (now - last_moved > 1000) {

            if(e.pageX !== currentPos[0] && e.pageY !== currentPos[1]) {
                currentPos = [e.pageX,e.pageY];

                $(".main-video, .video-ctrl-bar").off("mouseenter mouseleave");
                    // If is in fullscreen
            // showBar();
                fadeElemInFull();

            // last_moved = now;
            // }



        } 
    } 

});


// Video Progress

var durationData;
var videoDuration;
waitDurationLoad = setInterval(

    function() {

        if(videoGet.readyState > 0) {

            videoDuration = videoGet.duration;
            console.log(videoDuration);

            clearInterval(waitDurationLoad);
        } 
    }, 100);



function loadedProg() {

    var videoTimeRange = videoGet.buffered;

    // console.log(videoTimeRange.end(0));

    // for(var i=0; i < videoTimeRange.length; i++) {

    //     if(videoTimeRange.start(i) <= videoGet.currentTime) {


                // alert("asdfaf");
                var progFull = $('#video-progress').width();
                var loadedFraction = videoTimeRange.end(videoTimeRange.length - 1) / videoDuration;

                $(".progress-loaded").width(loadedFraction * progFull);

             // console.log(videoTimeRange.end(i));

    //     }

    // }

}


function currentProg() {
    var progFull = $('#video-progress').width();
    // alert(progFull);
    var progFraction = videoGet.currentTime / videoDuration;
    // alert(progFraction);
    $(".progress-current").width(progFraction * progFull);
}



$('#video-progress').mousedown(

    function(e) {

        var progFull = $('#video-progress').width();
        var xRelPos = e.pageX - $(this).offset().left;
        var progFraction = xRelPos / progFull;
        $(".progress-current").width(progFraction * progFull);
        videoGet.currentTime = progFraction * videoDuration;

    }

    );


video.on("timeupdate", function(){

    loadedProg();
    currentProg();


});




// buffer

// -----end-----


// --------Volume------
var clicking = false;
var sFull = $(".sound-level").height();

function positionVol() {

    var soundPosY = $("#video-sound").position().top;
    var soundPosX = $("#video-sound").position().left;
    var soundWidth = $("#video-sound").outerWidth();
    var sOuterWidth = $(".sound-outer").outerWidth();
    var sOuterHeight = $(".sound-outer").outerHeight()
    var levelPosX = soundPosX + ((soundWidth - sOuterWidth) / 2);

    // alert(levelPosX);

    $(".sound-outer").css("top", soundPosY - (sOuterHeight - 1));
    $(".sound-outer").css("left",levelPosX);



}

$(positionVol);


$(window).resize(positionVol);

function setVol(event) {
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
    var videoVol = $(".main-video").get(0).volume;
    var newHeight = videoVol * sFull;
    var videoMut = $(".main-video").get(0).muted;


    if (videoMut || videoVol == 0) {
        $(".sound-current").height(0);
        $("#mute-path, #scnd-vlm-path").show();

        // botão de mudo
    } else {

        $(".sound-current").height(newHeight);
        $("#mute-path").hide();

        if (videoVol <= .5) {
            $("#scnd-vlm-path").hide();
        } else {
            $("#scnd-vlm-path").show();
        }

        // botao correspondente
    }

}

updateVol();




// $(".sound-outer").click(setVol);

// function clearSelection() {
//     if ( document.selection ) {
//         document.selection.empty();
//         // alert("selection");
//     } else if ( window.getSelection ) {
//         // var fafa = window.getSelection().toString();
//         window.getSelection().removeAllRanges();
//         // alert(fafa);
//     }
// }

$(".sound-outer").mousedown(function(event) {

    $(".main-video").get(0).muted = false;
    clicking = true;
    setVol(event);
    event.preventDefault();
    // alert("sdfa");
    // clearSelection(); 
});

$("#video-sound").click(function(){

    var videoMut = $(".main-video").get(0).muted;
    if(videoMut) {

        videoGet.muted = false;

    } else {

        videoGet.muted = true;
    }

});


// $("#video-sound").mousedown(function() {

//     if(!videoGet.muted) {
//         videoGet.muted = true;
//     } else {

//         videoGet.muted = false;
//     }

// });


$(document).mouseup(function() {
    

    if ($('.sound-outer').is(":not(:hover)") && clicking) {

            $(".sound-outer").hide();
            $('body').css('cursor', 'initial');
            // clearSelection();
            if(!videoGet.paused) {

                hideBar();
        }

    }

    clicking = false;

});
$(document).mousemove(function(event) {
    if (clicking) {
        setVol(event);
        $('body').css('cursor', 'ns-resize');
    }
});
$(".main-video").on("volumechange", function() {

        updateVol();

});



$(".sound-outer").hide();
// $("#video-sound, .sound-level").hover(

//     function() {

//         $(".sound-level").show();
//         $(".sound-level").css("opacity", "1");
//     }, 

//     function() {

//         if (!clicking) {
//         $(".sound-level").hide();
//         $(".sound-level").css("opacity", "0");
//         }
//     }



//     );

$("#video-sound").hover(

        function() {

        if(!clicking) {
        $(".sound-outer").fadeIn();
        }
        
    }, 

    function() {

        if($('.sound-outer').is(":not(:hover)") && !clicking) {

        $(".sound-outer").fadeOut();
        }
    }



    );


$(".sound-outer").mouseleave(

    function(){

        if($('#video-sound').is(":not(:hover)") && !clicking) {
            $(".sound-outer").fadeOut();
        }


    }

    );


// --------------------End-----------------
var videoTimeRange = videoGet.skeelable;


video.on("timeupdate", function(){




for (var i = 0; i < videoTimeRange.length; i++) {

    var tR = videoTimeRange[i];

    console.log(tR);
}




});