const formatter = new Intl.RelativeTimeFormat('vi', {
	numeric: 'auto'
});

const divisions: Division[] = [
	{ amount: 60, name: 'seconds' },
	{ amount: 60, name: 'minutes' },
	{ amount: 24, name: 'hours' },
	{ amount: 7, name: 'days' },
	{ amount: 4.34524, name: 'weeks' },
	{ amount: 12, name: 'months' },
	{ amount: Number.POSITIVE_INFINITY, name: 'years' }
];

export function toRelativeTime(date: Date) {
	let duration = (date.getTime() - Date.now()) / 1000;

	for (let i = 0; i <= divisions.length; i++) {
		const division = divisions[i];
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
}

interface Division {
	amount: number;
	name: Intl.RelativeTimeFormatUnit;
}
