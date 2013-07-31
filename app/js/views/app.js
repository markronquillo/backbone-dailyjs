define([
   'text!templates/app.html',
   'views/lists/add',
   'views/lists/edit',
],

function(template, AddListView, EditListView) {
    var AppView = Backbone.View.extend({
        id: 'main',
        tagName: 'div',
        className: 'container-fluid',
        el: 'body',
        template: _.template( template ),

        events: {
            "click #authorize-button": "auth",
            "click #add-list-button": "addList",
            "click #edit-list-button": "editList",
            "click #delete-list-button": "deleteList",
        },


        initialize: function(app) {
            this.app = app;
        },

        render: function() {
            this.$el.html( this.template() );
            return this;
        },

        auth: function() {
            this.app.apiManager.checkAuth();
            return false; 
        },

        addList: function() {
            var list = new bTask.collection.lists.model({ title: '' }),
                form = new AddListView({ model: list }),
                self = this;
            this.listForm( form );
        },

        editList: function() {
            var form = new EditListView({ model: bTask.views.activeListMenuItem.model });
            this.listForm( form );
        },

        deleteList: function() {
            if ( confirm("Are you sure you want to delete that list?") ) {
                bTask.views.activeListMenuItem.model.destroy();
            }

            return false;
        },

        listForm: function( form ) {
            this.$el.find('#list-editor').html( form.render().el );
            form.$el.find('input:first').focus();

            return false;
        }
    });

    return AppView;
});

/*
    This AppView binds itself to body element and load the template (templates/app.html), the text! directive is provided by RequireJS text plugin

        
*/
