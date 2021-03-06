# Canvas-Spinner
A simple 3d product viewer made with vanilla JavaScipt and the HTML canvas element.



**Installation**
> $ npm install --save canvas-spinner


**Usage**

import canvas-spinner into your project,

`import CanvasSpinner from 'canvas-spinner'`


create a canvas element in your HTML and give it an id.

 `<canvas id="canvas-spinner"></canvas>`


pass canvas-spinner the following params:
 the canvas element, the images array of urls, and a boolean to determine whether you want a demo 360 degree spin to run on-load (default: False).

`let spinner = new CanvasSpinner(imgSrc, canvas, true)`

**API**

`CanvasSpinner.currentFrame` - reference to current frame in CanvasSpinner
`CanvasSpinner.totalFrames` - returns total number of images stored


`CanvasSpinner.update(direction: Number)` - passing a value of -1 will spin product clockwise, passing 1 spins product counter-clockwise


`CanvasSpinner.setFrame(frame: Number)` - passing a number will display image with index matching the number value.




**Key contributors:**

[@JakeAdams91](https://github.com/JakeAdams91)

[@juegoman](https://github.com/juegoman)

[@JosephCorralesWeb](https://github.com/JosephCorralesWeb)




**License**
The MIT License (MIT)
