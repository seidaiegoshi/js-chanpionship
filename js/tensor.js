let img = new Image();

// 受信処理
window.onload = function () {
	// URLを取得
	const url = new URL(window.location.href);

	// URLSearchParamsオブジェクトを取得
	const params = url.searchParams;

	// consoleに受け取ったパラメータを出力
	console.log(params);

	// パラメータから「cameraData」を取得
	const image = params.get("cameraData");
	console.log(image);
	$("#img").attr("src", image);

	img.src = image;
};

// const img = document.getElementById("img");
console.log(img);

// Load the model.
// 機械学習モデルのロードが完了したら、
mobilenet.load().then((model) => {
	// Classify the image.
	model.classify(img).then((predictions) => {
		console.log("Predictions: ");
		console.log(predictions);
		showHtml(splitClassNamesToArray(predictions));
	});
});

// スペース区切りをハイフン区切りにする。
function spaceToHyphen(str) {
	return str.replace(/ /g, "-");
}

// ClassNameを全部バラして認識結果で出てきた単語を全部配列に入れる。
function splitClassNamesToArray(arr) {
	const resultArr = [];
	arr.forEach((classNames) => {
		let elements = classNames.className.split(", ");
		elements.forEach((element) => {
			resultArr.push(spaceToHyphen(element));
		});
	});
	return resultArr;
}

// 配列の各要素をhtmlに出力する。
function showHtml(arr) {
	$("#label").val(arr[0]);
	htmlElement = "";
	arr.forEach((el, i) => {
		htmlElement += `<p>${el}</p>`;
	});
	$("#output").html(htmlElement);
}
