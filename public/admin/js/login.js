$(function() {
    /*登录功能
    	点击登录的时候进行表单验证 输入
    	获取用户名和密码 调用当前的后台登录接口
    	判断后台返回是否登录成功 成功跳转到首页 失败就提示用户失败原因*/
    // 给登录按钮添加点击事件 因为是PC端就是click事件
    $('.btn-login').on('click', function() {
        var check = true;
        // 1.1 获取所有Input输入进行遍历判断
        $(".login-form input").each(function() {
            //1.2 判断输入框是否为空
            if (!this.value || this.value.trim() == "") {
                // 1.3 获取输入框上一个兄弟span元素
                var span = this.previousElementSibling;
                // 1.4 把label元素里面的文字拼接到提示框里面
                alert(span.innerText + "不允许为空");
                // 1.5 有为空 表示未通过 把 check变成false
                check = false;
                // 1.6 只是return 当前函数 只是不用在继续遍历了  遍历后面 代码 还是会执行
                return false;                
            }
        });
        if (check) {
            // 2. 获取用户名 和 密码
            var username = $('.username').val();
            var password = $('.password').val();
            // 3. 调用当前的后台登录接口
            $.ajax({
                url: '/employee/employeeLogin',
                type: 'post',
                data: { username: username, password: password },
                success: function(data) {
                    // 4. 判断是否登录失败
                    if (data.error) {
                        alert(data.message)
                    } else {
                        // 登录成功跳转到首页
                        location = 'index.html';
                    }
                }
            })
        }
    });
})
