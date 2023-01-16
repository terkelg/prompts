import strip from './strip.js';

/**
 * @param {string} msg
 * @param {number} perLine
 */
export default function (msg, perLine) {
  let lines = String(strip(msg) || '').split(/\r?\n/);

  if (!perLine) return lines.length;
  return lines.map(l => Math.ceil(l.length / perLine))
      .reduce((a, b) => a + b);
};
