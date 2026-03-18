import { useEffect, useRef, useState } from 'react';
import { onInputRequest, submitInput } from '@/engine/wrapper';
import type { CellResult } from '@/store/types';

export type TranscriptItem =
	| { kind: 'output'; text: string }
	| { kind: 'input'; prompt: string; response: string };

export function usePythonInput(
	isLoading: boolean,
	result: CellResult | null | undefined,
) {
	const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
	const [inputPrompt, setInputPrompt] = useState<string | null>(null);
	const pendingPromptRef = useRef<string>('');

	useEffect(() => {
		if (!isLoading) {
			setInputPrompt(null);
			return;
		}
		setTranscript([]);
		return onInputRequest((stdout, prompt) => {
			pendingPromptRef.current = prompt;
			setTranscript((prev) =>
				stdout ? [...prev, { kind: 'output', text: stdout }] : prev,
			);
			setInputPrompt(prompt);
		});
	}, [isLoading]);

	const prevLoadingRef = useRef(false);
	useEffect(() => {
		if (prevLoadingRef.current && !isLoading) {
			setTranscript((prev) => {
				if (prev.length === 0) return prev;
				if (
					result?.kind === 'text' &&
					result.text &&
					result.text !== '(no output)'
				) {
					return [...prev, { kind: 'output', text: result.text }];
				}
				if (result?.kind === 'error') {
					return [...prev, { kind: 'output', text: result.message }];
				}
				return prev;
			});
		}
		prevLoadingRef.current = isLoading;
	}, [isLoading, result]);

	const submit = (value: string) => {
		const prompt = pendingPromptRef.current;
		setInputPrompt(null);
		setTranscript((prev) => [
			...prev,
			{ kind: 'input', prompt, response: value },
		]);
		submitInput(value);
	};

	return { transcript, inputPrompt, submitInput: submit };
}
