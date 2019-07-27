module.exports = function ServerExposer(mod) {
	mod.command.add("se", {
		$default() {
			mod.settings.enabled = !mod.settings.enabled;
			mod.command.message(`State: ${mod.settings.enabled ? "Enabled" : "Disabled"}`);
		},
		everywhere() {
			mod.settings.showEverywhere = !mod.settings.showEverywhere;
			mod.command.message(`Show Everywhere state: ${mod.settings.showEverywhere ? "Enabled" : "Disabled"}`);
		}
	});	

	mod.hook("S_SPAWN_USER", 15, (event) => {
		if (mod.settings.enabled && (mod.game.me.inDungeon || mod.settings.showEverywhere)) {
			event.guild += ` : ${mod.serverList[event.serverId].name}`
			return true;
		}
	});
}