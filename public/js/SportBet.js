const bb = document.body;
const sidenavmodal = document.getElementById("sidenav");
const showsidenavmodal = document.getElementById("hamb");
const closesidenav = document.getElementById("closenav");

showsidenavmodal.onclick = e => {
    // console.log("show");
    if (e.target === showsidenavmodal) {
        sidenavmodal.style.display = "block";
    }
};

window.onclick = e => {
    if (e.target === sidenavmodal) {
        sidenavmodal.style.display = "none";
    }
};
closesidenav.onclick = e => {
    if (e.target === closesidenav) {
        sidenavmodal.style.display = "none";
    }
};

/*
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    console.log("Level:", battery.level * 100 + "%");
    console.log("Charging:", battery.charging);
    console.log("Charging Time:", battery.chargingTime);
    console.log("Discharging Time:", battery.dischargingTime);
  });
}
*/
