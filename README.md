# MethodFactory Igniter

This is a front-end igniter for stubbing out MethodFactory projects. Clone this repo and get started. It comes preconfigured to use bower for asset package management, gulp for compiling css and js minified files, requirejs to handle javascript module loading, angularjs, sass, karma for unit tests, and protractor for e2e testing with angular. It also comes out of the box with a very simple node application to help with reusable components such as, nav, header, footer, etc.

## Getting Started

### Install Node / NPM

#### Windows
Simply download the [Windows Installer](http://nodejs.org/#download) directly from the [nodejs.org](http://nodejs.org) web site.

#### OSX Users
Simply download the [Macintosh Installer](http://nodejs.org/#download) direct from the [nodejs.org](http://nodejs.org) web site.

Using **[Homebrew](http://brew.sh/)**:
````
brew install node
````

### Install Gulp & Bower Globally
````
npm install gulp bower -g
````

### Run NPM Install
To install all npm packages required for this project
````
npm install
````

### Run Bower Install
To install all css/js assets required for this project
````
bower install
````

gulp clean:dist
gulp clean:vendor
gulp copy:bower
gulp copy:images
gulp copy:fonts
gulp build:js
gulp build:css
gulp build
gulp lint:js
gulp deploy
gulp serve
gulp