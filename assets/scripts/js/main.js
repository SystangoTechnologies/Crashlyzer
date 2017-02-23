if (window.location.pathname === '/' ) {
	$( 'body' ).addClass( 'login-bg' );
}
if (window.location.pathname === '/login' ) {
	$( 'body' ).addClass( 'login-bg' );
}
if (window.location.pathname === '/signup' ) {
	$( 'body' ).addClass( 'login-bg' );
}  
if (window.location.pathname === '/dashboard' ) {
	$( 'body' ).removeClass( 'login-bg' );
}

$('.user_profile_detail .edit_user').click(function(){
    $('.edit_user').addClass('disabled');
    $('.after_edit').hide();
    $('.user_profile_detail .details input[type=\'text\']').show();
    $('.user_profile_detail .details input[type=\'submit\'].action_btn').show();
    $('.user_profile_detail .details .col-md-2.pad-lft-none').addClass('pad-top-6');
    $('.calendar_icon img').show();
  });

$('.user_profile_detail .action_btn').click(function(){
	$('.edit_user').removeClass('disabled');
	$('.after_edit').show();
	$('.user_profile_detail .details input[type=\'text\']').hide();
	$('.user_profile_detail .details input[type=\'submit\'].action_btn').hide();
	$('.user_profile_detail .details .col-md-2.pad-lft-none').removeClass('pad-top-6');
    $('.calendar_icon img').hide();
});

$('.form_date').datetimepicker({
    language:  'fr',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
});


$('.message.message--success').fadeIn().delay(3000).fadeOut();
$('.message.message--error').fadeIn().delay(3000).fadeOut();


$('.profile_msg .message.message--success').css('display','inline-block').delay(3000).fadeOut();
$('.profile_msg .message.message--error').css('display','inline-block').delay(3000).fadeOut();


$('.input_calendar').click(function(){
    $('.datetimepicker-dropdown-bottom-right').show();
    $('.datetimepicker-dropdown-bottom-right').css('left', '425.5px');
    $('.datetimepicker-dropdown-bottom-right').css('top', '288px');
});

$( window ).resize(function() {
   var side = $('#sidebar-wrapper').height() - 190;   
   $('.block_scroll').height(side);
});

var side = $('#sidebar-wrapper').height() - 190;
   $('.block_scroll').height(side);