const STORAGE_PREFIX = 'rollbar2github.';

export default class Settings {
  constructor() {
    this.key      = `${STORAGE_PREFIX}.settings`;
    this.settings = [];

    const storedSettings = localStorage.getItem(this.key);

    try {
      this.settings = storedSettings ? JSON.parse(storedSettings) : [];
    } catch (error) {
      console.warn(error);
    }
  }

  setItems(items) {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (error) {
      console.warn(error);
    }
  }

  getItems() {
    return this.settings;
  }

  hasItem(rollbarProjectName) {
    return Boolean(this.settings.findIndex((item) => item.rollbarProjectName === rollbarProjectName) !== undefined);
  }
}
