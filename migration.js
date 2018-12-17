const DefaultSettings = {
    version: 1,
    enabled: true,
    showEverywhere: false
}

function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
	} else {
        return settings;
    }

}

module.exports = MigrateSettings;