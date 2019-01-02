$(function() {
    /*1. 注册功能
    	1. 点击注册按钮 进行 非空验证  （使用MUI验证代码）
    	2. 有很多表单挨个获取判断很麻烦 获取所有表单 循环遍历 只要有一个为空表示有错 提示用输入
    	3. 获取用户输入所有信息
    		验证手机是否合法
    		延迟用户名是否合法
    		验证2次密码是否一致
    		验证码是否一致
    */
    var vCode = '';
    $('.btn-register').on('tap', function() {
        // 1. 定义一个是否验证通过变量 默认为true是通过的
        var check = true;
        // 1.1 获取所有Input输入进行遍历判断
        mui(".mui-input-group input").each(function() {
            //1.2 判断输入框是否为空
            if (!this.value || this.value.trim() == "") {
                // 1.3 获取输入框上一个兄弟label元素
                var label = this.previousElementSibling;
                // 1.4 把label元素里面的文字拼接到提示框里面
                mui.alert(label.innerText + "不允许为空");
                // 1.5 有为空 表示未通过 把 check变成false
                check = false;
                // 1.6 只是return 当前函数 只是不用在继续遍历了  遍历后面 代码 还是会执行
                return false;
            }
        });
        // 1.7 如果的check还是true 表示验证通过了 继续执行后面的注册逻辑
        if (check) {
        		// 手机号
            var mobile = $('.mobile').val();
            	/*^1 第一个位是1 
            	[34578] 第二位是 3 4 5 7 8 中的一个
            	\d{9}$ 9个数字 结尾*/
            if (!(/^1[34578]\d{9}$/.test(mobile))) {
                mui.alert("用户手机不合法!");
                return false;
            }
            // 获取用户名
            var username = $('.username').val();
            // 用户长度大于10 就不合法
            if (username.length > 10) {
                mui.alert("你的用户名太长了(要小于10位)!");
                return false;
            }
            // 获取密码和确认密码
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            if(password1 != password2){
            	 mui.alert("两次密码不一致!");
                return false;
            }
            // 获取当前输入的验证码  小写的vcode是当前用户的输入  全局变量大写vCode按钮获取
            var vcode = $('.vcode').val();
            // 判断2个验证码不一致表示输入错误
            if(vCode != vcode){
            	mui.alert("验证码输入有误!");
                return false;
            }
            // 调用注册APi 传入这些注册需要的用户信息 实现注册功能
            $.ajax({
            	url: '/user/register',
            	type: 'post',
            	data: {username:username,password:password1,mobile:mobile,vCode:vCode},
            	success: function (data) {
            		// 判断后台返回数据是否注册成功
            		if(data.success){
            			// 注册成功 提示用户注册成功 
            			mui.toast('注册成功');
            			// 如果注册成功就跳转到登录  希望登录成功去跳转到个人中心
            			location = 'login.html?returnUrl=user.html';
            		}else{
            			// 注册失败 提示用户失败的原因
            			mui.toast(data.message);
            		}
            	}
            })
        }
    });

    /*获取验证码的功能
		1. 点击获取验证码就获取
		2. 调用API获取验证码
		3. 通过控制台告诉用户是什么验证码(真实开发是调用手机运营商的等APi发给用户手机)
    */
   $('.btn-get-vcode').on('tap',function () {
   	$.ajax({
   		url:'/user/vCode',
   		success:function (data) {
   			console.log(data.vCode);
   			//把API返回的验证码赋值给全局变量
   			vCode = data.vCode;
   		}
   	})
   })
})
