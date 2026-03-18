import type { IconType } from 'react-icons';
import type { CellData, CellResult } from '@/store/types';

export type CellStatus = 'none' | 'success' | 'failure';

export interface EditorProps<T extends CellData> {
	cellData: T;
	isLoading: boolean;
	onChange: (patch: Partial<Omit<T, 'id' | 'type'>>) => void;
}

export interface CellDefinition<T extends CellData> {
	label: string;
	information: string;
	Icon: IconType;
	execute: ((cellData: T) => Promise<CellResult>) | null;
	Editor: React.ComponentType<EditorProps<T>>;
}
