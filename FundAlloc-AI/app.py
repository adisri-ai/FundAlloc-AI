from flask import Flask , request , jsonify , render_template
import pandas as pd
import pulp
import os
app = Flask(__name__)
data = pd.read_excel("data/stock_data4.xlsx")
data.set_index("Fund" , inplace=True)
funds = data.index
num = {}
for i in range(funds.size):

    num[funds[i]]=i

weights = []

for i in range (11):

    weights.append(0.01 + i*0.01618)
@app.route('/')
def home():
    return render_template('index.html')
@app.route('/process' , methods=['POST'])
def calc():
    x = float(request.form["numinput"])
    prob = pulp.LpProblem("max_returns" , pulp.LpMaximize)

    select = pulp.LpVariable.dicts("selection" ,funds, 0 , 1 , pulp.LpBinary)

    allocation = pulp.LpVariable.dicts("allocate" ,funds, 0 , 1 , pulp.LpContinuous)

    prob+= pulp.lpSum(select[fund] for fund in funds)==5

    prob+= pulp.lpSum(allocation[fund] for fund in funds)==1

    for fund in funds:

        prob+= allocation[fund]>= 0.1*select[fund]

        prob+= allocation[fund]<= 0.35*select[fund]

    for i in range (11):

        prob+= sum(allocation[fund]*data.iloc[num[fund] , i] for fund in funds) >= x

    prob+= sum(sum(allocation[fund]*data.iloc[num[fund] , i] for fund in funds)*weights[i] for i in range(11))

    prob.solve()
    if(prob.status == pulp.LpStatusInfeasible):
        return jsonify({"funds":[] , "allocations":[] , "returns":[] , "ans":[]});
    selected_funds = [fund for fund in funds if pulp.value(select[fund])>0.5]
    select_funds  = [fund for fund in selected_funds]
    allocation_funds = {fund: pulp.value(allocation[fund]) for fund in selected_funds}
    s=0

    for i in range(11):

        s=s+ sum(pulp.value(allocation[fund])*data.iloc[num[fund] , i] for fund in funds)*weights[i]
    ret=[]
    k= round(s,2)

    for i in range(11):
        ret.append(round(sum(pulp.value(allocation[fund])*data.iloc[num[fund] , i] for fund in funds),2))
    return jsonify({"funds":selected_funds , "allocations": [round((pulp.value(allocation[fund]))*100, 2) for fund in selected_funds] , "returns":ret , "ans": round(s,2)})
port = int(os.environ.get("PORT" , 5000))
if(__name__ == "__main__"):
    app.run(host="0.0.0.0" , port= port)