jQuery(document).ready(function($){
  var isLateralNavAnimating = false;

  $('.menu-burger').on('click', function(e) {
    e.preventDefault();

    if( !isLateralNavAnimating ) {
      if($(this).parents('.csstransitions').length > 0 ) isLateralNavAnimating = true;

      $('body').toggleClass('navigation-is-open');
      $('.navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
        isLateralNavAnimating = false;
      });
    }
  });

  var input = $('#input-range');
  var user_guess = 50;
  var user_income = 0;

  input.bind('input', function(){
  	getRangeValue(input);
  }).bind('change', function(){
  	getRangeValue(input);	/* for IE */
  });

  function getRangeValue(e){
  	var value = $(e).val();
  	$('.value').text(value);
  	$('.range').attr('data-value', value);
  	input.attr('value', value);
    user_guess = value;
  }

  $('#user_income').bind('input, change', function(){
    user_income = $(this).val();
  });

  $('#check_again').on('click', function(){
    // Lazy Reset page
    location.reload();
  });

  $('#reveal').on('click', function(){

    user_income = parseFloat(user_income.replace(/,/g, ''));
    if(isNaN(user_income)){
      $("#nan").css('opacity', '1');
      return;
    }

    $("#nan").css('opacity', '0');

    var actual_percentile = getPercentile(user_income);

    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });

    // animate the result
    $({})
    // Hide the button
    .queue(function (next) {
      $('#reveal').fadeOut(1000, next);
    })
    // Show the entry message
    .queue(function (next) {
      $('#entry_message').delay(300).fadeIn(1000, next);
    })
    // Show bottles
    .queue(function (next) {
      $('#bottles').delay(1300).fadeIn(1000, next);
    })
    // Animate your bottle's water
    .queue(function (next) {
      $('#your_bottle .water').delay(2500, next).height(user_guess+"%");
    })
    // Show your percentage
    .queue(function (next) {
      $("#your_bottle_label").text(user_guess+"%");
      $("#your_bottle_label").css('opacity', '1').fadeIn(next);
    })
    // Change the entry message
    .queue(function (next) {
      $('#entry_message').delay(2500).fadeOut(function() {
        $(this).text("This is how you really fair")
      }).fadeIn(next);
    })
    // Fill second bottle
    .queue(function (next) {
      // CSS properties need different delay
      setTimeout(function(){
         $('#actual_bottle .water').delay(1000, next).height(actual_percentile+"%");
       }, 2500);
    })
    // Show actual percentage
    .queue(function (next) {
      $("#actual_bottle_label").text(actual_percentile+"%");
      $("#actual_bottle_label").css('opacity', '1').fadeIn(next);
    })
    // Closing statement
    .queue(function (next) {
      $('#entry_message').delay(3000).fadeOut(function() {
        // If +- 5%
        if(actual_percentile-5 < user_guess && user_guess < actual_percentile + 5){
          $(this).text("Nice! Your doing about as good as you thought");
        }else if(actual_percentile + 5 > user_guess){
          $(this).text("Congratulations! You are doing better than you thought");
        }else{
          $(this).text("You are not doing as well as you think");
        }
      }).fadeIn(next);
    })
  });


});

// Just hardcode CBF

var DIST_CHART = [
  0,
  20862,
  21577,
  22312,
  23054,
  23789,
  24536,
  25281,
  26022,
  26773,
  27526,
  28285,
  29034,
  29764,
  30480,
  31191,
  31901,
  32579,
  33230,
  33877,
  34513,
  35132,
  35750,
  36349,
  36907,
  37423,
  38015,
  38623,
  39235,
  39846,
  40451,
  41072,
  41697,
  42330,
  42967,
  43611,
  44262,
  44918,
  45581,
  46252,
  46941,
  47637,
  48348,
  49065,
  49777,
  50489,
  51206,
  51959,
  52745,
  53547,
  54369,
  55196,
  56053,
  56926,
  57813,
  58717,
  59635,
  60554,
  61510,
  62491,
  63490,
  64513,
  65551,
  66620,
  67731,
  68855,
  70003,
  71183,
  72412,
  73678,
  74958,
  76264,
  77603,
  78945,
  80044,
  81433,
  82985,
  84618,
  86324,
  88090,
  90024,
  92110,
  94394,
  96854,
  99526,
  102415,
  105613,
  109169,
  113161,
  117646,
  122724,
  128502,
  135095,
  142929,
  152407,
  164436,
  178837,
  197801,
  235435,
  324584
]

function getPercentile(income){

  // Loop through income and return percentile
  // The index IS the percentile
  for(var percentile in DIST_CHART){
    if(income < DIST_CHART[percentile]){
      console.log(percentile);
      return percentile;
    }
  }

  // If the person is balling hard return 99
  return 99;

}
