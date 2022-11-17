// 【参考URL】
// ※要PHS https://www.secioss.co.jp/%E3%83%8E%E3%83%BC%E3%83%88pc%E3%81%A7%E8%87%AA%E6%92%AE%E3%82%8A-pc%E3%81%AE%E3%82%AB%E3%83%A1%E3%83%A9%E3%82%92web%E3%82%AB%E3%83%A1%E3%83%A9%E3%81%A8%E3%81%97%E3%81%A6%E7%94%BB%E5%83%8F%E3%83%95/
// https://elsammit-beginnerblg.hatenablog.com/entry/2020/06/16/214024
// take1 動かなかった https://office-yone.com/javascript_camera/
// サポート対象外ブラウザあり https://ziyudom.com/js-camera-capture/
// https://blog.katsubemakito.net/html5/camera1

// canvas基本 https://qiita.com/kyrieleison/items/a3ebf7c55295c3e7d8f0

window.onload = () => {
	const video = document.querySelector("#camera");
	const canvas = document.querySelector("#picture");
	const se = document.querySelector("#se");

	/** カメラ設定 */
	const constraints = {
		audio: false,
		video: {
			width: 300,
			height: 200,
			facingMode: "user", // フロントカメラを利用する
			// facingMode: { exact: "environment" }  // リアカメラを利用する場合
		},
	};

	/**
	 * カメラを<video>と同期
	 */
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then((stream) => {
			video.srcObject = stream;
			video.onloadedmetadata = (e) => {
				video.play();
			};
		})
		.catch((err) => {
			console.log(err.name + ": " + err.message);
		});

	/**
	 * シャッターボタン
	 */
	document.querySelector("#shutter").addEventListener("click", () => {
		const ctx = canvas.getContext("2d");

		// 演出的な目的で一度映像を止めてSEを再生する
		video.pause(); // 映像を停止
		se.play(); // シャッター音
		setTimeout(() => {
			video.play(); // 0.5秒後にカメラ再開
		}, 500);

		// canvasに画像を貼り付ける
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	});
};
