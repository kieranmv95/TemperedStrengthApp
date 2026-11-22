const { withInfoPlist } = require('@expo/config-plugins');

const LANDSCAPE = [
  'UIInterfaceOrientationLandscapeLeft',
  'UIInterfaceOrientationLandscapeRight',
];

/**
 * The gym clock can lock landscape while the app still launches portrait.
 * app.json `orientation: portrait` rewrites this list, so this plugin runs
 * afterwards and adds the landscape values back.
 */
function withIosClockOrientations(config) {
  return withInfoPlist(config, (mod) => {
    const key = 'UISupportedInterfaceOrientations';
    const existing = mod.modResults[key] ?? [];
    mod.modResults[key] = [...new Set([...existing, ...LANDSCAPE])];
    return mod;
  });
}

module.exports = withIosClockOrientations;
