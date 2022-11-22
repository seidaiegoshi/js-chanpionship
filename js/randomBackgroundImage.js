imageSet = [
	{
		imageUrl: "/assets/img/apple.jpg",
		moshImageUrl: "/assets/img/apple_mosh.gif",
	},
	{
		imageUrl: "/assets/img/cafe.jpg",
		moshImageUrl: "/assets/img/cafe_mosh.gif",
	},
	{
		imageUrl: "/assets/img/town.jpg",
		moshImageUrl: "/assets/img/town_mosh.gif",
	},
];

function generateRandomNumber(min, max) {
	const rand = Math.floor(Math.random() * (max - min + 1) + min);
	return rand;
}

function setBackGroundImage(pathtoassets = "") {
	$("body").css(
		"background-image",
		"url(" + pathtoassets + imageSet[generateRandomNumber(0, imageSet.length - 1)].imageUrl + ")"
	);
	$("body").css("background-size", "cover");
	$("body").css("background-position", "center");
}
