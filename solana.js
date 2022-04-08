// var web3 = new Web3(window.solana);
var web3 = solanaWeb3;
var sender = {
    pubKey : null,
    balance : 0
}
  
console.log("Solana web3: ",solanaWeb3);
async function ConnectPhantomWallet() {
    window.solana.on("connect", () => document.getElementById("status").innerText="Connected")
      const isPhantomInstalled = window.solana && window.solana.isPhantom;
      if ( isPhantomInstalled ) {
        if ("solana" in window) {
          const provider = window.solana;
          console.log("Phantom is Present");
          if (provider.isPhantom) {
            if (!provider.isConnected) {
              try {   
                var test = await window.solana.connect();
                sender.pubKey = test.publicKey;
                let provider = window.solana;
                console.log("Address ---> ",test.publicKey.toString());
                var public_key = document.getElementById("address").innerText = (test.publicKey.toString());

                let connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('testnet'), 'confirmed');
        
                connection.getBalance(provider.publicKey).then(function (value) {
        
                console.log("Balance: " + (value/1000000000) + " SOL");
                var money = document.getElementById("balance").innerText = (value/1000000000 + " SOL");
        
                });
                return window.solana;
              } catch (err) {
              }
            } else {
              await window.solana.connect();
              return window.solana;
            }    
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
  }
  
  var provider = window.solana
  async function SendPhantom()
  {
    var receiver = document.getElementById("addressol");
    var solvalue = document.getElementById("solvalue");
    var finalReceiver = new web3.PublicKey(receiver.value);
    var sol = solvalue.value
    console.log("Receiver's Address ---> "+ receiver.value);
    console.log("SOL value to be sent ---> ",solvalue.value);
    var recieverWallet = new web3.PublicKey(finalReceiver);

    console.log("Empty receiver  ===>  ",receiver.value);
    var sol = solvalue.value
    console.log("SOL VALUE ==== ",solvalue.value);

    var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('testnet'), 'confirmed');
  
    console.log("Receive wallet ---> ",finalReceiver.toString());
    console.log("Sender address ---> ",sender.pubKey.toString() );  

    var transaction = await new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: sender.pubKey,
        toPubkey: new web3.PublicKey(recieverWallet),
        lamports: sol * web3.LAMPORTS_PER_SOL //Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
      }),
    );
  
    // Setting the variables for the transaction
    transaction.feePayer = sender.pubKey;
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;
  
    // Transaction constructor initialized successfully
    if(transaction) {
      console.log("Txn created successfully");
    }
    
    // Request creator to sign the transaction (allow the transaction)
    let signed = await provider.signTransaction(transaction);
    // The signature is generated
    let signature = await connection.sendRawTransaction(signed.serialize());
    // Confirm whether the transaction went through or not
    await connection.confirmTransaction(signature);
  
    //Signature will be printed here
    console.log("Signature: ", signature);
    var tranotify = document.getElementById("tranotify").innerText = ("Signature " + signature)

    alert("Transaction Successful")
  }
  
async function DisconnectPhantom(){
  window.solana.disconnect();
  window.solana.request({ method: "disconnect" });
  window.solana.on('disconnect', () => console.log("::::: Phantom Disconnected ::::"))
  window.solana.on('disconnect', () => document.getElementById("status").innerText="Disconnected")
  
  window.solana.disconnect();
  alert("Wallet Disconnected");
}