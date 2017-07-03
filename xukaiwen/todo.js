var todoList = [];
/*  初始化路由和界面  */
$(document).ready(function () {
    /*   读取localStorage  */
    todoList = JSON.parse(localStorage.todoList);
    for (var i=0; i<todoList.length; i++) {
        var todo = todoList[i];
        if (todo.state)
            $('.todo-list').append("<li class='completed'><div class='view'><input class='toggle' type='checkbox' checked>" +
                "<label>"+todo.content+"</label><button class='destroy'></button></div></li>");
        else
            $('.todo-list').append("<li><div class='view'><input class='toggle' type='checkbox'>" +
                "<label>"+todo.content+"</label><button class='destroy'></button></div></li>");
    }
    $('.todo-count strong').text(todoList.length);

    route();
    toggleChange();
});

/*  增加TODO  */
$('.new-todo').keydown(function (event) {
    /*  回车触发  */
    if (event.keyCode===13) {
        /*  若之前列表为空，则显示列表栏和栏脚  */
        if ($('.todo-list li').length==0) {
            $('.main').show();
            $('.footer').show();
        }
        $('.todo-list').append("<li><div class='view'><input class='toggle' type='checkbox'>" +
            "<label>"+$('.new-todo').val()+"</label><button class='destroy'></button></div></li>");

        /*  todoList增加  */
        todoList.push({'state':'','content':$('.new-todo').val()});

        $('.new-todo').val('');
        var count = $('.todo-count strong').text();
        count++;
        $('.todo-count strong').text(count);
    }
    route();
    localStore();
});

/*  删除TODO  */
$(document).on('click','.destroy',function (event) {
    /*  todoList删除  */
    var formerClass = $(event.target).parents('li').attr('class')===undefined ? '' : $(event.target).parents('li').attr('class');
    var num = todoList.findIndex(function (todo) {
        if (todo.state===formerClass && todo.content===$(event.target).parents('li').find('label').text()) {
            return todo;
        }
    });
    todoList.splice(num,1);

    $(event.target).parents('li').remove();
    var count = $('.todo-count strong').text();
    count--;
    $('.todo-count strong').text(count);
    toggleChange();
    localStore();
});

/*  标记/取消TODO  */
$('.todo-list').on('change','.toggle',function (event) {
    var formerClass = $(event.target).parents('li').attr('class')===undefined ? '' : $(event.target).parents('li').attr('class');

    if ($(event.target).prop('checked'))
        $(event.target).parents('li').attr('class','completed');
    else
        $(event.target).parents('li').attr('class', '');

    /*  todoList改变  */
    todoList.find(function (todo) {
        if (todo.state===formerClass && todo.content===$(event.target).parents('li').find('label').text()) {
            return todo;
        }
    }).state = $(event.target).parents('li').attr('class');

    route();
    toggleChange();
    localStore();
});

/*  全部标记/取消TODO  */
$('.toggle-all').change(function () {
    if ($('.toggle-all').prop('checked'))
        $('.toggle').prop('checked',true).change();
    else
        $('.toggle').prop('checked',false).change();
})

/*  清除已完成事件  */
$('.clear-completed').click(function () {
    /*  todoList删除  */
    $('.todo-list .completed').each(function (index, element) {
        var num = todoList.findIndex(function (todo) {
            if (todo.state==='completed' && todo.content===element.firstChild.childNodes[1].innerHTML) {
                return todo;
            }
        });
        todoList.splice(num,1);
    });

    $('.todo-list .completed').remove();
    $('.todo-count strong').text($('.todo-list li').length);
    toggleChange();
    localStore();
});

/*  改变路由  */
$('.filters').on('click','a',function (event) {
    $(event.target).parents('ul').find('a').attr('class', '');
    $(event.target).attr('class', 'selected');
    toggleChange();
});

/*  路由筛选  */
$(window).on('hashchange', function () {
    route();
});

/*  判断页面是否需要变化  */
function toggleChange() {
    /*  判断TODO列表是否有内容，没有则隐藏列表栏和栏脚  */
    if ($('.todo-list li').length==0) {
        $('.main').hide();
        $('.footer').hide();
    }
    else {
        /*  判断是否有已完成事件，若没有，则隐藏清除组件，若有，则显示组件  */
        if ($('.todo-list .completed').length==0)
            $('.clear-completed').hide();
        else
            $('.clear-completed').show();
    }
}

/*  根据路由显示TODO列表  */
function route() {
    var hash = location.hash.substr(2);
    if (hash === 'completed') {
        $('.todo-list li').hide();
        $('.todo-list .completed').show();
    }
    else if (hash === 'active') {
        $('.todo-list li').show();
        $('.todo-list .completed').hide();
    }
    else
        $('.todo-list li').show();
    toggleChange();
}

function localStore() {
    localStorage.todoList = JSON.stringify(todoList);
}