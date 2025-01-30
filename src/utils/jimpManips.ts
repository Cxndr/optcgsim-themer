import {intToRGBA, Jimp, JimpInstance, rgbaToInt} from "jimp";
import { ImageSet } from "./imageSet";
import { MenuType } from "./imageSet";
import { CardBackType } from "./imageSet";


export async function applyRoundedCorners(image: InstanceType<typeof Jimp>, radius: number){

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

  image.mask(mask);
  return image;
}


export async function applySizing(
  image: InstanceType<typeof Jimp>, 
  width: number, 
  height: number
){

  try {
    image.cover({w:width, h:height});
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
  size:number = 1, 
  x:number = 0, 
  y:number = 0,
  edgeBuffer: number = blur * 4
){

  try {
    const imageWidth = image.bitmap.width;
    const imageHeight = image.bitmap.height;
    const shadowWidth = Math.floor(imageWidth * size);
    const shadowHeight = Math.floor(imageHeight * size);
    const imageOffsetY = Math.floor(((shadowHeight - imageHeight)/2) + edgeBuffer/2);
    const imageOffsetX = Math.floor(((shadowWidth - imageWidth)/2) + edgeBuffer/2);

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

    return result as JimpInstance;
  }
  catch(err) {
    console.error("Error applying shadow: ", err);
    throw err
  }
}


export async function applyShadowRendered(
  image: JimpInstance,
  shadowFileName: string,
) {
  try {
    const shadow = await getOverlay(`/img/shadow/${shadowFileName}.png`);
    const xOffset = ((shadow.bitmap.width)-(image.bitmap.width))/2;
    const yOffset = ((shadow.bitmap.height)-(image.bitmap.height))/2;
    const result = shadow.composite(image, xOffset, yOffset);
    return result as JimpInstance;
  }
  catch(err) {
    console.error("Error applying shadow: ", err);
    throw err
  }
}

export async function applyRoundedCornersRendered(
  image: JimpInstance,
  maskFileName: string,
) {
  try {
    const mask = await Jimp.read(`/img/masks/${maskFileName}.png`);
    image.mask(mask);
    return image as JimpInstance;
  }
  catch(err) {
    console.error("Error applying rounded corners: ", err);
    throw err
  }
}

async function applySoftLightBlend(
  baseImage: InstanceType<typeof Jimp>, 
  overlayImage: InstanceType<typeof Jimp>,
  blendStrength: number = 0.5
) {

  const baseWidth = baseImage.bitmap.width;
  const baseHeight = baseImage.bitmap.height;

  overlayImage.resize({w: baseWidth, h: baseHeight});

  blendStrength = Math.min(1, Math.max(0, blendStrength));

  baseImage.scan(0, 0, baseWidth, baseHeight, (x, y, idx) => {
    const baseR = baseImage.bitmap.data[idx];
    const baseG = baseImage.bitmap.data[idx + 1];
    const baseB = baseImage.bitmap.data[idx + 2];

    const overlayR = overlayImage.bitmap.data[idx];
    const overlayG = overlayImage.bitmap.data[idx + 1];
    const overlayB = overlayImage.bitmap.data[idx + 2];

    // Apply Soft Light formula to each channel
    const softLightR =
      overlayR <= 128
        ? (baseR * overlayR) / 128
        : 255 - ((255 - baseR) * (255 - overlayR)) / 128;
    const softLightG =
      overlayG <= 128
        ? (baseG * overlayG) / 128
        : 255 - ((255 - baseG) * (255 - overlayG)) / 128;
    const softLightB =
      overlayB <= 128
        ? (baseB * overlayB) / 128
        : 255 - ((255 - baseB) * (255 - overlayB)) / 128;

    // Soften the effect using blendStrength (linear interpolation)
    const resultR = baseR + blendStrength * (softLightR - baseR);
    const resultG = baseG + blendStrength * (softLightG - baseG);
    const resultB = baseB + blendStrength * (softLightB - baseB);

    // Write the softened result back to the base image
    baseImage.bitmap.data[idx] = Math.min(255, Math.max(0, resultR));
    baseImage.bitmap.data[idx + 1] = Math.min(255, Math.max(0, resultG));
    baseImage.bitmap.data[idx + 2] = Math.min(255, Math.max(0, resultB));
  });

  return baseImage as JimpInstance;
}

export function forceSquareEdges(image: JimpInstance) {

  const blockSize = 18;
  const sampleDistance = 10;
  const blankBack = new Jimp({width: image.bitmap.width, height: image.bitmap.height, color: rgbaToInt(0,0,0,0)});

  const sampleColorLeft = image.getPixelColor(sampleDistance, sampleDistance);
  const cornerBlockLeft = new Jimp({width: blockSize, height: blockSize, color: sampleColorLeft});
  blankBack.composite(cornerBlockLeft, 0, 0);
  blankBack.composite(cornerBlockLeft, 0, image.bitmap.height - blockSize)


  const sampleColorRight = image.getPixelColor(image.bitmap.width - sampleDistance, sampleDistance);
  const cornerBlockRight = new Jimp({width: blockSize, height: blockSize, color: sampleColorRight});
  blankBack.composite(cornerBlockRight, image.bitmap.width - blockSize, 0)
  blankBack.composite(cornerBlockRight, image.bitmap.width - blockSize, image.bitmap.height - blockSize)

  const result = blankBack.composite(image, 0, 0);

  return result as JimpInstance;

}


const overlayCache: { [key: string]: JimpInstance } = {};

async function getOverlay(path: string): Promise<JimpInstance> {
  if (!overlayCache[path]) {
    overlayCache[path] = await Jimp.read(path) as JimpInstance;
  }
  return overlayCache[path];
}

export async function processPlaymat(image: InstanceType<typeof Jimp>, settings: ImageSet["playmats"]){

  image = await applySizing(image, 1414, 1000);

  try {
    if (settings.overlay === "Area Markers") {
      image = image.composite(await getOverlay("/img/overlays/area-markers.png"), 0, 0)
    }
    else if (settings.overlay === "Area Markers w/ Text") {
      image = image.composite(await getOverlay("/img/overlays/area-markers-text.png"), 0, 0)
    }
  } catch(err) { console.error("Error applying overlay: ", err); }

  if (settings.edgeStyle === "Rounded Small"){
    image = await applyRoundedCornersRendered(image, "playmatSmallMask");
  }
  else if (settings.edgeStyle === "Rounded Medium"){
    image = await applyRoundedCornersRendered(image, "playmatMediumMask");
  }
  else if (settings.edgeStyle === "Rounded Large"){
    image = await applyRoundedCornersRendered(image, "playmatLargeMask");
  }

  if (settings.shadow === true) {
    image = await applyShadowRendered(image, `playmatShadow${settings.edgeStyle.replaceAll(" ","")}`)
  }
  
  return image as JimpInstance;
}


export async function processMenuOverlay(menuType: MenuType, image: InstanceType<typeof Jimp>){

  image = await applySizing(image, 1920, 1080);

  if (menuType === "DeckEditor") {
    image = image.composite(await getOverlay("/img/overlays/menu-deckedit-template.png"), 0, 0)
  }
  else {
    image = image.composite(await getOverlay("/img/overlays/menu-home-template.png"), 0, 0)
  }
  
  return image as JimpInstance;
}

export async function processMenu(image: InstanceType<typeof Jimp>){

  image = await applySizing(image, 1920, 1080);
  
  return image as JimpInstance;
}


export async function processCardBack(cardBackType: CardBackType, image: InstanceType<typeof Jimp>, settings: ImageSet["cardBacks"]){

  const blackBack = new Jimp({
    width: image.width, 
    height: image.height, 
    color: rgbaToInt(0,0,0,0)
  });

  image = blackBack.composite(image, 0, 0);

  image = await applySizing(image, 869, 1214);

  try {
    let overlayCardType;
    if (cardBackType === "DeckCards") { overlayCardType = "overlayDeck"}
    else {overlayCardType = "overlayDon"}
    
    if (settings[overlayCardType as keyof typeof settings] === "OP Text") {
      image = image.composite(await getOverlay("/img/overlays/card-back-textlogo-white.png"), 0, 0)
      image = image.composite(await getOverlay("/img/overlays/card-oplogo-bordersoft.png"), 0, 0)
    }
    else if (settings[overlayCardType as keyof typeof settings] === "OP Logo") {
      const overlay = await getOverlay("/img/overlays/card-back-oplogo.png") as InstanceType<typeof Jimp>;
      image = (await applySoftLightBlend(image, overlay,0.35));
      image = image.composite(await getOverlay("/img/overlays/card-oplogo-border.png"), 0, 0)
      image.contrast(0.075);
    }
    else if (settings[overlayCardType as keyof typeof settings] === "Don Symbol") {
      image = image.composite(await getOverlay("/img/overlays/card-back-don-faded.png"), 0, 0)
    }
    else if (settings[overlayCardType as keyof typeof settings] === "Border Only") {
      image = image.composite(await getOverlay("/img/overlays/card-borderonly.png"), 0, 0)
    }
  } catch(err) { console.error("Error applying overlay: ", err); }

  if (settings.edgeStyle === "Rounded Small"){
    image = await applyRoundedCornersRendered(image, "cardBackSmallMask");
  }
  else if (settings.edgeStyle === "Rounded Medium"){
    image = await applyRoundedCornersRendered(image, "cardBackMediumMask");
  }
  else if (settings.edgeStyle === "Rounded Large"){
    image = await applyRoundedCornersRendered(image, "cardBackLargeMask");
  }

  if (settings.shadow === true) {
    image = await applyShadowRendered(image, `largeCardShadow${settings.edgeStyle.replaceAll(" ","")}`)
  }

  if (cardBackType === "DonCards") {
    // image = await applySizing(image, 180, 252);
  }

  return image as JimpInstance;
}

export async function processDonCard(image: InstanceType<typeof Jimp>, settings: ImageSet["donCards"]){

  image = await applySizing(image, 869, 1214);

  try {
    if (settings.overlay === "Don Symbol") {
      image = image.composite(await getOverlay("/img/overlays/card-don-full.png"), 0, 0)
    }
    else if (settings.overlay === "Don Symbol w/ White") {
      image = image.composite(await getOverlay("/img/overlays/card-don-full-text.png"), 0, 0)
    }
    else if (settings.overlay === "Focus Lines") {
      image = image.composite(await getOverlay("/img/overlays/card-don-half.png"), 0, 0)
    }
    else if (settings.overlay === "Focus Lines w/ White") {
      image = image.composite(await getOverlay("/img/overlays/card-don-half-text.png"), 0, 0)
    }
    else if (settings.overlay === "Border Only") {
      image = image.composite(await getOverlay("/img/overlays/card-don-borderonly.png"), 0, 0)
    }
    else if (settings.overlay === "Border Only w/ White") {
      image = image.composite(await getOverlay("/img/overlays/card-don-borderonly-text.png"), 0, 0)
    }
  } catch(err) { console.error("Error applying overlay: ", err); }

  if (settings.edgeStyle === "Rounded Small"){
    image = await applyRoundedCornersRendered(image, "cardBackSmallMask");
  }
  else if (settings.edgeStyle === "Rounded Medium"){
    image = await applyRoundedCornersRendered(image, "cardBackMediumMask");
  }
  else if (settings.edgeStyle === "Rounded Large"){
    image = await applyRoundedCornersRendered(image, "cardBackLargeMask");
  }

  if (settings.shadow === true) {
    image = await applyShadowRendered(image, `largeCardShadow${settings.edgeStyle.replaceAll(" ","")}`)
  }

  // image = await applySizing(image, 180, 252);

  return image as JimpInstance;
}


export async function processCard(image: InstanceType<typeof Jimp>, settings: ImageSet["cards"]){
  let width = 480;
  let height = 671;
  let small = false;

  if (image.bitmap.width === 120) { // for _small cards, added by Batsu in 1.27a for use in deck editor
    width = 120;
    height = 167;
    small = true;
  }

  if (image.bitmap.width != width || image.bitmap.height != height) {
    image = await applySizing(image, width, height);
  }

  if (intToRGBA(image.getPixelColor(0,0)).a < 255) {
    image = forceSquareEdges(image);
  }

  if (small === true) {
    if (settings.edgeStyle === "Rounded") {
      // image = await applyRoundedCorners(image, 28);
      image = await applyRoundedCornersRendered(image, "cardSmallMask");
    }

    if (settings.shadow === true) {
      if (settings.edgeStyle === "Rounded") {
        image = await applyShadowRendered(image, "cardSmallShadowRounded");
      } else {
        image = await applyShadowRendered(image, "cardSmallShadowSquare");
      }
    }
  }
  else {
    if (settings.edgeStyle === "Rounded") {
      // image = await applyRoundedCorners(image, 28);
      image = await applyRoundedCornersRendered(image, "cardMask");
    }

    if (settings.shadow === true) {
      if (settings.edgeStyle === "Rounded") {
        image = await applyShadowRendered(image, "cardShadowRounded");
      } else {
        image = await applyShadowRendered(image, "cardShadowSquare");
      }
    }
  }

  return image as JimpInstance;
}
