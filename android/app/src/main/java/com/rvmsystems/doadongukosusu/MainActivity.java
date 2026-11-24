package com.rvmsystems.doadongukosusu;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.graphics.Insets;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

public final class MainActivity extends Activity {
    private WebView webView;
    private static final String HOST = "appassets.androidplatform.net";
    private static final String ENTRY = "https://" + HOST + "/assets/www/index.html?native=1";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        webView = new WebView(this);
        webView.setBackgroundColor(0xff073e39);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportMultipleWindows(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && uri.getPath() != null && uri.getPath().startsWith("/assets/www/")) {
                    WebResourceResponse local = loader.shouldInterceptRequest(uri);
                    if (local != null) return local;
                }
                // No remote pages or background requests are needed by this game.
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not found", null,
                    new ByteArrayInputStream("Dosya bulunamadı".getBytes(StandardCharsets.UTF_8)));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                return !("https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && uri.getPath() != null && uri.getPath().startsWith("/assets/www/"));
            }
        });
        setContentView(webView);
        webView.loadUrl(ENTRY);
    }

    @Override protected void onPause() {
        if (webView != null) {
            webView.evaluateJavascript("window.dispatchEvent(new Event('blur'));", null);
            webView.onPause();
            webView.pauseTimers();
        }
        super.onPause();
    }

    @Override protected void onResume() {
        super.onResume();
        if (webView != null) { webView.resumeTimers(); webView.onResume(); }
    }

    @Override public void onBackPressed() {
        if (webView == null) { finish(); return; }
        webView.evaluateJavascript("(function(){var s=window.DOAGame&&window.DOAGame.state;if(s&&s.screen==='game'&&!s.paused){window.dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',key:'Escape'}));return 'paused';}return 'exit';})()", value -> {
            if (!"\"paused\"".equals(value)) finish();
        });
    }

    @Override protected void onDestroy() {
        if (webView != null) { webView.destroy(); webView = null; }
        super.onDestroy();
    }
}
