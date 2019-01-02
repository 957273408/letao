$(function() {
    var page = 1;
    var pageSize = 10;
    /*  1. 分类信息渲染
            1. 请求用户信息的API /category/querySecondCategoryPaging
            2. 创建模板
            3. 渲染页面*/
    // 调用查询数据函数
    querySecondCategory();

    /*2. 添加品牌
        1. 点击添加品牌的按钮弹出一个 模态框   所属分类 品牌名称 品牌logo
        2. 点击保存 获取当前选择的所属分类 输入品牌名称  拿到品牌图片
        3. 点击保存发送请求添加分类 /category/addSecondCategory 传递当前分类名称
        4. 添加完成后重新调用查询刷新页面*/
    /*1. 动态渲染模态框里面的分类名称
        1. 请求一级分类的API 获取所有分类名称 和分类id 
        2. 动态渲染到模态框的下拉框里面*/
    $.ajax({
        url: '/category/queryTopCategoryPaging',
        data: { page: 1, pageSize: 100 }, // 因为后台没有给查询所有分类API只能 假设后台最多100条数据
        success: function(data) {
            // 2. 把数据动态渲染到下拉框里面
            if (data.rows) {
                var html = '';
                for (var i = 0; i < data.rows.length; i++) {
                    // 把每个option拼接到html模板里面
                    html += '<option value="' + data.rows[i].id + '">' + data.rows[i].categoryName + '</option>';
                }
                console.log(html);
                // 3. 把拼接好的html放到下拉框里面
                $('.category-name').html(html);
            }
        }
    });

    /*2. 上传图片
        1. 给选择图片的框框添加一个change事件 (选择了文件就会触发事件)
        2. 在事件里拿到当前选择的图片
        3. 调用上传图片的API 吧图片  通过参数传递给API
        4. API就会帮你把图片保存到后台 返回一个返回值 返回一个图片地址
        5. 拿到地址了之后就显示到 显示图片的 img上*/

    // $('.brand-logo').on('change', function() {
    //     // 通过input标签files属性获取当前选择的文件  是一个数组 可能有多个文件
    //     var files = this.files;
    //     // console.dir(this.files);
    //     console.log(files);
    //     // formData 就是 form表单参数对象
    //     var formData = new FormData();
    //     // 把图片文件 使用append方法添加到formData对象里面    
    //     // 第一次上传会报错 找不到目录是以为没有放图片的目录 
    //     // 需要在public文件夹里面创建一个 upload文件里面 创建一个brand文件夹 (用来保存图片的文件夹)
    //     // append('file') 当前图片需要添加到的键名 键名 file 键的值就是当前图片
    //     // 一定要注意因为后台通过pic1键获取图片文件  上传的时候要指定这个图片键pic1
    //     formData.append('pic1', files[0]);
    //     $.ajax({
    //         // 指定图片上传的url地址
    //         url: '/category/addSecondCategoryPic',
    //         // 指定类型的post
    //         type: 'post',
    //         // 取消缓存
    //         cache: false,
    //         // 把准备好的表单数据对象 通过data参数传递给API
    //         data: formData,
    //         // processData设置为false。因为data值是FormData对象，不需要对数据做处理。
    //         processData: false,
    //         // contentType设置为false，不设置contentType值，因为是由<form>表单构造的FormData对象，
    //         // 且已经声明了属性enctype="multipart/form-data"，所以这里设置为false。
    //         contentType: false,
    //         // 接收API返回值  返回图片的地址 真实文件地址（nodeJS 做得） 需要把地址保存到数据库
    //         success: function(data) {
    //             console.log(data);
    //             if (data.picAddr) {
    //                 $('.show-logo').attr('src', data.picAddr);
    //             }
    //         },
    //         error: function(err) {
    //             console.log(err);
    //         }
    //     });
    //     // .done(function(data) {// done回调函数 API请求完成后会调用的回调函数
    //     //     console.log(data);
    //     // }).fail(function(err) {// 请求失败的回调函数
    //     //     console.log(err);
    //     // });
    // });
    /*使用jquery fileUpload插件上传文件
        1. 有一个文件框
        2. 获取文件文件框的元素调用 fileupload函数 传递一些参数既可上传
        3. 请求上传成功后接收返回值*/
    $('.brand-logo').fileupload({
        url: '/category/addSecondCategoryPic',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            if (data.picAddr) {
                $('.show-logo').attr('src', data.picAddr);
            }
        },
        // ,
        // done: function(e,data) {
        //     console.log(e);
        //     console.log(data);
        // }
    });

    // 3. 点击保存获取品牌信息调用API实现添加品牌

    $('.btn-save').on('click', function() {
        // 1. 获取当前选择的分类id
        var categoryId = $('.category-name').val();
        console.log(categoryId);
        // 2. 获取当前输入的品牌名称
        var brandName = $('.brand-name').val().trim();
        // 3. 拿到品牌logo 在显示logo的img元素上
        var brandLogo = $('.show-logo').attr('src');
        if (!categoryId) {
            alert('请选择分类');
            return false;
        }
        if (!brandName) {
            alert('请输入品牌名称');
            return false;
        }
        if (!brandLogo) {
            alert('请选择图片');
            return false;
        }
        // 4. 调用添加品牌的API吧品牌数据提交到数据库
        $.ajax({
            url: '/category/addSecondCategory',
            type: 'post',
            data: { brandName: brandName, categoryId: categoryId, brandLogo: brandLogo, hot: 1 },
            success: function(data) {
                console.log(data);
                if(data.success){
                    // 添加成功 重新刷新列表
                    querySecondCategory();
                }
            }
        })
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
                querySecondCategory();
            }
        });
    }

    function querySecondCategory() {
        $.ajax({
            url: '/category/querySecondCategoryPaging',
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
