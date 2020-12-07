async function calculate(distance, dropdown, laptime, fuelcon, fueltank){
    
    let laps = Number;

    if(dropdown == 1){
        laps = Math.round((distance*60/laptime)*100)/100;
    } 
    else if(dropdown == 2){
        laps = Math.round((distance*60*60/laptime)*100)/100;
    }
    else if(dropdown == 0){
        laps = distance;
    }

    let fuel = Math.round((laps*fuelcon)*100)/100,
        boxenstops = Math.floor(fuelcon/fueltank);
    
    return {laps, fuel, boxenstops};

}

module.exports = { calculate };


// if(detTime == 0){                
//     var drivingLaps = document.getElementById('inputTime').value;
// }
// else if(detTime == 1 || detTime == 2){
//     var drivingLaps = Math.round((detSeconds/outputLaptimeSEC)*100)/100;
// }

// if(detCheckbox.checked == true){
//     var drivingLaps = Math.round((drivingLaps)*100)/100+2;
// }



// var outputFuelCon = Math.round((drivingLaps*detFuelCon)*100)/100,
//     outputBoxenstops = Math.floor(outputFuelCon/detTank);