async function calculate(distance, dropdown, checkbox2laps, checkboxSaveFuel, laptime, fuelcon, fueltank){

    let laps = 0;
    let calcLaptime = (laptime[0]*60)+laptime[1]*1;

    if(dropdown == 0){
        laps = Math.round((distance*60/calcLaptime)*100)/100;
    } 
    else if(dropdown == 1){
        laps = Math.round((distance*60*60/calcLaptime)*100)/100;
    }
    else if(dropdown == 2){
        laps = distance;
    }

    if(checkbox2laps == true){
        laps += 2; 
    }

    console.log(fuelcon)

    if( checkboxSaveFuel == true) {
        fuel = Math.round((laps*fuelcon+fuelcon*1.8)*100)/100
    } else {
        fuel = Math.round((laps*fuelcon)*100)/100;
    }
    
    let boxenstops = Math.floor(fuel/fueltank);
    
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