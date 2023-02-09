const score = () => {
  document.querySelector("#score .details").classList.toggle("hidden");
};

//set buttons for sharing results
var setupShareButtons = (function () {
  var popupCenter = function (url, title, width, height) {
    var popupWidth = width || 640;
    var popupHeight = height || 320;
    var windowLeft = window.screenLeft || window.screenX;
    var windowTop = window.screenTop || window.screenY;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth;
    var windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    var popupLeft = windowLeft + windowWidth / 2 - popupWidth / 2;
    var popupTop = windowTop + windowHeight / 2 - popupHeight / 2;
    var popup = window.open(
      url,
      title,
      "scrollbars=yes, width=" +
        popupWidth +
        ", height=" +
        popupHeight +
        ", top=" +
        popupTop +
        ", left=" +
        popupLeft
    );
    popup.focus();
    return true;
  };

  document
    .querySelector(".share_twitter")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var url = window.location.href;
      var shareUrl =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(document.title) +
        "&url=" +
        encodeURIComponent(url);
      popupCenter(shareUrl, "Partager sur Twitter");
    });

  document
    .querySelector(".share_facebook")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var url =
        "https://muchas-glacias.com/score/?id=MjAyMjExMDgxMypodHRwczovL3d3dy5sYWJhbnF1aS5zZS8=";
      var shareUrl =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(url);
      popupCenter(shareUrl, "Partager sur facebook");
    });

  document
    .querySelector(".share_linkedin")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var url =
        "https://muchas-glacias.com/score/?id=MjAyMjExMDgxMypodHRwczovL3d3dy5sYWJhbnF1aS5zZS8=";
      var shareUrl =
        "https://www.linkedin.com/sharing/share-offsite/?url=" +
        encodeURIComponent(url);
      popupCenter(shareUrl, "Partager sur Linkedin");
    });
  btnCopy = document.getElementById("copy");
  btnCopy.addEventListener("click", function () {
    navigator.clipboard.writeText(window.location.href).then(
      function () {
        alert("Le lien de vos résultats a été copié avec succès");
      },
      function () {
        alert("Il semble qu'il y ait une erreur");
      }
    );
    return false;
  });
})(setupShareButtons || {});
