export interface user {
  user: {
    authLoad: boolean;
    userData: {
      username: string;
      email: string;
      image: string;
      [prop: string]: any;
    };
    theme: Theme;
  };
}

export type Theme = "light" | "dark";
