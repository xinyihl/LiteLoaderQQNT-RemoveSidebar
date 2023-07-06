const fs = require("fs");
const path = require("path");
const { BrowserWindow, ipcMain } = require("electron");

function debounce(fn, time) {
    let timer = null;
    return function (...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    }
}

function watchSettingsChange(webContents, settingsPath) {
//热更新预留
}

function onLoad(plugin, liteloader) {
    const pluginDataPath = plugin.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");

    if (!fs.existsSync(pluginDataPath)) {
        fs.mkdirSync(pluginDataPath, { recursive: true });
    }
    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify({
            "remove": "",
        }));
    }

    ipcMain.on(
        "betterQQNT.remove_sidebar.watchSettingsChange",
        (event, settingsPath) => {
            const window = BrowserWindow.fromWebContents(event.sender);
            watchSettingsChange(window.webContents, settingsPath);
        }
    );

    ipcMain.handle(
        "betterQQNT.remove_sidebar.getSettings",
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
        "betterQQNT.remove_sidebar.setSettings",
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
    const pluginDataPath = plugin.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");
    window.on("ready-to-show", () => {
        const url = window.webContents.getURL();
        if (url.includes("app://./renderer/index.html")) {
            watchSettingsChange(window.webContents, settingsPath);
        }
    });
}

module.exports = {
    onLoad,
    onBrowserWindowCreated
}