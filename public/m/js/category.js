var gallery = mui('.mui-slider');
gallery.slider({
    interval: 500 //自动轮播周期，若为0则不自动播放，默认为0；
});
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false,
    bounce: true,
});
$.ajax({
    type: "get",
    url: " /category/queryTopCategory",
    data: null,
    dataType: "json",
    success: function (response) {
        let html = template('tpl-left', {
            list: response.rows
        })
        $('#l-content').html(html);
    }
});
reand(1)
$('#l-content').on('touchstart','li',function(){
    $(this).addClass('active').siblings().removeClass('active')
    // console.log($(this).data('id'))
    reand($(this).data('id'))
})
function reand(id){
    $.ajax({
        type: "get",
        url: " /category/querySecondCategory",
        data: {id:id},
        dataType: "json",
        success: function (obj) {
            let html2=template('tpl-right',{list:obj.rows})
            $('#category-right').html(html2);
        }
    });
}