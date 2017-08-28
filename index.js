const TAG = '[red-logger]';
const userCustomLogRule = [];
export let isContentsTypeFilter = true;
const colors = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",
	fg: {
		Black: "\x1b[30m",
		Red: "\x1b[31m",
		Green: "\x1b[32m",
		Yellow: "\x1b[33m",
		Blue: "\x1b[34m",
		Magenta: "\x1b[35m",
		Cyan: "\x1b[36m",
		White: "\x1b[37m",
		Crimson: "\x1b[38m"
	},
	bg: {
		Black: "\x1b[40m",
		Red: "\x1b[41m",
		Green: "\x1b[42m",
		Yellow: "\x1b[43m",
		Blue: "\x1b[44m",
		Magenta: "\x1b[45m",
		Cyan: "\x1b[46m",
		White: "\x1b[47m",
		Crimson: "\x1b[48m"
	}
};


/**
 * Header Contents-type list
 * @type {[string,string,string,string,string,string,string,string,string,string]}
 */
const defaultContentsTypeFilters = [
	'text/xml',
	'application/xml',
	'application/xml-external-parsed-entity',
	'application/xml-dtd',
	'application/mathtml+xml',
	'application/xslt+xml',
	'application/json',
	'text/html',
	'text/plain',
	'text/xml'
];

/**
 * Add Filter
 * @param filter
 * @returns {*}
 */
export const addContentsTypeFilter = (filter) => {
	if (filter === '' || filter === null || filter === undefined) {
		return this;
	} else {
		const type = typeof filter;
		if (type === 'string' && defaultContentsTypeFilters.indexOf(filter) <= -1) {
			defaultContentsTypeFilters.push(filter);
		} else {
			for (let i = 0; i < filter.length; i++) {
				defaultContentsTypeFilters.push(filter.push(filter[i]));
			}
		}
	}
	return this;
};


/**
 * get Filter
 * @returns {[string,string,string,string,string,string,string,string,string,string]}
 */
export const getContentsTypeFilter = () => {
	return defaultContentsTypeFilters;
};

let __Event = (log, req, res) => {
	const keys = Object.keys(log);
	console.log(colors.bg.Cyan + colors.fg.White + '▼', `${TAG}` + colors.Reset);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = log[key];
		const type = typeof value;
		const icon = i !== keys.length - 1 ? '├' : '┕';
		if (type === 'object') {
			console.log(colors.fg.Cyan + icon + colors.Bright + ` ${key}[${colors.Reset}${type}${colors.fg.Cyan}]${colors.Reset}:`, colors.Reset);
			console.log(colors.fg.Cyan + '│', '┕' + colors.Reset + ` ${Array.isArray(value) ? 'Array Length:' + value.length : 'Object keys :' + Object.keys(value).length}`);
			console.log(colors.fg.Cyan + '' + colors.Reset, '', '', JSON.stringify(value));
		} else {
			console.log(colors.fg.Cyan + icon + colors.Bright + ` ${key}[${colors.Reset}${type}${colors.fg.Cyan}]${colors.Reset}:`, value, colors.Reset);
		}
	}
};

export const on = (callback) => {
	__Event = callback;
};

/**
 * Response 를 custom 해준다.
 * @param res
 * @param name
 * @param func
 * @returns {*}
 */
const $$TryResponse = (res, name, func) => {
	res[`__${name}`] = res[name];
	res[name] = function () {
		func.call(res, ...arguments);
		return res[`__${name}`](...arguments);
	};
	return res;
};

const $$Log = (res, isJSON = false) => {
	const currentTime = Date.now();
	const {req, statusMessage, statusCode, _headers, __responseBody} = res;
	const _processingTime = currentTime - req._requestTime;
	const log = {
		url: req.url,
		method: req.method,
		statusCode,
		statusMessage,
		body: isJSON ? JSON.parse(__responseBody) : __responseBody,
		_timeRequest: req._requestTime,
		_timeResponse: currentTime,
		_processingTime,
	};
	return log;
};


const Logger = (req, res, next) => {
	req._requestTime = Date.now();
	$$TryResponse(res, 'end', function () {
		this.__responseBody = arguments[0];
	});
	res.on('finish', function () {
		let contentType = this._headers['content-type'];
		if ((isContentsTypeFilter && contentType !== undefined && contentType !== null)) {
			contentType = contentType.toLowerCase();
			const type = defaultContentsTypeFilters.find(t => contentType.indexOf(t) >= 0);
			if (type !== null && type !== undefined) {
				__Event($$Log(res, type.indexOf('json') >= 0), res.req, res);
			}
		}
	});
	next();
};

export default Object.assign(Logger, {on});