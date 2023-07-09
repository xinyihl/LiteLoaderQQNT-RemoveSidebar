const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("remove_sidebar",{
    removeLastButton: () => ipcRenderer.invoke(
        "LiteLoader.removeLastButton"
    ),
    getSettings: () => ipcRenderer.invoke(
        "LiteLoader.remove_sidebar.getSettings"
    ),
    setSettings: content => ipcRenderer.invoke(
        "LiteLoader.remove_sidebar.setSettings",
        content
    ),
});