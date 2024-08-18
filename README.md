# Dvote
This is a voting d-app created for the Vichack hackathon blockchain stream.
## Backend only testing
How to test the contract on the backend?

1. go to remix.ethereum.org
2. pull the code from our GitHub repo
3. Compile while selecting voting. sol in d-app folder
4. go to deploy, select remix vm cancun, select voting d-app as a contract, and deploy
(if this didn't work, choose remix vm London, also change the EVM version to London, this can be done by Solidity compiler-> advanced config=> EVM version)
(also, try using an older compiler version, like 0.820)

5. find our instance in Deployed/Unpinned Contracts, u can play around with it now.
Note: u can switch accounts under environment on the left, remix will prepare lots of account
6. the rest is intuitive

## Webpage testing

1. go to   https://dvote.ngrok.app      (the server will only be on because this is a forwarding of mylocalhost, I will try my best to make it working from 8am to 11pm, but even u happen to find it closed, try another time)
2. Install metamask extensions,create an account if haven't done so
3. Go to chainlist website, search for Polygon zkEVM Cardona Testnet, click include testnet if it is not there, add it to metamasks.
4. Use your metamask address to redeem some test tokens in https://faucet.polygon.technology/ . select the correct network and verify using discord.
5. Refresh the page if u can't connect Metamask, now, u can finally start voting and creating events. Feel free to try it out.

## react.js
in the react folder, this is the frontend of our voting contract.
How to make a server yourself(if you want to)
terminal:
cd C:\Users\test\Desktop\VICHACK\vichack-goes-brrr\react\my-dapp
then: npm start

## node.js
This node folder contains APIs generated for Flutterflow to use. However flutterflow didn't fully worked.
Since it is not needed anymore. I didnt update this folder for a while, so it is most likely outdated(like the ABI doesn't match, the address doesn't match etc.)
How it used to work is  terminal: node index.js, then use ngrok to forawrd localhost, and call the apis using json body if it is a post function, for get function, just call them. Below image
is an example of all the api calls i generated.
![api calls](https://github.com/user-attachments/assets/ef5bc2ba-a626-4c48-a977-8e4af4a81154)

## flutterflow
Our initial frontend choice, however, didn't work out. You login without details to play through.
