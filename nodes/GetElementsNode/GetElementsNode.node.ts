import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { getBrowserManager } from '../BrowserManager';

export class GetElementsNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Playwright - Get Elements',
		name: 'getElementsNode',
		group: ['transform'],
		version: 1,
		description: 'Get elements from the page using XPath',
		defaults: {
			name: 'Playwright - Get Elements',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'XPath',
				name: 'xpath',
				type: 'string',
				default: '',
				required: true,
				description: 'The XPath expression to find elements',
			},
			{
				displayName: 'Get Attributes',
				name: 'getAttributes',
				type: 'boolean',
				default: true,
				description: 'Whether to get element attributes',
			},
			{
				displayName: 'Get Text Content',
				name: 'getTextContent',
				type: 'boolean',
				default: true,
				description: 'Whether to get element text content',
			},
			{
				displayName: 'Get HTML',
				name: 'getHtml',
				type: 'boolean',
				default: false,
				description: 'Whether to get element HTML',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const browserManager = await getBrowserManager(this);

		if (!browserManager.isRunning) {
			throw new ApplicationError('Browser is not running. Please launch the browser first.');
		}

		const xpath = this.getNodeParameter('xpath', 0) as string;
		const getAttributes = this.getNodeParameter('getAttributes', 0) as boolean;
		const getTextContent = this.getNodeParameter('getTextContent', 0) as boolean;
		const getHtml = this.getNodeParameter('getHtml', 0) as boolean;

		if (!xpath) {
			throw new ApplicationError('XPath is required');
		}

		try {
			const page = browserManager.getPage();
			await page.waitForLoadState('networkidle');

			// Get all elements matching the XPath
			const elements = await page.$$(xpath);

			const results = await Promise.all(
				elements.map(async (element) => {
					const result: any = {};

					if (getTextContent) {
						result.textContent = await element.textContent();
					}

					if (getHtml) {
						result.innerHTML = await element.innerHTML();
						result.outerHTML = await element.evaluate((el) => el.outerHTML);
					}

					if (getAttributes) {
						result.attributes = await element.evaluate((el) => {
							const attrs: { [key: string]: string } = {};
							for (const attr of el.attributes) {
								attrs[attr.name] = attr.value;
							}
							return attrs;
						});
					}

					return result;
				}),
			);

			return [
				results.map((result) => ({
					json: {
						...result,
						xpath,
						found: true,
					},
				})),
			];
		} catch (error) {
			throw new ApplicationError(`Failed to get elements: ${error.message}`);
		}
	}
}
