;
$(function() {
    window.app = {
        models: {},
        views: {},
        collections: {}
    }
    var template = function(id) {
        return _.template($('#' + id).html());
    }
    app.models.Task = Backbone.Model.extend({})
    app.views.Task = Backbone.View.extend({
        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.removeEl, this)
        },
        tagName: 'li',
        template: template('tasksTemplate'),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            'click .edit': 'edit',
            'click .delete': 'destroy',
        },
        edit: function() {
            var newTaskTitle = prompt('New task title', this.model.get('title'));
            if (newTaskTitle) {
                this.model.set('title', newTaskTitle);
            }
        },
        removeEl: function(params) {
            this.$el.remove();
        },
        destroy: function() {
            this.model.destroy();
            console.log("this.model ", tasks);

        }

    })
    app.collections.Tasks = Backbone.Collection.extend({
        model: app.models.Task,

    })
    app.views.Tasks = Backbone.View.extend({
        model: app.models.Tasks,
        initialize: function() {
            this.collection.on('add', this.addItem, this)
        },
        render: function() {
            this.collection.each(this.addItem, this);
            return this;
        },
        addItem: function(task) {
            var viewTask = new app.views.Task({ model: task })
            this.$el.append(viewTask.render().el)
        }
    })
    app.views.AddTask = Backbone.View.extend({
        el: '#addNewTask',
        events: {
            'click button': 'submit'
        },
        submit: function(e) {
            e.preventDefault();
            var text = this.$el.find('input').val();
            var newTask = new app.models.Task({
                title: text
            })
            this.collection.add(newTask);
            console.log("this.collection ", this.collection);
        }
    })
    var tasks = new app.collections.Tasks([{
        title: "some task",
        priority: 4,

    }, {
        title: "task",
        priority: 2,

    }, {
        title: "some",
        priority: 3,
    }, ]);
    var viewTasks = new app.views.Tasks({ collection: tasks });
    $('body').append(viewTasks.render().el)


    var newTasks = new app.views.AddTask({ collection: tasks });

})