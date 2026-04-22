'use client';

import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';
import { useColorScheme, useSheetStore } from '@/lib';
import type { PythonCellData } from '@/lib';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';
import { useDebouncedCallback } from './useDebouncedCallback';
import { usePythonInput } from './usePythonInput';

export const PythonCell = ({ cellData }: { cellData: PythonCellData }) => {
	const updateCell = useSheetStore((state) => state.updateCell);
	const isLoading = useSheetStore(
		(state) => state.runningCellId === cellData.id,
	);
	const anyRunning = useSheetStore((state) => state.runningCellId !== null);
	const scheme = useColorScheme();
	const { transcript, inputPrompt, submitInput } = usePythonInput(
		isLoading,
		cellData.result,
	);
	const handleChange = useDebouncedCallback(
		(code: string) => updateCell(cellData.id, { ...cellData, content: code }),
		250,
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
		<>
			<CodeMirror
				basicSetup={{ autocompletion: false }}
				theme={scheme}
				value={cellData.content}
				editable={!anyRunning}
				extensions={[python()]}
				onChange={handleChange}
			/>
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
		</>
	);
};
