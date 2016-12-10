(function(angular) {
  angular.module('TodoApp')
    .directive('autoFocus', [function() {
      // Runs during compile
      return {
        link: function($scope, iElm, iAttrs, controller) {
          iElm.on('dblclick', function() {
            // 将一个 DOM 对象转换为 jQuery 对象
            // ng 内部内置了一个 angular.element(DOM) 可以得到转换过后的 jQuery 对象
            angular.element(this).find('input')[1].focus()
          })
        }
      };
    }]);
})(angular)
