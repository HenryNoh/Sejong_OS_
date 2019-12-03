$(document).ready(function() {
  $('.hamburger-button').click(function(e){
    e.preventDefault();
    $('body').toggleClass('nav_active');
    $('.one').click(function(e){
      e.preventDefault();
    });
    if($('body').hasClass('nav_active')){
        $('.container_mp').click(function(e){    
          $('body').removeClass('nav_active');
        }) 
        $('.container_main, .body').click(function(e){    
          $('body').removeClass('nav_active');
        })
      }
  });

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
