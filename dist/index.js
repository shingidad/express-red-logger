"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var TAG = '[red-logger]';
var userCustomLogRule = [];
var isContentsTypeFilter = exports.isContentsTypeFilter = true;
var colors = {
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
var defaultContentsTypeFilters = ['text/xml', 'application/xml', 'application/xml-external-parsed-entity', 'application/xml-dtd', 'application/mathtml+xml', 'application/xslt+xml', 'application/json', 'text/html', 'text/plain', 'text/xml'];

/**
 * Add Filter
 * @param filter
 * @returns {*}
 */
var addContentsTypeFilter = exports.addContentsTypeFilter = function addContentsTypeFilter(filter) {
	if (filter === '' || filter === null || filter === undefined) {
		return undefined;
	} else {
		var type = typeof filter === "undefined" ? "undefined" : _typeof(filter);
		if (type === 'string' && defaultContentsTypeFilters.indexOf(filter) <= -1) {
			defaultContentsTypeFilters.push(filter);
		} else {
			for (var i = 0; i < filter.length; i++) {
				defaultContentsTypeFilters.push(filter.push(filter[i]));
			}
		}
	}
	return undefined;
};

/**
 * get Filter
 * @returns {[string,string,string,string,string,string,string,string,string,string]}
 */
var getContentsTypeFilter = exports.getContentsTypeFilter = function getContentsTypeFilter() {
	return defaultContentsTypeFilters;
};

var __Event = function __Event(log, req, res) {
	var keys = Object.keys(log);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var value = log[key];
		var type = typeof value === "undefined" ? "undefined" : _typeof(value);

		var icon = i !== keys.length - 1 ? '├' : '┕';
		if (type === 'object') {
			console.log(colors.fg.Cyan + icon + colors.Bright + (" " + key + "[" + colors.Reset + type + colors.fg.Cyan + "]" + colors.Reset + ":"), colors.Reset);
			console.log(colors.fg.Cyan + '│', '┕' + colors.Reset + (" " + (Array.isArray(value) ? 'Array Length:' + value.length : 'Object keys :' + Object.keys(value).length)));
			console.log(colors.fg.Cyan + '' + colors.Reset, '', '', JSON.stringify(value));
		} else {
			console.log(colors.fg.Cyan + icon + colors.Bright + (" " + key + "[" + colors.Reset + type + colors.fg.Cyan + "]" + colors.Reset + ":"), value, colors.Reset);
		}
	}
};

var on = exports.on = function on(callback) {
	__Event = callback;
};

/**
 * Response 를 custom 해준다.
 * @param res
 * @param name
 * @param func
 * @returns {*}
 */
var $$TryResponse = function $$TryResponse(res, name, func) {
	res["__" + name] = res[name];
	res[name] = function () {
		func.call.apply(func, [res].concat(Array.prototype.slice.call(arguments)));
		return res["__" + name].apply(res, arguments);
	};
	return res;
};

var $$Log = function $$Log(res) {
	var isJSON = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	var currentTime = Date.now();
	var req = res.req,
	    statusMessage = res.statusMessage,
	    statusCode = res.statusCode,
	    _headers = res._headers,
	    __responseBody = res.__responseBody;

	var _processingTime = currentTime - req._requestTime;
	var log = {
		url: req.url,
		method: req.method,
		statusCode: statusCode,
		statusMessage: statusMessage,
		body: isJSON ? JSON.parse(__responseBody) : __responseBody,
		_timeRequest: req._requestTime,
		_timeResponse: currentTime,
		_processingTime: _processingTime
	};
	return log;
};

var Logger = function Logger(req, res, next) {
	req._requestTime = Date.now();
	$$TryResponse(res, 'end', function () {
		this.__responseBody = arguments[0];
	});
	res.on('finish', function () {
		var contentType = this._headers['content-type'];
		if (isContentsTypeFilter && contentType !== undefined && contentType !== null) {
			contentType = contentType.toLowerCase();
			var type = defaultContentsTypeFilters.find(function (t) {
				return contentType.indexOf(t) >= 0;
			});
			if (type !== null && type !== undefined) {
				__Event($$Log(res, type.indexOf('json') >= 0), res.req, res);
			}
		}
	});
	next();
};

exports.default = Logger;
//# sourceMappingURL=index.js.map