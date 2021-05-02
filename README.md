Setup a new project recipe
==========================

```sh
mkdir <app>
cd <app>
nodeenv env --prebuilt
. env/bin/activate
npm install -g @ionic/cli

ionic start <app> blank --package-id ch.daemeier_clan.<app>
```

Setup project
=============

```sh
git clone https://github.com/ppoile/ionic-mystrom-switch-client
cd ionic-mystrom-switch-client
nodeenv env --prebuilt
. env/bin/activate
npm install -g @ionic/cli
npm install

# install AndroidStudio
sudo snap install android-studio --classic  #

rm -rf android
ionic cap add android
git checkout android/app/src/main/AndroidManifest.xml

ionic build
ionic cap sync
ionic cap run android
#AndroidStudio: Run 'app' Shift+F10
```
