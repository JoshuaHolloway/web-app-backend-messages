// https://stackoverflow.com/a/53981706

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_PRIVATE_KEY: string;
      STRIPE_PUBLIC_KEY: string;
      TOKEN_SECRET: string;
      DEV_DATABASE_URL: string;
      TESTING_DATABASE_URL: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
