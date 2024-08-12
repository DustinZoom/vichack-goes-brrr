Hi this is Lucas

How to test the codes?

1.go to remix.ethereum.org
2.pull the code from our github repo
3.Compile while selecting voting.sol in d-app folder
4.go to deploy, select remix vm cancun, select voting d-app as contract, and deploy
(if didn't work, choose remix vm london, also change EVM version to london, this can be done by Solidity complier-> advanced config=>evm version)

5.find our instance in Deployed/Unpinned Contracts, u can play around with it now.
Note: u can switch account under environmen on the left, u have lots of account, the account u deploy will be a organisers, you can give roles to other user, copy
the address of another account, switch back and give vote permission to this user, by using his address and enum 1(1 = voter)
6.the rest is intuiative as well
