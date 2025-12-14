const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;

function getTopBarHeight() {
    const realTopBar = Main.panel;
    if (!realTopBar) {
        console.log("ANDE: Could not find top panel actor");
        return;
    }

    return realTopBar.get_height();
}

function getSecondMonitor() {
    const monitors = Main.layoutManager.monitors;
    if (monitors.length < 2) {
        console.log("ANDE: only 1 monitor??");
        return;
    }
    // my "primary" monitor is my 2nd monitor according to FW/drivers
    // so my 2nd monitor is first monitor in FW
    return monitors[0];
}

/// Registers the menu as a "popup", meaning that if you click on anything else, it will auto-dismiss
/// doesn't hinder taps within the menu
function autoUnfocus(menu) {
    const manager = new PopupMenu.PopupMenuManager();
    manager.addMenu(menu);
}

function printActorTree(actor, indent = 0) {
    const padding = ' '.repeat(indent);
    let info = actor.constructor.name;

    // Add style_class if available
    if (actor.style_class)
        info += ` [${actor.style_class}]`;

    // Add name if available
    if (actor.get_name && actor.get_name())
        info += ` (name: ${actor.get_name()})`;

    log(padding + info);

    // Recurse into children if the actor has them
    if (actor.get_children) {
        const children = actor.get_children();
        for (let child of children) {
            printActorTree(child, indent + 2);
        }
    }
}
