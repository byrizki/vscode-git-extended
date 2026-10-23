import type { CancellationToken, Event, FileDecoration, FileDecorationProvider, Uri } from 'vscode';
import { Disposable, EventEmitter, ThemeColor, window } from 'vscode';
import { GlyphChars } from '../constants';
import { GitBranchStatus } from '../git/models/branch';

export class ViewFileDecorationProvider implements FileDecorationProvider, Disposable {
	private readonly _onDidChange = new EventEmitter<undefined | Uri | Uri[]>();
	get onDidChange(): Event<undefined | Uri | Uri[]> {
		return this._onDidChange.event;
	}

	private readonly disposable: Disposable;
	constructor() {
		this.disposable = Disposable.from(
			// Register the current branch decorator separately (since we can only have 2 char's per decoration)
			window.registerFileDecorationProvider({
				provideFileDecoration: (uri, token) => {
					if (uri.scheme !== 'git-extended-view') return undefined;

					if (uri.authority === 'branch') {
						return this.provideBranchCurrentDecoration(uri, token);
					}

					if (uri.authority === 'remote') {
						return this.provideRemoteDefaultDecoration(uri, token);
					}

					return undefined;
				},
			}),
			window.registerFileDecorationProvider(this),
		);
	}

	dispose(): void {
		this.disposable.dispose();
	}

	provideFileDecoration(uri: Uri, token: CancellationToken): FileDecoration | undefined {
		if (uri.scheme !== 'git-extended-view') return undefined;

		switch (uri.authority) {
			case 'branch':
				return this.provideBranchStatusDecoration(uri, token);
			case 'commit-file':
				return this.provideCommitFileStatusDecoration(uri, token);
		}

		return undefined;
	}

	provideCommitFileStatusDecoration(uri: Uri, _token: CancellationToken): FileDecoration | undefined {
		const [, , status] = uri.path.split('/');

		switch (status) {
			case '!':
				return {
					badge: 'I',
					color: new ThemeColor('git-extended.decorations.ignoredForegroundColor'),
					tooltip: 'Ignored',
				};
			case '?':
				return {
					badge: 'U',
					color: new ThemeColor('git-extended.decorations.untrackedForegroundColor'),
					tooltip: 'Untracked',
				};
			case 'A':
				return {
					badge: 'A',
					color: new ThemeColor('git-extended.decorations.addedForegroundColor'),
					tooltip: 'Added',
				};
			case 'C':
				return {
					badge: 'C',
					color: new ThemeColor('git-extended.decorations.copiedForegroundColor'),
					tooltip: 'Copied',
				};
			case 'D':
				return {
					badge: 'D',
					color: new ThemeColor('git-extended.decorations.deletedForegroundColor'),
					tooltip: 'Deleted',
				};
			case 'M':
				return {
					badge: 'M',
					// color: new ThemeColor('git-extended.decorations.modifiedForegroundColor'),
					tooltip: 'Modified',
				};
			case 'R':
				return {
					badge: 'R',
					color: new ThemeColor('git-extended.decorations.renamedForegroundColor'),
					tooltip: 'Renamed',
				};
			default:
				return undefined;
		}
	}

	provideBranchStatusDecoration(uri: Uri, _token: CancellationToken): FileDecoration | undefined {
		const [, , status] = uri.path.split('/');

		switch (status as GitBranchStatus) {
			case GitBranchStatus.Ahead:
				return {
					badge: '▲',
					color: new ThemeColor('git-extended.decorations.branchAheadForegroundColor'),
					tooltip: 'Ahead',
				};
			case GitBranchStatus.Behind:
				return {
					badge: '▼',
					color: new ThemeColor('git-extended.decorations.branchBehindForegroundColor'),
					tooltip: 'Behind',
				};
			case GitBranchStatus.Diverged:
				return {
					badge: '▼▲',
					color: new ThemeColor('git-extended.decorations.branchDivergedForegroundColor'),
					tooltip: 'Diverged',
				};
			case GitBranchStatus.MissingUpstream:
				return {
					badge: '!',
					color: new ThemeColor('git-extended.decorations.branchMissingUpstreamForegroundColor'),
					tooltip: 'Missing Upstream',
				};
			case GitBranchStatus.UpToDate:
				return {
					badge: '',
					color: new ThemeColor('git-extended.decorations.branchUpToDateForegroundColor'),
					tooltip: 'Up to Date',
				};
			case GitBranchStatus.Unpublished:
				return {
					badge: '▲+',
					color: new ThemeColor('git-extended.decorations.branchUnpublishedForegroundColor'),
					tooltip: 'Unpublished',
				};
			default:
				return undefined;
		}
	}

	provideBranchCurrentDecoration(uri: Uri, _token: CancellationToken): FileDecoration | undefined {
		const [, , status, current] = uri.path.split('/');

		if (!current) return undefined;

		let color;
		switch (status as GitBranchStatus) {
			case GitBranchStatus.Ahead:
				color = new ThemeColor('git-extended.decorations.branchAheadForegroundColor');
				break;
			case GitBranchStatus.Behind:
				color = new ThemeColor('git-extended.decorations.branchBehindForegroundColor');
				break;
			case GitBranchStatus.Diverged:
				color = new ThemeColor('git-extended.decorations.branchDivergedForegroundColor');
				break;
			case GitBranchStatus.UpToDate:
				color = new ThemeColor('git-extended.decorations.branchUpToDateForegroundColor');
				break;
			case GitBranchStatus.Unpublished:
				color = new ThemeColor('git-extended.decorations.branchUnpublishedForegroundColor');
				break;
		}

		return {
			badge: GlyphChars.Check,
			color: color,
			tooltip: 'Current Branch',
		};
	}

	provideRemoteDefaultDecoration(uri: Uri, _token: CancellationToken): FileDecoration | undefined {
		const [, isDefault] = uri.path.split('/');

		if (!isDefault) return undefined;

		return {
			badge: GlyphChars.Check,
			tooltip: 'Default Remote',
		};
	}
}
