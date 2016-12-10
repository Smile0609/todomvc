  (function(angular) {
    // 获取 TodoApp 模块，给该模块添加控制器
    var app = angular.module('TodoApp')

    app.controller('MainCtrl', [
      '$scope', '$window', '$location', 'TodoService',
      function($scope, $window, $location, TodoService) {
        // 模型数据初始化
        $scope.title = '任务列表'
        $scope.text = ''
        $scope.todoFilter = {}
        $scope.checkAll = false
        $scope.currentEditingId = 0
        $scope.todos = TodoService.getAll()

        // 以前的思路的做法
        // $scope.getEditing = function (todo) {
        //   todo.editing = true
        //   // 遍历其它项，设置为 false
        // }

        // 双击任务项获取编辑样式
        $scope.getEditing = function(todo) {
          $scope.currentEditingId = todo.id
        }

        // 保存编辑，改变编辑样式
        $scope.edit = function() {
          $scope.currentEditingId = 0
          TodoService.save()
        }

        // 使用 ng 之后，写代码就只需要关注你的业务就可以了
        $scope.remove = function(id) {
          TodoService.removeById(id)
        }

        $scope.toggle = function() {
          // 每一次 toggle 的时候，判断数组中是否全部是已完成的
          if ($scope.todos.every(function(todo) {
              return todo.completed
            })) {
            $scope.checkAll = true
          } else {
            $scope.checkAll = false
          }
          TodoService.save()
        }

        if ($scope.todos.every(function(todo) {
            return todo.completed
          })) {
          $scope.checkAll = true
        }

        $scope.clearAllCompleted = function() {
          // 调用该方法之后，丢失了和 service 中的 todos 的引用关系
          TodoService.clearAllCompleted()

          // 重新给当前的 todos 和 service 中的 todos 建立引用关系
          $scope.todos = TodoService.getAll()
        }

        $scope.save = function() {
          if ($scope.text.trim().length === 0) {
            return
          }
          TodoService.add($scope.text)
          $scope.text = ''
        }

        $scope.toggleAll = function() {
            TodoService.changeCompleted($scope.checkAll)
          }
          // 用户刷新页面，控制器中的代码会依次执行
          // 获取当期的url中的 hash 值
          // 根据不同的 hash 值，设置不同的 todoFilter
          // window.addEventListener('hashchange')
          // window.location.hash
          // 由于在 单页 app 中经常要使用 location 地址
          // 所以 Angular 提供了一个内置的服务 $location
        console.log($location.absUrl())

        // 在单页APP中，因为都是通过a链接的 hash 值来做页面的切换
        // 所以 Angular 将地址中的 hash 值称为  url
        console.log($location.url())

        $scope.$location = $location

        // $scope.$watch 方法，可以监视模型中属性，必须是模型中的
        // 第一个参数就是要监视的属性（必须是$scope 上的属性或者方法）
        //    当监视的属性是一个方法的时候，$watch 会把方法的返回值作为判定
        // 第二个参数就是数据改变之后要执行的处理函数
        //    该处理函数需要接收两个参数，第一个参数就是监视的属性的最新值
        //                                第二个参数就是监视的属性的原来的值
        $scope.$watch('$location.url()', function(newValue, oldValue) {
          switch (newValue) {
            case '/':
              $scope.todoFilter = {}
              break;
            case '/completed':
              $scope.todoFilter = { completed: true }
              break;
            case '/active':
              $scope.todoFilter = { completed: false }
              break;
            default:
              $scope.todoFilter = {}
              break;
          }
        });
      }
    ])
  })(angular)
