$(function() {
    /*1. 添加搜索记录
	    1. 点击搜索按钮获取当前输入的内容
	    2. 对输入内容进行非空判断
	    3. 获取之前存储的记录 如果有值就把之前记录转成数组来使用  如果没有值就使用空数组
	    4. 添加值之前进行判断 如果值已经在数组中存在了先把存在的值删掉 在数组中的前面添加
	    5. 添加完成后把数组重新保存到本地存储里面*/
    // 1. 给搜索按钮添加点击事件
    $('.btn-search').on('tap', function() {
        // 2. 获取输入框输入的内容
        var search = $('.input-search').val();
        // 3. 对象输入内容进行非空判断
        // 空格也是不合法的把首尾空格去掉search.trim()
        // !取反!false == true  !true == false
        if (!search.trim()) {
            alert('请输入要搜索的商品');
            return;
        }
        // 4. 获取之前本地存储存储的值 如果有值使用默认值 没有值就使用空数组
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        console.log(historyData);
        // 5. 往本地存储的数组中添加值
        // 5.1 添加之前要判断当前输入值在数组中是否存在
        if (historyData.indexOf(search) != -1) {
            //如果indexOf不等于-1表示输入内容在数组中存在 删除当前数组中的这个元素
            //5.2 splice 删除数组中的一个元素 第一个参数是元素索引 第二个参数删除索引后的几个元素
            historyData.splice(historyData.indexOf(search), 1);
        }
        // 5.3 如果有重复的上面已经删掉 删掉了后往前加就没问题了
        historyData.unshift(search);
        // 6. 把数据存储到本地存储中
        localStorage.setItem('searchHistory', JSON.stringify(historyData));
        // 7. 添加完成搜索记录后调用查询重新渲染搜索历史列表
        queryHistory();
        // 8. 加完了记录后跳到商品列表页面实现真实的商品搜索
        location = 'productlist.html?search='+search;
    });
    queryHistory();
    /*2. 查询搜索记录
    	1. 获取本地存储中存储的数据
        2. 创建一个模板去生成html
        3. 渲染到搜索历史列表
    */
    function queryHistory() {
        // 1. 获取本地存储中的数据 没有值设置为空数组
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 2. 数据是一个数组 模板引擎要求对象 需要包装一下
        historyData = { rows: historyData };
        console.log(historyData);
        // 3. 调用模板方法生成html
        var html = template('searchListTpl', historyData);
        // 4. 把html渲染到ul里面
        $('.search-history .mui-table-view').html(html);
    }
    /*3. 删除搜素记录
	    1. 点击某个x删掉当前记录
	    2. 获取当前点击x的删掉元素的索引
	    3. 获取整个记录 删掉当前索引的元素
	    4. 删除完成后重新把数组保存到本地存储中
	    5. 重新查询刷新页面
    */
    // 1. 给所有x按钮添加点击事件
    $('.search-history .mui-table-view').on('tap', '.btn-delete', function() {
        // 2. 获取当前点击x的删除的元素的索引
        var index = $(this).data('index');
        // 3. 获取本地存储的所有数据
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 4. 当前索引元素删除
        historyData.splice(index, 1);
        console.log(historyData);
        // 5. 把删除完成后的数组重新保存到存储里面
        localStorage.setItem('searchHistory', JSON.stringify(historyData));
        // 6. 删除完成搜索记录后调用查询重新渲染搜索历史列表
        queryHistory();
    });
    // 4. 清空搜索记录
    // 1. 给清空按钮添加点击事件
    $('.btn-clear').on('tap', function() {
        // 2. 删除整个searchHistory的键
        localStorage.removeItem('searchHistory');
        // 3. 清空之后重新调用查询刷新页面
        queryHistory();
    });
});
