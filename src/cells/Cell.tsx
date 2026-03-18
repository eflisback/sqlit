import { FaPlay, FaTrash } from 'react-icons/fa6';
import { type CellData, useSheetStore } from '@/store';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';
import { cellDefinitions } from './registry';
import type { CellDefinition } from './types';
import { useRunCell } from './useRunCell';

interface CellProps {
	cellData: CellData;
}

interface CellBodyProps<T extends CellData> {
	cellData: T;
	definition: CellDefinition<T>;
}

const CellBody = <T extends CellData>({
	cellData,
	definition,
}: CellBodyProps<T>) => {
	const removeCell = useSheetStore((state) => state.removeCell);
	const updateCell = useSheetStore((state) => state.updateCell);
	const isEditMode = useSheetStore((state) => state.isEditMode);
	const { isLoading, status, run } = useRunCell(cellData, definition);
	const { Icon, label, information, execute, Editor } = definition;

	const onChange = (patch: Partial<Omit<T, 'id' | 'type'>>) => {
		updateCell(cellData.id, { ...cellData, ...patch } as CellData);
	};

	return (
		<article
			className={`${styles.cell} ${isLoading ? styles.loading : styles[status]}`}
		>
			<header>
				<section title={information}>
					<Icon />
					<span className={isLoading ? styles.shimmer : undefined}>
						{label}
					</span>
				</section>
				<section>
					{isEditMode && (
						<button type='button' onClick={() => removeCell(cellData.id)}>
							<FaTrash />
						</button>
					)}
				</section>
			</header>
			<Editor cellData={cellData} isLoading={isLoading} onChange={onChange} />
			{execute !== null && (
				<section className={styles.actions}>
					<button type='button' onClick={run} disabled={isLoading}>
						<FaPlay />
						<span className={isLoading ? styles.shimmer : undefined}>
							{isLoading ? 'Running...' : 'Execute snippet'}
						</span>
					</button>
				</section>
			)}
			<CellOutput result={cellData.result} />
		</article>
	);
};

export const Cell = ({ cellData }: CellProps) => {
	switch (cellData.type) {
		case 'sql':
			return <CellBody cellData={cellData} definition={cellDefinitions.sql} />;
		case 'python':
			return (
				<CellBody cellData={cellData} definition={cellDefinitions.python} />
			);
		case 'markdown':
			return (
				<CellBody cellData={cellData} definition={cellDefinitions.markdown} />
			);
		case 'load':
			return <CellBody cellData={cellData} definition={cellDefinitions.load} />;
	}
};
