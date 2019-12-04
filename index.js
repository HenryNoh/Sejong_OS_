const express = require('express')
const path = require('path')
const app = express()
const cheerio = require('cheerio')
const request = require('request')
const iconv = require('iconv-lite')

var rtList = [];
var ulList = [];
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use(express.json());
app.use(express.urlencoded());

// cheerio.set('headers',{
//     'user-agent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
//     'Accept-Charset': 'utf-8'
// });
// ------------------------------------------crawling start---------------------------------------
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

// ------------------------------------------crawling finish--------------------------------------

// ------------------------------------------render start------------------------------------------
// ------------------------------------------total start------------------------------------------
app.post('/search',(req,res)=>{
    searching_blog_naver(req,res);
})
function searching_blog_naver(req,response){
    var options1 = {
        url : encodeURI(`https://search.naver.com/search.naver?where=post&sm=tab_jum&query=${req.body.search_word}`),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
        }
    }
    request(options1, function (err, res, body){
        if (err) throw err
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_blog_top");
        $list.each(function(i,elem){
            ulList[i]={
                title: $(this).find('dl > dt > a').text(),
                url: $(this).find('dl > dt > a').attr('href'),
                text: $(this).find('dl > dd.sh_blog_passage').text(),
                img: $(this).find(' div > a.sp_thmb.thmb80 > img').attr('src'),
            }
        })
        searching_web_naver(req,response);
    })
}
function searching_web_naver(req,response){
    var options2 = {
        url : encodeURI(`https://search.naver.com/search.naver?where=webkr&sm=tab_jum&query=${req.body.search_word}`),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
        },
        encoding:null
    }
    request(options2, function (err, res, body){
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
        searching_blog_daum(req,response);
    })
}
function searching_blog_daum(req,response){
    var options3 = {
        url : encodeURI(`https://search.daum.net/search?w=blog&enc=utf8&q=${req.body.search_word}`),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
        },
        encoding:null
    }
    request(options3, function (err, res, body){
        if (err) throw err
        $ = cheerio.load(body);
        $list = $("#blogColl > div > ul.list_info").children("li");
        $list.each(function(i,elem){
            ulList[i+20]={
                title: $(this).find('div.wrap_cont > div > div > a').text(),
                url: $(this).find('div.wrap_cont > div > div > a').attr('href'),
                text: $(this).find('div.wrap_cont > div > p').text(),
                img: $(this).find('img').attr('src')
            }
        })
        searching_web_daum(req,response);
    })
}
function searching_web_daum(req,response){
    var options4 = {
        url : encodeURI(`https://search.daum.net/search?w=site&enc=utf8&q=${req.body.search_word}`),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
        },
        encoding:null
    }
    request(options4, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#siteColl > div > div > ul.list_info").children("li");
        $list.each(function(i,elem){
            ulList[i+30]={
                title: $(this).find('div.wrap_cont > div > div > a').text(),
                url: $(this).find('div.wrap_cont > div > div > a').attr('href'),
                text: $(this).find('div.wrap_cont > div > p').text(),
                img: $(this).find('img').attr('src')
            }
        })
        searching_google(req,response);
    })
}
function searching_google(req,response){
    var options5 = {
        url : encodeURI(`https://www.google.com/search?q=${req.body.search_word}`),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
        },
        encoding:null
    }
    request(options5, function (err, res, body){
        if (err) throw err
        $ = cheerio.load(body);
        $list = $("#rso >div > div").children("div.g");
        $list.each(function(i,elem){
            ulList[i+40]={
                title: $(elem).find('div.r > a > h3 > span').text(),
                url: $(elem).find('div.r > a').attr('href'),
                text: $(elem).find('div.s > div > span').text(),
                img: $(elem).find('div.s > div > a > g-img > img').attr('alt')
            }
        })
        response.render(__dirname+'/views/search.ejs',{data:ulList});
    })
}
// ------------------------------------------total finish------------------------------------------

// ------------------------------------------naver start-------------------------------------------
app.post('/naver',(req,res)=>{
    searching_blog_naver2(req,res);
})
function searching_blog_naver2(req,response){
    request(`https://search.naver.com/search.naver?where=post&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_blog_top");
        $list.each(function(i,elem){
            ulList[i*2]={
                title: $(this).find('dl > dt > a').text(),
                url: $(this).find('dl > dt > a').attr('href'),
                text: $(this).find('dl > dd.sh_blog_passage').text(),
                img: $(this).find(' div > a.sp_thmb.thmb80 > img').attr('src'),
            }
        })
        searching_web_naver2(req,response);
    })
}
function searching_web_naver2(req,response){
    request(`https://search.naver.com/search.naver?where=webkr&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_web_top");
        $list.each(function(i,elem){
            ulList[(i*2+1)]={
                title: $(this).find('dt > a').text(),
                url: $(this).find('dt > a').attr('href'),
                text: $(this).find('dd').text(),
                img: $(this).find('img').attr('src')
            }
        })
        response.render(__dirname+'/views/templates/naver.ejs',{data:ulList});
    })
}
// ------------------------------------------naver finish------------------------------------------

// ------------------------------------------daum start--------------------------------------------
app.post('/daum',(req,res)=>{
    searching_blog_naver2(req,res);
})
function searching_blog_naver2(req,response){
    request(`https://search.naver.com/search.naver?where=post&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_blog_top");
        $list.each(function(i,elem){
            ulList[i*2]={
                title: $(this).find('dl > dt > a').text(),
                url: $(this).find('dl > dt > a').attr('href'),
                text: $(this).find('dl > dd.sh_blog_passage').text(),
                img: $(this).find(' div > a.sp_thmb.thmb80 > img').attr('src'),
            }
        })
        searching_web_naver2(req,response);
    })
}
function searching_web_naver2(req,response){
    request(`https://search.naver.com/search.naver?where=webkr&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_web_top");
        $list.each(function(i,elem){
            ulList[(i*2+1)]={
                title: $(this).find('dt > a').text(),
                url: $(this).find('dt > a').attr('href'),
                text: $(this).find('dd').text(),
                img: $(this).find('img').attr('src')
            }
        })
        response.render(__dirname+'/views/templates/daum.ejs',{data:ulList});
    })
}
// ------------------------------------------daum finish-------------------------------------------

// ------------------------------------------google start------------------------------------------
app.post('/google',(req,res)=>{
    searching_blog_naver2(req,res);
})
function searching_blog_naver2(req,response){
    request(`https://search.naver.com/search.naver?where=post&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_blog_top");
        $list.each(function(i,elem){
            ulList[i*2]={
                title: $(this).find('dl > dt > a').text(),
                url: $(this).find('dl > dt > a').attr('href'),
                text: $(this).find('dl > dd.sh_blog_passage').text(),
                img: $(this).find(' div > a.sp_thmb.thmb80 > img').attr('src'),
            }
        })
        searching_web_naver2(req,response);
    })
}
function searching_web_naver2(req,response){
    request(`https://search.naver.com/search.naver?where=webkr&sm=tab_jum&query=${req.body.search_word}`, function (err, res, body){
        if (err) throw err   
        $ = cheerio.load(body);
        $list = $("#elThumbnailResultArea").children("li.sh_web_top");
        $list.each(function(i,elem){
            ulList[(i*2+1)]={
                title: $(this).find('dt > a').text(),
                url: $(this).find('dt > a').attr('href'),
                text: $(this).find('dd').text(),
                img: $(this).find('img').attr('src')
            }
        })
        response.render(__dirname+'/views/templates/google.ejs',{data:ulList});
    })
}
// ------------------------------------------google finish-----------------------------------------
// ------------------------------------------render finish-----------------------------------------
app.listen(3000)