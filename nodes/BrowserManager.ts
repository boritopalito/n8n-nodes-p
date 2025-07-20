import { Browser, Page, chromium } from 'playwright';

class BrowserManager {
	private static instance: BrowserManager;
	private browser: Browser | null = null;
	private page: Page | null = null;

	private constructor() {}

	static getInstance(): BrowserManager {
		if (!BrowserManager.instance) {
			BrowserManager.instance = new BrowserManager();
		}
		return BrowserManager.instance;
	}
	
	async isRunning(): Promise<boolean> {
		return this.browser != null;
	}

	async launch(): Promise<void> {
		if (!this.browser) {
			this.browser = await chromium.launch({ headless: true });
			const context = await this.browser.newContext();
			this.page = await context.newPage();
		}
	}

	getPage(): Page {
		if (!this.page) {
			throw new Error('Page not initialized. Call launch() first.');
		}
		return this.page;
	}

	async close(): Promise<void> {
		await this.browser?.close();
		this.browser = null;
		this.page = null;
	}
}

export const browserManager = BrowserManager.getInstance();
