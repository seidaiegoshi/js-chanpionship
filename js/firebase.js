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
	getDoc,
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

// 受信処理
// URLを取得
const url = new URL(window.location.href);

// URLSearchParamsオブジェクトを取得
const params = url.searchParams;

// consoleに受け取ったパラメータを出力
// console.log(params);

// パラメータからラベル名を取得
const label_name = params.get("sendLabel");
// console.log(label_name);
$("#board_name").text(label_name);

// 新規か既存か分類
// データがあるかないか
const docRef = doc(db, "label", label_name); //ドキュメントの場所の変数docRefに入れる
const docSnap = await getDoc(docRef); //docSnapにデータを入れる
// console.log(docSnap); //docSnapにはよくわかんない情報が入ってるけど、.data()をつけるとわかりやすく見えるようになる

let board = [];

if (docSnap.exists()) {
	console.log("Document data:", docSnap.data());
	console.log(docSnap.data().board[0].user_name);

	board = docSnap.data().board;
	// board.push(board_comment);

	board.forEach((element, i) => {
		$("#post_contents").html(`
		<li>
			<div>${element.user_name}</div>
			<div>${element.text}</div>
		</li>
`);
	});

	// F_board.push()
} else {
	// doc.data() will be undefined in this case
	// コメントを登録する
	console.log("No such document!");
	$("#post_contents").html(`
		<li>
			<div>扉の番人</div>
			<div>あなたが最初の発見者です。</div>
		</li>
`);
}

$("#date_came").on("click", async function () {
	const user_name = $("#user_name").val();
	const text = $("#text").val();

	const date = new Date();
	console.log(date);
	console.log(date.toISOString());

	const board_comment = {
		user_name: user_name,
		text: text,
		time: date,
		// time: serverTimestamp(),配列内にはserverTimeStamp入れられない
	};

	board.push(board_comment);

	$("#user_name").val("");
	$("#text").val("");
	// コメント登録ゾーン終了

	//ドキュメントを更新する。
	setDoc(doc(db, "label", label_name), {
		board,
	});
});
