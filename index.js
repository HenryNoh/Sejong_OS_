const express = require('express')
const path = require('path')
const app = express()
const cheerio = require('cheerio')
const request = require('request')
var rtList = [];
var ulList = [];
var test;

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use(express.json());
app.use(express.urlencoded());

function crawling_naver(){
    crawling_daum();
    request('https://naver.com',function(err,res,body){
        if (err) throw err
        $ = cheerio.load(body);
        $list_rt = $("#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul:nth-child(5)").children("li.ah_item");
        $list_rt.each(function(i,elem){
            rtList[i]={
                number:i+1,
                title:$(this).find(".ah_k").text(),
                href:$(this).find(".ah_a").attr('href')
            }
        });
    })
}
function crawling_daum(){
    render_mainpage();
    request('https://daum.net',function(err,res,body){
        if (err) throw err
        $ = cheerio.load(body);
        $list_rt = $("#mArticle > div.cmain_tmp > div.section_media > div.hot_issue.issue_mini > div.hotissue_mini > ol").children("li");
        $list_rt.each(function(i,elem){
            rtList[i+20]={
                number:i+1,
                title:$(this).find(".link_issue").text(),
                href:$(this).find(".link_issue").attr('href')
            }
        })
    })
}
function render_mainpage(){
    app.get('/',(req,res)=>{
        res.render(__dirname +'/views/mainpage.ejs',{data:rtList});
    })
}
crawling_naver();

app.get('/daum',(req,res)=>{
    res.render(__dirname +'/views/templates/daum.ejs');
})

app.get('/naver',(req,res)=>{
    searching_blog_naver_1(req,res);
})
function searching_blog_naver_1(req,response){
    request(`https://search.naver.com/search.naver?where=post&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_blog_top");
        $list.each(function(i,elem){
            ulList[i]={
                title: $(this).find('dl > dt > a').text(),
                url: $(this).find('dl > dt > a').attr('href'),
                text: $(this).find('dl > dd.sh_blog_passage').text(),
                img: $(this).find(' div > a.sp_thmb.thmb80 > img').attr('src'),
                date: $(this).find('dl > dd.txt_inline').text()
            }
        })
        searching_web_naver_1(req,response);
    })
}
function searching_web_naver_1(req,response){
    request(`https://search.naver.com/search.naver?where=webkr&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_web_top");
        $list.each(function(i,elem){
            ulList[i+10]={
                title: $(this).find('dt > a').text(),
                url: $(this).find('dt > a').attr('href'),
                text: $(this).find('dd').text(),
                img: $(this).find('img').attr('src')
            }
        })
        response.render(__dirname+'/views/templates/naver.ejs',{data:ulList});
    })
}



app.get('/google',(req,res)=>{
    res.render(__dirname +'/views/templates/google.ejs');
})

// app.post('/search',(req,res)=>{
//     res.render(__dirname+'/views/search.ejs',{data:ulList});
// })


app.post('/search',(req,res)=>{
    searching_blog_naver(req,res);
})

function searching_blog_naver(req,response){
    request(`https://search.naver.com/search.naver?where=post&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_blog_top");
        $list.each(function(i,elem){
            ulList[i]={
                title: $(this).find('dl > dt > a').text(),
                url: $(this).find('dl > dt > a').attr('href'),
                text: $(this).find('dl > dd.sh_blog_passage').text(),
                img: $(this).find(' div > a.sp_thmb.thmb80 > img').attr('src'),
                date: $(this).find('dl > dd.txt_inline').text()
            }
        })
        searching_web_naver(req,response);
    })
}
function searching_web_naver(req,response){
    request(`https://search.naver.com/search.naver?where=webkr&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_web_top");
        $list.each(function(i,elem){
            ulList[i+10]={
                title: $(this).find('dt > a').text(),
                url: $(this).find('dt > a').attr('href'),
                text: $(this).find('dd').text(),
                img: $(this).find('img').attr('src')
            }
        })
        response.render(__dirname+'/views/search.ejs',{data:ulList});
    })
}



app.listen(3000)

// searcing_process 네이버 블로그/웹 다음 블로그/웹 구글 크롤링하게 변경
// 실시간검색어 href 추가