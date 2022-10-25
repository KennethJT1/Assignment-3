const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
 
  let newReport = await getTrips();


  let driverId =[];        
  let cashTrips = {};
  let nonCashTrips = {};
  let totalEarnings = {};
  let cashAmount = {};
  let nonCashAmount = {};
  
  for (let report of newReport) {
    //getting unique drivers Id 
    if(!driverId.includes(report.driverID)) {
      driverId.push(report.driverID);
    }
    console.log()
    // checking if the cash is true to implement count
    if (report['isCash']) {
      if (cashTrips[report.driverID]) {
        cashTrips[report.driverID]++;
      }
      else {
        cashTrips[report.driverID] = 1;
      }
    }
    if (!report['isCash']) {
      if (nonCashTrips[report.driverID]) {
        nonCashTrips[report.driverID]++;
      }
      else {
        nonCashTrips[report.driverID] = 1;
      }
    }
    if(totalEarnings[report.driverID]) {
      totalEarnings[report.driverID] += parseFloat(String(report.billedAmount).split(',').join(''));
    }
    else {
      totalEarnings[report.driverID] = parseFloat(String(report.billedAmount).split(',').join(''));
    }
    if (report.isCash) {
      if (cashAmount[report.driverID]) {
        cashAmount[report.driverID] += parseFloat(String(report['billedAmount']).split(',').join(''));
      }
      else{
        cashAmount[report.driverID] = parseFloat(String(report['billedAmount']).split(',').join(''));
      }
    }
    if (!report.isCash) {
      if (nonCashAmount[report.driverID]) {
        nonCashAmount[report.driverID] += parseFloat(String(report['billedAmount']).split(',').join(''));
      }
      else{
        nonCashAmount[report.driverID] = parseFloat(String(report['billedAmount']).split(',').join(''));
      }
    }
}

  let cashTripsInfo = Object.values(cashTrips);
  let nonCashTripsInfo = Object.values(nonCashTrips);
  let totalEarningsInfo = Object.values(totalEarnings);
  let totalCash = Object.values(cashAmount);
  let totalNonCash = Object.values(nonCashAmount);

  let driverDetails = []
  for (let id of driverId) {
    driverDetails.push(getDriver(id));
  }
  let promiseDriverInfo = await Promise.allSettled(driverDetails);

  let correctDriverInfo = [];
  //getting drivers status that are fulfilled
  for (let report of promiseDriverInfo) {
    if(report['status'] === 'fulfilled') {
      correctDriverInfo.push(elem);
    }
  }

  //getting number of trips per driver
  const driverTrips = {};
  for(let element of newReport) {
    if(driverTrips[element.driverID]){
      driverTrips[element.driverID]++;
    }
    // if key doesnt exist set key value to 1
    else {
      driverTrips[element.driverID] = 1;
    }
  }
  //to get the values of driverTrips alone
  let numOfTrips = Object.values(driverTrips);

  //getting vehicleID and information
  let vehicle = [];
  let vehicleInformation = [];
  for(let element of correctDriverInfo) {
    if (!vehicle.includes(element.value['vehicleID'])){
      vehicle.push(element.value.vehicleID)
    }
  }
  for(let report of vehicle) {
    if(!vehicle.includes['vehicleID']) {
      vehicleInformation.push(getVehicle(report))
    }
  }
  let promiseVehicleInfo = await Promise.allSettled(vehicleInformation)
  
  //sort out the fulfilled status
   let correctVehicleInfo = [];
   for (let report of promiseVehicleInfo) {
    if (report['status'] === 'fulfilled') {
      correctVehicleInfo.push(report);
    }
   }
  //getting vehicles plate and manufacturer
   let vehiclesPlate;
   let vehicleDetails = [];
   for (let report in correctVehicleInfo) {
    vehiclesPlate = {}
    vehiclesPlate['plate'] = correctVehicleInfo[report].value.plate;
    vehiclesPlate['manufacturer'] = correctVehicleInfo[report].value.manufacturer;
    vehicleDetails.push(vehiclesPlate);
   }

  //  user information
  let userDetails = [];
  for (let report in newReport) {
    let userInfo = {}
    userInfo['user'] = newReport[report].user.name;
    userInfo['created'] = newReport[report].created;
    userInfo['pickup'] = newReport[report].pickup;
    userInfo['destination'] = newReport[report].destination;
    userInfo['billed'] = newReport[report].billedAmount;
    userInfo['isCash'] = newReport[report].isCash;

    userDetails.push(userInfo)
  }

  //computing driver information
  let driverArray = [];
  
  for (let report in correctDriverInfo) {
    let driverInfo = {};
    if (correctDriverInfo[elem]) {
      driverInfo['fullName'] = correctDriverInfo[report].value.name;
      driverInfo['id'] = driverId[report];
      driverInfo['phone'] = correctDriverInfo[report].value.phone;
      driverInfo['noOfTrips'] = numOfTrips[report];
      driverInfo['noOfVehicles'] = (correctDriverInfo[report].value.vehicleID).length;
      driverInfo['vehicles'] = [];
      driverInfo['vehicles'].push(vehicleDetails[report]);
      driverInfo['noOfCashTrips'] = cashTripsInfo[report];
      driverInfo['noOfNonCashTrips'] = nonCashTripsInfo[report];
      driverInfo['totalAmountEarned'] = +(totalEarningsInfo[report]).toFixed(2);
      driverInfo['totalCashAmount'] = totalCash[report];
      driverInfo['totalNonCashAmount'] = +(totalNonCash[report].toFixed(2));
      driverInfo['trips'] = userDetails[report];
    }
    driverArray.push(driverInfo);
  }
return driverArray;
}
console.log(driverReport)
driverReport();
module.exports = driverReport;
