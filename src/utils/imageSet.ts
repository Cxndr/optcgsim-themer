import { Jimp, JimpInstance } from "jimp";
import { zipSync, Zippable } from "fflate";
import { processPlaymat, processMenu, processCardBack, processDonCard, processCard } from "./jimpManips";

export type EdgeStyle = "Square" | "Rounded Small" | "Rounded Medium" | "Rounded Large";
export function isEdgeStyle(value: string | null): value is EdgeStyle {
  return value === "Square" || value === "Rounded Small" || value === "Rounded Medium" || value === "Rounded Large";
}
export const EdgeStyleValues: EdgeStyle[] = [
  "Square",
  "Rounded Small",
  "Rounded Medium",
  "Rounded Large",
];

export type PlaymatOverlayStyle = "None" | "Area Markers" | "Area Markers w/ Text";
export function isPlaymatOverlayStyle(value: string | null): value is PlaymatOverlayStyle {
  return value === "None" || value === "Area Markers" || value === "Area Markers w/ Text";
}
export const PlaymatOverlayStyleValues: PlaymatOverlayStyle[] = [
  "None",
  "Area Markers",
  "Area Markers w/ Text",
];

export type CardOverlayStyle = "None" | "OP Logo" | "OP Text" | "Don Symbol" | "Border Only";
export function isCardOverlayStyle(value: string | null): value is CardOverlayStyle {
  return value === "None" || value === "OP Logo" || value === "OP Text" || value === "Don Symbol" || value === "Border Only";
}
export const CardOverlayStyleValues: CardOverlayStyle[] = [
  "None",
  "OP Logo",
  "OP Text",
  "Don Symbol",
  "Border Only",
];

export type DonOverlayStyle = "None" | "Don Symbol" | "Border Only" | "Don Symbol w/ White" | "Border Only w/ White" | "Focus Lines" | "Focus Lines w/ White";
export function isDonOverlayStyle(value: string | null): value is DonOverlayStyle {
  return value === "None" || value === "Don Symbol" || value === "Border Only" || value === "Don Symbol w/ White" || value === "Border Only w/ White" || value === "Focus Lines" || value === "Focus Lines w/ White";
}
export const DonOverlayStyleValues: DonOverlayStyle[] = [
  "None",
  "Don Symbol",
  "Don Symbol w/ White",
  "Focus Lines",
  "Focus Lines w/ White",
  "Border Only",
  "Border Only w/ White",
];

export type ThemeImage = {
  src: string | null;
  name: string | null;
  // image: typeof Jimp | null;
};

export type LeaderColor = "Black" | "BlackYellow" | "Blue" | "BlueBlack" | "BluePurple" | "BlueYellow" | "Green" | "GreenBlack" | "GreenBlue" | "GreenPurple" | "GreenYellow" | "Purple" | "PurpleBlack" | "PurpleYellow" | "Red" | "RedBlack" | "RedBlue" | "RedGreen" | "RedPurple" | "RedYellow" | "Yellow";

export function isLeaderColor(value: string | null): value is LeaderColor {
  return value === "Black" || value === "BlackYellow" || value === "Blue" || value === "BlueBlack" || value === "BluePurple" || value === "BlueYellow" || value === "Green" || value === "GreenBlack" || value === "GreenBlue" || value === "GreenPurple" || value === "GreenYellow" || value === "Purple" || value === "PurpleBlack" || value === "PurpleYellow" || value === "Red" || value === "RedBlack" || value === "RedBlue" || value === "RedGreen" || value === "RedPurple" || value === "RedYellow" || value === "Yellow";
}

export const LeaderColorValues: LeaderColor[] = [
  "Black",
  "BlackYellow",
  "Blue",
  "BlueBlack",
  "BluePurple",
  "BlueYellow",
  "Green",
  "GreenBlack",
  "GreenBlue",
  "GreenPurple",
  "GreenYellow",
  "Purple",
  "PurpleBlack",
  "PurpleYellow",
  "Red",
  "RedBlack",
  "RedBlue",
  "RedGreen",
  "RedPurple",
  "RedYellow",
  "Yellow",
];

export type MenuType = "Home" | "DeckEditor";

export function isMenuType(value: string | null): value is MenuType {
  return value === "Home" || value === "DeckEditor";
}

export const MenuTypeValues: MenuType[] = [
  "Home",
  "DeckEditor",
];

export type CardBackType = "DeckCards" | "DonCards";

export function isCardBackType(value: string | null): value is CardBackType {
  return value === "DeckCards" || value === "DonCards";
}

export const CardBackTypeValues: CardBackType[] = [
  "DeckCards",
  "DonCards",
];


export type ImageSet = {
  playmats: {
    overlay: PlaymatOverlayStyle,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      Black: ThemeImage, BlackYellow: ThemeImage, Blue: ThemeImage, BlueBlack: ThemeImage, BluePurple: ThemeImage, BlueYellow: ThemeImage, Green: ThemeImage, GreenBlack: ThemeImage, GreenBlue: ThemeImage, GreenPurple: ThemeImage, GreenYellow: ThemeImage, Purple: ThemeImage, PurpleBlack: ThemeImage, PurpleYellow: ThemeImage, Red: ThemeImage, RedBlack: ThemeImage, RedBlue: ThemeImage, RedGreen: ThemeImage, RedPurple: ThemeImage, RedYellow: ThemeImage, Yellow: ThemeImage;
    };
  };
  menus: {
    bgImages: {
      Home: ThemeImage,
      DeckEditor: ThemeImage,
    };
  };
  cardBacks: {
    overlay: CardOverlayStyle,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      DeckCards: ThemeImage,
      DonCards: ThemeImage,
    };
  };
  donCards: {
    overlay: DonOverlayStyle,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      DonCard: ThemeImage,
    };
  };
  cards: {
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      [key: string]: ThemeImage,
    };
  };
}


export const imageSet: ImageSet = {
  playmats : {
    overlay: "Area Markers w/ Text",
    edgeStyle: "Rounded Medium",
    shadow: true,
    images: {
      Black: { src: "", name: null },
      BlackYellow: { src: "", name: null },
      Blue: { src: "", name: null },
      BlueBlack: { src: "", name: null },
      BluePurple: { src: "", name: null },
      BlueYellow: { src: "", name: null },
      Green: { src: "", name: null },
      GreenBlack: { src: "", name: null },
      GreenBlue: { src: "", name: null },
      GreenPurple: { src: "", name: null },
      GreenYellow: { src: "", name: null },
      Purple: { src: "", name: null },
      PurpleBlack: { src: "", name: null },
      PurpleYellow: { src: "", name: null },
      Red: { src: "", name: null },
      RedBlack: { src: "", name: null },
      RedBlue: { src: "", name: null },
      RedGreen: { src: "", name: null },
      RedPurple: { src: "", name: null },
      RedYellow: { src: "", name: null },
      Yellow: { src: "", name: null },
    }
  },
  menus: {
    bgImages: {
      Home: { src: "", name: null },
      DeckEditor: { src: "", name: null },
    }
  },
  cardBacks: {
    overlay: "None",
    edgeStyle: "Rounded Medium",
    shadow: true,
    images: {
      DeckCards: { src: "", name: null },
      DonCards: { src: "", name: null },
    }
  },
  donCards: {
    overlay: "Don Symbol",
    edgeStyle: "Rounded Medium",
    shadow: true,
    images: {
      DonCard: { src: "", name: null },
    }
  },
  cards: {
    edgeStyle: "Rounded Medium",
    shadow: true,
    images: {
    }
  }
}

function countUsed(setting: object, checkValues: Array) {
  let count = 0;
  for (const value of checkValues) {
    if (setting[value].src === "" || setting[value].src === null) {
      continue;
    }
    count++;
  }
  return count;
}

export const defaultImageSet = imageSet;

let progressFeedback = "" as string;
let progressDetails = "" as string;

export async function makeImageSetZip(imageSet: ImageSet) {

  const zipFiles: Zippable = {};

  // Playmats
  progressFeedback = "Generating Playmats";
  const playmatCount = countUsed(imageSet.playmats.images,LeaderColorValues);
  try {
    for (const [index, color] of LeaderColorValues.entries()) {
      progressDetails = `Creating ${color} (${index}/${playmatCount}`;
      if (imageSet.playmats.images[color].src === "" || imageSet.playmats.images[color].src === null) {
        continue;
      }
      let image = await Jimp.read(imageSet.playmats.images[color].src) as JimpInstance;
      image = await processPlaymat(image, imageSet.playmats);
      const buffer = await image.getBuffer('image/png',{});
      zipFiles[`Playmats/${color}.png`] = new Uint8Array(buffer);
    }
  }
  catch(err) {
    console.error("Error processing playmats: ", err);
  }


  // Menus
  progressFeedback = "Generating Menus"
  const menuCount = countUsed(imageSet.menus.bgImages, MenuTypeValues)
  try {
    for (const [index, menu] of MenuTypeValues.entries()) {
      progressDetails = `Creating ${menu} (${index}/${menuCount})`
      if (imageSet.menus.bgImages[menu].src === "" || imageSet.menus.bgImages[menu].src === null) {
        continue;
      }
      let fileName = "";
      if (menu === "Home") {
        fileName = "background";
      }
      else if (menu === "DeckEditor") {
        fileName = "deckeditbackground";
      }
      let image = await Jimp.read(imageSet.menus.bgImages[menu].src) as JimpInstance;
      image = await processMenu(image);
      const buffer = await image.getBuffer('image/jpeg',{});
      zipFiles[`${fileName}.jpg`] = new Uint8Array(buffer);
    }
  }
  catch(err) {
    console.error("Error processing menus: ", err);
  }


  // Card backs
  progressFeedback = "Generating Card Backs"
  const cardBackCount = countUsed(imageSet.cardBacks.images, CardBackTypeValues);
  try {
    for (const [index,cardBack] of CardBackTypeValues.entries()) {
      progressDetails = `Creating ${cardBack} (${index}/${cardBackCount})`
      if (imageSet.cardBacks.images[cardBack].src === "" || imageSet.cardBacks.images[cardBack].src === null) {
        continue;
      }
      let fileName = "";
      if (cardBack === "DeckCards") {
        fileName = "CardBackRegular";
      }
      else if (cardBack === "DonCards") {
        fileName = "CardBackDon";
      }
      let image = await Jimp.read(imageSet.cardBacks.images[cardBack].src) as JimpInstance;
      image = await processCardBack(cardBack, image, imageSet.cardBacks);
      const buffer = await image.getBuffer('image/png',{});
      zipFiles[`CardBacks/${fileName}.png`] = new Uint8Array(buffer);
    }
  }
  catch(err) {
    console.error("Error processing card backs: ", err);
  }


  // Don Cards
  progressFeedback = "Generating Don Card";
  progressDetails = "(1/1)"
  try {
    if (imageSet.donCards.images.DonCard.src != "" && imageSet.donCards.images.DonCard.src != null) {
      let image = await Jimp.read(imageSet.donCards.images.DonCard.src) as JimpInstance;
      image = await processDonCard(image, imageSet.donCards);
      const buffer = await image.getBuffer('image/png',{});
      zipFiles[`Cards/Don/Don.png`] = new Uint8Array(buffer);
    }
  }
  catch(err) {
    console.error("Error processing don cards: ", err);
  }


  // Cards
  progressFeedback = "Generating Cards";
  const cardEntries = Object.entries(imageSet.cards.images);
  const cardCount = cardEntries.length;
  let index = 0;
  for (const [cardName, card] of cardEntries) {
    progressDetails = `Creating ${cardName} (${index + 1}/${cardCount})`;
    if (!card.src) {
      index++;
      continue;
    }
    const folderName = cardName.split("-")[0];
    let image = await Jimp.read(card.src) as JimpInstance;
    image = await processCard(image, imageSet.cards);
    const buffer = await image.getBuffer('image/png',{});
    zipFiles[`Cards/${folderName}/${cardName}.png`] = new Uint8Array(buffer);
    index++;
  }

  const zipData = zipSync(zipFiles, { level: 9 });
  return zipData;

}

async function downloadSet() {
  const zipFile = await makeImageSetZip(imageSet);
  const blob = new Blob([zipFile], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "imageSet.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const generateTheme = {
  progressFeedback: progressFeedback as string,
  progresDetails: progressDetails as string,
  zipFile: {} as Zippable,
  start: makeImageSetZip(imageSet),
  download: downloadSet(),
}