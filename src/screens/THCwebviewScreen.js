// screens/THCViewScreen.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const THCWebViewScreen = ({ route }) => {
  const { link } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView 
        source={{ uri: link }}
        startInLoadingState={true}
         scalesPageToFit={true} // For Android (though deprecated on iOS)
  javaScriptEnabled={true}
  domStorageEnabled={true}
        renderLoading={() => (
          <ActivityIndicator size="large" color="blue" style={{ flex: 1 }} />
        )}
      
injectedJavaScript={`
  (function() {
    // Inject meta tag for responsive viewport
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    document.head.appendChild(meta);

    // Function to inject table-fixing styles
    function injectStyles() {
      const style = document.createElement('style');
      style.innerHTML = \`
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          table-layout: auto !important;
        }
        td, th {
          word-wrap: break-word !important;
          white-space: normal !important;
          overflow-wrap: break-word !important;
          max-width: 100px !important;
        }
        body {
          overflow-x: hidden !important;
        }
      \`;
      document.head.appendChild(style);
    }

    // Wait until the DOM is fully loaded
    if (document.readyState === 'complete') {
      injectStyles();
    } else {
      window.addEventListener('load', injectStyles);
    }

    true;
  })();
`}
      />
    </View>
  );
};

export default THCWebViewScreen ;
