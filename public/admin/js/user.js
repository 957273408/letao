$(function() {
    var page = 1;
    var pageSize = 10;
    /*	1. 用户信息渲染
    		1. 请求用户信息的API /user/queryUser
    		2. 创建用户表格的模板
    		3. 渲染页面*/
    // 调用查询用户信息的函数
    queryUser();

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
                queryUser();
            }
        });
    }

    /*2. 用户操作功能
    	1. 点击了禁用或者启用按钮进行操作 改变当前用户的状态
    	2. isDelete == 0 表示 已禁用 isDelete == 1 表示 已启用
    	3. 获取当前点击的用户的 isDelete的值  如果是0 改成 如果是1 改成0
    	4. 修改完后调用API去更新用户状态
    	5. 更新完成后重新查询刷新页面*/
    // 1. 给所有操作按钮添加点击事件
    $('.message').on('click', '.btn-option', function() {
        // 2. 获取当前点击操作按钮的用户状态和id
        var id = $(this).data('id');
        var isDelete = $(this).data('is-delete');
        // 3. 更新状态 如果是0 变成1  如果是1 变为0
        isDelete = isDelete == 0 ? 1 : 0;
        console.log(isDelete);
        // 4. 更新标签自定义属性的值  jquery变化的不是标签上能够看到的属性 而是JS属性
        $(this).data('is-delete', isDelete);
        // 5. 调用API更新
        $.ajax({
            url: '/user/updateUser',
            type: 'post',
            data: { id: id, isDelete: isDelete },
            success: function(data) {
                console.log(data);
                queryUser();
            }
        })
    });

    function queryUser() {
        $.ajax({
            url: '/user/queryUser',
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
