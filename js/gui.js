var settingsShowing = false;

$(document).on('click', '#game-start', function(e) {
    
    var fullscreen = $('#settings-fullscreen').is(':checked');
    var pointerlocked = $('#settings-pointerlock').is(':checked'); 

    window.g.start(fullscreen, pointerlocked);
    $('#haze').fadeOut(1000, function() {
        $('#menu').hide();
        $('#menu-main').hide();
        $('#menu-settings').hide();
        settingsShowing = false;
        $('#game-main').fadeIn(1000);
    });
});

$(document).on('click', '#game-unpause', function(e) {
    var fullscreen = $('#settings-fullscreen').is(':checked');
    var pointerlocked = $('#settings-pointerlock').is(':checked'); 
    
    g.viewport.fullscreenMode = fullscreen;
    g.viewport.pointerLockMode = pointerlocked;

    window.g.unpause();
    $('#haze').fadeOut(200, function() {
        $('#menu').hide();
        $('#menu-main').hide();
        $('#menu-settings').hide();
        settingsShowing = false;
        $('#game-main').fadeIn(200, function() {
            
        });
    });
});

$(document).on('click', '#game-settings', function(e) {
    if (settingsShowing) {
        settingsShowing = false;
        $('#menu-settings').fadeOut(500);
    } else {
        settingsShowing = true;
        $('#menu-settings').fadeIn(500);
    }
});
$(document).on('click', '#game-settings-paused', function(e) {
    if (settingsShowing) {
        settingsShowing = false;
        $('#menu-settings').fadeOut(500);
    } else {
        settingsShowing = true;
        $('#menu-settings').fadeIn(500);
    }
});