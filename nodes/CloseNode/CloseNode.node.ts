import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { BrowserManager } from '../BrowserManager';

export class CloseNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Playwright - Close Browser',
		name: 'closeNode',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Playwright - Close Browser',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		await BrowserManager.cleanup(this);

		return [
			[
				{
					json: { status: "Browser is closed!" },
				},
			],
		];
	}
}
