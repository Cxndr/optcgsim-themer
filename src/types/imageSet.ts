// THIS IS STRUCTURED ALL WRONG! WE DON'T NEED A TYPE FOR THE IMAGESET - IT IS ONLY USED ONCE, JUST MAKE AN OBJECT AND MAKE THE PROPERTIES TYPED! JUST PASS THE OBJECT AS PROPS AND UPDATE THE SINGLE OBJECT AS NEEDED. THEN FUNCTIO TO CONVERT TO JIMP IMAGES.

import { Jimp } from "jimp";

export type EdgeStyle = "square" | "rounded-small" | "rounded-med" | "rounded-large";
export type OverlayStyle = "none" | "area-markers" | "area-markers-text";

export type ThemeImage = {
  selection: string;
  image: typeof Jimp | null;
}

export type LeaderColor = "Black" | "BlackYellow" | "Blue" | "BlueBlack" | "BluePurple" | "BlueYellow" | "Green" | "GreenBlack" | "GreenBlue" | "GreenPurple" | "GreenYellow" | "Purple" | "PurpleBlack" | "PurpleYellow" | "Red" | "RedBlack" | "RedBlue" | "RedGreen" | "RedPurple" | "RedYellow" | "Yellow" | null;

export type ImageSet = {
  playmats: {
    overlay: OverlayStyle,
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
    overlay: OverlayStyle,
    edgeStyle: EdgeStyle,
    shadow: boolean,
    images: {
      CardBackRegular: ThemeImage,
      CardBackDon: ThemeImage,
    };
  };
  donCards: {
    overlay: OverlayStyle,
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