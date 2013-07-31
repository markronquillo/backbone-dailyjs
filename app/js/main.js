requirejs.config({
    baseUrl: 'js',

    paths: {
        text: 'lib/text'
    },

    shim: {
        'lib/underscore.min': {
            exports: '_'
        },
        'lib/backbone.min': {
            deps: ['lib/underscore.min']
        },
        'app': {
            deps: ['lib/underscore.min', 'lib/backbone.min']
        }
    },
});

// ['app'] defines that it will load the app.js in the same directory
require(['app'], 

function(App) {
    window.bTask = new App();
});
