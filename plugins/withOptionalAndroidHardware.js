const { withAndroidManifest } = require('@expo/config-plugins');

const OPTIONAL_FEATURES = [
  'android.hardware.screen.portrait',
  'android.hardware.wifi',
];

/**
 * Portrait lock and ACCESS_WIFI_STATE imply required hardware features.
 * Mark them optional so Play still lists the app on XR, desktop, and
 * ethernet-only devices.
 */
function withOptionalAndroidHardware(config) {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const existing = manifest['uses-feature'] ?? [];
    const byName = new Map(
      existing.map((feature) => [feature.$['android:name'], feature])
    );

    for (const name of OPTIONAL_FEATURES) {
      byName.set(name, {
        $: {
          'android:name': name,
          'android:required': 'false',
        },
      });
    }

    manifest['uses-feature'] = Array.from(byName.values());
    return mod;
  });
}

module.exports = withOptionalAndroidHardware;
