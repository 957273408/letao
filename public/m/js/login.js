$(function() {
    /* 
    	1. 实现登录功能
    		1. 点击登录的时候获取用户名和密码
    		2. 进行非空判断
    		3. 调用的APi 传入 当前用户名和密码
    		4. 获取后台返回登录结果  成功就返回上一页去继续加入购物车
    		5. 如果失败就提示用户输入正确的用户名和密码
    */
    // 1. 给登录按钮添加点击事件
    $('.btn-login').on('tap', function() {
        // 2. 获取用户名和密码 把首尾空格去掉
        var username = $('.username').val().trim();
        var password = $('.password').val().trim();
        // 3. 非空判断
        if (!username) {
            // MUI的消息框 警告框
            mui.alert('请输入用户名！', '温馨提示', '知道了');
            // 只要没有输入后面的代码都不执行
            return false;
        }
        if (!password) {
            // MUI的消息框 警告框
            mui.alert('请输入密码！', '温馨提示', '知道了');
            // 只要没有输入后面的代码都不执行
            return false;
        }
        // 4. 调用登录API发送请求
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: { username: username, password: password },
            success: function(data) {
                // 5. 判断用户是否成功
                if (data.success) {
                    // 6. 成功 成功返回到上一页继续去购买
                    // history.back();
                    // 登录成功返回一个指定的页面 
                    // 从哪来跳转来登录的我不关心 我只关心我登录成功后去哪
                    // 在跳转到登录页面的时候 传递一个 登录成功要返回的页面过来
                    // 6.1 接收当前登录成功需要返回的地址
                    var returnUrl = getQueryString('returnUrl');
                    // 6.2 接收了当前需要返回的地址后 手动跳到这个地址
                    // location = 'http://localhost:3000/m/detail.html?id=2';
                    location = returnUrl;
                } else {
                    // 7. 失败 提示用户失败的原因 把错误信息data.message作为提示内容
                    mui.toast(data.message, { duration: 'long', type: 'div' })
                }
            }
        })
    });

    // 2. 如果用户没有账号点击注册跳转到注册页面
    $('.btn-register').on('tap',function () {
		// 跳转到注册页面
		location = 'register.html';
    });
     // 根据url参数名取值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
})
