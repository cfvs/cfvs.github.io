UpdateContests()

var Contests = new Map()
var Handles = new Set()
var ConType = new Set()

function UpdateContests(){    
    fetch('https://codeforces.com/api/contest.list')
    .then(response => response.json())
    .then(data => {
        
        data.result.forEach(contestData => { 
            if(contestData.phase == "FINISHED")
                Contests.set(contestData.id, contestData.name)
        })
    
    })
}

function addHandle(){
    var handle = document.getElementById("handleInp").value
    if(handle == "" || Handles.has(handle)) return

    fetch("https://codeforces.com/api/user.info?handles=" + handle)
    .then(response => response.json())
    .then(data => {
        var rating = data.result[0].rating
        Handles.add(handle)

        //Add handle to Table    
        var handleTable = document.getElementById("handleTable")
        var row = handleTable.insertRow(1)

        row.insertCell(0).innerHTML = handle
        row.insertCell(1).innerHTML = rating
        row.insertCell(2).innerHTML = '<i class="trash icon" onclick="removeHandle(this)"></i>'       
    })
}

function removeHandle(btn) {
    var row = btn.parentNode.parentNode

    Handles.delete(row.cells.item(0).innerHTML)
    row.parentNode.removeChild(row)  
}

function SC(buttonId) {
    if (document.getElementById(buttonId).classList.contains('active')) ConType.delete(buttonId)
    else ConType.add(buttonId)
    document.getElementById(buttonId).classList.toggle('active')
    document.getElementById(buttonId).blur()
}

function Show(){
    var AttContests = new Set()
    var fetches = []

    for(let handle of Handles){
        fetches.push(        
        fetch("https://codeforces.com/api/user.status?handle=" + handle)
        .then(response => response.json())
        .then(data => {
                        
            data.result.forEach(contest => {
                if (contest.verdict == "OK")
                    AttContests.add(contest.contestId)
            })
        })
        )
    }
    
    Promise.all(fetches)
    .then(function(){
        $('#contestTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
    Contests.forEach((contest_name, contest_id) => {
        flag = true
        ConType.forEach((type) => {
            if(contest_name.indexOf(type) == -1) flag = false
        })
        
        if(!AttContests.has(contest_id) && flag){
        
            var contestTable = document.getElementById("contestTable")
            var row = contestTable.insertRow(-1)
            
            row.insertCell(0).innerHTML = '<a href="https://codeforces.com/contest/' + contest_id + '" target="_blank">' + contest_name + '</a>'
            row.insertCell(1).innerHTML = contest_id
        }
    })
    })
}
