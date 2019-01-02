$(function() {
    /*1. 商品搜素
    	1. 拿到搜索页面传递过来参数?search=鞋# 拿到参数中鞋
    	2. 调用查询商品列表的API查询商品列表数据
    	3. 创建商品列表的模板 传入数据
    	4. 把模板渲染到页面*/
    // 1. 获取url中的参数的值 按照=分割取第二个值(索引是1) 进行转码
    // 使用一个函数 根据参数名去参数的值
    var search = getQueryString('search');
    // console.log(search);
    // 2. 调用查询商品数据的函数
    queryProduct();
    
    /*2. 商品列表的商品搜索功能
    		1. 点击搜索按钮获取当前输入的值  
    		2. 做非空判断
    		3. 调用API传入当前要搜索的商品关键字
    		4. 接受返回的商品数据 调用模板渲染页面
    */
    // 1. 给当前搜索按钮添加点击事件
    $('.btn-search').on('tap', function() {
        // 2. 获取当前输入框的值  只要把外面的全局的search覆盖
        search = $('.input-search').val();
        console.log(search);
        queryProduct();
    });

    // 由于商品查询经常使用 封装到一个公共函数里面 方便调用
    function queryProduct() {
        // 3. 根据当前输入的search发送请求渲染页面
        $.ajax({
            url: '/product/queryProduct',
            beforeSend: function() { // 请求之前会触发的回调函数
                // 请求之前显示遮罩层
                $('.mask').show();
            },
            complete: function() { // 请求之后会触发函数
                // 请求之后隐藏遮罩层
                $('.mask').hide();
            },
            // page 第几页 pageSize 每页大小 proName搜索关键字
            data: { page: 1, pageSize: 4, proName: search },
            success: function(data) {
                // 3. 调用模板生成html
                var html = template('productListTpl', data);
                // 4. 渲染到商品列表内容的ul
                $('.product-list .content ul').html(html);
            }
        });
    }

    /*3. 商品排序
		1. 如何排序 调用API传入参数进行排序 如果价格传入price 数量传入num
		2. 排序顺序 price=1升序 从小到大  price=2降序  从大到小
		3. 点击了排序按钮后 如果现在是升序(1) 点击了后变成降序(2)
		4. 在a标签默认存储一个排序顺序 默认1升序
		5. 点击后切换这个排序顺序的属性的值
		6. 还需要知道当前点击a排序方式是price还是num  获取a身上的排序方式
		7. 调用APi传入 传入对应排序方式和排序顺序即可 后面渲染页面
    */
    // 1. 给所有排序的a添加点击事件
    $('.product-list .title ul li a').on('tap', function() {
        // 2. 获取当前排序的顺序
        var sort = $(this).data('sort');
        // 3. 修改整个sort的值 如果是1改成2  如果是2改成1
        sort = sort == 1 ? 2 : 1;
        // 4. 变了后重新改变页面的sort的值为当前变了的值
        $(this).data('sort', sort);
        // 5. 获取当前排序的方式
        var sortType = $(this).data('sort-type');
        // console.log(sortType);
        // var obj = {
        // 		sortType:1
        // }
        // 给对象添加一个属性的名称 这个名称是一个变量 你是要取变量里面的值作为对象的属性名称
        // 不能用点 也不能直接在{}里面 只能使用[]添加
        // obj.sortType = 2;
        // obj[sortType] = 2;
        // console.log(obj);
        var params = { page: 1, pageSize: 4, proName: search};
        // 给对象动态添加键 和 值  键名是变量不能使用.不能直接在{}里面加 一定要使用[]
        params[sortType] = sort;
        console.log(params);
        $.ajax({
            url: '/product/queryProduct',
            // page 第几页 pageSize 每页大小 proName搜索关键字
            data: params,
            success: function(data) {
                // 3. 调用模板生成html
                var html = template('productListTpl', data);
                // 4. 渲染到商品列表内容的ul
                $('.product-list .content ul').html(html);
            }
        });
        /* 
	         if (sortType == 'price') {
	            // 6. 调用API传入对应的参数
	            $.ajax({
	                url: '/product/queryProduct',
	                // page 第几页 pageSize 每页大小 proName搜索关键字
	                data: { page: 1, pageSize: 4, proName: search, price: sort },
	                success: function(data) {
	                    // 3. 调用模板生成html
	                    var html = template('productListTpl', data);
	                    // 4. 渲染到商品列表内容的ul
	                    $('.product-list .content ul').html(html);
	                }
	            });
	         } else if (sortType == 'num') {
	            // 6. 调用API传入对应的参数
	            $.ajax({
	                url: '/product/queryProduct',
	                // page 第几页 pageSize 每页大小 proName搜索关键字
	                data: { page: 1, pageSize: 4, proName: search, num: sort },
	                success: function(data) {
	                    // 3. 调用模板生成html
	                    var html = template('productListTpl', data);
	                    // 4. 渲染到商品列表内容的ul
	                    $('.product-list .content ul').html(html);
	                }
	            });
	         }
        */
    });

    /*4. 下拉刷新和上拉加载
    	1. 调用MUI的初始化方法初始化下拉刷新和上拉加载效果
    	2. 指定下拉刷新的回调函数 实现刷新数据
    	3. 调用MUI结束下拉刷新的效果不然会一直转
    	4. 指定上拉加载的回调函数加载更多数据
    	5. 定义一个page当前页码数 每次上拉把page++ 请求下一页数据(更多的数据)
    	6. 把数据渲染后追加到页面 使用append
    	7. 追加完成结束上拉加载效果
    	8. 判断当如果上拉没有数据的时候 要结束上拉并且提示没有数据了 传入一个true
    	9. 但是再次下拉的时候需要能够重新上拉所以下拉完了后要重置上拉加载效果
    	10. 而且page也要从头开始 重置为1
    */

    // 4. 定义一个全局变量page表示当前页面数
    var page = 1;
    // 1. 初始化下拉刷新的效果
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {    
                contentdown: "你正在进行下拉还可以继续拉...", 
                contentover: "你已经拉到了可以刷新的位置 可以松手了",
                contentrefresh: "正在给你拼命刷新数据...", 
                callback: function() { //下拉刷新的回调函数 进行数据请求 下拉松手后就会还执行
                    //本地速度很快 加一个定时器延迟1秒钟执行请求和结束下拉效果
                    setTimeout(function() {
                        // 2. 拉了之后请求数据刷新页面 发请求刷新数据即可
                        queryProduct();
                        // 3. 当数据请求完毕页面刷新完毕后 结束下拉刷新  函数版本不一样 函数名不一样 注意当前结束函数
                        // endPulldownToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 9. 下拉完成后 重置这个上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 10. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            // 初始化上拉
            up: {
                contentrefresh: "正在拼命加载更多数据...", 
                contentnomore: '再下实在是给不了更多!',
                callback: function() {
                    // 请求更多数据 在页面中去追加
                    // 如果请求更多数据 修改参数的page值 第一页是1  第二页2 第三页3                   
                    setTimeout(function() {
                        // 5. 每次上拉让当前的page++
                        page++;
                        // 6. 调用API传入对应的参数 请求++之后的数据
                        $.ajax({
                            url: '/product/queryProduct',
                            // page 第几页使用当前++后的page变量 pageSize 每页大小 proName搜索关键字
                            data: { page: page, pageSize: 4, proName: search },
                            success: function(data) {
                                // 7. 判断数据还有没有长度 有长度表示有数据 追加 没长度 表示没有数据 就结束下拉并且提示没有数据
                                // data是对象 {data:[]}  data.data取 data对象里面的data数组 里面data数组的.length
                                if (data.data.length > 0) {
                                    // 7.1 调用模板生成html
                                    var html = template('productListTpl', data);
                                    // 7.2 追加到商品列表内容的ul
                                    $('.product-list .content ul').append(html);
                                    // 7.3 加载完成后结束上拉加载的效果 MUI 结束上拉的函数endPullupToRefresh
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                }else{
                                	// 8. 没有长度提示没有数据 了 endPullupToRefresh提示没有数据传人一个true
                                	mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });

    /*5. 点击立即购买跳转到商品详情去购买商品
	    1. 给所有购买按钮添加点击事件
	    2. 获取当前点击商品id 
	    3. 使用location跳转商品详情页面  把id作为参数传递到商品详情
	    */
	 // 1. 给所有购买按钮添加点击事件
	 $('.product-list').on('tap','.btn-buy',function () {
	 		// 2. 获取当前点击商品id 
	 		var id = $(this).data('id');
	 		// 3. 使用location跳转商品详情页面  把id作为参数传递到商品详情
	 		location = 'detail.html?id='+id;
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
});
// http://localhost:3000/m/productlist.html?search=%E9%9E%8B&price=1&num=2
// 根据url中参数名获取值
// ?search=%E9%9E%8B&price=1&num=2 参数
// 参数名 = search  参数值 = 鞋
// 参数名 = price  参数值 = 1
// 参数名 = num  参数值 = 2
// function getQueryString(name){
// 	// console.log(location);
// 	// console.log(location.search);
// 	// 1. 获取整个url参数的值的字符串 去掉第一个字符串 按照&分割成一个数组
// 	var urlParams = location.search.substr(1).split('&');
// 	// var urlParams = location.search.substring(1,location.search.length);
// 	// console.log(urlParams);
// 	for (var i = 0; i < urlParams.length; i++) {
// 		// search=%E9%9E%8B  =前面参数名 以=分割 如果等号前面的和参数名一样 返回=号后面的参数的值
// 		if(name == urlParams[i].split('=')[0]){
// 			// 返回当前参数的值 同时转码
// 			return decodeURI(urlParams[i].split('=')[1]);
// 		}
// 	}
// }
// console.log(getQueryString('search'));//鞋
// console.log(getQueryString('price'));//1
// console.log(getQueryString('num'));//2


// function getQueryString(name) {
//     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
//     var r = window.location.search.substr(1).match(reg);
//     console.log(r);
//     if (r != null) {
//         //转码方式改成 decodeURI
//         return decodeURI(r[2]);
//     }
//     return null;
// }
