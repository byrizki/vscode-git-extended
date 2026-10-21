/* eslint-disable @typescript-eslint/require-await */
import type { Disposable, Event } from 'vscode';
import { EventEmitter } from 'vscode';
import type { Container } from './container';
import type { Subscription, SubscriptionChangeEvent } from './subscription';
import { SubscriptionPlanId, SubscriptionState } from './subscription';

export class SubscriptionService implements Disposable {
	private readonly _onDidChange = new EventEmitter<SubscriptionChangeEvent>();
	get onDidChange(): Event<SubscriptionChangeEvent> {
		return this._onDidChange.event;
	}

	get etag(): number {
		return 1;
	}

	constructor(private readonly container: Container, _previousVersion?: string) {}

	dispose() {
		this._onDidChange.dispose();
	}

	async getSubscription(_cached: boolean = false): Promise<Subscription> {
		const startedOn = new Date('2020-01-01').toISOString();
		return {
			plan: {
				actual: {
					id: SubscriptionPlanId.Pro,
					name: 'Git Extended',
					bundle: false,
					cancelled: false,
					startedOn: startedOn,
					organizationId: undefined,
				},
				effective: {
					id: SubscriptionPlanId.Pro,
					name: 'Git Extended',
					bundle: false,
					cancelled: false,
					startedOn: startedOn,
					organizationId: undefined,
				},
			},
			account: {
				id: 'local',
				name: 'Community User',
				email: undefined,
				verified: true,
				createdOn: startedOn,
				organizationIds: [],
			},
			state: SubscriptionState.Paid,
		};
	}

	async loginOrSignUp(): Promise<boolean> {
		return true;
	}

	async logout(_reset: boolean = false): Promise<void> {}

	async purchase(): Promise<void> {}

	async resendVerification(): Promise<boolean> {
		return true;
	}

	async showHomeView(_silent: boolean = false): Promise<void> {}

	async startPreviewTrial(_silent?: boolean): Promise<void> {}

	async validate(): Promise<void> {}
}

