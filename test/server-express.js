import express from "express";
import http from "http";
import RedLogger, {on} from "../";

const PORT = 3000;
const app = express();
app.use(RedLogger);
on(function (log) {
	console.log(log)
});
app.get('/', (req, res) => {
	res.json({json: 1112});
});

app.listen(PORT, () => {
	console.log(`Example app listening on port : ${PORT}`);
	http.request((`http://localhost:${PORT}?time=${Date.now()}`))
		.end();
});


let cc = {
	a: 1
};

console.log(cc.a);
