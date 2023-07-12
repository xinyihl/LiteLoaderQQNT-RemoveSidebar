const fs = require("fs");
const path = require("path");
const { ipcMain, Menu  } = require("electron");

function onLoad(plugin, liteloader) {
    const pluginDataPath = plugin.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");

    if (!fs.existsSync(pluginDataPath)) {
        fs.mkdirSync(pluginDataPath, { recursive: true });
    }
    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify({
            "remove": "",
            "badgered": false
        }));
    }

    ipcMain.handle(
        "LiteLoader.remove_sidebar.getSettings",
        (event, message) => {
            try {
                const data = fs.readFileSync(settingsPath, "utf-8");
                const config = JSON.parse(data);
                return config;
            } catch (error) {
                console.log(error);
                return {};
            }
        }
    );

    ipcMain.handle(
        "LiteLoader.remove_sidebar.setSettings",
        (event, content) => {
            try {
                const new_config = JSON.stringify(content);
                fs.writeFileSync(settingsPath, new_config, "utf-8");
            } catch (error) {
                alert(error);
            }
        }
    );

}

function onBrowserWindowCreated(window, plugin) {
    //F5刷新页面
    var menuTemplate=[{
        label: "刷新",
        role: "reload",
        accelerator: "F5",
    }]

    var menuBuilder = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menuBuilder);
}

module.exports = {
    onLoad,
    onBrowserWindowCreated
}
