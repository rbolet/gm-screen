# GM Screen
*This project is stable and functional, but still in early stages of development*

A full stack Javascript application for RPG Game Masters to share media with players in order to illustrate their game world

## Technologies Used

- React.js
- Webpack 4
- Bootstrap 4
- Node.js
- mySQL 5
- Socket.io
- HTML5
- CSS3
- AWS EC2

## Live Demo

Try the application live at [https://gmscreen.slightlyskewedcreations.com](https://gmscreen.slightlyskewedcreations.com)

## Features

- GM can add images to a session (currently 1 session is hard-coded)
- GM can push an "environment" image to all players' display
- GM can push "secondary" images to all players' display
- GM can clear the "environment" image from all players' display
- GM can clear one "secondary" image from all players' display
- GM can clear all "secondary" images from all players' display
- Players can join a session (currently 1 session is hard-coded)
- Players can view the image as pushed by the GM

## Planned Features

- GM can choose an existing session or start a new one
- GM can push a "secondary" image to a specific player(s)
- GM can send text to a specific player(s)
- GM can designate an image as saveable by players
- Players can save designated images to view later (independant of GM action)

## Preview

![GM Screen](preview.gif)

## Development

#### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- mySQL 5 or higher

#### Getting Started

1. Create a new mySQL database named 'gm_screen'

1. Clone the repository.

    ```shell
    git clone https://github.com/rbolet/gm-screen.git
    cd gm-screen
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Import table structure and starter data

    ```shell
    mysql -u <your username> -p gm_screen < ./database/sqldump_noimages.sql
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
