App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) { 
        App.account = account;
        $("#account").text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if (err === null) {
            $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
          }
        });
      }
    });
  },

  initContract: function() {
    $.getJSON('ReReviews.json', function(reReviewsArtifact) {
      // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
      App.contracts.ReReviews = TruffleContract(reReviewsArtifact);

      // Set the provider for our contract.
      App.contracts.ReReviews.setProvider(App.web3Provider);

      // Listen for events
      App.listenToEvents();

      // Retrieve the review from the smart contract
      return App.reloadReviews();
    });
  },

  reloadReviews: function() {
    // avoid reentry
    if (App.loading) {
      return;
    }
    App.loading = true;

    // refresh account information because the balance may have changed
    App.displayAccountInfo();

    var reReviewInstance;

    App.contracts.ReReviews.deployed().then(function(instance) {
      reReviewInstance = instance;
      return reReviewInstance.getReviewsToView();
    }).then(function(productIds) {
      // Retrieve and clear the review placeholder
      var reviewsRow = $('#reviewsRow');
      reviewsRow.empty();

      for (var i = 0; i < productIds.length; i++) {
        var productId = productIds[i];
        
        reReviewInstance.reviews(productId.toNumber()).then(function(product) {
          console.log("product details are ", product);
          App.displayReview(
            product[0],
            product[1],
            product[3],
            product[4],
            product[5],
            product[6],
            product[7],
            product[8]
          );
        });
      }
      App.loading = false;
    }).catch(function(err) {
      console.log(err.message);
      App.loading = false;
    });
  },

  displayReview: function(id, seller, name, description,upvotes,rewards,downvotes,hash) {
    // Retrieve the review placeholder
    var reviewsRow = $('#reviewsRow');

    // var etherPrice = web3.fromWei(price, "ether");

    // Retrieve and fill the review template
    var reviewTemplate = $('#reviewTemplate');
    reviewTemplate.find('.panel-title').text(name);
    reviewTemplate.find('.review-description').text(description);
    reviewTemplate.find('.review-upvotes').text(upvotes);
    reviewTemplate.find('.review-downvotes').text(downvotes);

    reviewTemplate.find('.review-rewards').text(web3.fromWei(rewards, "ether") + " ETH");
    reviewTemplate.find('.btn-buy').attr('data-id', id);
    reviewTemplate.find('.btn-buy').attr('data-value', 0.0001);
    let url = `https://ipfs.io/ipfs/${hash}`;

    reviewTemplate.find('.js-image-url').attr("src", url);
    // seller?
    if (seller == App.account) {
      reviewTemplate.find('.review-seller').text("You");
      reviewTemplate.find('.btn-buy').hide();
      if(reviewTemplate.find('.js-review-footer') && 
      reviewTemplate.find('.js-review-footer').find(".js-upvote") &&
      reviewTemplate.find('.js-review-footer').find(".js-upvote").length > 0) {

      }
      else {
        reviewTemplate.find('.js-review-footer').css("display", "none");
      }
      
    } else {
      reviewTemplate.find('.review-seller').text(seller);
      reviewTemplate.find('.btn-buy').show();
    }

    // add this new review
    reviewsRow.append(reviewTemplate.html());
  },

  uploaddoc: function(){
    const reader = new FileReader();
    reader.onloadend = function() {
      const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
      const buf = buffer.Buffer(reader.result) // Convert data into buffer
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if(err) {
          console.error(err)
          swal("Error", "Something went wrong!", "error");
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        console.log(`Url --> ${url}`)
        $(".js-uploaded-hash").attr("data-hash", result[0].hash);
        swal("Document Uploaded!", "Thanks for choosing us!", "success");
      })
    }
    const photo = document.getElementById("memories");
    reader.readAsArrayBuffer(photo.files[0]); // Read Provided File

  },


  addReview: function() {
    // retrieve details of the review
    var _review_name = $("#review_name").val();
    var _description = $("#review_description").val();
    var _hashval = $(".js-uploaded-hash").attr("data-hash");
    console.log("Hash value is ", _hashval);
    if ((_review_name.trim() == '')) {
      // nothing to sell
      return false;
    }

    App.contracts.ReReviews.deployed().then(function(instance) {
      console.log("Deploy contract", instance);
      return instance.addReview(_review_name, _description, _hashval, {
        from: App.account,
        gas: 500000
      });
    }).then(function(result) {
      swal("Review added to BlockChain!", "Thanks for your valuable input!", "success");
       console.log("I am inside add review", result);
    }).catch(function(err) {
      console.error(err);
    });
  },

  // Listen for events raised from the contract
  listenToEvents: function() {
    App.contracts.ReReviews.deployed().then(function(instance) {
      instance.addReviewEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        if(!error){
          $("#events").append('<li class="list-group-item">' + event.args._name + ' is for Review' + '</li>');
        } else {
          console.error(error);
        }
        App.reloadReviews();
      });

      instance.viewReviewEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        if(!error){
          $("#events").append('<li class="list-group-item">' + event.args._buyer + ' Reviewed ' + event.args._name + '</li>');
        } else {
          console.error(error);
        }
        App.reloadReviews();
      });
    });
  },

  viewReview: function(flag) {
    console.log("flag value is flag",flag);
    event.preventDefault();
// debugger
//     var flag = $(this).attr("data-flag");
//     console.log("flag value is ", flag);
    var upvote = 0;
    var downvote = 0;
    if(flag =="downflag"){
      downvote = 1;
      console.log("downvote value is ", downvote);
    }
    else{
      console.log("upvote value is ", upvote);
      upvote = 1;
    }

    // retrieve the review
    var _reviewId = $(event.target).data('id');
    App.contracts.ReReviews.deployed().then(function(instance) {
      return instance.viewReview(_reviewId, upvote, downvote, {
        from: App.account,
        value: web3.toWei(0.0001, "ether"),
        gas: 500000
      });
    }).then(function(result) {
      swal("Vote Casted Successfully in BLOCKCHAIN", "Thanks for your valuable input!", "success");
      console.log("After View Review", result);
    }).catch(function(err) {
      console.error(err);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
