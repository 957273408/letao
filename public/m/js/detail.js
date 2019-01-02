$(function() {
    /*1. 根据当前url中参数的商品id 获取商品详情数据渲染
        1. 通过封装好的查询url参数值的函数获取 id参数的值
        2. 请求API获取数据 传入当前id参数
        3. 渲染商品详情*/
    // 1. 通过封装好的查询url参数值的函数获取 id参数的值
    var id = getQueryString('id');
    // 2. 请求API获取数据 传入当前id参数
    $.ajax({
        url: '/product/queryProductDetail',
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
            // 3. 这个返回数据data.size尺码是字符串 40-50字符串 把字符串转成数组
            // 3.1  拿到当前字符串最小值
            var min = data.size.split('-')[0] - 0;
            // 3.2  拿到当前字符串最小值
            var max = data.size.split('-')[1];
            // 3.4 把data.size赋值为空数组
            data.size = [];
            // 3.5 循环从最小开始到最大结束
            for (var i = min; i <= max; i++) {
                // 3.6 把循环的每个都添加到数组里面
                data.size.push(i);
            }
            console.log(data);
            // 4. 调用商品详情的模板生成html
            var html = template('productDetailTpl', data);
            $('#productDetail').html(html);
            // 5. 等到页面中的商品详情信息加载完了后再 初始化区域滚动保证不会有问题
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            // 6. 等轮播图结构出来了之后再初始化轮播图
            mui('.mui-slider').slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
            // 7. 数字框也是动态添加要手动初始化 
            mui('.mui-numbox').numbox();
            // 8. 尺码默认也是不能点击的手动初始化
            $('.btn-size').on('tap', function() {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    });

    /* 
    2. 加入购物车
        1. 当点击加入购物车的时候 获取 选择的尺码数量信息
        2. 判断尺码和数量是否选择 如果没有选择 提示用户选择尺码和数量
        3. 调用加入购物车的API传入当前商品id 尺码 数量 加入购物车
        4. 调用APi的时候 post 提交一般是post
        5. 提交如果当前用户没有登录 提示用户去登录
        6. 加入成功 提示用是否去购物车查看
    */
    // 1. 给加入购车按钮添加点击事件
    $('.btn-add-cart').on('tap', function() {
        // 2. 获取当前选择尺码和数量信息
        var size = $('.btn-size.active').data('size');
        // 3. 判断如果尺码没有选择 提示用户选择尺码
        if (!size) {
            // toast 消息提示框 提示用户选择尺码 第一个参数 提示内容 第二个参数提示配置项
            mui.toast('请选择尺码！', { duration: 3000, type: 'div' });
            // 注意当用户没有选择 后面的代码不执行的要return  return false 不仅结束还可以阻止默认行为
            return false;
        }
        // 4. 获取当前选择的数量
        var num = mui('.mui-numbox').numbox().getValue();
        // 5. 判断是否选择了数量
        if (!num) {
            mui.toast('请选择数量！', { duration: 3000, type: 'div' });
            return false;
        }
        // 6. 调用加入购物车的API去加入购车
        $.ajax({
            url: '/cart/addCart',
            type: 'post', //提交数据 都是post
            // 注意API文档要求参数productId 但是我们的变量名是id
            data: { productId: id, size: size, num: num },
            success: function(data) {
                // 加入失败 先去完整版登录 
                // 7. 判断加入购物车是否成功 如果返回值success表示成功 成功提示用户去购物车查看
                if (data.success) {
                    // 8. 提示用户是否去购物车查看
                    // 第一个参数是提示的内容 第二个参数是提示的标题 第三个参数是提示按钮的文字(数组)  第四个的回调函数 当点击按钮的后会触发的回调函数
                    mui.confirm('加入购物车成功！ 是否要去购物车查看?', 'hello 单身狗', ['去看', '发呆', '不看'], function(e) {
                        // 获取当前用户点击了左边的还是右边
                        console.log(e);
                        if (e.index == 0) {
                            //点击了左边 跳转到购物车查看
                            location = 'cart.html';
                        } else {
                            // 点击否就不看 表示还继续吗
                            mui.toast('你继续加一件就可以脱离单身了！', { duration: 3000, type: 'div' });
                        }
                    });
                } else {
                    // 9. 加入失败表示未登录  跳转到登录页面 指定当前登录成功要返回的页面 返回当前的详情页面
                    console.log(location);
                    // location = 'login.html?returnUrl='+'http://localhost:3000/m/detail.html?id=1';
                    // location.href 就是当前页面的url
                    location = 'login.html?returnUrl=' + location.href;
                }
            }
        })
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
