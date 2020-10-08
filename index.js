module.exports = function ServerExposer(mod) {
	const userMap = new Map();

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

	const transformGuildStr = (guildName, serverId) => {
		return (guildName ? (`${guildName} : ${mod.serverList[serverId].name}`) : `${mod.serverList[serverId].name}`);
	};

	mod.hook("S_SPAWN_USER", mod.majorPatchVersion >= 99 ? 16 : 15, { "order": Infinity, "filter": { "fake": null } }, (event) => {
		const serverId = event.serverId;
		userMap.set(event.gameId, serverId);

		if (mod.settings.enabled && (mod.game.me.inDungeon || mod.settings.showEverywhere)) {
			event.guildName = transformGuildStr(event.guildName, serverId);
			return true;
		}
	});
	
	mod.hook("S_GUILD_NAME", 2, { "order": Infinity, "filter": { "fake": null } }, (event) => {
		if (userMap.has(event.gameId) && mod.settings.enabled && (mod.game.me.inDungeon || mod.settings.showEverywhere)) {
			event.guildName = transformGuildStr(event.guildName, userMap.get(event.gameId));
			return true;
		}
	});

	mod.hook("S_DESPAWN_USER", 3, { "order": -Infinity, "filter": { "fake": false } }, (event) => { userMap.delete(event.gameId);});
	mod.hook("S_LOAD_TOPO", "event", { "order": -Infinity, "filter": { "fake": false } }, () => { userMap.clear(); });
};