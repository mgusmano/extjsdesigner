document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("rightfocusboxbutton").addEventListener("click", () => doFocusSettings());
});

function doFocusSettings() {
    console.log("doFocusSettings");


    window.rightfocusboxdetail = document.getElementById("rightfocusboxdetail");
    if (rightfocusboxdetail.style.display == 'flex') {
      rightfocusboxdetail.style.display = 'none';
      return
    }

    var height = 200;
    var width = 200;
    var borderheight = 4 + 2;

    window.rightfocusbox = document.getElementById("rightfocusbox");
    var rect = window.rightfocusbox.getBoundingClientRect();

    //var rect = currentElementSelected.getBoundingClientRect();

    window.rightfocusboxbutton = document.getElementById("rightfocusboxbutton");
    //var rect = window.settingsbutton.getBoundingClientRect();
    console.log(rect);

    //var rect = currentElementSelected.getBoundingClientRect();
    var x = rect.left;
    var y = rect.top;
    var w = rect.right - rect.left;
    var h = rect.bottom - rect.top;
    var y2 = y + h

    rightfocusboxdetail.style.display = "flex";
    rightfocusboxdetail.style.left = x + "px";
    rightfocusboxdetail.style.top = y2 + "px";
    rightfocusboxdetail.style.width = width + "px";
    rightfocusboxdetail.style.height = height + "px";
    rightfocusboxdetail.style.zIndex = "10000";
}
