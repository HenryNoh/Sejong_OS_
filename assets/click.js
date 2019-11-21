$(document).ready(function() {
    $('.hamburger-button').click(function(e){
      console.log('234');
      e.preventDefault();
      $(this).toggleClass('active');
      $('.nav_mobile_sidebar').toggleClass('visible');
    });
  })
  