# stellar-exchange
A console application write in Node.js to exchange assets in Stellar's Network

This applcation is set to exchange a limited number of assets for yUSDC, if you wish you can update code and allow as many assets as you want

## How to run it locally
To run it locally you'll need to clone this repository in your local machine and follow the next steps

1. Make a copy of the file `env.dist`, save it at the root of your project and rename it `.env`, Update the required values with your secret key and the slippage percentage you'd like to set in number.

Ex:

``VITE_USER_PRIVATE_KEY=SA2KDSSCU7KWDA4P5MCB5V23SDWCYJQ64DHSN4PGBFVYBQ4DTJOFC5QB``

``VITE_SLIPPAGE_PERCENT=2``

2. Run `npm i` to install dependencies
3. Run `npm run app` to run it

That's it! Your app is set and running

## How to use it

Once is running the app will allow you to choose between Stellar Public network or it's Testnet.
Once you've selected a network you'll simply have to select the code for the asset you'd like to exchange and the amount you wish to send. Waiting a few seconds the app will inform you wether it is completed or if anything came up

If you wish to shut down the proccess in the middle you can do it by running `Ctrl+C`
