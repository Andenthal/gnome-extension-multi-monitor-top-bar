/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

const GETTEXT_DOMAIN = 'multiScreenTopBar@andenthal';
const ExtensionUtils = imports.misc.extensionUtils;
const getText = ExtensionUtils.gettext;
const thisExtension = ExtensionUtils.getCurrentExtension();

const { GObject, St } = imports.gi;
const Main = imports.ui.main;
//probably not supposed/allowed to access this directly
// const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Widgets = thisExtension.imports.widgets;

let topBar;
let monitorChangedId;

// my own button(s) ??? copy/paste of demo smiley face
// class TopBarButton extends PanelMenu.Button {
//     _init() {
//         super._init(0.0, _('Mah button'));
//         // instead of:
//         // this.menu.addMenuItem(item);
//         //somehow try to do this
//         topBar.rightBox.addMenuItem(); //make sure this always appends to the left (first element)
//     }
// }
// smiley face icon in top bar + child behavior
const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, getText('My Shiny Indicator'));

        this.add_child(new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon',
        }));

        let item = new PopupMenu.PopupMenuItem(getText('Show Notification'));
        item.connect('activate', () => {
            Main.notify(getText('Whatʼs up, folks?'));
        });
        this.menu.addMenuItem(item);
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        //top panel smiley face
        //this._indicator = new Indicator();
        //Main.panel.addToStatusArea(this._uuid, this._indicator);

        createTopBarOnSecondMonitor()
        monitorChangedId = Main.layoutManager.connect('monitors-changed', () => {
            createTopBarOnSecondMonitor();   // reposition after layout changes
        });

        // debugging printing widget hierarchy
        // const rightBox = Main.panel._rightBox;
        // rightBox.get_children().forEach(
        //   actor => log(actor.constructor.name + " " + (actor.style_class || "")));
        // const quickSettingsActor = Main.panel.statusArea.aggregateMenu;
        // printActorTree(quickSettingsActor);

        // debugging, trying to get clock styling details
        // const clockLabel = Main.panel.statusArea.dateMenu._clock;
        // log(`ANDE clockLabel: ${clockLabel}`);
    }

    disable() {
        if (topBar) {
            topBar.destroy();
            topBar = null;
        }

        if (monitorChangedId)
            Main.layoutManager.disconnect(monitorChangedId);

        //for the button
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}

function createTopBarOnSecondMonitor() {
    // can we do this in js?
    // let otherMonitors = monitors[1:-1];  //or something... "give me everything except the first element"
    // then for (monitor in otherMonitors) ...
    topBar = Widgets.topBar()
    if (!topBar) return;

    placeTopBarOnScreen(topBar);

    // debugging only
    // let logNumber = 100
    // console.log("ANDE:", logNumber);
    // console.log("ANDE: end");
}

function placeTopBarOnScreen(topBar) {
    Main.layoutManager.addChrome(topBar, {
        affectsStruts: true,
        trackFullscreen: true,
    });
}
