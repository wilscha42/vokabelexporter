export type CSVData = { [column: string]: string }[];

export function readCSV(data: string): CSVData {
	const SEPARATOR = ';';

	const rows = data.split('\n');

	if (rows.length > 1) {
		const columns = rows[0].split(SEPARATOR);

		const entries = [];
		for (let i = 1; i < rows.length; i++) {
			if (rows[i].trim() === '') continue;

			const cells = rows[i].split(SEPARATOR);

			const entry = Object.fromEntries(columns.map((c, i) => [c, cells[i]]));

			entries.push(entry);
		}

		return entries;
	} else {
		throw new Error('Error reading CSV data.');
	}
}
