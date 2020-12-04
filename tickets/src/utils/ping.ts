import fetch from 'node-fetch';

/**
 * Ping by url
 * @param url - Url to ping
 * @param interval - Interval in ms
 */
export const ping = async (url: string, interval: number) => {
  setInterval(async () => {
    try {
      const res = await fetch(url);
      const text = await res.text();
    } catch (err) {
      console.log(err);
    }
  }, interval);
};
