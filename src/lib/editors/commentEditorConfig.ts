export const commentEditorConfig = {
	skin_url: '/weshare-editor',
	skin: 'weshare-editor',
	content_css: 'weshare-editor',
	statusbar: false,
	menubar: false,
	contextmenu: false,
	paste_as_text: true,
	content_style: 'body { font-family: sans-serif; }', //set editor font to be the same as app's font
	resize: false,
	toolbar_mode: 'sliding',
	toolbar: ['bold italic underline strikethrough | blockquote link | emoticons'],
	mobile: {
		toolbar_mode: 'sliding',
		toolbar:
			'bold italic underline strikethrough | h1 h2 h3 | numlist bullist | subscript superscript | blockquote link codesample | emoticons image | undo redo | indent outdent | alignleft aligncenter alignright alignjustify alignnone'
	},
	plugins: 'link autolink codesample autoresize emoticons image lists',
	link_default_protocol: 'https',
	default_link_target: '_blank',
	link_title: false,
	min_height: 50
};
