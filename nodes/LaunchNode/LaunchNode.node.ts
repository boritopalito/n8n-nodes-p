import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { getBrowserManager } from '../BrowserManager';

export class LaunchNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Playwright - Launch Browser',
		name: 'launchNode',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Playwright - Launch Browser',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const browserManager = await getBrowserManager(this);
		await browserManager.launch();

		return [
			[
				{
					json: { status: "Browser launched!" },
				},
			],
		];
	}
}
