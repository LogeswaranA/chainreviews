//Contract to be tested
var ReReviews = artifacts.require("./ReReviews.sol");

//Test suite
contract('ReReviews',function(accounts){

  var reReviewsInstance;
  var reviewer = accounts[1];
  var visitor = accounts[2];
  var name1 = "article 1";
  var comment1 = "Description for comment 1";
  var totalUpvotes1 = "TotalUpVotes value for first review";
  var totalDownvotes1 = "TotalDownVotes value for first review";
  var totalRewards1 = "totalRewards value for first review";

  var name2 = "article 1";
  var comment2 = "Description for comment 1";
  var totalUpvotes2 = "TotalUpVotes value for second review";
  var totalDownvotes2 = "TotalDownVotes value for second review";
  var totalRewards2 = "totalRewards value for second review";

  var watcher;
  var reviewerBalanceBeforeView, reviewerBalanceAfterView;
  var visitorBalanceBeforeView, visitorBalanceAfterView;

  // Test case: check initial values
  it("should be initialized with empty values", function() {
    return ReReviews.deployed().then(function(instance) {
      reReviewsInstance = instance;
      return reReviewsInstance.getNumberOfReviews();
    }).then(function(data) {
      assert.equal(data, 0x0, "number of reviews must be zero");
      return reReviewsInstance.getReviewsToView();
    }).then(function(data){
      assert.equal(data.length, 0, "Reviews for view should be empty");
    });
  });
});
