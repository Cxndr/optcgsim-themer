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

export type EdgeStyleSimple = "Square" | "Rounded";
export function isEdgeStyleSimple(value: string | null): value is EdgeStyleSimple {
  return value === "Square" || value === "Rounded";
}
export const EdgeStyleSimpleValues: EdgeStyleSimple[] = [
  "Square",
  "Rounded"
]

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
    overlayDeck: CardOverlayStyle,
    overlayDon: CardOverlayStyle,
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
    edgeStyle: EdgeStyleSimple,
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
    overlayDeck: "None",
    overlayDon: "None",
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
    edgeStyle: "Rounded",
    shadow: true,
    images: {
    }
  }
}

export function isImageSetEmpty(imageSetToCheck: ImageSet) {
  // Check playmats
  for (const value of LeaderColorValues) {
    if (imageSetToCheck.playmats.images[value].src !== "") {
      return false;
    }
  }

  // Check menu backgrounds
  if (imageSetToCheck.menus.bgImages.Home.src !== "" || 
      imageSetToCheck.menus.bgImages.DeckEditor.src !== "") {
    return false;
  }

  // Check card backs
  if (imageSetToCheck.cardBacks.images.DeckCards.src !== "" ||
      imageSetToCheck.cardBacks.images.DonCards.src !== "") {
    return false;
  }

  // Check don cards
  if (imageSetToCheck.donCards.images.DonCard.src !== "") {
    return false;
  }

  // Check cards
  for (const key in imageSetToCheck.cards.images) {
    if (imageSetToCheck.cards.images[key].src !== "") {
      return false;
    }
  }

  return true;
}

export function getPlaymatCount() {
  let count = 0;
  LeaderColorValues.forEach((leaderColor) => {
    if (imageSet.playmats.images[leaderColor].src !== "") { count += 1; }
  })
  return count;
}
export function getMenusCount() {
  let count = 0;
  MenuTypeValues.forEach((menuType) => {
    if (imageSet.menus.bgImages[menuType].src !== "") { count += 1; }
  })
  return count;
}
export function getCardBacksCount() {
  let count = 0;
  CardBackTypeValues.forEach((cardBackType) => {
    if (imageSet.cardBacks.images[cardBackType].src !== "") { count += 1; }
  })
  return count;
}
export function getDonCardsCount() {
  if (imageSet.donCards.images.DonCard.src !== "") return 1
  return 0;
}
export function getCardsCount() {
  return Object.keys(imageSet.cards.images).length;
}


function countUsed(setting: { [key: string]: { src: string | null } }, checkValues: Array<string>) {
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

// Add an event emitter for progress updates
const progressEmitter = new EventTarget();

// Update how we set progress values to ensure events are dispatched
function setProgress(feedback?: string, details?: string) {
  if (feedback) {
    progressFeedback = feedback;
  }
  if (details) {
    progressDetails = details;
  }
  progressEmitter.dispatchEvent(new Event('progress'));
}

function makeThemeError(errorText: string, err: unknown) {
  setProgress(
    errorText,
    err instanceof Error ? err.message : String(err)
  );
  console.error(errorText, err);
}

// const CHUNK_SIZE = 1; // Adjust based on performance needs

// async function processInBatches<T>(
//   items: T[],
//   batchSize: number,
//   processItem: (item: T, index: number) => Promise<void>
// ) {
//   let completed = 0;
//   for (let i = 0; i < items.length; i += batchSize) {
//     const batch = items.slice(i, i + batchSize);
    
//     // Process each batch sequentially
//     await Promise.all(
//       batch.map(async (item, index) => {
//         await processItem(item, i + index);
//       })
//     );

//     completed += batch.length;
    
//     // Update progress at the end of each batch
//     setProgress(undefined, `Created ${completed}/${items.length} cards`);
    
//     // Ensure the UI updates
//     await new Promise((resolve) => setTimeout(resolve, 0));
//   }
// }

export async function makeImageSetZip(imageSet: ImageSet) {
  const zipFiles: Zippable = {};

  generateTheme.generating = true;

  // Playmats
  try {
    const playmatCount = countUsed(imageSet.playmats.images,LeaderColorValues);
    if (playmatCount > 0) {
      setProgress("Generating Playmats");
      for (const [index, color] of LeaderColorValues.entries()) {
        setProgress(undefined, `Creating ${color} Playmat (${index}/${playmatCount})`);
        if (imageSet.playmats.images[color].src === "" || imageSet.playmats.images[color].src === null) {
          continue;
        }
        let image = await Jimp.read(imageSet.playmats.images[color].src) as JimpInstance;
        image = await processPlaymat(image, imageSet.playmats);
        const buffer = await image.getBuffer('image/png',{});
        zipFiles[`Playmats/${color}.png`] = new Uint8Array(buffer);
      }
    }
  }
  catch(err) {
    makeThemeError("Error generating playmats", err)
  }


  // Menus
  try {
    const menuCount = countUsed(imageSet.menus.bgImages, MenuTypeValues)
    if (menuCount > 0) {
      setProgress("Generating Menus");
      for (const [index, menu] of MenuTypeValues.entries()) {
        setProgress(undefined, `Creating ${menu} Menu (${index+1}/${menuCount})`)
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
  }
  catch(err) {
    makeThemeError("Error generating menus", err)
  }


  // Card backs
  try {
    const cardBackCount = countUsed(imageSet.cardBacks.images, CardBackTypeValues);
    if (cardBackCount > 0) {
    setProgress("Generating Card Backs");
      for (const [index,cardBack] of CardBackTypeValues.entries()) {
        setProgress(undefined, `Creating ${cardBack} Card Back (${index+1}/${cardBackCount})`)
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
  }
  catch(err) {
    makeThemeError("Error generating card backs", err)
  }
  


  // Don Cards
  try {
    if (imageSet.donCards.images.DonCard.src != "" && imageSet.donCards.images.DonCard.src != null) {
      setProgress("Generating Don Card");
      setProgress(undefined, `Creating Don Card (1/1)`)
      let image = await Jimp.read(imageSet.donCards.images.DonCard.src) as JimpInstance;
      image = await processDonCard(image, imageSet.donCards);
      const buffer = await image.getBuffer('image/png',{});
      zipFiles[`Cards/Don/Don.png`] = new Uint8Array(buffer);
    }
  }
  catch(err) {
    makeThemeError("Error generating don cards", err)
  }


  // Cards
  try {
    const cardEntries = Object.entries(imageSet.cards.images);
    const cardCount = cardEntries.length;
    if (cardCount > 0) {
      setProgress("Generating Cards");
      let index = 0;
      for (const [cardName, card] of cardEntries) {
        let trimmedCardName = cardName.split(".")[0];
        trimmedCardName = trimmedCardName.split("_small")[0];
        setProgress(undefined, `Creating ${trimmedCardName} Card (${index + 1}/${cardCount})`);
        if (!card.src) {
          index++;
          continue;
        }
        const folderName = cardName.split("-")[0];
        let image = await Jimp.read(card.src) as JimpInstance;
        image = await processCard(image, imageSet.cards);
        const buffer = await image.getBuffer('image/png',{});
        zipFiles[`Cards/${folderName}/${cardName}`] = new Uint8Array(buffer);
        index++;
      }
    }
  } catch (err) {
    makeThemeError("Error generating card images", err);
  }

  setProgress("Theme generated successfully!", " ");
  generateTheme.downloadReady = true;
  generateTheme.generating = false;

  const zipData = zipSync(zipFiles, { level: 9 });
  return zipData;
}

async function downloadTheme(zipFile: Uint8Array) {
  const blob = new Blob([zipFile], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "OPTCGSimTheme.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export type GenerateTheme = {
  progressFeedback: () => string,
  progressDetails: () => string,
  makeTheme: (imageSet: ImageSet) => Promise<Uint8Array>,
  downloadTheme: (zipFile: Uint8Array) => void,
  onProgress: (callback: () => void) => () => void,
  generating: boolean,
  downloadReady: boolean
}

export const generateTheme: GenerateTheme = {
  progressFeedback: () => progressFeedback,
  progressDetails: () => progressDetails,
  makeTheme: (imageSet: ImageSet) => makeImageSetZip(imageSet),
  downloadTheme: (zipFile: Uint8Array) => downloadTheme(zipFile),
  onProgress: (callback: () => void) => {
    progressEmitter.addEventListener('progress', callback);
    return () => progressEmitter.removeEventListener('progress', callback);
  },
  generating: false,
  downloadReady: false
}
