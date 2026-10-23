import { Commands, ContextKeys } from '../../constants';
import type { Container } from '../../container';
import { configuration } from '../../system/configuration';
import { WebviewWithConfigBase } from '../webviewWithConfigBase';
import type { State } from './protocol';

export class WelcomeWebview extends WebviewWithConfigBase<State> {
	constructor(container: Container) {
		super(
			container,
			'git-extended.welcome',
			'welcome.html',
			'images/icon.png',
			'Welcome to Git Extended',
			`${ContextKeys.WebviewPrefix}welcome`,
			'welcomeWebview',
			Commands.ShowWelcomePage,
		);
	}

	protected override includeBootstrap(): State {
		return {
			// Make sure to get the raw config, not from the container which has the modes mixed in
			config: configuration.getAll(true),
		};
	}
}
