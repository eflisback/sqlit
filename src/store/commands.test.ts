// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./welcome.sqlit.md?raw', () => ({
	default: '````sql\nSELECT 1\n````',
}));

import {
	InsertCellCommand,
	MoveCellCommand,
	RemoveCellCommand,
} from './commands';
import { history } from './history';
import type { CellData } from './types';
import { useSheetStore } from './useSheetStore';

const sqlCell = (id: string, content = 'SELECT 1'): CellData => ({
	id,
	type: 'sql',
	content,
	result: null,
});

beforeEach(() => {
	localStorage.clear();
	useSheetStore.setState({
		cells: [],
		runningCellId: null,
		editableCellId: null,
	});
	history.clear();
});

describe('InsertCellCommand', () => {
	it('execute inserts cell at correct index', () => {
		useSheetStore.setState({ cells: [sqlCell('a'), sqlCell('c')] });
		const cmd = new InsertCellCommand(sqlCell('b'), 1);
		cmd.execute();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'b', 'c']);
	});

	it('undo removes the inserted cell by id', () => {
		useSheetStore.setState({ cells: [sqlCell('a'), sqlCell('c')] });
		const cmd = new InsertCellCommand(sqlCell('b'), 1);
		cmd.execute();
		cmd.undo();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'c']);
	});
});

describe('RemoveCellCommand', () => {
	it('execute removes the cell', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		const cmd = new RemoveCellCommand('b');
		cmd.execute();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'c']);
	});

	it('undo restores the cell at the original index', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		const cmd = new RemoveCellCommand('b');
		cmd.execute();
		cmd.undo();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'b', 'c']);
	});

	it('captures cell data at execute-time, not construct-time', () => {
		useSheetStore.setState({ cells: [sqlCell('a', 'SELECT 1')] });
		const cmd = new RemoveCellCommand('a');
		// mutate the cell before executing
		useSheetStore.getState().updateCell('a', sqlCell('a', 'SELECT 999'));
		cmd.execute();
		cmd.undo();
		const cell = useSheetStore.getState().cells[0] as Extract<
			CellData,
			{ type: 'sql' }
		>;
		expect(cell.content).toBe('SELECT 999');
	});
});

describe('MoveCellCommand', () => {
	it('execute up swaps cell with predecessor', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		const cmd = new MoveCellCommand('b', 'up');
		cmd.execute();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['b', 'a', 'c']);
	});

	it('undo after moving up moves it back down', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		const cmd = new MoveCellCommand('b', 'up');
		cmd.execute();
		cmd.undo();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'b', 'c']);
	});

	it('execute down swaps cell with successor', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		const cmd = new MoveCellCommand('b', 'down');
		cmd.execute();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'c', 'b']);
	});

	it('undo after moving down moves it back up', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		const cmd = new MoveCellCommand('b', 'down');
		cmd.execute();
		cmd.undo();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'b', 'c']);
	});
});
