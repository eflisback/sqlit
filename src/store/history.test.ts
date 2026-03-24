import { beforeEach, describe, expect, it } from 'vitest';
import { history } from './history';

const makeMockCmd = () => {
	let executeCalls = 0, undoCalls = 0;
	return {
		execute() { executeCalls++; },
		undo()    { undoCalls++; },
		get executeCalls() { return executeCalls; },
		get undoCalls()    { return undoCalls; },
	};
};

beforeEach(() => {
	history.clear();
});

describe('execute', () => {
	it('calls cmd.execute() once', () => {
		const cmd = makeMockCmd();
		history.execute(cmd);
		expect(cmd.executeCalls).toBe(1);
	});

	it('pushes to past so undo works', () => {
		const cmd = makeMockCmd();
		history.execute(cmd);
		history.undo();
		expect(cmd.undoCalls).toBe(1);
	});

	it('clears future so redo is a no-op after new execute', () => {
		const cmd1 = makeMockCmd();
		const cmd2 = makeMockCmd();
		history.execute(cmd1);
		history.undo();
		history.execute(cmd2);
		// redo should be a no-op — cmd1 should not be re-executed
		history.redo();
		expect(cmd1.executeCalls).toBe(1);
	});
});

describe('undo', () => {
	it('calls cmd.undo() and moves cmd to future', () => {
		const cmd = makeMockCmd();
		history.execute(cmd);
		history.undo();
		expect(cmd.undoCalls).toBe(1);
		// redo should bring it back
		history.redo();
		expect(cmd.executeCalls).toBe(2);
	});

	it('is a no-op on empty stack', () => {
		expect(() => history.undo()).not.toThrow();
	});
});

describe('redo', () => {
	it('calls cmd.execute() again and moves cmd back to past', () => {
		const cmd = makeMockCmd();
		history.execute(cmd);
		history.undo();
		history.redo();
		expect(cmd.executeCalls).toBe(2);
		// undo should work again
		history.undo();
		expect(cmd.undoCalls).toBe(2);
	});

	it('is a no-op on empty stack', () => {
		expect(() => history.redo()).not.toThrow();
	});
});

describe('clear', () => {
	it('makes both undo and redo no-ops', () => {
		const cmd = makeMockCmd();
		history.execute(cmd);
		history.undo();
		history.clear();
		history.undo();
		history.redo();
		// only the original execute + nothing after clear
		expect(cmd.executeCalls).toBe(1);
		expect(cmd.undoCalls).toBe(1);
	});
});
