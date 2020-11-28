
ueberschuss = []

func findRecipiehe(name)
    ueberschuss = []

    findRecipiehelper(name)


func findRecipiehelper (name)
    recipieitems = name.finditems;
    output = []
    foreach recipieitems
        if(recipieitem is typeof grundmaterial)
            output.add(recipieitem)
        else
            if ueberschuss contains recipieitem 
                if ueberschuss(recipieitem) > 0
                    ueberschuss(recipieitem)--
                else
                    ueberschuss.remove(recipieitem)
                
            else
                amount = recipieitem.findamount
                if(amount > 1)
                    ueberschuss.add({recipieitem: amount -1})
                output.concat(findrecipiehelper(recipieitem))
    return output