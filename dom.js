$(document).ready(function(e){
    
    var timer = setTimeout(function(){
        $('#loadingProgressG').fadeOut("slow");
        $('#name-box').fadeIn("slow");
        $('#name-input').focus();
        
        $("#name-input").bind('blur keyup',function(e) {  
          if ((e.type == 'blur' || e.keyCode == '13') &&  $("#name-input").val() != '') {
            player.name = $("#name-input").val();       
            $('#preloader').fadeOut("slow");
            $('#pong').fadeIn("slow", function(){
                main();
            });
          } 
     });  
    }, 3000);
    
});