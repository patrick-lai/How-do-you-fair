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
    user_income = parseFloat($(this).val().replace(/,/g, ''));
    if(isNaN(user_income) || user_income < 0){
     $('#user_income').val('0');
     user_income = 0;
    }
  })

  $('#reveal').on('click', function(){

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
          $(this).text("You are not doing as well as you think. :(");
        }
      }).fadeIn(next);
    })
  });


});

var DIST_CHART = {
  0 : 0,
  5 :27976,
  10 :31267,
  15 :34510,
  20 :39030,
  25 :43592,
  30 :47151,
  35 :50856,
  40 :54041,
  45 :58776,
  50 :62596,
  55 :67389,
  60 :76822,
  65 :87674,
  70 :101540,
  75 :120624,
  80 :577674,
  90 :3476038,
  100 :4303649
}

function getPercentile(income){

  // The spacing of the data
  var gap_between_brackets = 5;

  // Loop through income and return an interpolated percentile
  for(var percentile in DIST_CHART){
    if(DIST_CHART[percentile] > income){
      // Do a linear interpolation
      var previous_percentile = percentile-gap_between_brackets;

      var previous_braket = DIST_CHART[previous_percentile];
      var current_braket = DIST_CHART[percentile];

      // Estimated percentile is the previous percentile plus a perceentage of the persons income compared to the gap.
      var estimate_percentile = previous_percentile + ((income-previous_braket)/(current_braket-previous_braket) * gap_between_brackets);

      return Math.floor(estimate_percentile);

    }
  }

  // If the person is balling hard return 99
  return 99;

}
