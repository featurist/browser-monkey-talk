# Browser Monkey: TDD for Front-End Hackers

The [done](https://github.com/featurist/browser-monkey-talk/tree/done) branch contains the working implementation. The [talk](https://github.com/featurist/browser-monkey-talk/tree/done) branch contains the implementation made during the talk. The [master](https://github.com/featurist/browser-monkey-talk/tree/master) branch contains the empty starting point so you can try it yourself.

## initial setup

```js
npm install
```

## running the server

```js
node server/server.js
```

## running the tests

```js
karma start
```

# Structure

* A commented Karma configuration is in [karma.conf.js](karma.conf.js)
* Specification files are in [test/browser](test/browser).
* Images used in specifications are in [test/browser/images](test/browser/images).
* The files we worked on in the talk:
    * [test/browser/imagesSpec.js](test/browser/imagesSpec.js) the specification
    * [browser/app.jsx](browser/app.jsx) the application

# Links

* The [slide deck](TDD%20for%20Front-End%20Hackers.key?raw=true) to this talk.
* [@dereke](https://github.com/dereke) has made an excellent [video](https://www.youtube.com/watch?v=WQZ2eIfmfEs) of a TDD session using browser-monkey.
* Here is another [example project](https://github.com/dereke/web-testing) that demonstrates how to use browser-monkey with Karma.

# Tools

* [browser-monkey](https://github.com/featurist/browser-monkey)

    Reliable DOM assertion and interaction library for automated tests in the browser

* [hyperdom](https://github.com/featurist/hyperdom)

    A fast, feature rich and simple virtual-dom framework for building dynamic browser applications.

* [trytryagain](https://github.com/featurist/trytryagain)

    If at first your expectation does not pass, try try again. Useful to make assertions on things that don't happen immediately.

* [httpism](https://github.com/featurist/httpism)

    A feature-rich HTTP client with very useful defaults.

* [mock-xhr-router](https://github.com/featurist/mock-xhr-router)

    Fake out your server API in the browser.

* [chai](http://chaijs.com/)

    Comprehensive expectation library

* [debug](https://github.com/visionmedia/debug)

    Runtime configurable debug output. Both browser-monkey and mock-xhr-router use this.

* [unset-timeout](https://github.com/featurist/unset-timeout)

    Resets any `setTimeout` or `setInterval` from previous tests, improving test isolation.

* [browserify](http://browserify.org/)

    Stiches JavaScript files together using require. Can be used in Karma, as well as production deployments. Possibly my favourite JavaScript tool!

* [qo](https://github.com/featurist/qo)

    A task runner that's not mental.

* [emmet](https://github.com/mattn/emmet-vim)

    HTML expansion and completion in Vim and other editors.
