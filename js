
const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // BSC Testnet USDT
const wgmiPresaleAddress = "YOUR_DEPLOYED_TESTNET_CONTRACT"; // Replace with your deployed contract

async function connectWallet() {
  if (window.ethereum) {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(ethereum);
      document.getElementById("status").innerText = "Wallet connected.";
    } catch (error) {
      document.getElementById("status").innerText = "Connection rejected.";
    }
  } else {
    alert("Please install MetaMask.");
  }
}

async function buyTokens() {
  const accounts = await web3.eth.getAccounts();
  const buyer = accounts[0];
  const amount = document.getElementById("usdtAmount").value;
  const usdt = new web3.eth.Contract([
    { "constant": false, "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
  ], usdtAddress);

  const amountInWei = web3.utils.toWei(amount, 'ether');
  try {
    await usdt.methods.approve(wgmiPresaleAddress, amountInWei).send({ from: buyer });
    const presale = new web3.eth.Contract([
      { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "buyTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function"
      }
    ], wgmiPresaleAddress);
    await presale.methods.buyTokens(amountInWei).send({ from: buyer });
    document.getElementById("status").innerText = "Purchase successful!";
  } catch (err) {
    document.getElementById("status").innerText = "Transaction failed.";
  }
}
