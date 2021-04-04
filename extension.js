const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const St = imports.gi.St;
const Atk = imports.gi.Atk;
const Shell = imports.gi.Shell;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const Util = imports.misc.util;

var CreativeControl = GObject.registerClass(
  class CreativeControl extends PanelMenu.Button {
    _init() {
      super._init(0.0, `${Me.metadata.name}`, false);

      this.accessible_role = Atk.Role.TOGGLE_BUTTON;
      this._windowTracker = Shell.WindowTracker.get_default();

      // Panel icon
      this.actor.add_child(
        new St.Icon({
          gicon: new Gio.ThemedIcon({ name: "audio-card-symbolic" }),
          style_class: "system-status-icon",
        })
      );

      // Output menu
      this.outputMenu = new PopupMenu.PopupSubMenuMenuItem("", true);
      this.outputMenu.label.text = "Output";
      this.outputMenu.icon.icon_name = "audio-card-symbolic";

      this.outputMenu.menu.addAction(
        "Speakers",
        this._speakersAction,
        "audio-speakers-symbolic"
      );
      this.outputMenu.menu.addAction(
        "Headphone",
        this._headphoneAction,
        "audio-headphones-symbolic"
      );

      this.menu.addMenuItem(this.outputMenu);

      // Separator
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      // Mic Boost menu
      this.micBoostMenu = new PopupMenu.PopupSubMenuMenuItem("", true);
      this.micBoostMenu.label.text = "Mic Boost";
      this.micBoostMenu.icon.icon_name = "audio-input-microphone-symbolic";

      this.micBoostMenu.menu.addAction(
        "0 dB",
        this._micBoost0Action,
        "audio-headphones-symbolic"
      );
      this.micBoostMenu.menu.addAction(
        "10 dB",
        this._micBoost10Action,
        "audio-headphones-symbolic"
      );
      this.micBoostMenu.menu.addAction(
        "20 dB",
        this._micBoost20Action,
        "audio-headphones-symbolic"
      );
      this.micBoostMenu.menu.addAction(
        "30 dB",
        this._micBoost30Action,
        "audio-headphones-symbolic"
      );

      this.menu.addMenuItem(this.micBoostMenu);
    }

    _speakersAction() {
      log("Speakers selected");
      Util.spawnCommandLine(
        `amixer -c 'Creative' set 'Output Select' 'Speakers'`
      );
    }

    _headphoneAction() {
      log("Headphone selected");
      Util.spawnCommandLine(
        `amixer -c 'Creative' set 'Output Select' 'Headphone'`
      );
    }

    _micBoost0Action() {
      log("Mic Boost 0 dB");
      Util.spawnCommandLine(`amixer -c 'Creative' set 'Mic Boost' '0 dB'`);
    }

    _micBoost10Action() {
      log("Mic Boost 10 dB");
      Util.spawnCommandLine(`amixer -c 'Creative' set 'Mic Boost' '10 dB'`);
    }

    _micBoost20Action() {
      log("Mic Boost 20 dB");
      Util.spawnCommandLine(`amixer -c 'Creative' set 'Mic Boost' '20 dB'`);
    }

    _micBoost30Action() {
      log("Mic Boost 30 dB");
      Util.spawnCommandLine(`amixer -c 'Creative' set 'Mic Boost' '30 dB'`);
    }
  }
);

class Extension {
  constructor() {}

  enable() {
    log(`enabling ${Me.metadata.name} version ${Me.metadata.version}`);
    this.control = new CreativeControl();
    Main.panel.addToStatusArea(`${Me.metadata.name} Control`, this.control);
  }

  disable() {
    log(`disabling ${Me.metadata.name} version ${Me.metadata.version}`);
    if (this.control !== null) {
      this.control.destroy();
      this.control = null;
    }
  }
}

function init() {
  log(`initializing ${Me.metadata.name} version ${Me.metadata.version}`);
  return new Extension();
}
