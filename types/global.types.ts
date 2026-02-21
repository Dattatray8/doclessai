export interface Feature {
    name: string;
    description: string;
    route: string;
    image: string;
    elementId: string;
}

export type AppType = {
    _id: string;
    name: string;
    description: string;
    features: any[];
    contactEmail: string;
};

export const DEFAULT_FEATURES_JSON = `[
  {
    "name": "Pricing Page",
    "description": "Shows pricing tiers and subscription plans",
    "route": "/pricing",
    "elementId": "#pricing-table",
    "image": "https://yourcdn.com/pricing.png"
  },
  {
    "name": "Login Flow",
    "description": "User authentication and login process",
    "route": "/login"
  }
]`;