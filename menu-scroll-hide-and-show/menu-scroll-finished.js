const headerElement = document.querySelector('header');

const timeout = 100;
const scrollDistance = function (callback) {
  //   if (!callback || typeof callback !== 'function') return;

  let isScrolling, start, end, distance;

  window.addEventListener('scroll', function (scrollEvent) {
    //   console.log(scrollEvent);

    if (!start) {
      console.log(`setting start at ${window.scrollY}`);
      start = window.scrollY;
    }

    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
      console.log('timeout is over. get end value and calculate distance.');
      end = window.scrollY;
      distance = end - start;
      console.log(`distance calculated in timeout = ${distance}`);

      callback(distance);
      start = null;
      end = null;
      distance = null;
    }, timeout);
    console.log('launched timeout');
  });
};

const hideClass = 'hide-header';
const showClass = 'show-header';

scrollDistance(function (distance) {
  console.log(`You travelled ${distance} px`);

  if (distance > 0) {
    headerElement.classList.add(hideClass);
    headerElement.classList.remove(showClass);
  } else {
    headerElement.classList.add(showClass);
    headerElement.classList.remove(hideClass);
  }
});
