import { Jimp } from "jimp";
import { zipSync, Zippable } from "fflate";
import { processSinglePlaymat } from "./jimpManips";

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

export type CardOverlayStyle = "None" | "Don Symbol" | "OP Logo";
export function isCardOverlayStyle(value: string | null): value is CardOverlayStyle {
  return value === "None" || value === "Don Symbol" || value === "OP Logo";
}
export const CardOverlayStyleValues: CardOverlayStyle[] = [
  "None",
  "Don Symbol",
  "OP Logo",
];

export type ThemeImage = {
  src: string | null;
  name: string | null;
  image: typeof Jimp | null;
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
      background: ThemeImage,
      deckeditbackground: ThemeImage,
    };
  };
  cardBacks: {
    overlay: CardOverlayStyle,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      CardBackRegular: ThemeImage,
      CardBackDon: ThemeImage,
    };
  };
  donCards: {
    overlay: CardOverlayStyle,
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
      Black: { src: "", image: null, name: null },
      BlackYellow: { src: "", image: null, name: null },
      Blue: { src: "", image: null, name: null },
      BlueBlack: { src: "", image: null, name: null },
      BluePurple: { src: "", image: null, name: null },
      BlueYellow: { src: "", image: null, name: null },
      Green: { src: "", image: null, name: null },
      GreenBlack: { src: "", image: null, name: null },
      GreenBlue: { src: "", image: null, name: null },
      GreenPurple: { src: "", image: null, name: null },
      GreenYellow: { src: "", image: null, name: null },
      Purple: { src: "", image: null, name: null },
      PurpleBlack: { src: "", image: null, name: null },
      PurpleYellow: { src: "", image: null, name: null },
      Red: { src: "", image: null, name: null },
      RedBlack: { src: "", image: null, name: null },
      RedBlue: { src: "", image: null, name: null },
      RedGreen: { src: "", image: null, name: null },
      RedPurple: { src: "", image: null, name: null },
      RedYellow: { src: "", image: null, name: null },
      Yellow: { src: "", image: null, name: null },
    }
  },
  menus: {
    bgImages: {
      background: { src: "", image: null, name: null },
      deckeditbackground: { src: "", image: null, name: null },
    }
  },
  cardBacks: {
    overlay: "None",
    edgeStyle: "Rounded Medium",
    shadow: true,
    images: {
      CardBackRegular: { src: "", image: null, name: null },
      CardBackDon: { src: "", image: null, name: null },
    }
  },
  donCards: {
    overlay: "Don Symbol",
    edgeStyle: "Rounded Medium",
    shadow: true,
    images: {
      DonCard: { src: "", image: null, name: null },
    }
  },
  cards: {
    edgeStyle: "Rounded Medium",
    shadow: true,
    images: {
    }
  }
}

export const defaultImageSet = imageSet;

export async function makeImageSetZip(imageSet: ImageSet) {

  const zipFiles: Zippable = {};

  for (const color of LeaderColorValues) {
    if (imageSet.playmats.images[color].src === "" || imageSet.playmats.images[color].src === null) {
      continue;
    }
    let image = await Jimp.read(imageSet.playmats.images[color].src);
    image = await processSinglePlaymat(image, imageSet.playmats);
    const buffer = await image.getBuffer('image/png',{});
    zipFiles[`Playmats/${color}.png`] = new Uint8Array(buffer);
  }

  const zipData = zipSync(zipFiles, { level: 9 });
  return zipData;

}