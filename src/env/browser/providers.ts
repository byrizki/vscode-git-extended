import type { Container } from '../../container';
import type { GitCommandOptions } from '../../git/commandOptions';
import type { GitProvider } from '../../git/gitProvider';

export function git(_options: GitCommandOptions, ..._args: any[]): Promise<string | Buffer> {
	return Promise.resolve('');
}

export async function getSupportedGitProviders(_container: Container): Promise<GitProvider[]> {
	return [];
}

