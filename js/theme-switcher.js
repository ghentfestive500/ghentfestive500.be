/*!
 * Theme switcher
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2024 - Licensed under MIT
 */

const themeSwitcher = {
  // Config
  _scheme: "auto",
  menuTarget: "details.dropdown",
  buttonsTarget: "a[data-theme-switcher]",
  buttonAttribute: "data-theme-switcher",
  rootAttribute: "data-theme",
  localStorageKey: "picoPreferredColorScheme",

  // Init
  init() {
    this.scheme = this.schemeFromLocalStorage;

    // Wait for header to load before initializing switchers
    const initWhenReady = () => {
      const buttons = document.querySelectorAll(this.buttonsTarget);
      if (buttons.length > 0) {
        this.initSwitchers();
      } else {
        // Retry after a short delay if header hasn't loaded yet
        setTimeout(initWhenReady, 50);
      }
    };

    initWhenReady();
  },

  // Get color scheme from local storage
  get schemeFromLocalStorage() {
    return window.localStorage?.getItem(this.localStorageKey) ?? this._scheme;
  },

  // Preferred color scheme
  get preferredColorScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  },

  // Init switchers
  initSwitchers() {
    const buttons = document.querySelectorAll(this.buttonsTarget);
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.scheme = button.getAttribute(this.buttonAttribute);
        document.querySelector(this.menuTarget)?.removeAttribute("open");
      }, false);
    });

    // If buttons exist, update visibility immediately
    if (buttons.length > 0) {
      this.updateIconVisibility();
    }
  },

  // Set scheme
  set scheme(scheme) {
    if (scheme == "auto") {
      this._scheme = this.preferredColorScheme;
    } else if (scheme == "dark" || scheme == "light") {
      this._scheme = scheme;
    }
    this.applyScheme();
    this.schemeToLocalStorage();
  },

  // Get scheme
  get scheme() {
    return this._scheme;
  },

  // Apply scheme
  applyScheme() {
    document.querySelector("html")?.setAttribute(this.rootAttribute, this.scheme);
    this.updateIconVisibility();
  },

  // Update icon visibility based on current scheme
  updateIconVisibility() {
    const lightButton = document.querySelector('a[data-theme-switcher="light"]');
    const darkButton = document.querySelector('a[data-theme-switcher="dark"]');

    if (this.scheme === "dark") {
      // In dark mode, show light/sun icon
      lightButton?.parentElement.style.setProperty('display', 'block', 'important');
      darkButton?.parentElement.style.setProperty('display', 'none', 'important');
    } else {
      // In light mode, show dark/moon icon
      lightButton?.parentElement.style.setProperty('display', 'none', 'important');
      darkButton?.parentElement.style.setProperty('display', 'block', 'important');
    }
  },

  // Store scheme to local storage
  schemeToLocalStorage() {
    window.localStorage?.setItem(this.localStorageKey, this.scheme);
  },
};

// Init
themeSwitcher.init();
