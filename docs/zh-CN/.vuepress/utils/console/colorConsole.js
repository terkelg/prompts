/**
 * 彩色的控制台，方便调试
 *
 * @param [string | ColorCode] desc 状态描述
 * @param [string ] hint 提示信息
 * @content [params ] ...content 控制台显示的参数
 */
export function colorConsole(desc, hint, content) {
	const defaultColor = {
		primary: "#1890ff",
		success: "#52c41a",
		warning: "#faad14",
		error: "#f5222d",
		coral: "#FF7F50",
		fuchsia: "#FF00FF",
		seagreen: "#2E8B57",
		violet: "#EE82EE",
		darkblue: "#00008B",
		red: "#B03060",
		orange: "#FE9A76",
		yellow: "#FFD700",
		pink: "#FF1493",
		olive: "#32CD32",
		teal: "#008080",
		blue: "#0E6EB8",
		green: "#016936",
		purple: "#B413EC",
		brown: "#A52A2A",
		gray: "#A0A0A0",
		black: "#000000"
	};
	const isDefaultColor = Object.keys(defaultColor).indexOf(desc) >= 0;
	if (!isDefaultColor) {
		defaultColor[desc] = desc;
	}
	console.log(`%c ${hint} `, `background: ${defaultColor[desc]}; color: white; border-radius: 2px; font-weight: bolder;`, content);
}
