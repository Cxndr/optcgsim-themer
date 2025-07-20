// Import webp-enabled Jimp for worker
import { getWebpJimp } from "../utils/jimp.ts"
import { processMenuOverlay, processPlaymat, processCardBack, processCard, processMenu, processDonCard } from "../utils/jimpManips";
import { isCardBackType, isMenuType } from "@/utils/imageSet";

self.onmessage = async function(e) {
  // Get webp-enabled Jimp instance
  const Jimp = await getWebpJimp();
  
  const arrayBuffer = e.data.image;
  const image = await Jimp.fromBuffer(arrayBuffer)
  
  // Resize image for faster preview processing
  const MAX_PREVIEW_SIZE = 1024;
  const resizedImage = image.scaleToFit({ w: MAX_PREVIEW_SIZE, h: MAX_PREVIEW_SIZE });
  
  const manip = e.data.manip;
  const step = e.data.step;
  const requestId = e.data.requestId;

  if (manip === "processPlaymat") {
    const settings = e.data.imageSet.playmats;
    const result = await processPlaymat(resizedImage, settings, Jimp);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64, step: step, requestId: requestId})
  }

  if (manip === "processMenuOverlay") {
    if (!e.data.type) throw error("no menu type provided");
    if (!isMenuType(e.data.type)) throw error("menu type in wrong format");
    const result = await processMenuOverlay(e.data.type,resizedImage);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64, step: step, requestId: requestId})
  }

  if (manip === "processMenu") {
    const result = await processMenu(resizedImage);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64, step: step, requestId: requestId})
  }

  if (manip === "processCardBack") {
    if (!e.data.type) throw error("no cardback type provided");
    if (!isCardBackType(e.data.type)) throw error("cardback type in wrong format");
    const settings = e.data.imageSet.cardBacks;
    const result = await processCardBack(e.data.type, resizedImage, settings, Jimp);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64, step: step, requestId: requestId})
  }

  if (manip === "processDonCard") {
    const settings = e.data.imageSet.donCards;
    const result = await processDonCard(resizedImage, settings);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64, step: step, requestId: requestId})
  }

  if (manip === "processCard") {
    const settings = e.data.imageSet.cards;
    const result = await processCard(resizedImage, settings, Jimp);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64, step: step, requestId: requestId})
  }

}


