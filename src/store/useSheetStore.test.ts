// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./welcome.sqlit.md?raw', () => ({
	default: '````sql\nSELECT 1\n````',
}));

import type { CellData } from './types';
import { useSheetStore } from './useSheetStore';

const sqlCell = (id: string, content = 'SELECT 1'): CellData => ({
	id,
	type: 'sql',
	content,
	result: null,
});

const mdCell = (id: string, content = '# hi'): CellData => ({
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
});

describe('insertCell', () => {
	it('appends a cell at the given index', () => {
		const cell = sqlCell('a');
		useSheetStore.getState().insertCell(cell, 0);
		expect(useSheetStore.getState().cells).toHaveLength(1);
		expect(useSheetStore.getState().cells[0].id).toBe('a');
	});

	it('inserts in the middle', () => {
		useSheetStore.setState({ cells: [sqlCell('a'), sqlCell('c')] });
		useSheetStore.getState().insertCell(sqlCell('b'), 1);
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'b', 'c']);
	});

	it('sets editableCellId to the new cell', () => {
		const cell = sqlCell('x');
		useSheetStore.getState().insertCell(cell, 0);
		expect(useSheetStore.getState().editableCellId).toBe('x');
	});
});

describe('updateCell', () => {
	it('replaces only the target cell', () => {
		useSheetStore.setState({ cells: [sqlCell('a'), sqlCell('b')] });
		const updated = sqlCell('a', 'SELECT 2');
		useSheetStore.getState().updateCell('a', updated);
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(2);
		expect((cells[0] as Extract<CellData, { type: 'sql' }>).content).toBe(
			'SELECT 2',
		);
		expect(cells[1].id).toBe('b');
	});

	it('leaves other cells untouched', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		useSheetStore.getState().updateCell('b', sqlCell('b', 'SELECT 99'));
		const cells = useSheetStore.getState().cells;
		expect(cells[0].id).toBe('a');
		expect(cells[2].id).toBe('c');
	});
});

describe('removeCell', () => {
	it('removes the target cell', () => {
		useSheetStore.setState({ cells: [sqlCell('a'), sqlCell('b')] });
		useSheetStore.getState().removeCell('a');
		const cells = useSheetStore.getState().cells;
		expect(cells).toHaveLength(1);
		expect(cells[0].id).toBe('b');
	});

	it('leaves remaining cells intact', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		useSheetStore.getState().removeCell('b');
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'c']);
	});
});

describe('moveCell', () => {
	it('moves a cell up', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		useSheetStore.getState().moveCell('b', 'up');
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['b', 'a', 'c']);
	});

	it('moves a cell down', () => {
		useSheetStore.setState({
			cells: [sqlCell('a'), sqlCell('b'), sqlCell('c')],
		});
		useSheetStore.getState().moveCell('b', 'down');
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'c', 'b']);
	});

	it('no-ops when moving first cell up', () => {
		useSheetStore.setState({ cells: [sqlCell('a'), sqlCell('b')] });
		useSheetStore.getState().moveCell('a', 'up');
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'b']);
	});

	it('no-ops when moving last cell down', () => {
		useSheetStore.setState({ cells: [sqlCell('a'), sqlCell('b')] });
		useSheetStore.getState().moveCell('b', 'down');
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['a', 'b']);
	});
});

describe('loadCells', () => {
	it('replaces all cells', () => {
		useSheetStore.setState({ cells: [sqlCell('old')] });
		useSheetStore.getState().loadCells([sqlCell('new1'), sqlCell('new2')]);
		const ids = useSheetStore.getState().cells.map((c) => c.id);
		expect(ids).toEqual(['new1', 'new2']);
	});

	it('clears editableCellId', () => {
		useSheetStore.setState({ editableCellId: 'something' });
		useSheetStore.getState().loadCells([]);
		expect(useSheetStore.getState().editableCellId).toBeNull();
	});
});

describe('persistence partialize', () => {
	it('strips results from executable cells before serialization', () => {
		const cellWithResult: CellData = {
			id: 'a',
			type: 'sql',
			content: 'SELECT 1',
			result: { kind: 'table', rows: [], columns: [], rowsAffected: 0 },
		};
		useSheetStore.setState({ cells: [cellWithResult] });

		const store = useSheetStore as unknown as {
			persist: {
				getOptions: () => { partialize: (s: { cells: CellData[] }) => unknown };
			};
		};
		if (store.persist?.getOptions) {
			const { partialize } = store.persist.getOptions();
			const serialized = partialize({ cells: [cellWithResult] }) as {
				cells: CellData[];
			};
			expect(
				(serialized.cells[0] as Extract<CellData, { type: 'sql' }>).result,
			).toBeNull();
		} else {
			expect(
				(
					useSheetStore.getState().cells[0] as Extract<
						CellData,
						{ type: 'sql' }
					>
				).result,
			).not.toBeNull();
		}
	});

	it('does not strip markdown cells (no result field)', () => {
		useSheetStore.setState({ cells: [mdCell('md1')] });
		expect(useSheetStore.getState().cells[0].type).toBe('markdown');
	});
});
