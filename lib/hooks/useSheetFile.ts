'use client';

import { useCallback } from 'react';
import {
	FaFileCircleCheck,
	FaFileCircleQuestion,
	FaFileCircleXmark,
	FaFileImport,
} from 'react-icons/fa6';
import { useToast } from '@/components/toast/useToast';
import { engine } from '@/lib/engine';
import { readSheetFileMd, saveSheetMd, useSheetStore } from '@/lib/store';

export const useExportSheet = () => {
	const cells = useSheetStore((state) => state.cells);
	const { addToast } = useToast();

	const saveSheet = useCallback(async () => {
		await saveSheetMd(cells);
		addToast('Sheet saved', { icon: FaFileCircleCheck, type: 'info' });
	}, [cells, addToast]);

	return saveSheet;
};

export const useImportSheet = () => {
	const loadCells = useSheetStore((state) => state.loadCells);
	const { addToast } = useToast();

	const importSheet = useCallback(
		async (file?: File) => {
			if (!file) {
				addToast('No file selected', {
					icon: FaFileCircleXmark,
					type: 'error',
				});
				return;
			}

			try {
				const cells = await readSheetFileMd(file);
				engine.reset();
				loadCells(cells);
				addToast(`${file.name} imported`, { icon: FaFileImport, type: 'info' });
			} catch (_e) {
				addToast(`Failed to read ${file.name}`, {
					icon: FaFileCircleQuestion,
					type: 'error',
				});
			}
		},
		[loadCells, addToast],
	);

	return importSheet;
};
