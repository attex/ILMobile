echo "Lösche alte Release-Version"
rm platforms/android/app/build/outputs/apk/release/ILMobile.apk

echo "Erstelle neue Release-Version"
cordova build android --release

echo "ZipAlign .apk"
zipalign -p 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/release/ILMobile.apk

echo "Signiere .apk"
apksigner.bat sign --ks ilmobile.keystore platforms/android/app/build/outputs/apk/release/ILMobile.apk

echo "Verifiziere erstelle Version (Kein Fehler bedeutet verifiziert)"
apksigner.bat verify platforms/android/app/build/outputs/apk/release/ILMobile.apk