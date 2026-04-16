import type { Command } from './commands';

const past: Command[] = [];
const future: Command[] = [];

export const history = {
	execute(cmd: Command): void {
		cmd.execute();
		past.push(cmd);
		future.length = 0;
	},
	undo(): void {
		const cmd = past.pop();
		if (!cmd) return;
		cmd.undo();
		future.push(cmd);
	},
	redo(): void {
		const cmd = future.pop();
		if (!cmd) return;
		cmd.execute();
		past.push(cmd);
	},
	clear(): void {
		past.length = 0;
		future.length = 0;
	},
};
