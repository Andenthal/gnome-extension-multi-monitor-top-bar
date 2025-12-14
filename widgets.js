const ExtensionUtils = imports.misc.extensionUtils;
const thisExtension = ExtensionUtils.getCurrentExtension();

const Helpers = thisExtension.imports.helpers;
const { Clutter, St } = imports.gi;
const DateMenu = imports.ui.dateMenu;

function topBar() {
    let secondMonitor = Helpers.getSecondMonitor();
    if (secondMonitor == null) {
        return;
    }

    let topBar = new St.Widget({
        style_class: 'rectangle',
        width: secondMonitor.width,
        height: Helpers.getTopBarHeight() ?? 35,
        x: secondMonitor.x,
        y: secondMonitor.y,
        reactive: true,
        layout_manager: new Clutter.BoxLayout({
            orientation: Clutter.Orientation.HORIZONTAL,
        }),
    });

    topBar.add_style_class_name('top-bar');

    let leftBox = new St.BoxLayout({
        x_align: Clutter.ActorAlign.START,
    });
    let centerBox = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
    });

    topBar.add_child(leftBox);
    topBar.add_child(centerBox);
    topBar.add_child(rightBox());

    return topBar;
}

function rightBox() {
    let rightBox = new St.BoxLayout({
        x_align: Clutter.ActorAlign.END,
    });

    //ActivitiesButton (Applications?) - in Panel
    //QuickSettings
    //TypeError: Panel.QuickSettings is not a constructor
    //let quickSettings = new Panel.QuickSettings({
    //showEvents: true
    //})

    let clock = new DateMenu.DateMenuButton({ showEvents: true });
    clock.add_style_class_name('mock-clock');
    Helpers.autoUnfocus(clock.menu);

    let rightSpacer = new St.Widget({
        width: 12,
    });

    //order matters when adding children
    //topBar.add_child(quickSettings);
    rightBox.add_child(clock.container)  //drop .container ???
    rightBox.add_child(rightSpacer);

    return rightBox;
}
