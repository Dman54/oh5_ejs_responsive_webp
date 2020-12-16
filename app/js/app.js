document.addEventListener("DOMContentLoaded", function () {
  if (canUseWebP()) document.body.classList.add("webp");
  else document.body.classList.add("no-webp");
  // Array.from(document.getElementsByTagName("li")).forEach((element, index) => {
  //   element.innerHTML = index;
  // });
});

function canUseWebP() {
  var elem = document.createElement("canvas");
  if (!!(elem.getContext && elem.getContext("2d"))) {
    return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
  }
  return false;
}
