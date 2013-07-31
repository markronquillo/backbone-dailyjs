define([], function() {
    var config = {};
    config.apiKey = 'AIzaSyCTafTHbTtr8sPp_m4tYK7vw0ZzJ74817o';
    config.scopes = 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile';
    config.clientId = '1041338361619.apps.googleusercontent.com';

    _.templateSettings = {
        interpolate:  /\{\{(.+?)\}\}/g
    }; // this tells underscore's templating system to use double curly braces for inserting value, otherwise known as interpolation

    return config;
});
