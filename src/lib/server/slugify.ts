//from gist.github.com/codeguy/6684588
export default function slugify(str: string) {
	return str
		.normalize('NFD') // split an accented letter in the base letter and the acent
		.replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
		.toLowerCase()
		.trim()
		.replace(/[đ]/g, 'd') // vietnamese character normalization
		.replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
		.replace(/\s+/g, '-');
}
