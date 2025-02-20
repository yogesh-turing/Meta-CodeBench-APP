function checkDataset(dataset) {
   //logic for checking the data validation comes here
    return dataset;
  }
  
  function billingAmount(dataset) {
    // First, check the validity of the dataset
    checkDataset(dataset);
  
    // logic for getting billing amount for each house comes here

    return billingAmounts;
  }
  
  function billedMembers(dataset) {

   // logic for getting billed members from each house comes here

    return result;
  }
  
  module.exports = { checkDataset, billingAmount, billedMembers };