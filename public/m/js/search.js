$(function(){
    let localgo=new Lee('mydata');
    localgo.queryHistory().addData().clearhistory().delecthistory()
})
let Lee=function(key){
    this.key=key
}

Lee.prototype={
    getlocal:function(){
        this.localData=JSON.parse(localStorage.getItem(this.key)||'[]')
    },
    setlocal:function(){
        localStorage.setItem(this.key,JSON.stringify(this.localData))
    },
    addData:function(){
        this.getlocal();
        $('.btn-search').on('tap',function(){
            let search=$('.search-text').val();
            if(!search.trim()){
                mui.toast('不能为空请重新搜索',{ duration:'long', type:'div' });
                return ;
            }
            if(this.localData.indexOf(search.trim())!=-1){
                this.localData.splice(this.localData.indexOf(search.trim()),1);
            }
            this.localData.unshift(search.trim())
            this.setlocal()
        }.bind(this)) 
        return this
    },
    queryHistory:function(){
        this.getlocal();
        let html=template('tpl-list',{data:this.localData});
        $('.mui-table-view').html(html);
        return this
    },
    clearhistory:function(){
        $('.mui-card-header').on('tap','a',()=>{
            localStorage.clear();
            this.queryHistory()
        })
        return this
    },
    delecthistory(){
        let that=this
        $('.mui-table-view').on('tap','.mui-badge',function(){
            console.log(1)
            that.getlocal();
            that.localData.splice($(this).data('index'));
            that.setlocal()
            that.queryHistory()
        })
    }
}   