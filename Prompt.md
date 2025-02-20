provide your prompt using the following format:

Base Code:
```javascript

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
  


```

Prompt:

Government has brought a new scheme on the electricity bill amount to relax houses based on the total monthly income of family members.

Here are some of the details:

-> Each family will get unique meter , if same meter is allotted then raise error "Meter number cant be same"

-> each earning members salary will be considered only if they are equal or above  (=>) 18 and below or equal (<=) 45, If all members have an age outside the range of 18 to 45 (inclusive), raise the message 'Not applicable for scheme' and apply default billing for them. Otherwise, billing will be applied according to the specific rules defined for the scheme and also note members below 18 and above 45 their salary wont be considered in total monthly income.

-> Default billing is charging $1 for every 10W of electricity consumed. For example if the total watt of meter is 100 , then billing amount ill be $10

-> Rules for the billing amount:

- If the monthly total income of house is than (<) $100k then billing amount will be calculated based on default billing.

- if the monthly income is equal or above (=>) $100k but less than (<) $ 200k then it will charge $2 for every 10W.

- if the monthly income is equal or above (=>) $200k then it will charge $3 for every 10W

Note: If same members identified with adhar card number are present in multiple house , then dont consider them again in billing Amount logic if already present in processed house that is house with lower house number.

-> The billing amount calculated based on total monthly income gets added at end with addition charges on the floor of house that is billingamount divided by number of floors and just take the integer value from it.



Complete three functions and both these function will accept json array of dataset, one of the example :

dataset=[

{  meterNo: 1,

members: [ { memberName: 'Salman', Salary: $30K, age: 21} , { memberName: 'Saif', Salary: $150K, age: 21} ],
adharno:  [ "abc" ,"ddf" ],
meterReading: '100W'

floors: 3 }


]
Dataset cant be empty  , if empty or not an array , raise error "Invalid DataSet"
Each record of dataset will have properties such as meterNo, members list ( This will have memberName , Salary and age), meterReading ,  adharno list ( adhar number of members that first member of members list has adhar number identified with first element of adharno and so on) and  floor.  The dataset is zero based indexing , where each index is a house starting from house1 , house2 and so on.

1. meterNo should be integer number

2. memberName should be string

3. age should be integer number

4. salary should have prefix `$` symbol then integer number and at end symbol `k`, meter

5. meterReading will have integer number followed by suffix `W`

6. floors will be a number

7. adharno list must have elements of string.

if any property of the records in dataset is not having the above type raise error "Dataset is not valid" and this all checks will be done in `checkDataset` function.





- `billingAmount` : will accept dataset and calls `checkDataset` and then apply billing logic as described in details part and return billing in integer for each house in a list.

- `checkDataset`: will accept dataset and will have check as defined for each records in dataset and return dataset if its valid else raise error as described in type check.

- `billedMembers`: will accept dataset and then return list of objects( key as `house{index+1}`, where index is the index of current house from dataset and value will members considered for billing  if no members of house is considered then in such case take empty list for that house ) for example for this dataset:
```bash
dataset=[

{  meterNo: 1,

members: [ { memberName: 'Salman', Salary: $30K, age: 21} , { memberName: 'Saif', Salary: $150K, age: 21} ],
adharno:  [ "abc" ,"ddf" ],
meterReading: '100W'

floors: 3 
}, 
{  meterNo: 2,

members: [ { memberName: 'Sharuk', Salary: $30K, age: 46} , { memberName: 'kajal', Salary: $150K, age: 16} ],
adharno:  [ "ghf" ,"qqw" ],
meterReading: '100W'

floors: 3 }

]
```
Output will be :
```bash
[ { house1:['Salman','Saif'] } , { house2:[] } ]
```

--------------------------------

Example of calculating billing amount , here is the dataset
```bash
[
      {
        meterNo: 1,
        members: [
          {
            memberName: 'Salman',
            Salary: '$30k',
            age: 21
          },
          {
            memberName: 'Sarah',
            Salary: '$40k',
            age: 22
          }
        ],
      adharno:  [ "abc" ,"qew" ],
        meterReading: '100W',
        floors: 3
      }
   ]
``` 
Billing amount: 10 + 3= 13

Output is : `[13]`
explanation:
House1 with represented with 0 index has members salary less than 100k so default billing with `$1` for every 10W which comes out to be `$10`

 Here there are 3 floors so `10/3` = 3.33 , so take integer value ie 3 

Another example, here is the dataset:
```bash
[

{  meterNo: 1,

members: [ { memberName: 'Salman', Salary: '$30K', age: 21} , { memberName: 'Saif', Salary: '$150K', age: 21} ],
adharno:  [ "abc" ,"ddf" ],
meterReading: '100W'

floors: 3 
}, 
{  meterNo: 2,

members: [ { memberName: 'Sharuk', Salary: '$30K', age: 46} ,  { memberName: 'Salman', Salary: '$30K', age: 21} ],
adharno:  [ "ghf" ,"abc"],
meterReading: '100W'

floors: 3 }

]
```
Output will be : [ 26, 13 ] , member Salman has already been processed on house1 and he is identified process with adhar number ("abc")  so for house2 we wont consider Salman and see only other members and found there is no eligible members and hence default billing.
----------------

Complete the functions as they are incomplete.