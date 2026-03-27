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

const mdCell = (id: string, content = '# Hello'): CellData => ({
	id,
	type: 'markdown',
	content,
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

describe('RemoveCellCommand — markdown merging', () => {
	it('deleting a non-markdown cell flanked by two markdown cells merges them', () => {
		useSheetStore.setState({
			cells: [mdCell('m1', 'aaa'), sqlCell('s1'), mdCell('m2', 'bbb')],
		});
		const cmd = new RemoveCellCommand('s1');
		cmd.execute();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(1);
		expect(cells[0].id).toBe('m1');
		expect((cells[0] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'aaa\n\nbbb',
		);
	});

	it('undo after flanked-delete restores all three original cells', () => {
		useSheetStore.setState({
			cells: [mdCell('m1', 'aaa'), sqlCell('s1'), mdCell('m2', 'bbb')],
		});
		const cmd = new RemoveCellCommand('s1');
		cmd.execute();
		cmd.undo();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(3);
		expect(cells.map((c) => c.id)).toEqual(['m1', 's1', 'm2']);
		expect((cells[0] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'aaa',
		);
		expect((cells[2] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'bbb',
		);
	});

	it('deleting a cell with only one markdown neighbor does not merge', () => {
		useSheetStore.setState({
			cells: [mdCell('m1'), sqlCell('s1'), sqlCell('s2')],
		});
		const cmd = new RemoveCellCommand('s1');
		cmd.execute();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(2);
		expect(cells.map((c) => c.id)).toEqual(['m1', 's2']);
	});
});

describe('MoveCellCommand — markdown merging', () => {
	it('moving a non-markdown cell away from between two markdown cells merges them (up)', () => {
		// [md1, sql, md2] → move sql up → [sql, md1+md2]
		useSheetStore.setState({
			cells: [mdCell('m1', 'aaa'), sqlCell('s1'), mdCell('m2', 'bbb')],
		});
		const cmd = new MoveCellCommand('s1', 'up');
		cmd.execute();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(2);
		expect(cells[0].id).toBe('s1');
		expect(cells[1].id).toBe('m1');
		expect((cells[1] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'aaa\n\nbbb',
		);
	});

	it('moving a non-markdown cell away from between two markdown cells merges them (down)', () => {
		// [md1, sql, md2] → move sql down → [md1+md2, sql]
		useSheetStore.setState({
			cells: [mdCell('m1', 'aaa'), sqlCell('s1'), mdCell('m2', 'bbb')],
		});
		const cmd = new MoveCellCommand('s1', 'down');
		cmd.execute();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(2);
		expect(cells[0].id).toBe('m1');
		expect((cells[0] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'aaa\n\nbbb',
		);
		expect(cells[1].id).toBe('s1');
	});

	it('moving a markdown cell next to another markdown cell merges them', () => {
		// [md1, sql, md2] → move md2 up → [md1, md2, sql] but md1+md2 merge
		useSheetStore.setState({
			cells: [mdCell('m1', 'aaa'), sqlCell('s1'), mdCell('m2', 'bbb')],
		});
		const cmd = new MoveCellCommand('m2', 'up');
		cmd.execute();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(2);
		expect(cells[0].id).toBe('m1');
		expect((cells[0] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'aaa\n\nbbb',
		);
		expect(cells[1].id).toBe('s1');
	});

	it('undo of a merge-triggering move up restores original cells', () => {
		useSheetStore.setState({
			cells: [mdCell('m1', 'aaa'), sqlCell('s1'), mdCell('m2', 'bbb')],
		});
		const cmd = new MoveCellCommand('s1', 'up');
		cmd.execute();
		cmd.undo();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(3);
		expect(cells.map((c) => c.id)).toEqual(['m1', 's1', 'm2']);
		expect((cells[0] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'aaa',
		);
		expect((cells[2] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'bbb',
		);
	});

	it('undo of a merge-triggering move down restores original cells', () => {
		useSheetStore.setState({
			cells: [mdCell('m1', 'aaa'), sqlCell('s1'), mdCell('m2', 'bbb')],
		});
		const cmd = new MoveCellCommand('s1', 'down');
		cmd.execute();
		cmd.undo();
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(3);
		expect(cells.map((c) => c.id)).toEqual(['m1', 's1', 'm2']);
		expect((cells[0] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'aaa',
		);
		expect((cells[2] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'bbb',
		);
	});

	it('moving a cell with no markdown adjacency has no merge', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		const cmd = new MoveCellCommand('b', 'up');
		cmd.execute();
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['b', 'a', 'c']);
	});
});
