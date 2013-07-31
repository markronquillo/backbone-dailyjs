define(['config'], 

function(config) {
    'use strict'
    var app;

    function ApiManager(_app) {
        app = _app;
        this.loadGapi();
    }

    _.extend( ApiManager.prototype, Backbone.Events);

    // Init function will load the tasks api with 'gapi.client.load'
    ApiManager.prototype.init = function() {
        var self = this;

        gapi.client.load('tasks', 'v1', function() { /* Loaded */ });

        function handleClientLoad() {
            gapi.client.setApiKey( config.apiKey );
            window.setTimeout(checkAuth, 100);
        }

        function checkAuth() {
            gapi.auth.authorize({ client_id: config.clientId, scope: config.scopes, immediate: true }, handleAuthResult);
        }

        function handleAuthResult(authResult) {
            var authTimeout;

            if (authResult && !authResult.error) {
                // Schedule a check when the authentication token expires
                if (authResult.expires_in) {
                    authTimeout = (authResult.expires_in - 5 * 60) * 1000;
                    setTimeout(checkAuth, authTimeout);
                }

                $('#sign-in-container').hide();
                $('#signed-in-container').show();

                self.trigger('ready');

            } else {
                if (authResult && authResult.error) {
                    console.log('Unable to sign in', authResult.error);
                }

                //app.views.auth.$el.show();
                $('#sign-in-container').show();
            }
        }

        this.checkAuth = function() {
            gapi.auth.authorize({ client_id: config.clientId, scope: config.scopes, immediate: false }, handleAuthResult);
        };

        handleClientLoad();
    };

    // The loadGapi method loads the Google Javascript using RequireJS.
    // Once it is loaded it will run the init function
    ApiManager.prototype.loadGapi = function() {
        var self = this;

        // Don't load gapi if it is already present
        if ( typeof gapi != "undefined" ) {
            return this.init();
        }

        require(['https://apis.google.com/js/client.js?onload=define'], function() {
            // poll until gapi is ready
            function checkGapi() {
                if (gapi && gapi.client) {
                    self.init();
                } else {
                    setTimeout(checkGapi, 100);
                }
            }

            checkGapi();
        });
    };

    Backbone.sync = function(method, model, options)  {
        var requestContent = {};
        options || (options = {});

        switch(model.url) {
            case "tasks": 
                requestContent.task = model.get("id");
                break;
            case "tasklists":
                requestContent.tasklist = model.get("id");
                break;
        }

        switch(method) {
            case 'create': 
                requestContent['resource'] = model.toJSON();
                request = gapi.client.tasks[model.url].insert(requestContent);
                Backbone.gapiRequest( request, method, model, options );
                break;
            case 'update':
                requestContent['resource'] = model.toJSON();
                request = gapi.client.tasks[model.url].update(requestContent);
                Backbone.gapiRequest( request, method, model, options );
                break;
            case 'delete':
                requestContent['resource'] = model.toJSON();
                request = gapi.client.tasks[model.url].delete(requestContent);
                Backbone.gapiRequest( request, method, model, options );
                break;
            case 'read':
                var request = gapi.client.tasks[model.url].list(options.data);
                Backbone.gapiRequest( request,  method, model, options );
                break;
        }
    };

    Backbone.gapiRequest = function(request, method, model, options) {
        var result;
        request.execute( function(res) {
            if ( res.error ) {
                if (options.error) {
                    console.log(res);
                    options.error(res);
                }
            } else if ( options.success ) {
                if (res.items) {
                    result = res.items;
                } else {
                    result = res;
                }
                options.success( result, true, request );
            }
        });
    };
            
    return ApiManager;
});
