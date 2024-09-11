export interface UpdateLaunchParams {
  launchId: string;
}

export interface GetLaunchParams {
  launchId: string;
}

export type Components = {
  title?: string;
  logoMedia?: string;
  media?: string;
  url?: string;
  frontMedia?: string;
  backMedia?: string;
  text?: string;
  subTitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  rightMedia?: string;
  leftMedia?: string;
  rightFrontMedia?: string;
  rightBackMedia?: string;
  leftFrontMedia?: string;
  leftBackMedia?: string;
  rightTitle?: string;
  rightSubTitle?: string;
  rightButtonText?: string;
  rightButtonUrl?: string;
  leftTitle?: string;
  leftSubTitle?: string;
  leftButtonText?: string;
  leftButtonUrl?: string;
  miniCardItems?: Array<{
    id: number;
    buttonText: string;
    text: string;
    logoMedia: string;
  }>;
  accordianItems?: Array<{ title: string; subTitle: string }>;
  infoCardSliderItems?: Array<{
    id: number;
    icon: string;
    title: string;
    subtitle: string;
  }>;
  fullScreenCardItems?: Array<{
    id: number;
    media: string;
    text: string;
    buttonText: string;
    buttonUrl: string;
    logoMedia: string;
  }>;
  reelsCardSliderItems?: Array<{
    id: number;
    media: string;
    title: string;
    subTitle: string;
  }>;
};

export interface UpdateAddLaunchBody {
  launchName?: string;
  language?: string;
  groupNumber?: string;
  companyName?: string;
  companyLogo?: string;
  launchDate?: string;
  endDate?: string;
  sequenceNumber?: number;
  isActive?: boolean;
  showOnHomepage?: boolean;
}

export interface UpdateSeoSettingsParams {
  launchId: string;
  seoId: string;
}

export interface UpdateSeoSettingsBody {
  title?: string;
  keywords?: string;
  description?: string;
  socialImage?: string;
  indexStatus?: boolean;
  followStatus?: boolean;
  launchUrl?: string;
}
