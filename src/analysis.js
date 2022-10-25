const { getTrips, getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {

  try{let trips = await getTrips();
  // let driver = await getDriver();
  // console.log(driver)

  const output = 
    {
      "noOfCashTrips": 0, 
      "noOfNonCashTrips": 0, 
      "billedTotal": 0, 
      "cashBilledTotal": 0, 
      "nonCashBilledTotal": 0, 
      "noOfDriversWithMoreThanOneVehicle": 0,
      "mostTripsByDriver": {
        "name": "",
        "email": "",
        "phone": "",
        "noOfTrips": 0,
        "totalAmountEarned": 0
      },
      "highestEarningDriver": {
        "name": "",
        "email": "",
        "phone": "",
        "noOfTrips": 0,
        "totalAmountEarned": 0
      }
    };

  let driverChecker = [];

    //To get the total bill
 for(let trip of trips) {
  const billAmount = Number(trip.billedAmount) || Number(trip.billedAmount.replace(/\,/ig, ''))
  // console.log((trip.billedAmount))
  if(trip.isCash === true) {
    output.noOfCashTrips++;
   output.cashBilledTotal += billAmount 
  } else {
    output.noOfNonCashTrips++;
    output.nonCashBilledTotal += billAmount
 }

//  To calculate the driverId
 let driverId = trip.driverID;
 if(!driverChecker.includes(driverId)) {
  driverChecker.push(driverId)
 }

}
// To get the total billed for both cash and noncash
 output.billedTotal = output.cashBilledTotal + output.nonCashBilledTotal;

return output}catch(err) {
  return "There is an error"
}
}
analysis();
module.exports = analysis;