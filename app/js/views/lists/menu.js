define(['views/lists/menuitem'], function(ListMenuItemView) {
    var ListMenuView = Backbone.View.extend( {
        el: '.left-nav',
        tagName: 'ul',
        className: 'nav nav-list lists-nav',

        events: {
        },

        initialize: function() {
            this.collection.on( 'add', this.render, this);
        },

        render: function() {
            // TODO

            var $el = $(this.el),
                self = this;

            this.collection.each( function(list) {
                var item, sidebarItem;
                item = new ListMenuItemView({ model: list });
                $el.append(item.render().el);
            });

            return this;
        },

        renderMenuItem: function(model) {
            var item = new ListMenuItemView({ model: model });
            this.$el.append( item.render().el );

            if (model.get('id') === bTask.views.activeListMenuItem.get('id')) {
                item.open();
            }
        }
    });

    return ListMenuView;

});
