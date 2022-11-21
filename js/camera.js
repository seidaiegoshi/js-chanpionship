// 【参考URL】
// ※要PHS https://www.secioss.co.jp/%E3%83%8E%E3%83%BC%E3%83%88pc%E3%81%A7%E8%87%AA%E6%92%AE%E3%82%8A-pc%E3%81%AE%E3%82%AB%E3%83%A1%E3%83%A9%E3%82%92web%E3%82%AB%E3%83%A1%E3%83%A9%E3%81%A8%E3%81%97%E3%81%A6%E7%94%BB%E5%83%8F%E3%83%95/
// https://elsammit-beginnerblg.hatenablog.com/entry/2020/06/16/214024
// take1 動かなかった https://office-yone.com/javascript_camera/
// サポート対象外ブラウザあり https://ziyudom.com/js-camera-capture/
// https://blog.katsubemakito.net/html5/camera1

// canvas基本 https://qiita.com/kyrieleison/items/a3ebf7c55295c3e7d8f0

// 画像を文字列変換したものを格納する変数
let imageData = "";

// window.onload = () => {
const video = document.querySelector("#camera");
const canvas = document.querySelector("#picture");
// const se = document.querySelector("#se");

/** カメラ設定 */
const constraints = {
	audio: false,
	video: {
		width: 300,
		height: 200,
		facingMode: "user", // フロントカメラを利用する
		// facingMode: { exact: "environment" }, // リアカメラを利用する場合
	},
};
let is_front = false;
let curSTREAM = null;

/**
 * カメラを<video>と同期
 */
function camera() {
	is_front = !is_front;
	constraints.video.facingMode = is_front ? "user" : { exact: "environment" };

	// すでにカメラと接続していたら停止
	if (curSTREAM !== null) {
		curSTREAM.getVideoTracks().forEach((camera) => {
			camera.stop();
		});
	}

	navigator.mediaDevices
		.getUserMedia(constraints)
		.then((stream) => {
			curSTREAM = stream;
			video.srcObject = stream;
			video.onloadedmetadata = (e) => {
				video.play();
			};
		})
		.catch((err) => {
			console.log(err.name + ": " + err.message);
		});
}

camera();

/**
 * シャッターボタン
 */
document.querySelector("#shutter").addEventListener(
	"click",
	() => {
		const ctx = canvas.getContext("2d"); //2Dグラフィックを描画するためのメソッドやプロパティをもつオブジェクトを返す。

		// 演出的な目的で一度映像を止めてSEを再生する
		video.pause(); // 映像を停止
		setTimeout(() => {
			video.play(); // 0.5秒後にカメラ再開
		}, 500);

		// canvasに画像を貼り付ける
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		// canvasに表示されているデータを画像に変換
		imageData = canvas.toDataURL("image/jpeg", 1); //toDataURL("設定したい拡張子", 画質※画質設定はjpgのときのみ)

		//
		//toDataURL("設定したい拡張子", 画質※画質設定はjpgのときのみ)
		document.getElementById("result").innerHTML =
			'<img src="' + imageData + '">';
		// --切り抜き機能ためにくぼっちがいじったゾーン--

		// judge_imgはImageとして扱う宣言。
		const judge_img = new Image();
		// judge_imgの参照元はimageDataである宣言。
		judge_img.src = imageData;
		console.log(judge_img);
		// テンソルのモデルの読み込み？？？
		cocoSsd.load().then(async (model) => {
			// judge_imgをtensorflowのmodelに渡して、結果をtensorflow_judge_dateと変数宣言。
			const tensorflow_judge_date = await model.detect(judge_img);
			console.log(tensorflow_judge_date);
			// 一番、正しい可能性が高いデータ
			console.log(tensorflow_judge_date[0]);
			// 写真のどの範囲で判定したかのデータ
			console.log(tensorflow_judge_date[0].bbox);
			// htmlのcanvas(clipping)を呼び出し
			const tensorflow_judge_date_canvas = document.querySelector("#clipping");
			// tensorflow_judge_date_canvasの縦横を判定の縦横と合わせる。
			tensorflow_judge_date_canvas.width = tensorflow_judge_date[0].bbox[2];
			tensorflow_judge_date_canvas.height = tensorflow_judge_date[0].bbox[3];
			// tensorflow_judge_date_canvasに書く２Dはctx2
			const ctx2 = tensorflow_judge_date_canvas.getContext("2d");
			//ctx2にtensorflow_judge_dateの判定範囲従ってjudge_imgを切り取ってcanvas描写。
			ctx2.drawImage(
				judge_img,
				tensorflow_judge_date[0].bbox[0],
				tensorflow_judge_date[0].bbox[1],
				tensorflow_judge_date[0].bbox[2],
				tensorflow_judge_date[0].bbox[3],
				0,
				0,
				tensorflow_judge_date[0].bbox[2],
				tensorflow_judge_date[0].bbox[3]
			);
			const tensorflow_judge_date_img =
				tensorflow_judge_date_canvas.toDataURL();
			console.log(tensorflow_judge_date_img);

			//セッションストレージに画像を保存する
			sessionStorage.img = tensorflow_judge_date_img;

			//--切り抜き機能ためにくぼっちがいじったゾーン終わり--
		});
	},
	false
);

// 背面カメラとフロントカメラを切り替える

$("#toggleCamera").on("click", () => {
	camera();
});
