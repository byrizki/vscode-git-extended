import type { AttributeValue, TimeInput } from '@opentelemetry/api';
import type { HttpsProxyAgent } from 'https-proxy-agent';
import type { TelemetryContext, TelemetryProvider } from './telemetry';

export class OpenTelemetryProvider implements TelemetryProvider {
	constructor(_context: TelemetryContext, _agent?: HttpsProxyAgent, _debugging?: boolean) {}

	dispose(): void {}

	sendEvent(_name: string, _data?: Record<string, AttributeValue>, _startTime?: TimeInput, _endTime?: TimeInput): void {}

	startEvent(_name: string, _data?: Record<string, AttributeValue>, _startTime?: TimeInput): any {
		return undefined;
	}

	setGlobalAttributes(_attributes: Map<string, AttributeValue>): void {}
}
