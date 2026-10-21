import type { Container } from '../../container';
import type { GitCommandOptions } from '../../git/commandOptions';
import type { GitProvider } from '../../git/gitProvider';
import { Git } from './git/git';
import { LocalGitProvider } from './git/localGitProvider';
import { VslsGit, VslsGitProvider } from './git/vslsGitProvider';

let gitInstance: Git | undefined;
function ensureGit() {
	if (gitInstance == null) {
		gitInstance = new Git();
	}
	return gitInstance;
}

export function git(_options: GitCommandOptions, ..._args: any[]): Promise<string | Buffer> {
	return ensureGit().git(_options, ..._args);
}

export function getSupportedGitProviders(container: Container): Promise<GitProvider[]> {
	const git = ensureGit();

	return Promise.resolve([
		new LocalGitProvider(container, git),
		new VslsGitProvider(container, new VslsGit(git)),
	]);
}
