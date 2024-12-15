import {Jimp, JimpInstance, rgbaToInt} from "jimp";
import { ImageSet } from "./imageSet";

export async function applyRoundedCorners(image: InstanceType<typeof Jimp>, radius: number){
  // Create a mask with the same size as the image
  const mask = new Jimp({
    width: image.width, 
    height: image.height, 
    color: rgbaToInt(0,0,0,0)
  });

  // Draw rounded corners on the mask
  const diameter = radius * 2;
  const circle = new Jimp({
    width: diameter, 
    height: diameter, 
    color: rgbaToInt(255,255,255,255)
  });
  circle.scan(0, 0, diameter, diameter, (x, y) => {
    const dist = Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2));
    if (dist > radius) {
      circle.setPixelColor(0x00000000, x, y);
    }
  });

  // Place circles in each corner of the mask
  mask.composite(circle, 0, 0);
  mask.composite(circle, mask.width - diameter, 0);
  mask.composite(circle, 0, mask.height - diameter);
  mask.composite(circle, mask.width - diameter, mask.height - diameter);

  // Draw rectangles to fill in the edges between corners
  mask.scan(0, radius, mask.width, mask.height - 2 * radius, (x, y) => {
    mask.setPixelColor(0xffffffff, x, y); // Set pixels to opaque white
  });
  mask.scan(radius, 0, mask.width - 2 * radius, mask.height, (x, y) => {
    mask.setPixelColor(0xffffffff, x, y); // Set pixels to opaque white
  });

  // Apply the mask to the image
  image.mask(mask);
  return image;
}

export async function applySizing(
  image: InstanceType<typeof Jimp>, 
  width: number, 
  height: number
){

  try {
    const imageHeight = image.bitmap.height;
    const imageWidth = image.bitmap.width;
    const imageAspectRatio = imageWidth / imageHeight;
  
    if (imageAspectRatio < 1) {
      image.resize({w: width});
    }
    else {
      image.resize({h: height});
    }
  
    image.crop({x: 0, y: 0, w: width, h: height});
    return image;
  } catch(err) {
    console.error("Error applying sizing: ", err);
    throw err
  }

}

export async function applyShadow(
  image: InstanceType<typeof Jimp>, 
  blur:number, 
  opacity: number, 
  edgeBuffer: number = blur * 4,
  size:number = 1, 
  x:number = 0, 
  y:number = 0
){

  try {
    const imageWidth = image.bitmap.width;
    const imageHeight = image.bitmap.height;
    const shadowWidth = Math.floor(imageWidth * size);
    const shadowHeight = Math.floor(imageHeight * size);
    const imageOffsetX = Math.floor(((shadowWidth - imageWidth)/2) + edgeBuffer/2);
    const imageOffsetY = Math.floor(((shadowHeight - imageHeight)/2) + edgeBuffer/2);

    const shadow = image.clone();
    shadow.color([{apply: "darken", params: [100]}]);
    shadow.opacity(opacity);
    shadow.resize({
      w: shadowWidth,
      h: shadowHeight
    });

    const canvas = new Jimp({
      width: shadowWidth + edgeBuffer,
      height: shadowHeight + edgeBuffer,
      color: rgbaToInt(0,0,0,0)
    });

    let result = canvas.composite(shadow, x + (edgeBuffer/2) , y + (edgeBuffer/2));
    result.blur(blur);

    result = result.composite(image, imageOffsetX, imageOffsetY);
    result.resize({w: imageWidth, h: imageHeight});

    return result as JimpInstance;
  }
  catch(err) {
    console.error("Error applying shadow: ", err);
    throw err
  }

}


export async function processSinglePlaymat(image: InstanceType<typeof Jimp>, settings: ImageSet["playmats"]){

  image = await applySizing(image, 1414, 1000);

  try {
    if (settings.overlay === "area-markers") {
      image = image.composite(await Jimp.read("img/overlays/area-markers.png"), 0, 0)
    }
    else if (settings.overlay === "area-markers-text") {
      image = image.composite(await Jimp.read("img/overlays/area-markers-text.png"), 0, 0)
    }
  } catch(err) { console.error("Error applying overlay: ", err); }


  if (settings.edgeStyle === "rounded-small"){
    applyRoundedCorners(image, 50);
  }
  else if (settings.edgeStyle === "rounded-med"){
    applyRoundedCorners(image, 100);
  }
  else if (settings.edgeStyle === "rounded-large"){
    applyRoundedCorners(image, 200);
  }

  if (settings.shadow === true) {
    image = await applyShadow(image, 5, 0.5)
  }
  
  return image;
}