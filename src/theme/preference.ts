export const THEME_COOKIE_NAME = "tp-theme";
export const THEME_STORAGE_KEY = "tp-theme";
export const THEME_CHANGE_EVENT = "tp-theme-change";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type ThemePreference = "light" | "dark" | "system";

export const themeBootstrapScript = `(function(){try{var d=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)"),c=document.cookie.match(/(?:^|;\\s*)${THEME_COOKIE_NAME}=(light|dark|system)(?:;|$)/),t=c?c[1]:localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"&&t!=="system")t="system";if(!c&&t!=="system")document.cookie="${THEME_COOKIE_NAME}="+t+"; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax"+(location.protocol==="https:"?"; Secure":"");var x=t==="dark"||(t==="system"&&m.matches);d.dataset.theme=t;d.classList.toggle("dark",x);d.style.colorScheme=x?"dark":"light"}catch(e){}})()`;
