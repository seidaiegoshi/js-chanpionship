// 【参考URL】
// ※要PHS https://www.secioss.co.jp/%E3%83%8E%E3%83%BC%E3%83%88pc%E3%81%A7%E8%87%AA%E6%92%AE%E3%82%8A-pc%E3%81%AE%E3%82%AB%E3%83%A1%E3%83%A9%E3%82%92web%E3%82%AB%E3%83%A1%E3%83%A9%E3%81%A8%E3%81%97%E3%81%A6%E7%94%BB%E5%83%8F%E3%83%95/
// https://elsammit-beginnerblg.hatenablog.com/entry/2020/06/16/214024
// take1 動かなかった https://office-yone.com/javascript_camera/
// サポート対象外ブラウザあり https://ziyudom.com/js-camera-capture/
// https://blog.katsubemakito.net/html5/camera1

// canvas基本 https://qiita.com/kyrieleison/items/a3ebf7c55295c3e7d8f0

// ーーーーーーーーーーーーーーーーーーーーー
// 宣言
// ーーーーーーーーーーーーーーーーーーーーー
// 画像を文字列変換したものを格納する変数
let imageData = "";
let media = null;
let isFront = true;
let render = null;
let cameraIsStop = false;
let mobileNetImageArray = [];
let streamObj = null;

// カメラ
video = document.createElement("video");
video.setAttribute("autoplay", "");
video.setAttribute("muted", "");
video.setAttribute("playsinline", "");

const constraints = {
	audio: false,
	video: {
		// width: 300,
		// height: 200,
		facingMode: "user", // フロントカメラを利用する
	},
};

// キャンバス
const canvas = document.querySelector("#mainCanvas");
const prev = canvas.getContext("2d"); //2Dグラフィックを描画するためのメソッドやプロパティをもつオブジェクトを返す。

// ーーーーーーーーーーーーーーーーーーーーー
// 関数の定義
// ーーーーーーーーーーーーーーーーーーーーー
function isMobile() {
	// スマホか判定
	var b = false;
	var ua = navigator.userAgent;
	if ((ua.indexOf("iPhone") > 0 || ua.indexOf("Android") > 0) && ua.indexOf("Mobile") > 0) {
		b = true;
	}
	return b;
}

function canvasUpdate() {
	//. video to canvas(animation)
	prev.drawImage(video, 0, 0, canvas.width, canvas.height);
	render = requestAnimationFrame(canvasUpdate);
}

function toggleCamera() {
	//背面カメラとフロントカメラを切り替える
	isFront = !isFront;
	canvas.style.transform = isFront ? "scaleX(-1)" : "scaleX(1)";
	startVideo();
}

function startVideo() {
	constraints.video.facingMode = isFront ? "user" : { exact: "environment" };
	// すでにカメラと接続していたら停止
	if (streamObj !== null) {
		// すでにカメラと接続していたら停止
		streamObj.getVideoTracks().forEach((camera) => {
			camera.stop();
		});
	}
	media = navigator.mediaDevices
		.getUserMedia(constraints)
		.then((stream) => {
			streamObj = stream;
			video.srcObject = stream;
			video.onloadedmetadata = (e) => {
				video.play();
			};
		})
		.catch((err) => {
			console.log(err.name + ": " + err.message);
		});
}

function toggleStream() {
	cameraIsStop = !cameraIsStop;
	if (cameraIsStop) {
		// シャッターを押したら、カメラの表示の更新を止める。
		cancelAnimationFrame(render);
		video.pause(); // 映像を停止
	} else {
		video.play();
		canvasUpdate();
	}
}
async function getClassifyResult() {
	//より詳細な認識を試みる
	mobileNetImageArray.forEach(async (element) => {
		const img = new Image();
		img.src = element;
		await mobilenet.load().then((model) => {
			// Classify the image.
			model.classify(img).then((predictions) => {
				console.log(predictions);
				// mobileNetResults.push(spaceToHyphen(getFirstLabel(predictions)));
				return predictions;
			});
		});
	});
	// return await predictions;
}
// ーーーーーーーーーーーーーーーーーーーーー
// 実行
// ーーーーーーーーーーーーーーーーーーーーー

// ランダムな背景画像を設定する
setBackGroundImage("./..");

if (isMobile()) {
	constraints.video.facingMode = "environment";
	isFront = false;
} else {
	canvas.style.transform = "scaleX(-1)";
	isFront = true;
	// 背面カメラがない場合は、切り替えボタンを消滅させる。
	$("#toggleCamera").css("display", "none");
}

startVideo();
canvasUpdate();

/**
 * シャッターボタン
 */
document.querySelector("#shutter").addEventListener(
	"click",
	() => {
		toggleStream(); //カメラのON/OFFを切り替える
		if (cameraIsStop) {
			// カメラが止まっているとき、

			/* 認識結果を表示 
			----------------*/

			// canvasに表示されているデータを画像に変換
			imageData = canvas.toDataURL("image/jpeg", 1); //toDataURL("設定したい拡張子", 画質※画質設定はjpgのときのみ)
			const judge_img = new Image();
			judge_img.src = imageData;
			mobileNetImageArray = [];

			cocoSsd.load().then(async (model) => {
				const tensorflow_judge = await model.detect(canvas);

				// オブジェクト認識で使う
				let tensorCanvasArray = []; //これにcanvasの情報を入れる
				// 詳細な画像認識で使う
				const mobileNetCanvas = document.querySelector("#mobileNetCanvas");
				const mobCtx = mobileNetCanvas.getContext("2d");

				tensorflow_judge.forEach((el, i) => {
					console.log(el.class);
					// hmtl要素を作成
					$("#recognitionResults ul").append(`
						<li><canvas id="tensorCanvas${i}"></canvas></li>
					`);
					// 横幅とその時の縦の大きさをセット
					let maxWidth = 70;
					let maxheight = 70;
					let aspectH = (maxWidth * el.bbox[3]) / el.bbox[2];
					if (aspectH > maxheight) {
						aspectH = maxheight;
						maxWidth = (maxheight * el.bbox[2]) / el.bbox[3];
					}
					//canvasを準備
					tensorCanvasArray.push(document.querySelector(`#tensorCanvas${i}`));
					tensorCanvasArray[i].width = maxWidth;
					tensorCanvasArray[i].height = aspectH;
					tensorCanvasArray[i].style.transform = isFront ? "scaleX(-1)" : "scaleX(1)";
					let tensorCtx = tensorCanvasArray[i].getContext("2d");
					// 取得したイメージを表示
					tensorCtx.drawImage(
						canvas, //もとの図形
						el.bbox[0], //開始点x
						el.bbox[1], //開始点y
						el.bbox[2], //開始点からの幅
						el.bbox[3], //開始点からの高さ
						0, //どこに描くかx
						0, //どこに描くかy
						maxWidth, //描画後の幅(アスペクト)
						aspectH //描画後の高さ(アスペクト)
					);

					// 取得した各要素を識別してラベルを作成する
					//canvasを準備

					mobileNetCanvas.width = el.bbox[2];
					mobileNetCanvas.height = el.bbox[3];
					mobCtx.clearRect(0, 0, mobileNetCanvas.width, mobileNetCanvas.height);
					mobCtx.drawImage(
						canvas, //もとの図形
						el.bbox[0], //開始点x
						el.bbox[1], //開始点y
						el.bbox[2], //開始点からの幅
						el.bbox[3], //開始点からの高さ
						0, //どこに描くかx
						0, //どこに描くかy
						el.bbox[2], //描画後の幅(アスペクト)
						el.bbox[3] //描画後の高さ(アスペクト)
					);

					// より詳細な認識のために、画像データは一旦配列に入れる。
					mobileNetImageArray.push(mobileNetCanvas.toDataURL("image/jpeg", 1));
				});

				//より詳細な認識を行って、labelに表示する。
				const mobileNetResults = [];
				mobileNetImageArray.forEach(async (element) => {
					const img = new Image();
					img.src = element;
					mobilenet.load().then((model) => {
						// Classify the image.
						model.classify(img).then((predictions) => {
							//認識後の処理はここに書かないと、うまく表示できない！
							mobileNetResults.push(spaceToHyphen(getFirstLabel(predictions)));
							const label = mobileNetResults.join("-");
							console.log(label);
							sessionStorage.label = label;
							$("#label").val(label);
							$("#recognitionResults").css("visibility", "visible");
							$("#goBoard").css("visibility", "visible");
						});
					});
				});
			});
		} else {
			// カメラが動いているとき、

			// 認識結果をリセット
			$("#recognitionResults").css("visibility", "hidden");
			$("#recognitionResults ul").html("");

			// 掲示板へ移動のボタンを非表示
			$("#goBoard").css("visibility", "hidden");
		}
	},
	false
);

// 背面カメラとフロントカメラを切り替える

$("#toggleCamera").on("click", () => {
	toggleCamera();
});
