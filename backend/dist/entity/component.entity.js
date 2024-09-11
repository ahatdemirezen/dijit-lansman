"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LargeTopTitleHeroCard = exports.AccordianRightCard = exports.AccordianRightCardItems = exports.TwinFlipCard = exports.Header = exports.MiniCardSlider = exports.MiniCard = exports.FullScreenCardSlider = exports.FullScreenCard = exports.TwinTopTitleHeroCard = exports.TwinCard = exports.Title = exports.CtaCard = exports.InfoCardSlider = exports.InfoCardSliderItems = exports.TopTextCard = exports.LeftTextCard = exports.RightTextCard = exports.ReelsCardSlider = exports.ReelsCardSliderItems = exports.FullText = exports.LargeScalableCard = exports.LargeFlipCard = exports.LargePopupCard = exports.LargeCard = exports.Components = void 0;
class Components {
}
exports.Components = Components;
class LargeCard extends Components {
    constructor(media, url) {
        super();
        this.media = media;
        this.url = url;
    }
}
exports.LargeCard = LargeCard;
class LargePopupCard extends Components {
    constructor(media) {
        super();
        this.media = media;
    }
}
exports.LargePopupCard = LargePopupCard;
class LargeFlipCard extends Components {
    constructor(media, backMedia) {
        super();
        this.frontMedia = media;
        this.backMedia = backMedia;
    }
}
exports.LargeFlipCard = LargeFlipCard;
class LargeScalableCard extends Components {
    constructor(media) {
        super();
        this.media = media;
    }
}
exports.LargeScalableCard = LargeScalableCard;
class FullText extends Components {
    constructor(text) {
        super();
        this.type = "FullText";
        this.data = { text };
    }
}
exports.FullText = FullText;
class ReelsCardSliderItems {
    constructor(media, title, subTitle) {
        this.media = media;
        this.title = title;
        this.subTitle = subTitle;
    }
}
exports.ReelsCardSliderItems = ReelsCardSliderItems;
class ReelsCardSlider extends Components {
    constructor(reelsCardSliderItems) {
        super();
        this.reelsCardSliderItems = reelsCardSliderItems;
    }
}
exports.ReelsCardSlider = ReelsCardSlider;
class RightTextCard extends Components {
    constructor(text, media) {
        super();
        this.text = text;
        this.media = media;
    }
}
exports.RightTextCard = RightTextCard;
class LeftTextCard extends Components {
    constructor(text, media) {
        super();
        this.text = text;
        this.media = media;
    }
}
exports.LeftTextCard = LeftTextCard;
class TopTextCard extends Components {
    constructor(text, media) {
        super();
        this.text = text;
        this.media = media;
    }
}
exports.TopTextCard = TopTextCard;
class InfoCardSliderItems {
    constructor(icon, title, subTitle) {
        this.icon = icon;
        this.title = title;
        this.subTitle = subTitle;
    }
}
exports.InfoCardSliderItems = InfoCardSliderItems;
class InfoCardSlider extends Components {
    constructor(infoCard) {
        super();
        this.infoCard = infoCard;
    }
}
exports.InfoCardSlider = InfoCardSlider;
class CtaCard extends Components {
    constructor(title, buttonText, buttonUrl) {
        super();
        this.title = title;
        this.buttonText = buttonText;
        this.buttonUrl = buttonUrl;
    }
}
exports.CtaCard = CtaCard;
class Title extends Components {
    constructor(title) {
        super();
        this.title = title;
    }
}
exports.Title = Title;
class TwinCard extends Components {
    constructor(rightMedia, leftMedia) {
        super();
        this.rightMedia = rightMedia;
        this.leftMedia = leftMedia;
    }
}
exports.TwinCard = TwinCard;
class TwinTopTitleHeroCard extends Components {
    constructor(rightMedia, rightTitle, rightSubTitle, rightButtonText, rightButtonUrl, leftMedia, leftTitle, leftSubTitle, leftButtonText, leftButtonUrl) {
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
exports.TwinTopTitleHeroCard = TwinTopTitleHeroCard;
class FullScreenCard {
    constructor(media, text, buttonText, buttonUrl, logoMedia) {
        this.media = media;
        this.text = text;
        this.buttonText = buttonText;
        this.buttonUrl = buttonUrl;
        this.logoMedia = logoMedia;
    }
}
exports.FullScreenCard = FullScreenCard;
class FullScreenCardSlider extends Components {
    constructor(cards) {
        super();
        this.cards = cards;
    }
    addCard(card) {
        this.cards.push(card);
    }
}
exports.FullScreenCardSlider = FullScreenCardSlider;
class MiniCard {
    constructor(buttonText, text, logoMedia) {
        this.buttonText = buttonText;
        this.text = text;
        this.logoMedia = logoMedia;
    }
}
exports.MiniCard = MiniCard;
class MiniCardSlider extends Components {
    constructor(cards) {
        super();
        this.cards = cards;
    }
    addCard(card) {
        this.cards.push(card);
    }
}
exports.MiniCardSlider = MiniCardSlider;
class Header extends Components {
    constructor(title, logoMedia) {
        super();
        this.title = title;
        this.logoMedia = logoMedia;
    }
}
exports.Header = Header;
class TwinFlipCard extends Components {
    constructor(rightCard, leftCard) {
        super();
        this.rightCard = rightCard;
        this.leftCard = leftCard;
    }
}
exports.TwinFlipCard = TwinFlipCard;
class AccordianRightCardItems {
    constructor(title, subTitle) {
        this.title = title;
        this.subTitle = subTitle;
    }
}
exports.AccordianRightCardItems = AccordianRightCardItems;
class AccordianRightCard extends Components {
    constructor(media, accordian) {
        super();
        this.media = media;
        this.accordian = accordian;
    }
}
exports.AccordianRightCard = AccordianRightCard;
class LargeTopTitleHeroCard extends Components {
    constructor(title, subTitle, buttonText, buttonUrl, media // Yapıcıya media alanını ekliyoruz
    ) {
        super();
        this.title = title;
        this.subTitle = subTitle;
        this.buttonText = buttonText;
        this.buttonUrl = buttonUrl;
        this.media = media; // Media'yı burada atıyoruz
    }
}
exports.LargeTopTitleHeroCard = LargeTopTitleHeroCard;
//# sourceMappingURL=component.entity.js.map