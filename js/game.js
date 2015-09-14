function Game() {
    var g = this;
    this.eleGame = $('#game-main');
    this.hooks = [];

    this.paused = true;

    g.events = {
        hooks: {},
        mouse: {x: 0, y: 0},
        init: function() {
            var me = this;

            this.cursor = $('<img id="cursor" src="./res/img/cursor.gif" height="32" width="32">');
            g.eleGame.append(this.cursor);

            $(document).on('mousedown', '#game-main', function(e) {
                e.preventDefault();
                me.fireEvent('mousedown', e);
            });

            $(document).on('click', '#game-main', function(e) {
                e.preventDefault();
                me.fireEvent('click', e);
            });

            $(window).mousemove(function(e) {
                e.preventDefault();
                !g.viewport.hasPointerLock ? me.updateMouse(e) : null;
                me.fireEvent('mousemove', e);
            });

            $(document).on('mouseup', '#game-main', function(e) {
                e.preventDefault();
                me.fireEvent('mouseup', e);
            });

            $(document).on('keyup', function(e) {
                me.fireEvent('keyup', e);
            });

            $(document).on('keydown', function(e) {
                me.fireEvent('keydown', e);
            });

            $(window).resize(function() {
                me.fireEvent('resize', undefined);
            });

            $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', '#game-main', function(e) {
                me.fireEvent('fullscreenchange', e);
            });

            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            }, false);

            document.addEventListener('pointerlockchange', function(e) {
                me.pointerLockTrap(e);
            }, false);

            document.addEventListener('mozpointerlockchange', function(e) {
                me.pointerLockTrap(e);
            }, false);

            document.addEventListener('webkitpointerlockchange', function(e) {
                me.pointerLockTrap(e);
            }, false);
        },

        updateMouse: function(e) {
            if (g.viewport.hasPointerLock) {
                var movementX = e.movementX ||
                    e.mozMovementX ||
                    e.webkitMovementX ||
                    0;

                var movementY = e.movementY ||
                    e.mozMovementY ||
                    e.webkitMovementY ||
                    0;

                g.events.mouse.x += movementX;
                g.events.mouse.y += movementY;


            } else {
                g.events.mouse.x = e.pageX;
                g.events.mouse.y = e.pageY;
            }

            if (g.events.mouse.x < 0) {
                g.events.mouse.x = 0;
            } else if (g.events.mouse.x > g.viewport.width) {
                g.events.mouse.x = g.viewport.width;
            }

            if (g.events.mouse.y < 0) {
                g.events.mouse.y = 0;
            } else if (g.events.mouse.y > g.viewport.height) {
                g.events.mouse.y = g.viewport.height;
            }

            g.events.cursor.css('left', g.events.mouse.x - 13);
            g.events.cursor.css('top', g.events.mouse.y - 7);
        },

        pointerLockTrap: function(e) {
            if (document.pointerLockElement === g.eleGame[0] ||
                document.mozPointerLockElement === g.eleGame[0] ||
                document.webkitPointerLockElement === g.eleGame[0]) {
                this.e_funct = function(e) { g.events.updateMouse(e); }
                document.addEventListener('mousemove', this.e_funct, false);
            } else {
                document.removeEventListener('mousemove', this.e_funct, false);
            }
            this.fireEvent('pointerlockchange');
        },

        hook: function(eventType, target) {
            this.hooks[eventType] == undefined ? this.hooks[eventType] = []: null;
            this.hooks[eventType].push(target);
        },

        fireEvent: function(eventType, e) {
            for (var i in this.hooks[eventType]) {
                this.hooks[eventType][i](e);
            }
        }
    }

    g.viewport = {
        init: function() {
            this.fullscreenMode = false;
            this.pointerLockMode = false;

            this.hasFullscreen = false;
            this.hasPointerLock = false;

            this.width = g.eleGame.width();;
            this.height = g.eleGame.height();;

            g.events.hook('pointerlockchange', this.pointerLockChanged);
            g.events.hook('fullscreenchange', this.fullScreenChanged);
            g.events.hook('unpaused', this.unpaused);
            g.events.hook('keydown', this.escaped);
            g.events.hook('resize', this.windowResized);
        },

        start: function(fullscreen, pointerlocked) {
            if (fullscreen) {
                this.fullscreenMode = true;
                this.requestFullscreen();
            }
            if (pointerlocked) {
                this.pointerLockMode = true;
                this.requestPointerLock();
            }
            this.width = g.eleGame.width();
            this.height = g.eleGame.height();
        },

        windowResized: function(e) {
            g.delay(function() {
                g.viewport.resize();
            }, 500);
        },

        resize: function() {
            this.width = g.eleGame.width();
            this.height = g.eleGame.height();
            for (var l in g.layers) {
                g.layers[l].windowResized();
            }
        },

        escaped: function(e) {
            console.log('here ' + g.paused);
            !g.paused && e.keyCode == 27 ? g.pause() : null;
        },

        unpaused: function() {
            console.log('unpaused : ' + g.viewport.fullscreenMode + ' '+ g.viewport.pointerLockMode);
            g.viewport.fullscreenMode ? g.viewport.requestFullscreen() : null;
            g.viewport.pointerLockMode ? g.viewport.requestPointerLock() : null;
        },

        pointerLockChanged: function() {
            g.viewport.hasPointerLock =  (
                document.pointerLockElement === g.eleGame[0] ||
                document.mozPointerLockElement === g.eleGame[0] ||
                document.webkitPointerLockElement === g.eleGame[0]);

            !g.viewport.hasPointerLock && g.viewport.pointerLockMode ? g.pause() : null;
        },

        fullScreenChanged: function() {
            g.viewport.hasFullscreen = (
                document.fullscreenElement === g.eleGame[0] ||
                document.mozFullscreenElement === g.eleGame[0] ||
                document.webkitFullscreenElement === g.eleGame[0]);

            !g.viewport.hasFullscreen && g.viewport.fullscreenMode ? g.pause() : null;
        },

        requestFullscreen: function() {
            var ele = g.eleGame[0];
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            } else if (ele.msRequestFullscreen) {
                ele.msRequestFullscreen();
            } else if (ele.mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            } else if (ele.webkitRequestFullscreen) {
                ele.webkitRequestFullscreen();
            }
        },

        requestPointerLock: function() {
            var ele = g.eleGame[0];
            if (ele.requestPointerLock) {
                ele.requestPointerLock();
            } else if (ele.mozRequestPointerLock) {
                ele.mozRequestPointerLock();
            } else if (ele.webkitRequestPointerLock) {
                ele.webkitRequestPointerLock();
            }
        }
    }

    g.resources = {
        init: function() {

        }
    }

    g.layers = {};

    this.layer = function(name, props) {
        this.name = name;

        props.left ? this.left = props.left : this.left = 0;
        props.top ? this.top = props.top : this.top = 0;
        props.z ? this.z = props.z : this.z = 0;
        props.fullscreen ? this.fullscreen = props.fullscreen : this.fullscreen = true;
        if (!props.fullscreen && props.width && props.height) {
            this.width = props.width;
            this.height = props.height;
        } else {
            this.width = g.viewport.width;
            this.height = g.viewport.height;
        }
        props.refresh ? this.refresh = props.refresh : this.refresh = false;
        props.refreshRate ? this.refreshRate = props.refreshRate : this.refreshrate = 1;

        this.ele = $('<canvas id="can-' + name + '" class="game-canvas">');
        this.canvas = this.ele[0];
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        this.ele.css('position', 'absolute');

        if (this.fullscreen) {
            this.ele.css('width', '100%');
            this.ele.css('height', '100%');
        } else {
            this.ele.css('width', this.width);
            this.ele.css('height', this.height);
        }

        this.ele.css('left', this.left + 'px');
        this.ele.css('top', this.top + 'px');
        this.ele.css('z-index', this.z);

        g.eleGame.append(this.ele);

        console.log('added layer?');
    }
    this.layer.prototype.windowResized = function(e) {
        if (this.fullscreen) {
            console.log('resizing me');
            this.width = g.viewport.width;
            this.height = g.viewport.height;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
    }
    this.layer.prototype.update = function(delta) {
        console.log('clear layer');
    }

    g.draw = {
        init: function() {
            var bkg = {
                fullscreen: true
            }
            var sprites = {
                fullscreen: true,
                refresh: true,
                z: 10,
            }

            g.layers['background'] = new g.layer('background', bkg);
            g.layers['sprites'] = new g.layer('sprites', sprites);

        },
        drawMap: function(mapData) {

        }
    }

    g.events.init();
    g.viewport.init();
    g.draw.init();

    g.start = function(fullscreen, pointerlocked) {
        g.viewport.start(fullscreen, pointerlocked);
        $('html').css('cursor', 'none');
        $('button').css('cursor', 'none');
        $('input').css('cursor', 'none');
    },

    g.pause = function() {
        this.paused = true;
        g.events.fireEvent('paused', g);
        $('#haze').show(100, function() {
            $('#game-main').css('pointer-events', 'none');
            $('#menu-paused').show();
            $('#menu').fadeIn(750);
        });
        console.log('PAUSED');
    }

    g.unpause = function() {
        $('#main-title').html('Mars Outpost');
        g.events.fireEvent('unpaused', g);
        $('#haze').hide();
        $('#menu').hide();
        $('#menu-paused').hide();
        g.paused = false;
        console.log('UNPAUSED');
    }

    g.delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    /* add a hook to the main game loop */
    g.hook = function(hook, priority) {
        if (typeof hook === 'function') {
            this.hooks.push(hook);
            return true;
        }
        return false;
    }


}

$(window).ready(function() {
    window.g = new Game();
});
