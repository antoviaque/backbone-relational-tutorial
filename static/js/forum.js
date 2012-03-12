/*
 * Copyright (C) 2012 Xavier Antoviaque <xavier@antoviaque.org>
 *
 * This software's license gives you freedom; you can copy, convey,
 * propagate, redistribute and/or modify this program under the terms of
 * the GNU Affero Gereral Public License (AGPL) as published by the Free
 * Software Foundation (FSF), either version 3 of the License, or (at your
 * option) any later version of the AGPL published by the FSF.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program in a file in the toplevel directory called
 * "AGPLv3".  If not, see <http://www.gnu.org/licenses/>.
*/

(function($) {

    $.forum = {}
    
    // Models //////////////////////////////////////////////////////////////
        
    $.forum.Message = Backbone.RelationalModel.extend({
        urlRoot: '/api/message',
        idAttribute: '_id',
    });

    $.forum.Thread = Backbone.RelationalModel.extend({
        urlRoot: '/api/thread',
        idAttribute: '_id',
        relations: [{
            type: Backbone.HasMany,
            key: 'messages',
            relatedModel: '$.forum.Message',
            reverseRelation: {
                key: 'thread',
                includeInJSON: '_id',
            },
        }]
    });
    
    $.forum.ThreadCollection = Backbone.Collection.extend({
        url: '/api/thread',
        model: $.forum.Thread,
    })
    
    // Views ///////////////////////////////////////////////////////////////
    
    // Threads list //
    
    $.forum.ThreadListView = Backbone.View.extend({
        tagName: 'div',

        className: 'thread_list_view',
        
        initialize: function(){
            _.bindAll(this, 'render', 'render_thread_summary', 'on_submit', 'on_thread_created', 'on_error');
            this.model.bind('reset', this.render); 
            this.model.bind('change', this.render); 
            this.model.bind('add', this.render_thread_summary); 
        },
    
        template: Handlebars.compile($('#tpl_thread_list').html()),
    
        render: function() {
            $(this.el).html(this.template());
            this.model.forEach(this.render_thread_summary);
            return $(this.el).html();
        },
        
        render_thread_summary: function(thread) {
            var thread_summary_view = new $.forum.ThreadSummaryView({model: thread});
            this.$('ul.thread_list').prepend($(thread_summary_view.render()));
        },
        
        events: {
            'click input[type=submit]': 'on_submit',
        },
        
        on_submit: function(e) {
            var thread = new $.forum.Thread({ title: this.$('.new_thread_title').val() });
            thread.save({}, { success: this.on_thread_created,
                              error: this.on_error });
        },
        
        on_thread_created: function(thread, response) {
            this.model.add(thread, {at: 0});
            var message = new $.forum.Message({ author: this.$('.new_message_author').val(),
                                                 text: this.$('.new_message_text').val(),
                                                 thread: thread.get('_id') });
            message.save({}, { 
                success: function() {
                    $.forum.app.navigate('thread/'+thread.get('_id')+'/', { trigger: true });
                },
                error: this.on_error,
            });
        },
                
        on_error: function(model, response) {
            var error = $.parseJSON(response.responseText);
            this.$('.error_message').html(error.message);
        },
    });
    
    // Thread //
    
    $.forum.ThreadSummaryView = Backbone.View.extend({
        tagName: 'li',

        className: 'thread_summary_view',
        
        initialize: function(){
            _.bindAll(this, 'render', 'on_click');
            this.model.bind('change', this.render);
        },
    
        template: Handlebars.compile($('#tpl_thread_summary').html()),
        
        render: function() {
            return $(this.el).html(this.template(this.model.toJSON()));
        },
        
        events: {
            'click': 'on_click',
        },
        
        on_click: function(e) {
            $.forum.app.navigate('thread/'+this.model.get('_id')+'/', {trigger: true});
        },
    });
    
    $.forum.ThreadView = Backbone.View.extend({
        tagName: 'div',

        className: 'thread_view',
        
        initialize: function(){
            _.bindAll(this, 'render', 'render_message', 'on_submit');
            this.model.bind('change', this.render);
            this.model.bind('reset', this.render);
            this.model.bind('add:messages', this.render_message); 
        },
    
        template: Handlebars.compile($('#tpl_thread').html()),
        
        render: function() {
            return $(this.el).html(this.template(this.model.toJSON()));
        },
        
        render_message: function(message) {
            var message_view = new $.forum.MessageView({model: message});
            this.$('div.message_list').append($(message_view.render()));
        },
        
        events: {
            'click input[type=submit]': 'on_submit',
        },
        
        on_submit: function(e) {
            var new_message = new $.forum.Message({author: this.$('.new_message_author').val(),
                                                    text: this.$('.new_message_text').val(),
                                                    thread: this.model});
            new_message.save();
        },
    });
    
    // Message //
    
    $.forum.MessageView = Backbone.View.extend({
        tagName: 'div',

        className: 'message_view',
        
        initialize: function(){
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
        },
    
        template: Handlebars.compile($('#tpl_message').html()),
        
        render: function() {
            return $(this.el).html(this.template(this.model.toJSON()));
        },
    });
    
    // Router ///////////////////////////////////////////////////////////////
    
    $.forum.Router = Backbone.Router.extend({
        routes: {
            "": "show_thread_list",
            "thread/:_id/": "show_thread",
        },
    
        show_thread_list: function() {
            var thread_collection = new $.forum.ThreadCollection();
            var thread_list_view = new $.forum.ThreadListView({el: $('#content'), 
                                                                model: thread_collection });
            thread_collection.fetch();
        },
        
        show_thread: function(_id) {
            var thread = new $.forum.Thread({_id: _id});
            var thread_view = new $.forum.ThreadView({el: $('#content'), model: thread});
            thread.fetch();
        },
        
    });
    
    
    // App /////////////////////////////////////////////////////////////////
    
    $.forum.app = null;
    
    $.forum.bootstrap = function() {
        $.forum.app = new $.forum.Router(); 
        Backbone.history.start({pushState: true});
    };

})(jQuery);

