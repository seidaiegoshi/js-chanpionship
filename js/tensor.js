let img = new Image();

// 画像取得処理
window.onload = function () {
	// URLを取得
	img = new Image();
	img.src = sessionStorage.img;
	console.log(sessionStorage.img);
	$("#img").attr("src", img.src);
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
