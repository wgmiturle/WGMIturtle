
// Connect to MetaMask
async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      document.getElementById("status").innerText = "✅ Wallet connected!";
    } catch (error) {
      document.getElementById("status").innerText = "❌ Connection failed.";
    }
  } else {
    document.getElementById("status").innerText = "❌ MetaMask not detected.";
  }
}

// Buy WGMI tokens with test USDT
async function buyTokens() {
  const amount = document.getElementById("usdtAmount").value;
  const web3 = new Web3(window.ethereum);

  const usdtContract = new web3.eth.Contract(usdtABI, USDT_ADDRESS);
  const presaleContract = new web3.eth.Contract(abi, PRESALE_ADDRESS);

  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];

  try {
    // Convert USDT amount to smallest unit (assuming 18 decimals)
    const value = web3.utils.toWei(amount, "ether");

    // Approve USDT transfer
    await usdtContract.methods.approve(PRESALE_ADDRESS, value).send({ from });

    // Buy WGMI tokens
    await presaleContract.methods.buyTokens(value).send({ from });

    document.getElementById("status").innerText = "✅ Purchase successful!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Transaction failed.";
  }
}
