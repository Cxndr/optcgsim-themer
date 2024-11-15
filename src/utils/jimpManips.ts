import {Jimp, rgbaToInt} from "jimp";

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