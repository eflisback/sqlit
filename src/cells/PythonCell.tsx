import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';
import { FaPython } from 'react-icons/fa6';
import { useTheme } from '@/components';
import { useSheetStore } from '@/store';
import type { CellData } from '@/store/types';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';
import {
	ExecutableCellShell,
	RunButton,
	RunWithPriorButton,
} from './ExecutableCellShell';
import { usePythonInput } from './usePythonInput';
import { useRunCell } from './useRunCell';

type PythonCellData = Extract<CellData, { type: 'python' }>;

export const PythonCell = ({ cellData }: { cellData: PythonCellData }) => {
	const updateCell = useSheetStore((state) => state.updateCell);
	const { theme } = useTheme();
	const { isLoading, anyRunning, status, run, runWithPrior, showRunWithPrior } =
		useRunCell(cellData);
	const { transcript, inputPrompt, submitInput } = usePythonInput(
		isLoading,
		cellData.result,
	);

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const input = (
			e.currentTarget.elements.namedItem('response') as HTMLInputElement
		).value;
		submitInput(input);
		e.currentTarget.reset();
	};

	return (
		<ExecutableCellShell
			Icon={FaPython}
			label='python'
			information='Contains Python code executed via Pyodide with access to the SQLite database.'
			isLoading={isLoading}
			status={status}
		>
			<CodeMirror
				basicSetup={{ autocompletion: false }}
				theme={theme}
				value={cellData.content}
				editable={!anyRunning}
				extensions={[python()]}
				onChange={(code) =>
					updateCell(cellData.id, { ...cellData, content: code })
				}
			/>
			<section className={styles.actions}>
				<RunButton isLoading={isLoading} disabled={anyRunning} onClick={run} />
				{showRunWithPrior && (
					<RunWithPriorButton disabled={anyRunning} onClick={runWithPrior} />
				)}
			</section>
			{transcript.length > 0 || inputPrompt != null ? (
				<section className={styles.transcript}>
					{transcript.map((item, i) =>
						item.kind === 'output' ? (
							// biome-ignore lint/suspicious/noArrayIndexKey: transcript is append-only, index keys are stable
							<pre key={i} className={styles.transcriptOutput}>
								{item.text}
							</pre>
						) : (
							// biome-ignore lint/suspicious/noArrayIndexKey: transcript is append-only, index keys are stable
							<pre key={i} className={styles.transcriptInput}>
								{item.prompt}
								<span>{item.response}</span>
							</pre>
						),
					)}
					{inputPrompt != null && (
						<form className={styles.inputForm} onSubmit={handleSubmit}>
							<label className={styles.inputPrompt}>
								{inputPrompt || '> '}
								<input
									className={styles.inputField}
									type='text'
									name='response'
									// biome-ignore lint/a11y/noAutofocus: We want autofocus here
									autoFocus
									autoComplete='off'
								/>
							</label>
							<button type='submit'>Submit</button>
						</form>
					)}
				</section>
			) : (
				<CellOutput result={cellData.result} />
			)}
		</ExecutableCellShell>
	);
};
