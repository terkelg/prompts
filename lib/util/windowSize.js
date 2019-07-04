/**
 * @since 2019-07-04 22:48:16
 * @author vivaxy
 */
function get(stdout) {
  const [width, height] = stdout.getWindowSize();
  return { width, height };
}

function onChange(stdout, onChange) {
  stdout.on('resize', function () {
    onChange(get(stdout));
  });
}

module.exports = {
  get,
  onChange,
};
