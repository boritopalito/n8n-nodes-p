import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { browserManager } from '../BrowserManager';

export class GoToNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Playwright - Visit url',
		name: 'goToNode',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Playwright - Go to Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				required: true,
				description: 'The URL to navigate to',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		if (!browserManager.isRunning) {
			throw new ApplicationError('Browser is not running. Please launch the browser first.');
		}

		const url = this.getNodeParameter('url', 0) as string;

		if (!url) {
			throw new ApplicationError('URL is required');
		}

		try {
			const page = browserManager.getPage();
			await page.goto(url);

			return [
				[
					{
						json: {
							status: "Success",
							message: `Successfully navigated to ${url}`,
							url: url
						},
					},
				],
			];
		} catch (error) {
			throw new ApplicationError(`Failed to navigate to URL: ${error.message}`);
		}
	}
}
