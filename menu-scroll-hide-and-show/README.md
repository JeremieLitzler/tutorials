# Menu scroll hide and show

## The finished app

Demo the app.

## The HTML

- a `header` with a wrapper to allow a full width on the viewport of the header element while the wrapper is a contained in the same width as `main` and `footer` .
- a `main` with a lot of content to test the scroll effect
- a `footer` just to be clean semantically ;)

## The CSS

- the common style and the usual responsive styles which I won't talk about here.
- from line 34, we have the stuff that we are interested in, e.g. the menu and child elements styles:
  - first,
    - the `header` element is taking 100% of the width
    - its position is fixed. It is essential to allow the scroll effect to work later on.
    - why? because the effect is simply to hide or show the menu on the scroll event. If it is relative or absolute, it won't work because the element doesn't follow the scroll.
    - to finish for a fancy effect, I use ease effect, nothing special here.
  - then the responsive styles for the menu elements, a simple flex example.
  - finally, regarding that menu, we find the show and hide styles
    - the `opacity` is only used for the disappearing effect as the transition execute.
    - the `margin-top` is the tool we'll use put off or on screen the menu depending on the scroll direction. scrolling down will `hide-header` and scroll up will `show-header`.
- to finish a lit

## The JavaScript

### What is our goal

We want to:

- Task 1: hide the header on scrolling down
- Task 2: show the header on scrolling up

To know when to hide or show the menu, we need to:

- Detect when we are scrolling down
- Build the scroll distance calculator
- Implement the scroll calculator

### Detect when we are scrolling down

To find that information, we will use the `scroll` event.

But on which element do we need to listen? The window.

```javascript
window.addEventListener('scroll', function (event) {
  console.log(event);
});
```

What does the log tells us? that we scrolled. OK, that's not helpful.

How can we find the distance scrolled?

Then let's log the `window` element to see if you can find something.

```javascript
const scrollDistance = function () {
  console.log(window);
};
```

OK, so we see in the properties containing the word `scroll` a few things. If we ask the question _how do we detect when we are scrolling down_, ask also _what does down mean_?

It means scrolling on the Y axis where down scrolling is going from 0 to X, where X is the offset between the top (0) and where you are.

So in the properties, `scrollY` seems to be a good pick.

```javascript
console.log(window.scrollY);
```

As you scroll down, you see that value increasing.
As you scroll up, the value decreases because we are going back to the top.

OK, we have our value.

### Build the scroll distance calculator

First let's wrap our code in a function.

```javascript
const scrollDistance = function () {
  //our current code...
};

scrollDistance(); //call the calculator
```

That value we got from `window.scrollY` is the end of our scrolling event.

We will need to save it to calculate the scrolled distance.

Let's add a variable for that. Let's also add a variable for:

- save the start position of the scrolling that will allow us to difference with the end
- save the distance, whether positive (scrolling down) or negative (scrolling up).

OK, but when do we save the start value and the end value?

Well, `start` must be set when scroll starts.

```javascript
if (!start) {
  console.log('setting start');
  start = window.scrollY;
}

console.log('setting end');
end = window.scrollY;
console.log(`distant = end (${end}) - start (${start}) = ${end - start}`);
```

Let's run it:

- Scroll down.
- Stop.
- Scroll down once again.
- Stop.

Oh! Do you see what's happening? `start` doesn't change, therefore the `distance` scrolled down on the first scroll may be correct but not the second.

Why? Because, we are not resetting `start` on the new scroll event.

So we need to save when we are scrolling and we need to measure the distance when the scrolling is done.

Let's add a variable:

- to save the fact that we are scrolling, let's call it `isScrolling`.

Then we will use a `setTimeout` to delay the reading of the `end` value.

Why?
Because, the scroll event is fired continuously and we don't need to do something with all the events.
We need the last event.

```javascript
isScrolling = setTimeout(() => {
  console.log('timeout is over. get end value and calculate distance.');
  end = window.scrollY;
  distance = end - start;
  console.log(`distance = ${distance}`);
}, 1000); //wait 1000ms until reading the end value
console.log('launched timeout');
```

We see that there is a lot of scroll events, depending on how much you scroll.

However, our distnace is still the original start value minus the end value of the latest scroll.

If I repeat, from the top, the same scroll-stop-scroll-stop, I want the distance to be 100 on the second stop.

To do so, let's the last event by cancelling all timeouts but the last one:

```javascript
window.clearTimeout(isScrolling);
```

And we reset the values start, end and distance at the end of the timeout code:

```javascript
start = null;
end = null;
distance = null;
```

Let's try the sequence again.

There we have it!

Now, let's do the reverse sequence:

- Scroll up.
- Stop.
- Scroll up once again.
- Stop.

We see that we have a negative distance value.

So we are ready as we can now detect the scroll down (positive distance) and the scroll up (negative distance).

### Implement the scroll calculator

Now that we have the scroll calculator working, we need to implement it.

First, let's hide it.

We said we want to hide it on scrolling down.

Where do we put that?

Ah! We are missing something! How do we get the distance from our scroll calculator?

We can use a callback function for that purpose. Let's set it up.

Let's put it in the `scrollDistance` function like so:

- we modify the `scrollDistance` signature to take a callback parameter.

```javascript
const scrollDistance = function (callback) {
  //our current code...
  isScrolling = setTimeout(function () {
    //...
    callback(distance);
    start = null;
    end = null;
    distance = null;
  }, timeout);
};
```

- we call the callback in the `setTimeout` that we can get the scrolled distance back.

```javascript
isScrolling = setTimeout(function () {
  //...
  callback(distance);
  start = null;
  end = null;
  distance = null;
}, timeout);
```

- we modify how the `scrollDistance` function is called

```javascript
scrollDistance(function (distance) {
  console.log(`You travelled ${distance} px`);
});
```

Let's run the scroll sequence: there we have it.

Now we can add the code to add the class to hide the menu.

```javascript
if (distance > 0) {
  headerElement.classList.add(hideClass);
}
```

There we go: the menu gest hidden.

Now, we need to show the menu on scroll up.

Let's modify the implementation:

```javascript
if (distance > 0) {
  globalHeader.classList.add('hide-header');
  globalHeader.classList.remove('show-header');
} else {
  globalHeader.classList.add('show-header');
  globalHeader.classList.remove('hide-header');
}
```

Let's run the scroll sequence once more: OK, it is working but the timeout value needs to be lowered to be smoother. Let's try setting it 50ms.

## Conclusion

Alright, we are done. This was fun.

I hope you learned a lot in this tutorial and that you were able to code along.

The principles we saw were:

- detection of scrolling down and up.
- calculation of the scrolling distance using `setTimeout`.
- implementing the scrollDistance function with a callback function.

Give a thumb up if you liked it, 2 thumbs down otherwise!

Let's me know in the comments if you have any questions. See you later for another video.

Credits to [Chris Ferdinandi](https://gomakethings.com) who showed me this trick and help me understand all these principles.

Checkout his website and subscribe to his newsletter. His tips don't end with this one.
