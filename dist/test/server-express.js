"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _ = require("../");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 3000;
var app = (0, _express2.default)();
app.use(_2.default);
(0, _.on)(function (log) {
	console.log(log);
});
app.get('/', function (req, res) {
	res.json({ json: 1112 });
});

app.listen(PORT, function () {
	console.log("Example app listening on port : " + PORT);
	_http2.default.request("http://localhost:" + PORT + "?time=" + Date.now()).end();
});

var cc = {
	a: 1
};

console.log(cc.a);
//# sourceMappingURL=server-express.js.map