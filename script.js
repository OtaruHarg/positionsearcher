hanni = 10;

function click(){
    monster_size = monster_size + Number(Math.random()*hanni);
}

const video = document.querySelector('#video');
const canvas = document.createElement('canvas');

initVideoCamera();
initPhoto();
document.querySelector('#shoot').addEventListener('click', photoShoot);

/**
 * ビデオのカメラ設定(デバイスのカメラ映像をビデオに表示)
 */
function initVideoCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch(e => console.log(e));
}

/**
 * 写真の初期描画
 */
function initPhoto() {
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * 写真の撮影描画
 */
function photoShoot() {
    let drawSize = calcDrawSize();
    canvas.width = drawSize.width;
    canvas.height = drawSize.height;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

/**
 * 描画サイズの計算
 * 縦横比が撮影(video)が大きい時は撮影の縦基準、それ以外は撮影の横基準で計算
 */
function calcDrawSize() {
    let videoRatio = video.videoHeight / video.videoWidth;
    let viewRatio = video.clientHeight / video.clientWidth;
    return videoRatio > viewRatio ?
        { height: video.clientHeight, width: video.clientHeight / videoRatio }
        : { height: video.clientWidth * videoRatio, width: video.clientWidth }
}


function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var contentType = data.contentType; // 例: image/png
  var imgData = data.base64; // base64データ
  var folderId = "1oFGUUKuBDKaNJpZfSkZledqkPAe_YUgW"; // ★ここにフォルダIDを入力

  // base64をblobに変換
  var decoded = Utilities.base64Decode(imgData);
  var blob = Utilities.newBlob(decoded, contentType, "uploaded-image.png");

  // ドライブに保存
  var folder = DriveApp.getFolderById(folderId);
  var file = folder.createFile(blob);

  return ContentService.createTextOutput(JSON.stringify({ "status": "success", "url": file.getUrl() })).setMimeType(ContentService.MimeType.JSON);
}
