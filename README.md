# OPTCG Sim Themer

###  Create custom themes for the **One Piece Trading Card Sim** by [Maebatsu](https://linktr.ee/maebatsu).

### Live Site: [optcgsimthemer.com](https://www.optcgsimthemer.com/)

The One Piece Trading Card Game Sim is great, offering a free digital platform to play the trading card game online with other players across the world in the absense of an official client. The sim is very well designed technically and gets constant updates to accomodate new cards and mechanics. 

The only downside of the Sim is that the default graphics are very basic and the exectuion in general is not very aesthetically focused. This tool aims to offer a solution to that for players who want a more aesthetically pleasing experience using custom playmats, backgrounds, card sleeves, don cards and play cards.

## Basic Usage

1. Visit [the live site](https://www.optcgsimthemer.com/create).
2. Select the customizations you want.
3. Click **Download** and select **Generate Theme**. Once it's finished generating click **Download Theme**
4. Extract the downloaded zip file and copy the contents this folder of your sim install:\
   `[YOUR OPTCGSIM INSTALL]/Builds[YOUR_OS]/OPTCGSim_Data/StreamingAssets`

## Run Locally

1. Clone this repository.
2. Make sure **Node** and **Node Package Manager** are installed on your system.
3. Inside the cloned repository run `npm i` and then `npm build`.
4. To run the app run `npm run build` inside the cloned repository. You can then find the app by visiting localhost:3000 in your web browser.

## FAQ

### I have discovered a bug / have a suggestion for a new feature, how can I contact you?
You can email me at livewellandmakethings@gmail.com or dm/@ me on twitter.

### How does this website work?
This website uses a javascript library called JIMP to generate images for themes.

JIMP is an image processing library very similar to popular image editing software like GIMP and Photoshop, but instead of using a graphic user interface, it is operated through code.

You will need javascript turned on in your browser to be able to create your own themes, but not if you just want to download the default theme.


### Can I have one playmat/sleeves for all my decks and different playmat/sleeves for my opponents?
Due to the way the sim works: playmats are assigned only by Leader Color, and sleeves can only have one visual for all. You can however get your own personal playmat that will also display to your opponents by subscribing to [BatsuApps patreon](https://www.patreon.com/BatsuApps) at the Warlord tier.

### Why does this website use a lot of my computer's resources?
Most modern websites try to do as much work on the server as possible, and then only send the results of that work to your computer in the form of web pages.

Because generating a theme requires a lot of image processing - in order to prevent large server costs and still provide a free service this website does most of the heavy lifting for generating the images for the theme on your computer.

This is why you may notice your computer's fans spinning up and a large amount of computer resources used when creating themes. Much the same as if you were generating the images using GIMP or Photoshop.
