import type { CellResult } from '@/store/types';
import styles from './cells.module.css';
import type { TranscriptItem } from './usePythonInput';

interface CellOutputProps {
	result: CellResult | null | undefined;
	transcript?: TranscriptItem[];
	inputPrompt?: string | null;
	onSubmitInput?: (value: string) => void;
}

export const CellOutput = ({ result, transcript, inputPrompt, onSubmitInput }: CellOutputProps) => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const input = (e.currentTarget.elements.namedItem('response') as HTMLInputElement).value;
		onSubmitInput?.(input);
		e.currentTarget.reset();
	};

	if (transcript && transcript.length > 0) {
		return (
			<section className={styles.transcript}>
				{transcript.map((item, i) =>
					item.kind === 'output'
						? <pre key={i} className={styles.transcriptOutput}>{item.text}</pre>
						: <pre key={i} className={styles.transcriptInput}>{item.prompt}<span>{item.response}</span></pre>
				)}
				{inputPrompt != null && onSubmitInput && (
					<form className={styles.inputForm} onSubmit={handleSubmit}>
						<label className={styles.inputPrompt}>{inputPrompt || '> '}</label>
						<input
							className={styles.inputField}
							type='text'
							name='response'
							autoFocus
							autoComplete='off'
						/>
						<button type='submit'>Submit</button>
					</form>
				)}
			</section>
		);
	}

	return (
		<>
			{result && (() => {
				switch (result.kind) {
					case 'table':
						return (
							<section className={styles.result}>
								{result.rows.length > 0 ? (
									<table className={styles.resultTable}>
										<thead>
											<tr>
												{Object.keys(result.rows[0]).map((col) => (
													<th key={col}>{col}</th>
												))}
											</tr>
										</thead>
										<tbody>
											{result.rows.map((row, i) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: No stable key available
												<tr key={i}>
													{Object.values(row).map((val, j) => (
														// biome-ignore lint/suspicious/noArrayIndexKey: Positional
														<td key={j}>{String(val ?? '')}</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<p className={styles.status}>
										{result.rowsAffected > 0
											? `Query OK (${result.rowsAffected} change${result.rowsAffected > 1 ? 's' : ''} applied)`
											: 'Query OK'}
									</p>
								)}
							</section>
						);
					case 'text':
						return <p className={styles.status}>{result.text}</p>;
					case 'error':
						return <section className={styles.error}>{result.message}</section>;
				}
			})()}
			{inputPrompt != null && onSubmitInput && (
				<form className={styles.inputForm} onSubmit={handleSubmit}>
					<label className={styles.inputPrompt}>{inputPrompt || '> '}</label>
					<input
						className={styles.inputField}
						type='text'
						name='response'
						autoFocus
						autoComplete='off'
					/>
					<button type='submit'>Submit</button>
				</form>
			)}
		</>
	);
};
