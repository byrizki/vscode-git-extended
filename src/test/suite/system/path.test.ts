import * as assert from 'assert';
import { splitPath } from '../../../system/path';

describe('Path Test Suite', () => {
	function assertSplitPath(actual: [string, string], expected: [string, string]) {
		assert.strictEqual(actual[0], expected[0]);
		assert.strictEqual(actual[1], expected[1]);
	}

	it('splitPath: no repoPath', () => {
		assertSplitPath(splitPath('C:\\User\\Name\\code\\byrizki\\vscode-git-extended', ''), [
			'c:/User/Name/code/byrizki/vscode-git-extended',
			'',
		]);

		assertSplitPath(splitPath('C:\\User\\Name\\code\\byrizki\\vscode-git-extended\\', ''), [
			'c:/User/Name/code/byrizki/vscode-git-extended',
			'',
		]);

		assertSplitPath(splitPath('C:/User/Name/code/byrizki/vscode-git-extended', ''), [
			'c:/User/Name/code/byrizki/vscode-git-extended',
			'',
		]);

		assertSplitPath(splitPath('C:/User/Name/code/byrizki/vscode-git-extended/', ''), [
			'c:/User/Name/code/byrizki/vscode-git-extended',
			'',
		]);
	});

	it('splitPath: no repoPath (split base)', () => {
		assertSplitPath(splitPath('C:\\User\\Name\\code\\byrizki\\vscode-git-extended', '', true), [
			'vscode-git-extended',
			'c:/User/Name/code/byrizki',
		]);

		assertSplitPath(splitPath('C:\\User\\Name\\code\\byrizki\\vscode-git-extended\\', '', true), [
			'vscode-git-extended',
			'c:/User/Name/code/byrizki',
		]);

		assertSplitPath(splitPath('C:/User/Name/code/byrizki/vscode-git-extended', '', true), [
			'vscode-git-extended',
			'c:/User/Name/code/byrizki',
		]);

		assertSplitPath(splitPath('C:/User/Name/code/byrizki/vscode-git-extended/', '', true), [
			'vscode-git-extended',
			'c:/User/Name/code/byrizki',
		]);
	});

	it('splitPath: match', () => {
		assertSplitPath(
			splitPath(
				'C:\\User\\Name\\code\\byrizki\\vscode-git-extended\\foo\\bar\\baz.ts',
				'C:\\User\\Name\\code\\byrizki\\vscode-git-extended',
			),
			['foo/bar/baz.ts', 'c:/User/Name/code/byrizki/vscode-git-extended'],
		);

		assertSplitPath(
			splitPath(
				'C:\\User\\Name\\code\\byrizki\\vscode-git-extended\\foo\\bar\\baz.ts',
				'C:\\User\\Name\\code\\byrizki\\vscode-git-extended\\',
			),
			['foo/bar/baz.ts', 'c:/User/Name/code/byrizki/vscode-git-extended'],
		);

		assertSplitPath(
			splitPath(
				'C:\\User\\Name\\code\\byrizki\\vscode-git-extended\\foo\\bar\\baz.ts',
				'c:/User/Name/code/byrizki/vscode-git-extended',
			),
			['foo/bar/baz.ts', 'c:/User/Name/code/byrizki/vscode-git-extended'],
		);

		assertSplitPath(
			splitPath(
				'C:\\User\\Name\\code\\byrizki\\vscode-git-extended\\foo\\bar\\baz.ts',
				'c:/User/Name/code/byrizki/vscode-git-extended/',
			),
			['foo/bar/baz.ts', 'c:/User/Name/code/byrizki/vscode-git-extended'],
		);

		assertSplitPath(
			splitPath(
				'C:/User/Name/code/byrizki/vscode-git-extended/foo/bar/baz.ts',
				'c:/User/Name/code/byrizki/vscode-git-extended',
			),
			['foo/bar/baz.ts', 'c:/User/Name/code/byrizki/vscode-git-extended'],
		);

		assertSplitPath(
			splitPath(
				'C:/User/Name/code/byrizki/vscode-git-extended/foo/bar/baz.ts',
				'c:/User/Name/code/byrizki/vscode-git-extended/',
			),
			['foo/bar/baz.ts', 'c:/User/Name/code/byrizki/vscode-git-extended'],
		);
	});

	it('splitPath: match (casing)', () => {
		assertSplitPath(
			splitPath(
				'C:/USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED/FOO/BAR/BAZ.TS',
				'c:/User/Name/code/byrizki/vscode-git-extended/',
				undefined,
				true,
			),
			['FOO/BAR/BAZ.TS', 'c:/USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED'],
		);

		assertSplitPath(
			splitPath(
				'C:/USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED/FOO/BAR/BAZ.TS',
				'c:/User/Name/code/byrizki/vscode-git-extended/',
				undefined,
				false,
			),
			['USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED/FOO/BAR/BAZ.TS', 'c:'],
		);

		assertSplitPath(
			splitPath(
				'/USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED/FOO/BAR/BAZ.TS',
				'/User/Name/code/byrizki/vscode-git-extended/',
				undefined,
				true,
			),
			['FOO/BAR/BAZ.TS', '/USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED'],
		);

		assertSplitPath(
			splitPath(
				'/USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED/FOO/BAR/BAZ.TS',
				'/User/Name/code/byrizki/vscode-git-extended/',
				undefined,
				false,
			),
			['/USER/NAME/CODE/BYRIZKI/VSCODE-GIT-EXTENDED/FOO/BAR/BAZ.TS', '/User/Name/code/byrizki/vscode-git-extended'],
		);
	});

	it('splitPath: no match', () => {
		assertSplitPath(
			splitPath(
				'/foo/User/Name/code/byrizki/vscode-git-extended/foo/bar/baz.ts',
				'/User/Name/code/byrizki/vscode-git-extended',
			),
			['/foo/User/Name/code/byrizki/vscode-git-extended/foo/bar/baz.ts', '/User/Name/code/byrizki/vscode-git-extended'],
		);
	});
});
