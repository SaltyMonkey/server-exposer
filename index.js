module.exports = function ServerExposer(mod) {
	let regionsData = require("./regions.json");
	let region = regionsData[mod.region];
	let currentZone = -1;
	
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

	mod.hook("S_LOAD_TOPO", 3, (event) => { currentZone = event.zone; });

	mod.hook("S_SPAWN_USER", 13, (event) => {
		if(!mod.settings.enabled || (currentZone <= 8999 && !mod.settings.showEverywhere)  || !region) return;
		if (region[event.serverId]) {
			event.guild = `${event.guild} : ${region[event.serverId]}`
			return true;
		}
	});
}