'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  document.addEventListener("mousemove", function (e) {
    if (_this.clicked === true) {
      _this.handleMouseMove(e);
    }
  }, false);
  document.addEventListener("mouseup", function (e) {
    if (_this.clicked === true) {
      _this.clicked = false;
    }
  });
  this.loadImages();
}
/**
 * Handle promises to load the images
 */
CanvasSpinner.prototype.loadImages = function () {
  var _this2 = this;

  Promise.all(this.imgSrcs.map(this.getImg)).then(function (imgs) {
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
 * update current frame to passed in value, and re-render image
 * @param {Number} frame index of user selected frame
 */
CanvasSpinner.prototype.setFrame = function (frame) {
  if (this.loaded) {
    if (frame < 0 || frame >= this.totalFrames) {
      throw new Error('param frame out of bounds');
    }
    this.currentFrame = frame;
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
    var loadingImg, bitmap, res, blob;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            loadingImg = true;
            bitmap = void 0, res = void 0, blob = void 0;

          case 2:
            if (!loadingImg) {
              _context.next = 21;
              break;
            }

            _context.next = 5;
            return fetch(url);

          case 5:
            res = _context.sent;
            _context.next = 8;
            return res.blob();

          case 8:
            blob = _context.sent;
            _context.prev = 9;
            _context.next = 12;
            return createImageBitmap(blob);

          case 12:
            bitmap = _context.sent;

            loadingImg = false;
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](9);

            console.error('error generating bitmap', url, ' trying again...');

          case 19:
            _context.next = 2;
            break;

          case 21:
            return _context.abrupt('return', bitmap);

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[9, 16]]);
  }));

  return function (_x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.CanvasSpinner = CanvasSpinner;
exports.default = CanvasSpinner;