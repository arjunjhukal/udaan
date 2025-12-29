import type { GlobalResponse } from "./user";


export type NotifiableType = 'general' |
    'live_class' |
    'course' |
    'mcq' |
    'subjective'

export interface BannerProps {
    title: string;
    description: string;
    sub_title: string;
    btn_title: string;
    notifiable_type: NotifiableType | null;
    notifiable_id: number | null;
    image_url?: string;
    status: boolean;
}

export interface BannerPayload {
    json: BannerProps;
    file: {
        image: File | null
    }
}

export const bannerInitialState = {
    json: {
        title: "",
        description: "",
        sub_title: "",
        btn_title: "",
        notifiable_type: null,
        notifiable_id: null,
        image_url: "",
        status: true
    },
    file: {
        image: null
    }
}

export interface BannerList extends GlobalResponse {
    data: BannerPayload[]
}

export interface FeaturedCourseProps {
    mega_cat_id: number | null;
    courses: number[];
}

export const FeaturedCourseInitialState: { featured: FeaturedCourseProps[] } = {
    featured: [
        {
            mega_cat_id: null,
            courses: []
        }
    ]
}

export interface FeaturedCourseList {
    data: FeaturedCourseProps[];
}

export interface WelcomePopupProps {
    heading: string;
    sub_heading: string;
    image: File | null;
    image_url: string;
}
export const WelcomePopupInitialState: WelcomePopupProps = {
    heading: "",
    sub_heading: "",
    image: null,
    image_url: ""
}

export interface OnBoardingProps {
    page_id?: string;
    icon: File | null;
    icon_url?: string;
    title: string;
    description: string;
    layout: "square" | "wide";
    items: OnBoardingCardsProps[]
}
export interface OnBoardingCardsProps {
    icon: File | null;
    icon_url?: string;
    title: string;
    description: string;
}


export interface SplashProps {
    splash_heading: string;
    splash_sub_heading: string;
    splash_icon: File | null;
    splash_icon_url?: string;
}

