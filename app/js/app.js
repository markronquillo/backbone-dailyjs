define([
    'gapi',
    'views/app',
    'views/auth',
    'views/lists/menu',
    'collections/tasklists',
], 


function(ApiManager, AppView, AuthView, ListMenuView, TaskLists) {

    var App = function() {
        this.views.app = new AppView(this);
        this.views.app.render();
        this.collection.lists = new TaskLists();
        this.views.listMenu = new ListMenuView( { collection: this.collection.lists } );
        // this.views.auth = new AuthView(this);
        // this.views.auth.render(); // AuthView won't work unless it has some of AppViews tag available

        this.connectGapi();
    };

    App.prototype = {
        views: {},
        collection: {},
        //models: {},
        connectGapi: function() {
            var self = this;
            this.apiManager = new ApiManager(this);
            
            this.apiManager.on( 'ready', function() {
                self.collection.lists.fetch( { data: { userId: '@me' }, success: function(res) {
                    // self.models.activeList = self.collection.lists.first();
                    self.views.listMenu.render();

                }
                });
            });
        },

    };

    return App;
}); // This is a module written in the AMD format 
