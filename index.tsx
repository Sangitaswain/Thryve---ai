
import React from 'react';
import { AppRegistry, Platform, View, Text } from 'react-native';
import App from './App';

const Root = () => {
  return <App />;
};

const bootstrap = () => {
  try {
    console.log('[Thryve] Registering component...');
    AppRegistry.registerComponent('Main', () => Root);

    if (Platform.OS === 'web') {
      const rootTag = document.getElementById('root');
      if (rootTag) {
        console.log('[Thryve] Running application on web...');
        AppRegistry.runApplication('Main', {
          initialProps: {},
          rootTag,
        });
      } else {
        console.error('[Thryve] No root element found');
      }
    }
  } catch (err) {
    console.error("[Thryve] Bootstrap Failure:", err);
  }
};

// Check if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  bootstrap();
} else {
  window.addEventListener('DOMContentLoaded', bootstrap);
}
