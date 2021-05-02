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
git clone https://github.com/ppoile/ionic-mystrom-client
cd ionic-mystrom-client
nodeenv env --prebuilt
. env/bin/activate
npm install -g @ionic/cli
npm install
ionic serve
ionic build
ionic cap add android
cd android/app/src/main/assets/ && ln -s ./public/ www && cd -
ionic cap copy
sudo snap install android-studio --classic
cordova-res android --skip-config --copy --type icon
ionic cap open android
```
