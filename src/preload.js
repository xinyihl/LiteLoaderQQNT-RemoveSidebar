const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("remove_sidebar",{
    removeLastButton: () => ipcRenderer.invoke(
        "betterQQNT.removeLastButton"
    ),
    getSettings: () => ipcRenderer.invoke(
        "betterQQNT.remove_sidebar.getSettings"
    ),
    setSettings: content => ipcRenderer.invoke(
        "betterQQNT.remove_sidebar.setSettings",
        content
    ),
});