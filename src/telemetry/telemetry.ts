import type { Disposable } from 'vscode';
import type { Container } from '../container';

export type AttributeValue = string | number | boolean | Array<null | undefined | string | number | boolean>;
export type TimeInput = number | Date | [number, number];

export interface TelemetryContext {
	env: string;
	extensionId: string;
	extensionVersion: string;
	language: string;
	machineId: string;
	platform: string;
	sessionId: string;
	vscodeEdition: string;
	vscodeHost: string;
	vscodeRemoteName: string;
	vscodeShell: string;
	vscodeUIKind: string;
	vscodeVersion: string;
}

export interface TelemetryProvider extends Disposable {
	sendEvent(name: string, data?: Record<string, AttributeValue>, startTime?: TimeInput, endTime?: TimeInput): void;
	startEvent(name: string, data?: Record<string, AttributeValue>, startTime?: TimeInput): any;
	setGlobalAttributes(attributes: Map<string, AttributeValue>): void;
}

export class TelemetryService implements Disposable {
	readonly enabled: boolean = false;

	constructor(_container: Container) {}

	dispose(): void {}

	sendEvent(
		_name: string,
		_data?: Record<string, AttributeValue | null | undefined>,
		_startTime?: TimeInput,
		_endTime?: TimeInput,
	): void {}

	startEvent(
		_name: string,
		_data?: Record<string, AttributeValue | null | undefined>,
		_startTime?: TimeInput,
	): Disposable | undefined {
		return undefined;
	}

	setGlobalAttribute(_key: string, _value: AttributeValue | null | undefined): void {}

	setGlobalAttributes(_attributes: Record<string, AttributeValue | null | undefined>): void {}

	deleteGlobalAttribute(_key: string): void {}
}
