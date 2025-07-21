import { Browser, Page, chromium } from 'playwright';
import { IExecuteFunctions } from 'n8n-workflow';

export class BrowserManager {
	private static instances: Map<string, BrowserManager> = new Map();
	private browser: Browser | null = null;
	private page: Page | null = null;

	private constructor() {}

	static getInstance(execution: IExecuteFunctions): BrowserManager {
		const executionId = execution.getExecutionId();
		if (!this.instances.has(executionId)) {
			const instance = new BrowserManager();
			this.instances.set(executionId, instance);
		}
		return this.instances.get(executionId)!;
	}

	public static async cleanup(execution: IExecuteFunctions): Promise<void> {
		const executionId = execution.getExecutionId();
		const instance = this.instances.get(executionId);

		if (instance) {
			await instance.close();
			this.instances.delete(executionId);
		}
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

export async function getBrowserManager(f: IExecuteFunctions): Promise<BrowserManager> {
	return BrowserManager.getInstance(f);
}
