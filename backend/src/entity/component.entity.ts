export class Components {}

export class LargeCard extends Components {
  media: string;
  url: string;

  constructor(media: string, url: string) {
    super();
    this.media = media;
    this.url = url;
  }
}
export class LargePopupCard extends Components {
  media: string;

  constructor(media: string) {
    super();
    this.media = media;
  }
}
export class LargeFlipCard extends Components {
  frontMedia: string;
  backMedia: string;

  constructor(media: string, backMedia: string) {
    super();
    this.frontMedia = media;
    this.backMedia = backMedia;
  }
}
export class LargeScalableCard extends Components {
  media: string;

  constructor(media: string) {
    super();
    this.media = media;
  }
}
export class FullText extends Components {
  type: string;
  data: {
    text: string;
  };

  constructor(text: string) {
    super();
    this.type = "FullText";
    this.data = { text };
  }
}

export class ReelsCardSliderItems {
  media: string;
  title: string;
  subTitle: string;

  constructor(media: string, title: string, subTitle: string) {
    this.media = media;
    this.title = title;
    this.subTitle = subTitle;
  }
}

export class ReelsCardSlider extends Components {
  reelsCardSliderItems: [ReelsCardSliderItems];

  constructor(reelsCardSliderItems: [ReelsCardSliderItems]) {
    super();
    this.reelsCardSliderItems = reelsCardSliderItems;
  }
}

export class RightTextCard extends Components {
  text: string;
  media: string;

  constructor(text: string, media: string) {
    super();
    this.text = text;
    this.media = media;
  }
}
export class LeftTextCard extends Components {
  text: string;
  media: string;

  constructor(text: string, media: string) {
    super();
    this.text = text;
    this.media = media;
  }
}
export class TopTextCard extends Components {
  text: string;
  media: string;

  constructor(text: string, media: string) {
    super();
    this.text = text;
    this.media = media;
  }
}

export class InfoCardSliderItems {
  icon: string;
  title: string;
  subTitle: string;

  constructor(icon: string, title: string, subTitle: string) {
    this.icon = icon;
    this.title = title;
    this.subTitle = subTitle;
  }
}

export class InfoCardSlider extends Components {
  infoCard: [InfoCardSliderItems];

  constructor(infoCard: [InfoCardSliderItems]) {
    super();
    this.infoCard = infoCard;
  }
}
export class CtaCard extends Components {
  title: string;
  buttonText: string;
  buttonUrl: string;

  constructor(title: string, buttonText: string, buttonUrl: string) {
    super();
    this.title = title;
    this.buttonText = buttonText;
    this.buttonUrl = buttonUrl;
  }
}
export class Title extends Components {
  title: string;
  constructor(title: string) {
    super();
    this.title = title;
  }
}
export class TwinCard extends Components {
  rightMedia: string;
  leftMedia: string;
  constructor(rightMedia: string, leftMedia: string) {
    super();
    this.rightMedia = rightMedia;
    this.leftMedia = leftMedia;
  }
}

export class TwinTopTitleHeroCard extends Components {
  rightMedia: string;
  rightTitle: string;
  rightSubTitle: string;
  rightButtonText: string;
  rightButtonUrl: string;
  leftMedia: string;
  leftTitle: string;
  leftSubTitle: string;
  leftButtonText: string;
  leftButtonUrl: string;

  constructor(
    rightMedia: string,
    rightTitle: string,
    rightSubTitle: string,
    rightButtonText: string,
    rightButtonUrl: string,
    leftMedia: string,
    leftTitle: string,
    leftSubTitle: string,
    leftButtonText: string,
    leftButtonUrl: string
  ) {
    super();
    this.rightMedia = rightMedia;
    this.rightTitle = rightTitle;
    this.rightSubTitle = rightSubTitle;
    this.rightButtonText = rightButtonText;
    this.rightButtonUrl = rightButtonUrl;
    this.leftMedia = leftMedia;
    this.leftTitle = leftTitle;
    this.leftSubTitle = leftSubTitle;
    this.leftButtonText = leftButtonText;
    this.leftButtonUrl = leftButtonUrl;
  }
}

export class FullScreenCard {
  media: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
  logoMedia: string;

  constructor(
    media: string,
    text: string,
    buttonText: string,
    buttonUrl: string,
    logoMedia: string
  ) {
    this.media = media;
    this.text = text;
    this.buttonText = buttonText;
    this.buttonUrl = buttonUrl;
    this.logoMedia = logoMedia;
  }
}

export class FullScreenCardSlider extends Components {
  cards: FullScreenCard[];

  constructor(cards: FullScreenCard[]) {
    super();
    this.cards = cards;
  }

  addCard(card: FullScreenCard) {
    this.cards.push(card);
  }
}

export class MiniCard {
  buttonText: string;
  text: string;
  logoMedia: string;

  constructor(buttonText: string, text: string, logoMedia: string) {
    this.buttonText = buttonText;
    this.text = text;
    this.logoMedia = logoMedia;
  }
}

export class MiniCardSlider extends Components {
  cards: MiniCard[];

  constructor(cards: MiniCard[]) {
    super();
    this.cards = cards;
  }

  addCard(card: MiniCard) {
    this.cards.push(card);
  }
}

export class Header extends Components {
  title: string;
  logoMedia: string;

  constructor(title: string, logoMedia: string) {
    super();
    this.title = title;
    this.logoMedia = logoMedia;
  }
}

export class TwinFlipCard extends Components {
  rightCard: [frontMedia: string, backMedia: string];
  leftCard: [frontMedia: string, backMedia: string];
  constructor(
    rightCard: [frontMedia: string, backMedia: string],
    leftCard: [frontMedia: string, backMedia: string]
  ) {
    super();
    this.rightCard = rightCard;
    this.leftCard = leftCard;
  }
}

export class AccordianRightCardItems {
  title: string;
  subTitle: string;

  constructor(title: string, subTitle: string) {
    this.title = title;
    this.subTitle = subTitle;
  }
}

export class AccordianRightCard extends Components {
  media: string;
  accordian: AccordianRightCardItems[]; // AccordianRightCardItems array olarak tanımlandı

  constructor(media: string, accordian: AccordianRightCardItems[]) {
    super();
    this.media = media;
    this.accordian = accordian;
  }
}

export class LargeTopTitleHeroCard extends Components {
  title: string;
  subTitle: string;
  buttonText: string;
  buttonUrl: string;
  media: string; // Media alanını ekliyoruz

  constructor(
    title: string,
    subTitle: string,
    buttonText: string,
    buttonUrl: string,
    media: string // Yapıcıya media alanını ekliyoruz
  ) {
    super();
    this.title = title;
    this.subTitle = subTitle;
    this.buttonText = buttonText;
    this.buttonUrl = buttonUrl;
    this.media = media; // Media'yı burada atıyoruz
  }
}
