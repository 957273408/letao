$(function() {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    /*1. 分类左侧的动态数据渲染
        1. 使用ajax请求分类左侧的API接口 /category/queryTopCategory
        2. 拿到数据 创建数据的模板
        3. 调用模板方法生成html结构
        4. 把html放到页面上*/
    $.ajax({
        url: '/category/queryTopCategory',
        beforeSend: function() { // 请求之前会触发的回调函数
            // 请求之前显示遮罩层
            $('.mask').show();
        },
        complete: function() { // 请求之后会触发函数
            // 请求之后隐藏遮罩层
            $('.mask').hide();
        },
        // dataType:'json', 默认值就是把字符串 转成JS对象
        success: function(data) {
            console.log(data);
            // 调用模板传入数据
            // var html = template('categoryLeftTpl', {list:data.rows}); 不推荐因为data已经是对象了没必要在包装了
            var html = template('categoryLeftTpl', data);
            $('.category-left ul').html(html);
        }
    });
    // 1. 给左边的a添加点击事件 移动端使用不延迟tap事件代替click事件
    // 如果是异步元素 要添加事件 可以等到异步完成后再 添加事件 也可以使用事件委托
    $('.category-left ul').on('tap', 'li a', function() {
        // 2. 获取当前点击a的id
        // attr获取所有属性 带属性全称data-id 不会做类型的转换
        // var id = $(this).attr('data-id'); 
        // zepto和jquery专门获取自定义属性的函数不需要带data- 自动做类型转换
        var id = $(this).data('id');
        // 调用请求右侧分类的数据的函数 传入当前点击id
        querySecondCategory(id);
        // 6. 切换当前active类名 给当前点击a父元素添加active 其他兄弟删掉
        $(this).parent().addClass('active').siblings().removeClass('active');
    });
    // 默认调用请求数据的函数 传入id为1
    querySecondCategory(1);

    function querySecondCategory(id) {
        // 3. 根据当前点击id去请求右侧分类的数据
        $.ajax({
            url: '/category/querySecondCategory',
            data: { id: id },
            beforeSend: function() { // 请求之前会触发的回调函数
                // 请求之前显示遮罩层
                $('.mask').show();
            },
            complete: function() { // 请求之后会触发函数
                // 请求之后隐藏遮罩层
                $('.mask').hide();
            },
            success: function(data) {
                // 4. 调用分类右侧模板
                var html = template('categoryRightTpl', data);
                // 5. 渲染到页面
                $('.category-right ul').html(html);
            }
        });
    }

    // zepto的get不能传入对象的参数
    // $.get({

    // })
    // $.get(url,{参数},function(){})
})


/*function fun(obj) {
    console.log(obj);
}
fun({ 'rows': [1, 2, 3, 4] });
var data = { 'rows': [1, 2, 3, 4] };
fun(data);
*/
