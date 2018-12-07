import header from '../public/js/header.js';
import '../main.js';
import '../main.scss';
import '../scss/home.scss';
$(function(){
    console.log(header);
    header.list.add();
    async function getMyPerson(){
        var last = await $.get('/assets/json/person.json');
        console.log('我是last',last);
        var data = last.data;
        var html = "";
        for(var i = 0; i < data.length;i++){
            var value = data[i];
            html += 
            `
                <li>${value.name}</li>  
            `
        }
        $(".home .list").append(html);
    }
    getMyPerson();
    console.log(2333765,"嘿嘿");
    var brodcast = new Broadcast();
    console.log(brodcast);
    var pages = new Page({
        id: 'pagination',
        pageTotal: 20, 
        pageAmount: 10,  
        dataTotal: 200, 
        curPage:1, 
        pageSize: 5, 
        prevText:"Previous",
        nextText:"Next",
        firstText:"First",
        lastText:"Last",
        showPageTotalFlag:false, //数据统计
        showSkipInputFlag:false, //跳转
        getPage: function (page) {
            console.log(page);
        }
    });
    pages.init();
    console.log(pages);
})
