'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CanvasSpinner = undefined;

require('babel-polyfill');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Turns a canvas element into an interactive draggable 3d image viewer
 * @param {Array<String>} imageSources array of image urls to load 
 * @param {HTMLCanvasElement} canvas canvas element to control
 * @param {Boolean} demo whether to do a spin demo when the images load
 */
function CanvasSpinner(imageSources, canvas) {
  var _this = this;

  var demo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  this.imgSrcs = imageSources;
  this.canvas = canvas;
  this.imgs = [];
  this.loaded = false;
  this.currentFrame = 0;
  this.clicked = false;
  this.doDemo = demo;
  Object.defineProperties(this, {
    'currentImg': {
      get: function get() {
        return this.imgs[this.currentFrame];
      }
    },
    'totalFrames': {
      get: function get() {
        return this.imgs.length;
      }
    },
    'canvasContext': {
      get: function get() {
        return this.canvas.getContext('2d');
      }
    }
  });
  // catches mouse events and calls necessary functions
  this.canvas.addEventListener("mousedown", function (e) {
    _this.clicked = true;
  }, false);
  this.canvas.addEventListener("mousemove", function (e) {
    _this.handleMouseMove(e);
  }, false);
  this.canvas.addEventListener("mouseup", function (e) {
    _this.clicked = false;
  });
  this.loadImages();
}
/**
 * Handle promises to load the images
 */
CanvasSpinner.prototype.loadImages = function () {
  var _this2 = this;

  Promise.all(this.imgSrcs.map(getImg)).then(function (imgs) {
    return _this2.setImgsAfterLoad(imgs);
  });
};
/**
 * @param {Array<ImageBitmap>} imgs array of processed image bitmaps
 */
CanvasSpinner.prototype.setImgsAfterLoad = function (imgs) {
  this.imgs = imgs;
  this.loaded = true;
  // fit the canvas
  this.canvas.height = imgs[0].height;
  this.canvas.width = imgs[0].width;
  if (this.doDemo) {
    this.demo();
  } else {
    this.update(0);
  }
};
/**
 * increments or decrements the drawn image and updates it on the canvas
 * @param {Number} direction direction to update image, -1 if left, 1 if right, 0 just updates the current image
 */
CanvasSpinner.prototype.update = function (direction) {
  if (this.loaded) {
    this.currentFrame += direction;
    if (this.currentFrame < 0) {
      this.currentFrame = this.totalFrames - 1;
    } else if (this.currentFrame > this.totalFrames - 1) {
      this.currentFrame = 0;
    }

    this.canvasContext.drawImage(this.currentImg, 0, 0);
  }
};
/**
 * event handler for mousemove, gets X direction of movement then calls update with direction
 * @param {Event} event event from mousemove
 */
CanvasSpinner.prototype.handleMouseMove = function (event) {
  if (this.loaded && this.clicked) {
    var tracker = event.movementX;
    if (tracker > 0) {
      this.update(1);
    } else if (tracker < 0) {
      this.update(-1);
    }
  }
};
/**
 * initializes the canvas and iterates through the images
 */
CanvasSpinner.prototype.demo = function () {
  var _this3 = this;

  if (this.loaded) {
    this.update(0);
    var rotationInterval = setInterval(function () {
      if (_this3.currentFrame === _this3.totalFrames - 1) {
        clearInterval(rotationInterval);
      }
      _this3.update(1);
    }, 25);
  }
};

/**
 * asynchronously loads an image
 * @param {String} url url of image to load
 * @return {Promise<ImageBitmap>} Promise that resolves to image ready for use
 */
CanvasSpinner.prototype.getImg = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var res, blob;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(url);

          case 2:
            res = _context.sent;
            _context.next = 5;
            return res.blob();

          case 5:
            blob = _context.sent;
            return _context.abrupt('return', createImageBitmap(blob));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.CanvasSpinner = CanvasSpinner;
exports.default = CanvasSpinner;