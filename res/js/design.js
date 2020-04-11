import {
    MDCTopAppBar
} from "@material/top-app-bar";

import {
    MDCDrawer
} from "@material/drawer";

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

const listEl = document.querySelector('.mdc-drawer .mdc-list');
listEl.addEventListener('click', (event) => {
    drawer.open = false;
});