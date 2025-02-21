declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: string;
		NODE_ENV: "development" | "production";
		MONGO_URL: string;
		CLERK_WEBHOOK_SECRET: string;
	}
}