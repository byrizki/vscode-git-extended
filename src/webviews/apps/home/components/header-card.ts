import { attr, css, customElement, FASTElement, html, volatile } from '@microsoft/fast-element';
import { SubscriptionState } from '../../../../subscription';
import { pluralize } from '../../../../system/string';
import { numberConverter } from '../../shared/components/converters/number-converter';
import '../../shared/components/code-icon';
import '../../shared/components/overlays/pop-over';

const template = html<HeaderCard>`
	<div class="header-card__media"><img class="header-card__image" src="${x => x.image}" alt="Git Extended Logo" /></div>
	<h1 class="header-card__title">Git Extended</h1>
`;

const styles = css`
	* {
		box-sizing: border-box;
	}

	:host {
		position: relative;
		display: grid;
		/*
		padding: 1rem 1rem 1.2rem;
		background-color: var(--card-background);
		border-radius: 0.4rem;
		*/
		padding: 1rem 0 1.2rem;
		gap: 0 0.8rem;
		grid-template-columns: 3.4rem auto;
		grid-auto-flow: column;
	}

	a {
		color: var(--vscode-textLink-foreground);
		text-decoration: none;
	}
	a:focus {
		outline-color: var(--focus-border);
	}
	a:hover {
		text-decoration: underline;
	}

	.header-card__media {
		grid-column: 1;
		grid-row: 1 / span 2;
		display: flex;
		align-items: center;
	}

	.header-card__image {
		width: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
	}

	.header-card__title {
		font-size: var(--vscode-font-size);
		font-weight: 600;
		margin: 0;
	}

	.header-card__title.logo {
		font-family: 'Segoe UI Semibold', var(--font-family);
		font-size: 1.5rem;
	}

	.header-card__account {
		position: relative;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0 0.4rem;
	}

	.progress {
		width: 100%;
		overflow: hidden;
	}

	:host-context(.vscode-high-contrast) .progress,
	:host-context(.vscode-dark) .progress {
		background-color: var(--color-background--lighten-15);
	}

	:host-context(.vscode-high-contrast-light) .progress,
	:host-context(.vscode-light) .progress {
		background-color: var(--color-background--darken-15);
	}

	.progress__indicator {
		height: 4px;
		background-color: var(--vscode-progressBar-background);
	}

	.header-card__progress {
		position: absolute;
		bottom: 0;
		left: 0;
		/*
		border-bottom-left-radius: 0.4rem;
		border-bottom-right-radius: 0.4rem;
		*/
	}

	.brand {
		color: var(--git-extended-brand-color-2);
	}
	.status {
		color: var(--color-foreground--65);
	}

	.status-label {
		cursor: help;
	}

	.status pop-over {
		top: 1.6em;
		left: 0;
	}
	.status-label:not(:hover) + pop-over:not(.is-pinned) {
		display: none;
	}

	.repo-access {
		font-size: 1.1em;
		margin-right: 0.2rem;
	}
	.repo-access:not(.is-pro) {
		filter: grayscale(1) brightness(0.7);
	}

	.actions {
		position: absolute;
		right: 0.1rem;
		top: 0.1rem;
	}

	.action {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 0.3rem;
		color: var(--color-foreground--75);
	}
	:host-context(.vscode-high-contrast) .action.is-primary,
	:host-context(.vscode-dark) .action.is-primary {
		border: 1px solid var(--color-background--lighten-15);
	}

	:host-context(.vscode-high-contrast-light) .action.is-primary,
	:host-context(.vscode-light) .action.is-primary {
		border: 1px solid var(--color-background--darken-15);
	}

	.action.is-icon {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 2.2rem;
		height: 2.2rem;
		padding: 0;
	}
	.action:hover {
		text-decoration: none;
		color: var(--color-foreground);
	}

	:host-context(.vscode-high-contrast) .action:hover,
	:host-context(.vscode-dark) .action:hover {
		background-color: var(--color-background--lighten-10);
	}

	:host-context(.vscode-high-contrast-light) .action:hover,
	:host-context(.vscode-light) .action:hover {
		background-color: var(--color-background--darken-10);
	}

	pop-over .action {
		margin-right: -0.2rem;
	}

	.link-inline {
		color: inherit;
		text-decoration: underline;
	}
	.link-inline:hover {
		color: var(--vscode-textLink-foreground);
	}
`;

@customElement({ name: 'header-card', template: template, styles: styles })
export class HeaderCard extends FASTElement {
	@attr
	image = '';

	@attr
	name = '';

	@attr({ converter: numberConverter })
	days = 0;

	@attr({ converter: numberConverter })
	steps = 4;

	@attr({ converter: numberConverter })
	completed = 0;

	@attr({ converter: numberConverter })
	state: SubscriptionState = SubscriptionState.Free;

	@attr
	plan = '';

	@attr({ attribute: 'pin-status', mode: 'boolean' })
	pinStatus = true;

	progressNode!: HTMLElement;
	statusNode!: HTMLElement;

	override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);

		if (oldValue === newValue || this.progressNode == null) {
			return;
		}
		this.updateProgressWidth();
	}

	get daysRemaining() {
		if (this.days < 1) {
			return '<1 day';
		}
		return pluralize('day', this.days);
	}

	get progressNow() {
		return this.completed + 1;
	}

	get progressMax() {
		return this.steps + 1;
	}

	@volatile
	get progress() {
		return `${(this.progressNow / this.progressMax) * 100}%`;
	}

	@volatile
	get planName() {
		switch (this.state) {
			case SubscriptionState.Free:
			case SubscriptionState.FreePreviewTrialExpired:
			case SubscriptionState.FreePlusTrialExpired:
				return 'Git Extended';
			case SubscriptionState.FreeInPreviewTrial:
			case SubscriptionState.FreePlusInTrial:
				return 'Git Extended Pro';
			case SubscriptionState.VerificationRequired:
				return `${this.plan} (Unverified)`;
			default:
				return this.plan;
		}
	}

	@volatile
	get daysLeft() {
		switch (this.state) {
			case SubscriptionState.FreeInPreviewTrial:
			case SubscriptionState.FreePlusInTrial:
				return `, ${this.daysRemaining} left`;
			default:
				return '';
		}
	}

	get hasAccount() {
		switch (this.state) {
			case SubscriptionState.Free:
			case SubscriptionState.FreePreviewTrialExpired:
			case SubscriptionState.FreeInPreviewTrial:
				return false;
		}
		return true;
	}

	get isPro() {
		switch (this.state) {
			case SubscriptionState.Free:
			case SubscriptionState.FreePreviewTrialExpired:
			case SubscriptionState.FreePlusTrialExpired:
			case SubscriptionState.VerificationRequired:
				return false;
		}
		return true;
	}

	updateProgressWidth() {
		this.progressNode.style.width = this.progress;
	}

	dismissStatus(_e: MouseEvent) {
		this.pinStatus = false;
		this.$emit('dismiss-status');

		window.requestAnimationFrame(() => {
			this.statusNode?.focus();
		});
	}
}
