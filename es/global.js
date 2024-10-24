var screen;
let colors = ["#34bfc8", "#ffffff", "#F8B229", "#EA4630", "#BB2528", "#F0CCBD", "#326AB4"];
var totalAvatars;
var pendingAvatars;
var loaded = false;

$(window).on("load", function() {

    loaded = true;

    $("#loading").hide();
    $("#container").show();

    $(window).resize(function () {
        onWindowResize();
    });

    onWindowResize();

    setInterval(onWindowResize, 1000);

    initAvatars();

    /*$("#finalMessage").fadeIn(3000);
    $("#finalMessage .fadeIn").fadeIn(3000);
    $("#container").css("filter", "blur(5px)");
    $("#finalMessage .message img").css("height", screen.GAME_VIEWPORT_HEIGHT - $("#finalMessage .play-again").height() - 80 + "px");*/


    $("#finalMessage .play-again").click(function (){
        location.reload();
    });


    $("#language").click(function (){
        if($(this).hasClass("es")){
            window.location.href = '../es/index.html';
        }else{
            window.location.href = '../en/index.html';
        }
    });


    var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    if (mobile) {
        $("#unsupported-resolution .desktop").hide();
        $("#instructions .desktop").hide();
    } else {
        $("#unsupported-resolution .mobile").hide();
        $("#instructions .mobile").hide();
    }

    // hide address
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});


let onWindowResize = function(){

    screen = {
        GAME__VIEWPORT_ORIGINAL_WIDTH: 1024,
        GAME__VIEWPORT_ORIGINAL_HEIGHT: 768,
        GAME_VIEWPORT_WIDTH: $( window ).width(),
        GAME_VIEWPORT_HEIGHT: $( window ).height()
    };

    screen.GAME_HSCALE_FACTOR = screen.GAME_VIEWPORT_WIDTH / screen.GAME__VIEWPORT_ORIGINAL_WIDTH;
    screen.GAME_VSCALE_FACTOR = screen.GAME_VIEWPORT_HEIGHT / screen.GAME__VIEWPORT_ORIGINAL_HEIGHT;


    if(screen.GAME_VIEWPORT_WIDTH / screen.GAME_VIEWPORT_HEIGHT >= screen.GAME__VIEWPORT_ORIGINAL_WIDTH / screen.GAME__VIEWPORT_ORIGINAL_HEIGHT){
        $("#container").show();
        if(pendingAvatars === 0) $("#finalMessage").show();
        if(!loaded) $("#loading").show();
        $("#unsupported-resolution").hide();
    }else{
        $("#container").hide();
        $("#finalMessage").hide();
        $("#loading").hide();
        $("#unsupported-resolution").show();
    }

    $(".world-object").css("transform", "scale("+ screen.GAME_VSCALE_FACTOR +")");

    positionEverything();
};


var positionEverything = function() {
    $("#tree").css("top", screen.GAME_VIEWPORT_HEIGHT - $("#tree .asset").height() * screen.GAME_VSCALE_FACTOR + "px");
    $("#tree").css("left", screen.GAME_VIEWPORT_WIDTH / 2 - $("#tree .asset").width() / 2 * screen.GAME_VSCALE_FACTOR + "px");

    $("#new_year").css("top", screen.GAME_VIEWPORT_HEIGHT - ($("#new_year .asset").height() + 50) * screen.GAME_VSCALE_FACTOR + "px");
    $("#new_year").css("left", 80 * screen.GAME_VSCALE_FACTOR + "px");

    $("#finalMessage").css("top",  screen.GAME_VIEWPORT_HEIGHT / 2 - $("#finalMessage").height() / 2 + "px");
    $("#finalMessage").css("left", screen.GAME_VIEWPORT_WIDTH / 2 - $("#finalMessage").width() / 2 + "px");

    $("#finalMessage .message img").css("height", screen.GAME_VIEWPORT_HEIGHT - $("#finalMessage .play-again").height() - 80 + "px");

    if(pendingAvatars == 0){
        $("#logo-star").css("top", $("#tree").offset().top - $("#logo-star").height() / 2 * screen.GAME_VSCALE_FACTOR);
        $("#logo-star").css("left", parseInt($("#tree").offset().left) + ($("#tree").width() - $("#logo-star").width()) / 2 * screen.GAME_VSCALE_FACTOR);
    }

    $(".avatar.completed").each(function(){
        $(this).css("left", parseInt($("#tree").offset().left) + parseInt($(this).attr("posX")) * screen.GAME_VSCALE_FACTOR - $(this).width() / 2 * screen.GAME_VSCALE_FACTOR);
        $(this).css("top", parseInt($("#tree").offset().top) + parseInt($(this).attr("posY")) * screen.GAME_VSCALE_FACTOR - $(this).height() / 2 * screen.GAME_VSCALE_FACTOR);
    });
};


var startAvatarAnimation = function(avatar, hasDelay){

    if($(avatar).hasClass("completed")) return;

    var initPosX = 100 + Math.random() * (screen.GAME_VIEWPORT_WIDTH - 200 - $(avatar).width());

    let speed, delay;

    speed = parseInt(Math.random() * 8 + 4);

    if(!hasDelay) {
        delay = parseInt(Math.random() * 16);
    }else{
        delay = 0;
    }


    TweenLite.fromTo(avatar, speed,
        {
            ease: Power0.easeNone,
            left: initPosX,
            top: -150,
            scaleX: screen.GAME_VSCALE_FACTOR,
            scaleY: screen.GAME_VSCALE_FACTOR,
        },
        {
            ease: Power0.easeNone,
            left: initPosX,
            top: screen.GAME_VIEWPORT_HEIGHT + 100,
            scaleX: screen.GAME_VSCALE_FACTOR,
            scaleY: screen.GAME_VSCALE_FACTOR,
            onComplete: function(){
                startAvatarAnimation(avatar, true)
            }
        }).delay(delay);
};

var initAvatars = function(){

    totalAvatars = $(".avatar").length;
    pendingAvatars = totalAvatars;

    $(".avatar").each(function(index){
        startAvatarAnimation($(this));
    });

    $(".avatar").on("click mouseover touchmove mouseenter mouseleave touchstart", function(){

        TweenLite.killTweensOf($(this));

        $(this).unbind();

        $(this).addClass("completed");

        let animateToX = parseInt($("#tree").offset().left) + parseInt($(this).attr("posX")) * screen.GAME_VSCALE_FACTOR - $(this).width() / 2 * screen.GAME_VSCALE_FACTOR;
        let animateToY = parseInt($("#tree").offset().top) + parseInt($(this).attr("posY")) * screen.GAME_VSCALE_FACTOR - $(this).height() / 2 * screen.GAME_VSCALE_FACTOR;

        TweenLite.fromTo($(this), 3,
            {
                ease: Elastic.easeOut,
                left: $(this).css("left"),
                top: $(this).css("top"),
                scaleX: screen.GAME_VSCALE_FACTOR,
                scaleY: screen.GAME_VSCALE_FACTOR,
            },
            {
                ease: Elastic.easeOut,
                left: animateToX,
                top: animateToY,
                scaleX: screen.GAME_VSCALE_FACTOR,
                scaleY: screen.GAME_VSCALE_FACTOR,
                onComplete: function(){
                    if(--pendingAvatars == 0){
                        completeTree();
                    }else if(totalAvatars - pendingAvatars == 3){
                        $("#instructions").fadeOut(2000)
                    }
                }
            });
    });


};

var completeTree = function(){

    TweenLite.set($(this), {clearProps:"all"});

    let animateToX = parseInt($("#tree").offset().left) + ($("#tree").width() - $("#logo-star").width()) / 2 * screen.GAME_VSCALE_FACTOR;
    let animateToY = $("#tree").offset().top - $("#logo-star").height() / 2 * screen.GAME_VSCALE_FACTOR;

    $("#logo-star").show();

    TweenLite.to($("#logo-star"), 3, {
        ease: Sine.easeOut,
        left: animateToX,
        top: animateToY,
        scaleX: screen.GAME_VSCALE_FACTOR,
        scaleY: screen.GAME_VSCALE_FACTOR,
        onComplete: function(){

            snowEntity = "&starf;";
            snowColor = colors;

            setInterval(function(){
                $(".avatar").each(function(index) {
                    $(this).css("border-color", colors[Math.floor(Math.random() * colors.length)]);
                });

            }, 300);

            setTimeout(function(){
                $("#finalMessage").fadeIn(3000);
                $("#finalMessage .fadeIn").fadeIn(3000);
                $("#container").css("filter", "blur(5px)");
                $("#finalMessage .message img").css("height", screen.GAME_VIEWPORT_HEIGHT - $("#finalMessage .play-again").height() - 80 + "px");
            }, 3000)

        }});

};
