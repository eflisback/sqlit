import type { GistEntry } from '@/api/github';
import styles from '../Modal.module.css';

interface Props {
	gists: GistEntry[];
	loading: boolean;
	onSelect: (gistId: string) => void;
	onBack: () => void;
}

export const GistPickerView = ({ gists, loading, onSelect, onBack }: Props) => {
	return (
		<>
			<button type='button' className={styles.textButton} onClick={onBack}>
				← Back
			</button>
			{loading ? (
				<p className={styles.spinnerText}>Loading…</p>
			) : gists.length === 0 ? (
				<p>No existing sqlit sheets found.</p>
			) : (
				<ul className={styles.gistList}>
					{gists.map((gist) => (
						<li key={gist.id}>
							<button
								type='button'
								className={styles.gistItem}
								onClick={() => onSelect(gist.id)}
							>
								<span className={styles.gistDescription}>
									{gist.description || '(no description)'}
								</span>
								<span className={styles.gistDate}>
									{new Date(gist.updatedAt).toLocaleDateString()}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</>
	);
};
