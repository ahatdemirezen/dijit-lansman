import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CTASection from "../sections/cta-section";
import LargeCardSection from "../sections/largeCard-section";
import FullScreenCardSection from "../sections/fullScreenCard-section";
import HeaderSection from "../sections/header-section";
import FullTextSection from "../sections/fullText-section";
import TitleSection from "../sections/title-section";
import LargeTopTitleHeroCardSection from "../sections/largeTopTitleHeroCard-section";
import AccordionRightCardSection from "../sections/AccordionRightCard-section";
import InfoCardSliderSection from "../sections/infoCardSlider-section";
import LargeFlipCardSection from "../sections/largeFlipCard-section";
import LargeScalableCardSection from "../sections/largeScalableCard-section";
import LeftTextCardSection from "../sections/leftTextCard-section";
import MiniCardSliderSection from "../sections/miniCardSlider-section";
import RightTextCardSection from "../sections/rightTextCardSlider-section";
import TopTextCardSection from "../sections/topTextCard-section";
import TwinCardSection from "../sections/twinCard-section";
import TwinFlipCardSection from "../sections/twinFlipCard-section";
import TwinTopTitleHeroCardSection from "../sections/twinTopTitleHeroCard-section";
import LargePopupCardSection from "../sections/largePopupCard-section";
import ReelsCardSliderSection from "../sections/reelsCardSlider-section";
import BottomTextCardSection from "../sections/BottomTextCardSection";
import SpaceSection from "../sections/SpaceSection";
import BannerSection from "../sections/BannerSection";
import ReelsBottomCardSection from "../sections/ReelsBottomCardSection"; // ReelsBottomCardSection'u import ediyoruz
import LaunchFilter from "../sections/launchFilter";
import NavBar from "../sections/NavBar";

interface FullScreenCardItem {
  media: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
  logoMedia: string;
}

interface InfoCardItem {
  icon: string;
  title: string;
  subtitle: string;
}

interface MiniCardItem {
  id: number;
  buttonText: string;
  text: string;
  logoMedia: string;
  buttonUrl: string;
  backgroundMedia: string;
}

interface ReelsCardItem {
  id: number;
  media: string;
  title: string;
  subTitle: string;
}

interface ReelsBottomCardItem {
  id: number;
  media: string;
  title: string;
  subTitle: string;
  buttonText: string;
  buttonUrl: string;
}

interface Content {
  title?: string;
  subTitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  media?: string;
  rightMedia?: string;
  rightFrontMedia?: string;
  rightBackMedia?: string;
  leftFrontMedia?: string;
  leftBackMedia?: string;
  leftMedia?: string;
  rightTitle?: string;
  rightSubTitle?: string;
  rightButtonText?: string;
  rightButtonUrl?: string;
  leftTitle?: string;
  leftSubTitle?: string;
  leftButtonText?: string;
  leftButtonUrl?: string;
  url?: string;
  fullScreenCardItems?: FullScreenCardItem[];
  logoMedia?: string;
  text?: string;
  accordianItems?: Array<{ title: string; subTitle: string }>;
  infoCardSliderItems?: InfoCardItem[];
  frontMedia?: string;
  backMedia?: string;
  miniCardItems?: MiniCardItem[];
  reelsCardSliderItems?: ReelsCardItem[];
  reelsBottomCardItems?: ReelsBottomCardItem[]; // Reels Bottom Card ekleniyor
}

interface Component {
  _id: string;
  type: string;
  name: string;
  content: Content;
  inTrailer: boolean;
}

const apiUrl = import.meta.env.VITE_BE_URL;

const PreviewPage: React.FC = () => {
  const { launchId } = useParams<{ launchId: string }>();
  const [components, setComponents] = useState<Component[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/deployDesign/${launchId}`);
        const componentsData = response.data;
        setComponents(componentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/404");
      }
    };

    fetchComponents();
  }, [launchId, navigate]);

  return (
    <div className="relative overflow-x-hidden">
      {" "}
      {/* overflow-x-hidden ile yatay scroll gizlendi */}
      <NavBar />
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 max-w-full bg-white">
        {components.map((component: any) => {
          if (!component.content) return null;

          if (component.type === "CTA Card") {
            return (
              <CTASection
                key={component._id}
                buttonText={component.content.buttonText || ""}
                buttonUrl={component.content.buttonUrl || ""}
                title={component.content.title || ""}
              />
            );
          }

          if (component.type === "Large Card") {
            return (
              <LargeCardSection
                key={component._id}
                media={component.content.media || ""}
                url={component.content.url || ""}
              />
            );
          }
          if (component.type === "Search Form") {
            return (
              <div key={component._id}>
                <LaunchFilter />
              </div>
            );
          }
          if (component.type === "Full Screen Card Slider") {
            return (
              <FullScreenCardSection
                key={component._id}
                items={component.content.fullScreenCardItems || []}
              />
            );
          }

          if (component.type === "Bottom Text Card") {
            return (
              <BottomTextCardSection
                key={component._id}
                text={component.content.text || ""}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Header") {
            return (
              <HeaderSection
                key={component._id}
                title={component.content.title || ""}
                logoMedia={component.content.logoMedia || ""}
              />
            );
          }

          if (component.type === "Full Text") {
            return (
              <FullTextSection
                key={component._id}
                text={component.content.text || ""}
              />
            );
          }

          if (component.type === "Title") {
            return (
              <TitleSection
                key={component._id}
                title={component.content.title || ""}
              />
            );
          }

          if (component.type === "Large Top Title Hero Card") {
            return (
              <LargeTopTitleHeroCardSection
                key={component._id}
                title={component.content.title || ""}
                subTitle={component.content.subTitle || ""}
                buttonText={component.content.buttonText || ""}
                buttonUrl={component.content.buttonUrl || ""}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Banner Form") {
            return (
              <BannerSection
                key={component._id}
                buttonText={component.content.buttonText || ""}
                buttonUrl={component.content.buttonUrl || ""}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Accordion Right Card") {
            return (
              <AccordionRightCardSection
                key={component._id}
                media={component.content.media || ""}
                accordian={component.content.accordianItems || []}
              />
            );
          }

          if (component.type === "Info Card Slider") {
            return (
              <InfoCardSliderSection
                key={component._id}
                items={component.content.infoCardSliderItems || []}
              />
            );
          }

          if (component.type === "Large Flip Card") {
            return (
              <LargeFlipCardSection
                key={component._id}
                frontMedia={component.content.frontMedia || ""}
                backMedia={component.content.backMedia || ""}
              />
            );
          }

          if (component.type === "Large Scalable Card") {
            return (
              <LargeScalableCardSection
                key={component._id}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Left Text Card") {
            return (
              <LeftTextCardSection
                key={component._id}
                text={component.content.text || ""}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Mini Card Slider") {
            return (
              <MiniCardSliderSection
                key={component._id}
                cards={component.content.miniCardItems || []}
              />
            );
          }

          if (component.type === "Right Text Card") {
            return (
              <RightTextCardSection
                key={component._id}
                text={component.content.text || ""}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Top Text Card") {
            return (
              <TopTextCardSection
                key={component._id}
                text={component.content.text || ""}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Twin Card") {
            return (
              <TwinCardSection
                key={component._id}
                rightMedia={component.content.rightMedia || ""}
                leftMedia={component.content.leftMedia || ""}
              />
            );
          }

          if (component.type === "Twin Flip Card") {
            return (
              <TwinFlipCardSection
                key={component._id}
                rightFrontMedia={component.content.rightFrontMedia || ""}
                rightBackMedia={component.content.rightBackMedia || ""}
                leftFrontMedia={component.content.leftFrontMedia || ""}
                leftBackMedia={component.content.leftBackMedia || ""}
              />
            );
          }

          if (component.type === "Twin Top Title Hero Card") {
            return (
              <TwinTopTitleHeroCardSection
                key={component._id}
                rightMedia={component.content.rightMedia || ""}
                rightTitle={component.content.rightTitle || ""}
                rightSubTitle={component.content.rightSubTitle || ""}
                rightButtonText={component.content.rightButtonText || ""}
                rightButtonUrl={component.content.rightButtonUrl || ""}
                leftMedia={component.content.leftMedia || ""}
                leftTitle={component.content.leftTitle || ""}
                leftSubTitle={component.content.leftSubTitle || ""}
                leftButtonText={component.content.leftButtonText || ""}
                leftButtonUrl={component.content.leftButtonUrl || ""}
              />
            );
          }

          if (component.type === "Large Popup Card") {
            return (
              <LargePopupCardSection
                key={component._id}
                media={component.content.media || ""}
              />
            );
          }

          if (component.type === "Reels Card Slider") {
            return (
              <ReelsCardSliderSection
                key={component._id}
                items={component.content.reelsCardSliderItems || []}
              />
            );
          }

          if (component.type === "Reels Bottom Card") {
            return (
              <ReelsBottomCardSection
                key={component._id}
                items={component.content.reelsBottomCardItems || []}
              />
            );
          }

          if (component.type === "Space") {
            return <SpaceSection key={component._id} />;
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default PreviewPage;
