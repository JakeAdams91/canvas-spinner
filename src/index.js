/* Safari and Edge polyfill for createImageBitmap
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/createImageBitmap
 */
if (!('createImageBitmap' in window)) {
  window.createImageBitmap = async function (blob) {
    return new Promise(resolve => {
      let img = document.createElement('img')
      img.addEventListener('load', function () {
        resolve(this)
      })
      img.src = URL.createObjectURL(blob)
    })
  }
}

/**
 * Turns a canvas element into an interactive draggable 3d image viewer
 * @param {Array<String>} imageSources array of image urls to load 
 * @param {HTMLCanvasElement} canvas canvas element to control
 * @param {Boolean} demo whether to do a spin demo when the images load
 */
function CanvasSpinner(imageSources, canvas, demo = false) {
  this.imgSrcs = imageSources
  this.canvas = canvas
  this.imgs = []
  this.loaded = false
  this.currentFrame = 0
  this.clicked = false
  this.doDemo = demo
  this.lastTouchX = null
  Object.defineProperties(this, {
    'currentImg': {
      get: function () {
        return this.imgs[this.currentFrame]
      }
    },
    'totalFrames': {
      get: function () {
        return this.imgs.length
      }
    },
    'canvasContext': {
      get: function () {
        return this.canvas.getContext('2d')
      }
    }
  })
  // catches mouse events and calls necessary functions
  this.canvas.addEventListener("mousedown", e => { this.clicked = true }, false)
  this.canvas.addEventListener("mousemove", e => { this.handleMouseMove(e) }, false)
  this.canvas.addEventListener("mouseup", e => { this.clicked = false })
  // touch handling
  this.canvas.addEventListener("touchstart", e => {
    e.preventDefault()
    this.clicked = true
    this.lastTouchX = e.changedTouches[0].screenX
  }, false)
  this.canvas.addEventListener("touchmove", e => {
    e.preventDefault()
    this.handleTouchMove(e)
  }, false)
  this.canvas.addEventListener("touchend", e => {
    e.preventDefault();
    this.clicked = false
    this.lastTouchX = null
  }, false)
  this.loadImages()
}
/**
 * Handle promises to load the images
 */
CanvasSpinner.prototype.loadImages = function () {
  Promise.all(this.imgSrcs.map(this.getImg))
    .then(imgs => this.setImgsAfterLoad(imgs))
}
/**
 * @param {Array<ImageBitmap>} imgs array of processed image bitmaps
 */
CanvasSpinner.prototype.setImgsAfterLoad = function (imgs) {
  this.imgs = imgs
  this.loaded = true
  // fit the canvas
  this.canvas.height = imgs[0].height
  this.canvas.width = imgs[0].width
  if (this.doDemo) {
    this.demo()
  } else {
    this.update(0)
  }
}
/**
 * increments or decrements the drawn image and updates it on the canvas
 * @param {Number} direction direction to update image, -1 if left, 1 if right, 0 just updates the current image
 */
CanvasSpinner.prototype.update = function (direction) {
  if (this.loaded) {
    this.currentFrame += direction
    if (this.currentFrame < 0) {
      this.currentFrame = this.totalFrames + this.currentFrame
    } else if (this.currentFrame > this.totalFrames - 1) {
      this.currentFrame = this.currentFrame - this.totalFrames
    }

    this.canvasContext.drawImage(this.currentImg, 0, 0)
  }
}
/**
 * update current frame to passed in value, and re-render image
 * @param {Number} frame index of user selected frame
 */
CanvasSpinner.prototype.setFrame = function (frame) {
  if (this.loaded) {
    if (frame < 0 || frame >= this.totalFrames) {
      throw new Error('param frame out of bounds')
    }
    this.currentFrame = frame
    this.canvasContext.drawImage(this.currentImg, 0, 0)
  }
}



/**
 * event handler for mousemove, gets X direction of movement then calls update with direction
 * @param {Event} event event from mousemove
 */
CanvasSpinner.prototype.handleMouseMove = function (event) {
  if (this.loaded && this.clicked) {
    let tracker = event.movementX
    if (tracker > 0) {
      this.update(1)
    } else if (tracker < 0) {
      this.update(-1)
    }
  }
}

/**
 * event handler for touchmove, gets X direction of movement then calls update with direction
 * @param {Event} event event from touchmove
 */
CanvasSpinner.prototype.handleTouchMove = function (event) {
  if (this.loaded && this.clicked) {
    let touch = event.changedTouches[0]
    let touchDelta = this.lastTouchX - touch.screenX
    if (touchDelta > 0) {
      this.update(1)
    } else if (touchDelta < 0) {
      this.update(-1)
    }
    this.lastTouchX = touch.screenX
  }
}

/**
 * initializes the canvas and iterates through the images
 */
CanvasSpinner.prototype.demo = function () {
  if (this.loaded) {
    this.update(0)
    let rotationInterval = setInterval(() => {
      if (this.currentFrame === this.totalFrames - 1) {
        clearInterval(rotationInterval)
      }
      this.update(1)
    }, 25)
  }
}

/**
 * asynchronously loads an image
 * @param {String} url url of image to load
 * @return {Promise<ImageBitmap>} Promise that resolves to image ready for use
 */
CanvasSpinner.prototype.getImg = async function (url) {
  let loadingImg = true
  let bitmap, res, blob
  while (loadingImg) {
    res = await fetch(url)
    blob = await res.blob()
    try {
      bitmap = await createImageBitmap(blob)
      loadingImg = false
    } catch (e) {
      console.error('error generating bitmap', url, ' trying again...')
    }
  }
  return bitmap
}
export { CanvasSpinner, CanvasSpinner as default }