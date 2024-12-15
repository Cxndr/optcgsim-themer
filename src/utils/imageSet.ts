import { Jimp } from "jimp";

export type EdgeStyle = "square" | "rounded-small" | "rounded-med" | "rounded-large";
export type PlaymatOverlayStyle = "none" | "area-markers" | "area-markers-text";
export type CardOverlayStyle = "none" | "don" | "op-logo";

export type ThemeImage = {
  src: string;
  image: typeof Jimp | null;
}

export type LeaderColor = "Black" | "BlackYellow" | "Blue" | "BlueBlack" | "BluePurple" | "BlueYellow" | "Green" | "GreenBlack" | "GreenBlue" | "GreenPurple" | "GreenYellow" | "Purple" | "PurpleBlack" | "PurpleYellow" | "Red" | "RedBlack" | "RedBlue" | "RedGreen" | "RedPurple" | "RedYellow" | "Yellow";

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
    overlay: "area-markers-text",
    edgeStyle: "rounded-med",
    shadow: true,
    images: {
      Black: { src: "", image: null },
      BlackYellow: { src: "", image: null },
      Blue: { src: "", image: null },
      BlueBlack: { src: "", image: null },
      BluePurple: { src: "", image: null },
      BlueYellow: { src: "", image: null },
      Green: { src: "", image: null },
      GreenBlack: { src: "", image: null },
      GreenBlue: { src: "", image: null },
      GreenPurple: { src: "", image: null },
      GreenYellow: { src: "", image: null },
      Purple: { src: "", image: null },
      PurpleBlack: { src: "", image: null },
      PurpleYellow: { src: "", image: null },
      Red: { src: "", image: null },
      RedBlack: { src: "", image: null },
      RedBlue: { src: "", image: null },
      RedGreen: { src: "", image: null },
      RedPurple: { src: "", image: null },
      RedYellow: { src: "", image: null },
      Yellow: { src: "", image: null },
    }
  },
  menus: {
    bgImages: {
      background: { src: "", image: null },
      deckeditbackground: { src: "", image: null },
    }
  },
  cardBacks: {
    overlay: "none",
    edgeStyle: "rounded-med",
    shadow: true,
    images: {
      CardBackRegular: { src: "", image: null },
      CardBackDon: { src: "", image: null },
    }
  },
  donCards: {
    overlay: "don",
    edgeStyle: "rounded-med",
    shadow: true,
    images: {
      DonCard: { src: "", image: null },
    }
  },
  cards: {
    edgeStyle: "rounded-med",
    shadow: true,
    images: {
    }
  }
}

export const defaultImageSet = imageSet;