import { Plugin } from 'obsidian';

import SyncHighlights from './SyncHighlights';
import CredentialsManager from './CredentialsManager';
import { SettingsTab } from './SettingsTab';
import { PluginSettings } from './models';
import { StatusBar } from './StatusBar';

const DEFAULT_SETTINGS: PluginSettings = {
  highlightsFolderLocation: '/',
  synchedBookAsins: [],
  lastSyncDate: null,
};

export default class KindlePlugin extends Plugin {
  settings!: PluginSettings;
  private credentialsManager!: CredentialsManager;

  async onload() {
    console.log('loading plugin', new Date().toLocaleString());
    this.credentialsManager = new CredentialsManager();

    await this.loadSettings();

    const statusBar = new StatusBar(this.addStatusBarItem(), this.settings);

    const syncHighlights = new SyncHighlights(
      this,
      statusBar,
      this.credentialsManager,
    );

    this.addRibbonIcon(
      'dice',
      'Sync your Kindle highlights',
      async () => await syncHighlights.sync(),
    );

    this.addSettingTab(new SettingsTab(this.app, this));
  }

  async onunload() {
    console.log('unloading plugin', new Date().toLocaleString());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (this.settings.lastSyncDate) {
      this.settings.lastSyncDate = new Date(this.settings.lastSyncDate);
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
