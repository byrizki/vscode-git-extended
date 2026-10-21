import type { WebviewItemContext, WebviewItemGroupContext } from '../../system/webview';
import type { GitBranch } from './branch';
import type { GitBranchReference, GitReference, GitRevisionReference, GitStashReference, GitTagReference } from './reference';
import type { GitRemote } from './remote';

export interface ShowInCommitGraphCommandArgs {
	ref: GitReference;
	preserveFocus?: boolean;
}

export interface GraphBranchContextValue {
	type: 'branch';
	ref: GitBranchReference;
}

export interface GraphCommitContextValue {
	type: 'commit';
	ref: GitRevisionReference;
}

export interface GraphStashContextValue {
	type: 'stash';
	ref: GitStashReference;
}

export interface GraphTagContextValue {
	type: 'tag';
	ref: GitTagReference;
}

export interface GraphUpstreamStatusContextValue {
	type: 'upstreamStatus';
	ref: GitBranchReference;
	ahead: number;
	behind: number;
}

export interface GraphContributorContextValue {
	type: 'contributor';
	repoPath: string;
	name: string;
	email: string | undefined;
	current?: boolean;
}

export interface GraphPullRequestContextValue {
	type: 'pullrequest';
	id: string;
}

export type GraphColumnsContextValue = string;

export type GraphItemTypedContextValue =
	| GraphContributorContextValue
	| GraphPullRequestContextValue
	| GraphUpstreamStatusContextValue;

export type GraphItemRefContextValue =
	| GraphBranchContextValue
	| GraphCommitContextValue
	| GraphStashContextValue
	| GraphTagContextValue;

export interface GraphItemRefGroupContextValue {
	type: 'refGroup';
	refs: (GitBranchReference | GitTagReference)[];
}

export type GraphItemContextValue = GraphColumnsContextValue | GraphItemTypedContextValue | GraphItemRefContextValue;

export type GraphItemContext = WebviewItemContext<GraphItemContextValue>;
export type GraphItemGroupContext = WebviewItemGroupContext<GraphItemGroupContextValue>;
export type GraphItemGroupContextValue = GraphItemRefGroupContextValue;

export type GraphItemRefContext<T = GraphItemRefContextValue> = WebviewItemContext<T>;
export type GraphItemRefGroupContext<T = GraphItemRefGroupContextValue> = WebviewItemGroupContext<T>;
export type GraphItemTypedContext<T = GraphItemTypedContextValue> = WebviewItemContext<T>;

export interface Head {
	id: string;
	name: string;
	current?: boolean;
	isCurrentHead?: boolean;
	upstream?: string | { name: string; missing?: boolean };
	context?: string;
}

export interface Remote {
	id: string;
	name: string;
	owner: string;
	url?: string;
	avatarUrl?: string;
	context?: string;
	current?: boolean;
}

export interface Tag {
	id: string;
	name: string;
	annotated?: boolean;
	context?: string;
}

export interface RowContexts {
	refGroups?: Record<string, string>;
	row?: string;
	avatar?: string;
	[key: string]: unknown;
}

export interface RowStats {
	[key: string]: unknown;
}

export interface GraphRow {
	sha: string;
	parents?: string[];
	author?: string;
	email?: string;
	date?: number;
	message?: string;
	type?: string;
	[key: string]: unknown;
}

export type GitGraphRowHead = Head;
export type GitGraphRowRemoteHead = Remote;
export type GitGraphRowTag = Tag;
export type GitGraphRowContexts = RowContexts;
export type GitGraphRowStats = RowStats;

export const enum GitGraphRowType {
	Commit = 'commit-node',
	MergeCommit = 'merge-node',
	Stash = 'stash-node',
	Working = 'work-dir-changes',
	Conflict = 'merge-conflict-node',
	Rebase = 'unsupported-rebase-warning-node',
}

export interface GitGraphRow extends GraphRow {
	type: GitGraphRowType;
	heads?: GitGraphRowHead[];
	remotes?: GitGraphRowRemoteHead[];
	tags?: GitGraphRowTag[];
	contexts?: GitGraphRowContexts;
	stats?: GitGraphRowStats;
}

export interface GitGraph {
	readonly repoPath: string;
	/** A map of all avatar urls */
	readonly avatars: Map<string, string>;
	/** A set of all "seen" commit ids */
	readonly ids: Set<string>;
	readonly includes: { stats?: boolean } | undefined;
	/** A set of all skipped commit ids -- typically for stash index/untracked commits */
	readonly skippedIds?: Set<string>;
	readonly branches: Map<string, GitBranch>;
	readonly remotes: Map<string, GitRemote>;
	/** The rows for the set of commits requested */
	readonly rows: GitGraphRow[];
	readonly id?: string;

	readonly paging?: {
		readonly limit: number | undefined;
		readonly startingCursor: string | undefined;
		readonly hasMore: boolean;
	};

	more?(limit: number, id?: string): Promise<GitGraph | undefined>;
}
