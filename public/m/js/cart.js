$(function() {
    /* 
    1. 动态渲染购物车的商品信息
        1. 页面加载请求购物车的商品的数据  请求查询购物车的API接口 带分页的
        2. 创建购物车列表模板 渲染模板
    */
    // 调用封装好的查询购车商品和渲染函数
    queryCart();

    /* 
    2. 下拉刷新和上拉加载购物车
        1. 添加下拉上拉结构
        2. 初始化下拉刷新和上拉加载
        3. 在下拉刷新的函数请求最新的数据
        4. 结束下拉刷新的效果(不结束会一直转)
        5. 定义一个page = 1;
        6. 上拉加载的回调函数让page++
        7. 请求page++了之后的更多的数据
        8. 追加append到购物车的列表
        9. 结束上拉加载效果
        10. 判断如果没有数据的时候结束并且提示没有数据了  调用结束上拉加载效果传递一个true
        11. 下拉结束后重置上拉加载的效果
        12. 把page也要重置为1
    */
    // 5. 定义一个page = 1;
    var page = 1;
    // 1. 添加下拉上拉结构
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {
                callback: function() {
                    // 模拟请求网络请求延迟
                    setTimeout(function() {
                        // 3. 在下拉刷新的函数请求最新的数据
                        queryCart();
                        // 4. 结束下拉刷新的效果(不结束会一直转) 在官方文档函数后 多加一个 ToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 11. 下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 12. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            // 初始化上拉
            up: {
                callback: function() {
                    // 只是为了模拟延迟
                    setTimeout(function() {
                        // 6. 上拉加载的回调函数让page++
                        page++;
                        // 7. 请求page++了之后的更多的数据
                        $.ajax({
                            url: '/cart/queryCartPaging',
                            data: { page: page, pageSize: 4 },
                            success: function(data) {
                                console.log(data);
                                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                                if (data.error) {
                                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                                    location = 'login.html?returnUrl=' + location.href;
                                } else {
                                    // []  一开始这个样子的数组
                                    // {
                                    //  data:[]
                                    // }// 变成这个样子的对象
                                    console.log(data instanceof Array);
                                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                                    if (data instanceof Array) {
                                        data = {
                                            data: data
                                        }
                                    }
                                    if (data.data.length > 0) {
                                        // 调用模板方法生成html
                                        var html = template('cartListTpl', data);
                                        // 8. 追加append到购物车的列表
                                        $('.cart-list').append(html);
                                        // 9. 结束上拉加载效果
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                    } else {
                                        // 10. 结束上拉加载效果提示没有数据了
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }

                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });

    /* 
    3. 商品勾选计算总金额
        1. 当复选框选择发生变化的时候要获取所有选中的复选框  什么叫选中的 input:checked
        2. 计算每个选择复选框的商品的单价（商品价格 * 数量）
        3. 定一个和 把所有单价累加起来就是总金额
    */
    // 1. 给所有复选框添加 change事件 
    $('.cart-list').on('change', '.choose', function() {
        // 2. 获取所有选中的复选框
        var checkeds = $('.choose:checked');
        console.log(checkeds);
        // 所有商品总价
        var sum = 0;
        // 3. 遍历所有选中的复选框 计算每个商品单价
        checkeds.each(function(index, value) {
            // 4. 获取当前复选框的价格和 数量
            var price = $(value).data('price');
            var num = $(value).data('num');
            var count = price * num;
            sum += count;
        });
        // 让当前sum保留2位小数
        // 0.034 * 100 3/100  == 0.03
        // sum = parseInt(sum * 100) / 100;
        sum = sum.toFixed(2);
        $('.order-total span').html(sum);
    });

    /* 
    4. 删除商品
        1. 点击删除按钮弹出一个确认框 问用户是否要删除当前商品
        2. 判断如果用户点击了确定  就删除商品
            调用删除购物车商品的APi去删除要求传入购物车id
            在删除按钮上把当前购物车id绑定到删除按钮
        3. 取消滑动回去 什么都不干
    */
    // 1. 委托给删除按钮添加点击事件
    $('.cart-list').on('tap', '.btn-delete', function() {
        // 当前点击a元素
        var that = this;
        // 2. 弹出一个确认框
        mui.confirm('您真的要删除我吗?', '温馨提示', ['确定', '取消'], function(e) {
            // 点击确定或者取消 会触发回调函数 并且 e.index == 0 确定 e.index == 1取消
            // 3. 判断点击确定还是取消
            if (e.index == 0) {
                // 4. 点击了确定 拿到当前删除购物车id
                var id = $(that).data('id');
                // 5. 调用API删除
                $.ajax({
                    url: '/cart/deleteCart',
                    data: { id: id },
                    success: function(data) {
                        // 6. 判断如果删除成功就重新刷新页面
                        if (data.success) {
                            // 7. 调用查询购物车商品的函数
                            queryCart();
                        }
                    }
                })
            } else if (e.index == 1) {
                // 8. 把侧滑列表滑动回去
                // this是window 因为这个函数不是元素调用的 MUI间接 
                // 我要拿到之前的a必须通过在事件的回调函数里面把this保存到一个新的变量 that
                console.log(this);
                // 8.1 原生 ：获取a的父元素div 的下一个兄弟 mui-slider-handle
                // var handle = $(that).parent().next();
                // console.log(handle);
                // // 8.2 给当前handle去除位移的样式
                // handle.css({
                //     transform:'translate(0,0)'
                // });

                // 8.3 使用MUI官方提供函数 是MUI调用的  而且参数是a的父元素的父元素  必须的DOM对象
                mui.swipeoutClose($(that).parent().parent()[0]);
            }
        });
    });

    /*
        5. 编辑商品
            1. 点击编辑按钮弹出一个确认框
            2. 把商品尺码数量 的代码放到确认框里面
            3. 准备一个尺码和数量的模板
            4. 需要所有尺码 当前尺码 所有数量 当前数量  传入模板里面
            5. 把模板生成 放到确认框的内容里面
            6. 放上去了之后让尺码数量能够点击(放上去后初始化)
            7. 在确认框点击了确定 获取最新的尺码数量 去编辑 调用API传入参数  编辑成功刷新页面
            8. 点击了取消 就列表滑回去
    */
    // 1. 给编辑按钮添加点击事件
    $('.cart-list').on('tap', '.btn-edit', function() {
        var that = this;
        // 2. 拿到当前编辑商品的对象
        var product = $(this).data('product');
        // 3. 尺码是字符串 30-50 处理成数组
        var min = product.productSize.split('-')[0] - 0;
        var max = product.productSize.split('-')[1];
        product.productSize = [];
        for (var i = min; i <= max; i++) {
            product.productSize.push(i);
        }
        console.log(product);
        // 4. 调用模板 生成html  传入当前的商品对象 拿当前商品对象去渲染模板
        var html = template('editCartTpl', product);
        console.log(html);
        // 5. 使用正则去掉字符串里面的回车换行
        html = html.replace(/[\r\n]/g, "");
        console.log(html);
        // 因为html字符串里面有很多回车换行 到了确认框里面会变成br标签 在放进去之前要把回车换行去掉
        // 6. 把准备的好的编辑模板放到确认框里面
        mui.confirm(html, '编辑商品', ['确定', '取消'], function(e) {
            // 8. 判断点击确定还是取消
            if (e.index == 0) {
                // 9. 点击确定 拿到最新改的尺码数量 调用APi传参编辑
                $.ajax({
                    url: '/cart/updateCart',
                    type: 'post',
                    data: {
                        id: product.id, // 当前购物车id
                        size: $('.btn-size.active').data('size'), // 当前选择尺码
                        num: mui('.mui-numbox').numbox().getValue() //当前选择数量
                    },
                    success: function(data) {
                        // 10. 编辑成功就调用查询购物车刷新页面
                        if (data.success) {
                            queryCart();
                        }
                    }
                });
            } else {
                // 10. 点击取消 把侧滑列表滑动回去
                mui.swipeoutClose($(that).parent().parent()[0]);
            }
        });
        // 7. 等到代码放到确认框后再初始化 尺码 和 数量
        // 7.1 数字框也是动态添加要手动初始化  但这个时候只是能点击 还没有值
        // mui('.mui-numbox').numbox()
        // 7.2 初始化的时候 默认给赋值为当前选择的数量
        mui('.mui-numbox').numbox().setValue(product.num);
        // 7.3 尺码默认也是不能点击的手动初始化
        $('.btn-size').on('tap', function() {
            $(this).addClass('active').siblings().removeClass('active');
        });
    });


    // 把请求购物车商品数据函数封装起来
    function queryCart() {
        $.ajax({
            url: '/cart/queryCartPaging',
            data: { page: 1, pageSize: 4 },
            beforeSend: function() { // 请求之前会触发的回调函数
                // 请求之前显示遮罩层
                $('.mask').show();
            },
            complete: function() { // 请求之后会触发函数
                // 请求之后隐藏遮罩层
                $('.mask').hide();
            },
            success: function(data) {
                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                if (data.error) {
                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    // 注意页面刚刚加载请求数据 可能没有数据 也要把数据处理成一个对象 
                    console.log(data instanceof Array);
                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                    if (data instanceof Array) {
                        data = {
                            data: data
                        }
                    }
                    console.log(data);
                    // 调用模板方法生成html
                    var html = template('cartListTpl', data);
                    // 渲染到购物车列表的容器里面
                    $('.cart-list').html(html);
                }
            }
        });
    }
})
