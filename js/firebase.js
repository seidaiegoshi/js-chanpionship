// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
	getFirestore,
	collection,
	addDoc,
	serverTimestamp,
	setDoc,
	doc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyC5tfHi9Y-jV3r_hMFIsZtggFde7afngIM",
	authDomain: "js-chanpionship.firebaseapp.com",
	projectId: "js-chanpionship",
	storageBucket: "js-chanpionship.appspot.com",
	messagingSenderId: "840380828090",
	appId: "1:840380828090:web:f184b684f72688b3cbf583",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
$("#date_came").on("click", function () {
	// コメントを登録する
	const board = [];

	const board_comment = {
		user_name: "inputからひっぱってくる",
		text: "inputからひっぱってくる",
		time: "inputからひっぱってくる",
	};

	board.push(board_comment);
	// コメント登録ゾーン終了

	const label_date = $("#label_name").val();
	console.log(label_date);

	setDoc(doc(db, "label", label_date), {
		board,
	});
});

// 受信処理
window.onload = function () {
	// URLを取得
	const url = new URL(window.location.href);

	// URLSearchParamsオブジェクトを取得
	const params = url.searchParams;

	// consoleに受け取ったパラメータを出力
	console.log(params);

	// パラメータから「cameraData」を取得
	const label = params.get("sendLabel");
	console.log(label);
	$("#label_name").val(label);
};
