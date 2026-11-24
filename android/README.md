# DOA Döngü Koşusu — Android

Bu proje mevcut web oyununu tamamen APK içine paketler. Oyun çevrimdışı çalışır;
reklam, hesap, konum, kamera veya İnternet izni istemez. Kayıtlar uygulamanın
WebView yerel deposunda tutulur; tarayıcı sürümündeki kayıtlar otomatik taşınmaz.

Paket: `com.rvmsystems.doadongukosusu` · Sürüm: `20261124-4` · Android 7.0+.

## Derleme

Android Studio ile bu klasörü açın. SDK 35, Build Tools 35.0.0, JDK 17 ve
Gradle 8.11.1 gerekir. Önce depo kökünde `node android/prepare-assets.cjs`
komutunu, ardından bu klasörde `gradle assembleDebug` komutunu çalıştırın.
Android Studio Gradle dağıtımını indirdikten sonra aynı görev IDE üzerinden de
çalıştırılabilir. Hazır Gradle kurulumu olmayanlar için depodaki GitHub Actions
Android APK iş akışı bu adımları ücretsiz genel depo çalıştırıcısında uygular.

Web varlıkları GitHub'da `docs/` altındaysa iş akışı
`node android/prepare-assets.cjs --source docs` kullanır. Çıktı:
`app/build/outputs/apk/debug/app-debug.apk`. Bu test APK'sı SDK debug anahtarıyla
imzalanır; Google Play yayını veya mağaza hesabı oluşturulmaz.

İş akışı APK'yı yayımlamadan önce `apksigner verify --verbose --print-certs`
ile imzasını, `aapt2 dump badging` ile paket kimliğini ve sürümünü doğrular.
SHA-256, sürüm bilgisi ve sertifika çıktısı APK ile aynı derleme çıktısındaki
`apk-verification.txt` dosyasına yazılır. Bu doğrulama fiziksel Android cihazda
kurulum veya oynama testi yapıldığı anlamına gelmez.

Test APK'sının debug anahtarı her yeni çalıştırıcıda yeniden üretilebilir;
önceki APK'nın anahtarı kalıcı saklanmadığından imzaların aynı olduğu garanti
edilmez. Android farklı imzalı bir güncellemeyi kabul etmeyebilir. Eski APK'yı
kaldırmak uygulamadaki kayıtları silebilir; kayıtlar korunmadan kaldırma
önerilmez. Tarayıcı/PWA sürümü mevcut APK kayıtlarını değiştirmez.

Güncel oyun APK içine kopyalandığı için `window.DOA_NATIVE=true` işareti eklenir.
Web sürümü servis çalışanını kaydetmeden önce bu işareti kontrol etmelidir.
APK'nın WebViewAssetLoader kaynağı `https://appassets.androidplatform.net/`;
diğer adresler engellenir. JavaScript/native köprüsü eklenmemiştir.

Geri düğmesi aktif koşuyu önce duraklatır; menüde veya zaten duraklatılmışken
uygulamadan çıkar. Uygulama arka plana geçince oyun ve WebView zamanlayıcıları
durur. Ekranı döndürmek yeni oyun başlatmaz.

Bu bilgisayarda Android SDK/JDK/Gradle bulunmadığından yerel APK derlemesi
doğrulanmadı. Bir APK dosyası ancak iş akışı başarıyla tamamlandığında üretilir.

Resmî kaynaklar:
- [Yerel içerik ve WebViewAssetLoader](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content)
- [APK komut satırı derlemesi](https://developer.android.com/build/building-cmdline)
- [AGP 8.9 uyumluluğu](https://developer.android.com/build/releases/agp-8-9-0-release-notes)
