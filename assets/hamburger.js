$(document).ready(function() {
  function realtime(){
    $.each($('.rt_naver_table .one'), function(index, elem){
      setTimeout(function(){
        $(elem).addClass('active');
      },1000*index);
    });
    $.each($('.rt_daum_table .one'), function(index, elem){
      setTimeout(function(){
        $(elem).addClass('active');
      },1000*index)
    });
  }

  realtime();
  setInterval(function(){
    $.each($('.rt_naver_table .one'), function(index, elem){
      $(elem).removeClass('active');
    });
    $.each($('.rt_daum_table .one'), function(index, elem){
      $(elem).removeClass('active');
    });
    realtime();
  },10000);

  
})
