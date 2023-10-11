const DEFAULTS = {
  seed: "1",
  banners: "n,ce",
  rolls: "100",
  lastCat: "",
  lastBanner: "",
};

export const getQueryParam = (key: keyof typeof DEFAULTS): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key) || DEFAULTS[key];
};

export const setQueryParam = (key: keyof typeof DEFAULTS, value: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  const newUrl = new URL(window.location.href);
  newUrl.search = urlParams.toString();
  window.location.href = newUrl.toString();
};
