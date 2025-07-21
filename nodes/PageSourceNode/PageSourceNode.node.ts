import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { getBrowserManager } from '../BrowserManager';

export class PageSourceNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Playwright - Page Source',
		name: 'pageSourceNode',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Playwright - Page Source',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const browserManager = await getBrowserManager(this);
		const page = browserManager.getPage();

		await page.waitForLoadState("networkidle");

		const pageSource = await page.content();

		const binaryData = Buffer.from(pageSource);

		return [
			[
				{
					json: {
						pageSource,
						status: "success"
					},
					binary: {
						data: {
							data: binaryData.toString('base64'),
							mimeType: 'text/html',
							fileName: 'page-source.html',
						},
					},
				},
			],
		];
	}
}
