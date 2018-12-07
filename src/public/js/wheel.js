(function(window,document){
    //轮播插件
    function Broadcast(data){
        if(data){
            this.speed = data.speed?data.speed:300;
            this.grid = data.grid?data.grid:1;
            this.step = 0;
            this.state = false;
            this.scale = data.scale?data.scale:2/3;
            this.father = data.father?'.x-broadcast ' + '.' + data.father:'.x-broadcast';
            this.boxPadding = data.boxPadding?data.boxPadding:'0 10px';
        }else{
            this.speed = 300;
            this.grid = 1;
            this.father = '.x-broadcast';
            this.scale = 2/3;
            this.step = 0;
            this.state = false;
            this.boxPadding = "0";
        }
    }
    Broadcast.prototype = {
        //初始化函数
        init:function(){
            //选出x-imgBox
            var selectorImgBox = this.father + ' .x-imgList .x-imgBox';
            //通过轮播放几张图片-grid算出每个box的宽度
            var boxWidth = $(this.father).width()/this.grid;
            //通过比例算出每个box的高度
            var boxHeight = Math.floor(boxWidth * this.scale);
            // 给imgbox的宽赋值
            $(selectorImgBox).width(boxWidth);
            //给包裹x-imgBox加padding
            $(selectorImgBox).css('padding',this.boxPadding);
            // 给imgbox的高赋值
            $(selectorImgBox).height(boxHeight);
            //给父元素的高赋值
            $(this.father).height(boxHeight);
            //如果图片给的数量正好等于grid的数量，那么最后一个box右内边距为0
            //选出包裹imgBox的imgList
            var selectorImgList = this.father + ' .x-imgList';
            /////////////剩下的就开始克隆图片了
            var imgBoxs = $(selectorImgBox);
            //通过循环来计算出imgList的宽度
            var imgListWidth = 0;
            for(var i = 0; i < $(selectorImgBox).length;i++){
                imgListWidth += $(selectorImgBox).eq(i).outerWidth();
            }
            imgListWidth+= $(selectorImgBox).eq(0).outerWidth();
            //给imgList设置宽度
            $(selectorImgList).width(imgListWidth);
        },
        //左边箭头-向右移动
        moveLeft:function(){
            if(!this.state){
                var selectorImgBox = this.father + ' .x-imgList .x-imgBox';
                var selectorImgList = this.father + ' .x-imgList';
                this.step--;
                if(this.step < 0){
                    this.step = $(selectorImgBox).length - 1;
                }
                var step = $(selectorImgBox).width();
                var newElement = $(selectorImgBox).last().clone(true);
                var left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                $(selectorImgList).prepend(newElement);
                $(selectorImgList).css('left',(left - step) + 'px');
                $(selectorImgBox).last().remove();
                left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                var _this = this;
                $(selectorImgList).animate({left:(left + step) + 'px'},this.speed,function(){
                    _this.state = false;
                });
                this.state = true;
            }
        },
        //右边箭头-向左移动
        moveRight:function(){
            if(!this.state){
                var selectorImgBox = this.father + ' .x-imgList .x-imgBox';
                var selectorImgList = this.father + ' .x-imgList';
                this.step++;
                if(this.step > $(selectorImgBox).length - 1){
                    this.step = 0;
                }
                var step = $(selectorImgBox).width();
                var newElement = $(selectorImgBox).eq(0).clone(true);
                var left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                $(selectorImgList).append(newElement);
                var _this = this;
                $(selectorImgList).animate({left:(left - step) + 'px'},this.speed,function(){
                    _this.state = false;
                    $(selectorImgBox).first().remove();
                    var left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                    $(selectorImgList).css('left',(left + step) + 'px');
                });
                this.state = true;
            }
        },
        roundMove:function(index){
            var selectorImgBox = this.father + ' .x-imgList .x-imgBox';
            var selectorImgList = this.father + ' .x-imgList';
            var left = Math.floor($(selectorImgList).css('left').slice(0,-2));
            var distance = index - this.step;
            if(distance < 0 && left == 0){
                if(!this.state){
                    this.step = index;
                    distance = Math.abs(distance);
                    var step = $(selectorImgBox).width();
                    for(var i = 1; i <= distance;i++){
                    var newElement = $(selectorImgBox).eq($(selectorImgBox).length - i).clone(true);
                    $(selectorImgList).prepend(newElement);
                    }
                    var left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                    $(selectorImgList).css('left',(left - distance * step) + 'px');
                    for(var i = 1; i <= distance;i++){
                        $(selectorImgBox).last().remove();
                    }
                    left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                    var _this = this;
                    $(selectorImgList).animate({left:(left + distance * step) + 'px'},this.speed,function(){
                        _this.state = false;
                    });
                    this.state = true;
                }
            }else if(distance > 0 && left == 0){
                this.step = index;
                distance = Math.abs(distance);
                var step = $(selectorImgBox).width();
                for(var i = 0; i < distance;i++){
                    var newElement = $(selectorImgBox).eq(i).clone(true);
                    $(selectorImgList).append(newElement);
                }
                var left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                var _this = this;
                $(selectorImgList).animate({left:(left - distance * step) + 'px'},this.speed,function(){
                    _this.state = false;
                    for(var i = 0; i < distance;i++){
                        $(selectorImgBox).eq(0).remove();
                    }
                    var left = Math.floor($(selectorImgList).css('left').slice(0,-2));
                    $(selectorImgList).css('left',(left + distance * step) + 'px');
                });
            }else{
                this.step = index;
            }
        }
    }
    window.Broadcast = Broadcast;
    // 创建分页构造函数
    function Page(_ref) {
        var pageSize = _ref.pageSize,
            pageTotal = _ref.pageTotal,
            curPage = _ref.curPage,
            id = _ref.id,
            getPage = _ref.getPage,
            showPageTotalFlag = _ref.showPageTotalFlag,
            showSkipInputFlag = _ref.showSkipInputFlag,
            pageAmount = _ref.pageAmount,
            dataTotal = _ref.dataTotal;
            prevText = _ref.prevText;
            nextText = _ref.nextText;
            firstText = _ref.firstText;
            lastText = _ref.lastText;
        if(!pageSize){
            pageSize = 0
        };
        if(!pageSize){
            pageSize = 0
        };
        if(!pageTotal){
            pageTotal = 0
        };
        if(!pageAmount){
            pageAmount = 0
        };
        if(!dataTotal){
            dataTotal = 0
        };
        this.pageSize = pageSize || 5; //分页个数
        this.pageTotal = pageTotal; //总共多少页
        this.pageAmount = pageAmount; //每页多少条
        this.dataTotal = dataTotal; //总共多少数据
        this.curPage = curPage || 1; //初始页码
        this.ul = document.createElement('ul');
        this.id = id;
        this.getPage = getPage;
        this.showPageTotalFlag = showPageTotalFlag || false; //是否显示数据统计
        this.showSkipInputFlag = showSkipInputFlag || false; //是否支持跳转
        this.prevText = prevText || '<'; //是否支持跳转
        this.nextText = nextText || '>'; //是否支持跳转
        this.firstText = firstText || '首页'; //是否支持跳转
        this.lastText = lastText || '尾页'; //是否支持跳转
        if(dataTotal >0 && pageTotal>0){
            this.init();
        }else{
            console.error("总页数或者总数据参数不对")
        }
    };
    // 给实例对象添加公共属性和方法
    Page.prototype = {
        init: function init() {
            var pagination = document.getElementById(this.id);
            pagination.innerHTML = '';
            this.ul.innerHTML = '';
            pagination.appendChild(this.ul);
            var that = this;
            //首页
            that.firstPage();
            //上一页
            that.lastPage();
            //分页
            that.getPages().forEach(function (item) {
                var li = document.createElement('li');
                if (item == that.curPage) {
                    li.className = 'active';
                } else {
                    li.onclick = function () {
                        that.curPage = parseInt(this.innerHTML);
                        that.init();
                        that.getPage(that.curPage);
                    };
                }
                li.innerHTML = item;
                that.ul.appendChild(li);
            });
            //下一页
            that.nextPage();
            //尾页
            that.finalPage();

            //是否支持跳转
            if (that.showSkipInputFlag) {
                that.showSkipInput();
            }
            //是否显示总页数,每页个数,数据
            if (that.showPageTotalFlag) {
                that.showPageTotal();
            }
        },
        //首页
        firstPage: function firstPage() {
            var that = this;
            var li = document.createElement('li');
            li.innerHTML = this.firstText;
            li.className = 'firstPage';
            this.ul.appendChild(li);
            li.onclick = function () {
                var val = parseInt(1);
                that.curPage = val;
                that.getPage(that.curPage);
                that.init();
            };
        },
        //上一页
        lastPage: function lastPage() {
            var that = this;
            var li = document.createElement('li');
            li.innerHTML = this.prevText;
            li.className = "prev"
            if (parseInt(that.curPage) > 1) {
                li.onclick = function () {
                    that.curPage = parseInt(that.curPage) - 1;
                    that.init();
                    that.getPage(that.curPage);
                };
            } else {
                li.className = 'disabled';
            }
            this.ul.appendChild(li);
        },
        //分页
        getPages: function getPages() {
            var pag = [];
            if (this.curPage <= this.pageTotal) {
                if (this.curPage < this.pageSize) {
                    //当前页数小于显示条数
                    var i = Math.min(this.pageSize, this.pageTotal);
                    while (i) {
                        pag.unshift(i--);
                    }
                } else {
                    //当前页数大于显示条数
                    var middle = this.curPage - Math.floor(this.pageSize / 2),
                        //从哪里开始
                        i = this.pageSize;
                    if (middle > this.pageTotal - this.pageSize) {
                        middle = this.pageTotal - this.pageSize + 1;
                    }
                    while (i--) {
                        pag.push(middle++);
                    }
                }
            } else {
                console.error('当前页数不能大于总页数');
            }
            if (!this.pageSize) {
                console.error('显示页数不能为空或者0');
            }
            return pag;
        },
        //下一页
        nextPage: function nextPage() {
            var that = this;
            var li = document.createElement('li');
            li.innerHTML = this.nextText;
            li.className = "next"
            if (parseInt(that.curPage) < parseInt(that.pageTotal)) {
                li.onclick = function () {
                    that.curPage = parseInt(that.curPage) + 1;
                    that.init();
                    that.getPage(that.curPage);
                };
            } else {
                li.className = 'disabled';
            }
            this.ul.appendChild(li);
        },
        //尾页
        finalPage: function finalPage() {
            var that = this;
            var li = document.createElement('li');
            li.innerHTML = this.lastText;
            li.className = 'lastPage';
            this.ul.appendChild(li);
            li.onclick = function () {
                var yyfinalPage = that.pageTotal;
                var val = parseInt(yyfinalPage);
                that.curPage = val;
                that.getPage(that.curPage);
                that.init();
            };
        },
        //是否支持跳转
        showSkipInput: function showSkipInput() {
            var that = this;
            var li = document.createElement('li');
            li.className = 'totalPage jump';
            var span1 = document.createElement('span');
            span1.innerHTML = '跳转到';
            li.appendChild(span1);
            var input = document.createElement('input');
            input.setAttribute("type","number");
            input.onkeydown = function (e) {
                var oEvent = e || event;
                if (oEvent.keyCode == '13') {
                    var val = parseInt(oEvent.target.value);
                    if (typeof val === 'number' && val <= that.pageTotal && val>0) {
                        that.curPage = val;
                        that.getPage(that.curPage);
                    }else{
                        alert("请输入正确的页数 !")
                    }
                    that.init();
                }
            };
            li.appendChild(input);
            var span2 = document.createElement('span');
            span2.innerHTML = '页';
            li.appendChild(span2);
            this.ul.appendChild(li);
        },
        //是否显示总页数,每页个数,数据
        showPageTotal: function showPageTotal() {
            var that = this;
            var li = document.createElement('li');
            li.innerHTML = '共&nbsp' + that.pageTotal + '&nbsp页';
            li.className = 'totalPage';
            this.ul.appendChild(li);
            var li2 = document.createElement('li');
            li2.innerHTML = '每页&nbsp' + that.pageAmount + '&nbsp条';
            li2.className = 'totalPage';
            this.ul.appendChild(li2);
            var li3 = document.createElement('li');
            li3.innerHTML = '合计&nbsp' + that.dataTotal + '&nbsp条数据';
            li3.className = 'totalPage';
            this.ul.appendChild(li3);
        }
    };
    window.Page = Page;
    //单页面跳转(hash跳转)
    function Router(routeArr,path) {
        this.routes = routeArr||{};
        this.currentUrl = '';
    }
    Router.prototype = {
        route:function(path,callback){
            this.routes[path] = callback || function(){};
        },
        refresh:function(){
            this.currentUrl = location.hash || '/';
            if(this.currentUrl == '/') return
            var func = this.routes [ this.currentUrl] || function(){};
            func(this.currentUrl);
        },
        init:function(index){
            window.addEventListener('load', this.refresh.bind(this), false);
            window.addEventListener('hashchange', this.refresh.bind(this), false);
        }
    }
    window.Router = Router;
    //多行文本溢出省略号表示
    function Splitstr(number){
        this.number = 0;
    }
    Splitstr.prototype = {
        ellipsis:function(element){
            var lineH = Math.floor(element.css('lineHeight').slice(0,-2)); 
            var divH = Math.floor(element.height()); 
            var divW = Math.floor(element.width()); 
            var fontSize = Math.floor(element.css('fontSize').slice(0,-2)); 
            var col = Math.floor(divW/fontSize);
            var row = Math.floor(divH/lineH);
            var wordLength = col * row;
            var text = $.trim(element.text());
            if(text.length > wordLength){
                element.text(text.slice(0,wordLength - 3) + ' ...');
            }
        }
    }
    window.Splitstr = Splitstr;
})(window,document);

