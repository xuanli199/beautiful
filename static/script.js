var UTIL = (function() {
    let util = {};

    util.minMax = function(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    util.map = function(x1, x2, y2) {
      return x1 * y2 / x2;
    }

    return util;
})();

var ACE = (function() {
  let ace = {
    width: null
  };

  let audio = new Audio('./static/js/slideventura.mp3');
  audio.loop = true;
  audio.volume = 0.6;
  let audio1 = new Audio('./static/js/music.mp3');
  audio1.volume = 0.4;

  var $text = document.getElementById('text');
  var currentPosition = 0;
  var targetPosition = 0;
  var backgroundPosition = 0;
  var currentStep = 0;
  var totalStep = 26;

  let $body, $img;

  ace.init = function() {
      $body  = document.querySelector('body');
      $img = document.querySelector('#img');

      window.addEventListener('resize', function() {
        ACE.getWidth();
      }, true);
      ACE.getWidth();

      $body.addEventListener('mousemove', ACE.move);
      $body.addEventListener('touchmove', ACE.move);

      $body.addEventListener('click', function() {
        audio.play();
        audio1.play();
        $text.style.display = 'none';
      });

      audio.play();
      if (audio.paused) {
        $text.style.display = 'block';
      }

      requestAnimationFrame(ACE.animation);
  }

  ace.getWidth = function() {
    let rect = document.getElementById('img').getBoundingClientRect();
    ACE.width = rect.width;
  }

  ace.move = function(e) {
    let currentX;

    if (!isNaN(e.pageX)) {
      currentX = e.pageX;
    } else {
      let touch = event.targetTouches[event.targetTouches.length-1];
      currentX = touch.pageX;
    }
    let rect = $img.getBoundingClientRect();
    let offsetLeft = rect.left + window.scrollX;
    currentX = UTIL.minMax(currentX - offsetLeft, 0, ACE.width);

    targetPosition = ACE.width - currentX;
  }

  ace.animation = function() {
    currentPosition += (targetPosition - currentPosition) / 6;
    currentStep = Math.round(UTIL.map(currentPosition, ACE.width, totalStep));

    backgroundPosition = Math.max(currentStep, 1) * (ACE.width);


    $img.style.backgroundPositionX =  backgroundPosition + 'px';

    if (currentStep > 0 && currentStep <= totalStep) {
        audio.volume = UTIL.map(Math.min(Math.max(currentStep - 4, 0), totalStep - 10), totalStep - 10, 0.5);
    } else {
      audio.volume = 0;
    }
    requestAnimationFrame(ACE.animation);
  }

  return ace;
})();

ACE.init();
