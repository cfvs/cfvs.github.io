UpdateContests()

var Contests = new Map()
var Handles = new Set()

function UpdateContests(){    
    fetch('http://codeforces.com/api/contest.list')
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

    fetch("http://codeforces.com/api/user.info?handles=" + handle)
    .then(response => response.json())
    .then(data => {
        var rating = data.result[0].rating
        Handles.add(handle)

        //Add handle to Table    
        var handleTable = document.getElementById("handleTable")
        var row = handleTable.insertRow(1)

        row.insertCell(0).innerHTML = handle
        row.insertCell(1).innerHTML = rating
        row.insertCell(2).innerHTML = '<a onclick="removeHandle(this)"><i class="trash alternate outline icon"></i></a>'       
    })
}

function removeHandle(btn) {
    var row = btn.parentNode.parentNode

    Handles.delete(row.cells.item(0).innerHTML)
    row.parentNode.removeChild(row)  
}

function ShowContests() {
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
        $("#contestTable tr").remove();
    Contests.forEach((value, key, map) => {
        if(!AttContests.has(key)){
        
            var contestTable = document.getElementById("contestTable")
            var row = contestTable.insertRow(-1)

            row.insertCell(0).innerHTML = '<a href="https://codeforces.com/contest/' + key + '">' + value + '</a>'
            row.insertCell(1).innerHTML = key
        }
    })
    })
}
