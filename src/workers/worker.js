import { Jimp } from "jimp"
import { processMenuOverlay, processPlaymat, processCardBack, processCard, processMenu, processDonCard } from "../utils/jimpManips";
import { isCardBackType, isMenuType } from "@/utils/imageSet";

self.onmessage = async function(e) {
  const arrayBuffer = e.data.image;
  const image = await Jimp.fromBuffer(arrayBuffer)
  const manip = e.data.manip;

  if (manip === "processPlaymat") {
    const settings = e.data.imageSet.playmats;
    const result = await processPlaymat(image, settings);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64})
  }

  if (manip === "processMenuOverlay") {
    if (!e.data.type) throw error("no menu type provided");
    if (!isMenuType(e.data.type)) throw error("menu type in wrong format");
    const result = await processMenuOverlay(e.data.type,image);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64})
  }

  if (manip === "processMenu") {
    const result = await processMenu(image);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64})
  }

  if (manip === "processCardBack") {
    if (!e.data.type) throw error("no cardback type provided");
    if (!isCardBackType(e.data.type)) throw error("cardback type in wrong format");
    const settings = e.data.imageSet.cardBacks;
    const result = await processCardBack(e.data.type, image, settings);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64})
  }

  if (manip === "processDonCard") {
    const settings = e.data.imageSet.donCards;
    const result = await processDonCard(image, settings);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64})
  }

  if (manip === "processCard") {
    const settings = e.data.imageSet.cards;
    const result = await processCard(image, settings);
    const base64 = await result.getBase64("image/png");
    self.postMessage({base64: base64})
  }

}


