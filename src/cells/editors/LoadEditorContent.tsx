import type { CellData } from '@/store/types';
import styles from '../cells.module.css';
import type { EditorProps } from '../types';

type LoadCell = Extract<CellData, { type: 'load' }>;

export const LoadEditorContent = ({ cellData }: EditorProps<LoadCell>) => {
	return <span className={styles.urlInput}>{cellData.url}</span>;
};
