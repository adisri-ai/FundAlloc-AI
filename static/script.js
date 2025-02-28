function format(s){
    let n = s.length;
    let ans="";
    for(let i=0 ; i<n ;  i++){
        if((s.charCodeAt(i) >= "A".charCodeAt(0)) && (s.charCodeAt(i)<="Z".charCodeAt(0))){
            ans+=" ";
        }
        ans+=s[i];
    }
    return ans;
}
async function submitInput(){
    let box = document.getElementById("input1").value;
    let output = document.getElementById("allocation");
    let tab = document.getElementById("prev");
    if(!box){
        alert("Enter valid input");
        return;
    }
    let form = new FormData();
    form.append("numinput" , box);
    output.innerHTML = "<h2>Wait,Let AI create your portfolio..</h2>";
    tab.innerHTML="";
    let send = await fetch('/process' , {
        method:"POST",
        body: form
    });
    if(!(send.ok)){
        output.innerHTML = "<h2>An Error Occured! Try reloading the page after a few minutes!</h2>";
        return;
    }
    else{
        k = await send.json();
        if(k.funds.length===0){
            output.innerHTML = "<h2>HighValueError: The value" + box + " % is too high to guarantee!! Try entering Lower value.</h2>"
            return;
        }
        else{
            let m = "<h1> Your Portfolio Allocation </h1>"
            m+= "<div><table>   <thead>    <th> Fund </th>   <th> Allocation(in %)  </th>   </thead>";
            for(let i=0 ; i<k.funds.length ; i++){
                m+="<tr>"+"<td>"+format(k.funds[i])+"</td>    "+"<td>"+k.allocations[i]+"</td>   </tr>"
            }
            m+="</table>"
            output.innerHTML = m;
            m = "<h1> Let's see how your portfolio did in last 11 years: </h1>";
            m+= "<table>  <thead> <th> Year </th> <th> Return(in %) </th>    </thead>";
            for(let i=0 ; i<k.returns.length ; i++){
                m+= "<tr> <td>"+(2014+i)+"</td>   "+"<td>"+k.returns[i]+"</td>   </tr>"
            }
            m+="</table></div>"
            tab.innerHTML = m;
            m = "<h1>Your average annual return is: "+(k.ans)+"% </h1>"
            tab.innerHTML+=m;
        }
    }
}