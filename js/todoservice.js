(function(angular) {
  var app = angular.module('TodoApp')

  // 1. 服务就是用来获取数据或者说操作数据的，不关心视图，不关心界面交互
  // 2. 可以将服务定义成全局构造函数的形式，但是会污染全局变量
  // 3. 所以 ng 提供了一种自定义服务的机制，可以基于模块去定义服务，然后在控制器里面使用该服务
  //    这样的话就避免了全局污染的问题

  // 给 app 模块定义一个服务
  // 第一个参数就是服务的名称，也就是你原来的构造函数的名字
  // 第二个参数可以直接传递一个函数（类似于原来控制器的写法）
  // 服务本身也可以使用别的服务
  // 第二个参数，就是一个构造函数，可以直接在里面通过 this 给该构造函数添加静态方法
  // 使用服务的时候，肯定是在控制器里面使用服务，使用的时候，ng 会帮我们自动去创建服务对象
  // 然后就可以直接使用里面通过 this 定义的方法了
  app.service('TodoService', ['$window', function($window) {
    var todos = JSON.parse($window.localStorage.getItem('todos') || '[]')

    this.getAll = function() {
      return todos
    }

    this.save = function() {
      $window.localStorage.setItem('todos', JSON.stringify(todos))
    }

    this.add = function(text) {
      var maxId = 0
      todos.forEach(function(todo) {
        if (todo.id > maxId) {
          maxId = todo.id
        }
      })
      var todo = {
          id: ++maxId,
          text: text,
          completed: false
        }
        // todos 和 本地存储的 todos 有一个映射关系
        // 改变了 todos 数组，不会改变本地存储
        //    如果想要改变了 todos 数组，马上和本地存储中的 todos 建立关系，保持同步
        //      所以直接将 todos 持久化到本地存储中
        // 但是：改变了本地存储，一定会改变 todos 数组
      todos.push(todo)
      this.save()
    }

    this.removeById = function(id) {
      var index = -1
      todos.some(function(todo, i) {
        if (todo.id === id) {
          index = i
          return true
        }
      })

      // 根据索引从数组中删除具体的元素
      todos.splice(index, 1)
      this.save()
    }

    this.clearAllCompleted = function() {
      var unCompleteds = []
      todos.forEach(function(todo, index) {
          if (!todo.completed) {
            unCompleteds.push(todo)
          }
        })
        // 给 service 中的 todos 重新赋值就切换了与 controller 中的 todos 之间的引用关系
        // 所以给 service 中的 todos 重新辅助不会影响 controller 中的 todos
        // 如果想让 controller 中的 todos 和 service 中的 todos 保持同步，就给他们两者之间重新建立引用关系
      todos = unCompleteds
      this.save()
    }

    this.changeCompleted = function(completed) {
      todos.forEach(function(todo) {
        todo.completed = completed
      })
      this.save()
    }
  }])
})(angular)
