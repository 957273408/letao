$(function() {
    var page = 1;
    var pageSize = 10;
    /*  1. 分类信息渲染
            1. 请求用户信息的API /category/queryTopCategoryPaging
            2. 创建模板
            3. 渲染页面*/
    // 调用查询数据函数
    queryTopCategory();

    /*2. 添加分类 
        1. 点击添加分类的按钮弹出一个 模态框
        2. 获取当前输入的分类名称
        3. 点击保存发送请求添加分类 /category/addTopCategory 传递当前分类名称
        4. 添加完成后重新调用查询刷新页面*/

    // 1. 给保存按钮添加点击事件
    $('.btn-save').on('click', function() {
        // 2. 获取当前输入的分类名称
        var categoryName = $('.category-name').val().trim();
        // 3. 进行非空判断
        if (!categoryName) {
            alert('请输入分类名称！');
            return false;
        }
        // 4. 调用添加分类的API添加分类
        $.ajax({
            url: '/category/addTopCategory',
            type: 'post',
            data: { categoryName: categoryName },
            success: function(data) {
                if (data.success) {
                    // 5 添加成功就刷新页面
                    queryTopCategory();
                }
            }
        });
    });

    // 初始化分页 等到一开始数据请求后 知道分多少页了再初始化
    function initPage(totalPages) {
        // 当前页码数
        // var page = page;
        // 总页数 总条数 / 每页大小 == 总页数   100条 / 10pageSize  == 10 总页数
        // var totalPages = 25;
        $(".pagination").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: page, //当前页数
            numberOfPages: 5, //每次显示页数 几个分页按钮 10个按钮
            totalPages: totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function(event, originalEvent, type, nowPage) {
                // 当前点击的page 
                console.log(nowPage);
                // 把形参nowPage 赋值给全局变量的page  注意变量名不能重复  不然 page = page 吧自己赋值给了自己 全局变量没有变的
                page = nowPage;
                queryTopCategory();
            }
        });
    }

    function queryTopCategory() {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: { page: page, pageSize: pageSize },
            success: function(data) {
                console.log(data);
                var html = template('userTpl', data);
                $('.message tbody').html(html);
                // 根据当前数据去计算总页数  总条数/每页大小 data.total总条数  pageSize每页大小
                var totalPages = Math.ceil(data.total / pageSize); // 62/10 == 7
                console.log(totalPages);
                // 当数据请求完成后去初始化分页插件 传人当前总页数
                initPage(totalPages);
            }
        });
    }
})
