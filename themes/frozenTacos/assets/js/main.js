var reboot = false;

document.getElementById("url2test").addEventListener("keydown", function(event) {
    if(event.key=="Enter")
        document.getElementById("url2testButton").click();
}, true);

function contentToggle() {
    var x = document.getElementById("moreInfo");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

// Launch Pepper Index Score
async function launch(url){
    //Check if test has already been asked
    if(!reboot)
        reboot = true;
    else
        rebootData();

    //Create New StyleSheet
    var styleEl = document.createElement('style');
    styleEl.setAttribute("id", "animationSS");
    document.head.appendChild(styleEl);

    //preformating url
    let reg = /(http:\/\/|https:\/\/)/;
    if(!reg.test(url))
        url = "https://"+url;

    //Verify if the URL is valid
    if(!checkURL(url))
        alert("Veuillez entrer une URL valide")
    else {
        document.getElementById('waiting').style.visibility = 'visible';
        let data = await getScores(url);
        getPepper(data);
    }
}

// Get data set to default
function rebootData(){
    console.log("reboot");

    //delete ss
    document.getElementById("animationSS").remove();
    //delete color & score
    let elts = ['ei', 'perf', 'acc', 'bp', 'seo'];
    let classes =  ['green', 'orange', 'red', 'mixDiff', 'animated'];
    let grades = ['done','A','B','C','D','E'];

    // EI & LH
    elts.forEach(elt => {
        classes.forEach(css => {
            document.getElementById('res-'+elt).classList.remove(css);
        });
        document.getElementById('s-'+elt).innerHTML = "--";
    });

    // Pepper Index
    grades.forEach(grade => {
        document.getElementById('res-pepper').classList.remove(grade);
    })
    document.getElementById("s-pepper").innerHTML = "--";
}


// Launch Pepper Index
async function getScores(url){
    //Launch the different test
    console.log("calling");
    const responses = await Promise.all([
        ecoindex(url),
        googleLH(url, "performance", "perf"),
        googleLH(url, "accessibility", "acc"),
        googleLH(url, "best-practices", "bp"),
        googleLH(url, "seo", "seo")
    ]);
    console.log(responses)
    return responses;
    console.log("end of call");

}

//Calculate Pepper Index
function getPepper(data){
    /*
    repartition peperdindex  : 15 / 15 / 20 / 20 / 30
    formule corrigée : (40A +20B + 20 C + 10 D + 10E ) / 100
    */
   let score = (40*data[0]+20*data[1]+20*data[2]+10*data[3]+10*data[4])/100;
   let grade = getPepperGrade(score);

   document.getElementById("res-pepper").classList.add("done",grade);
   document.getElementById("s-pepper").innerHTML = score;
   console.log("Pepper Index :"+score+" et "+grade);
   document.getElementById('waiting').style.visibility = 'hidden';
}

//Getting Grade depending on Score
function getPepperGrade(score){
    if(score > 100 || score < 0) return "INVALID SCORE";
    var map = [
        {max: 85, grade: "A"},
        {max: 70, grade: "B"},
        {max: 50, grade: "C"},
        {max: 30, grade: "D"},
    ];
    for(var loop = 0; loop < map.length; loop++) {
        var data = map[loop];
        if(score >= data.max) return data.grade;
    }
    return "E";
}

// Validating URL
function checkURL(url)
{
    try {
        new URL(url);
      } catch (e) {
        console.error(e);
        return false;
      }
      return true;
}

// Asking EcoIndex from MG
async function ecoindex(url2Test){
    return await fetch('https://ecoindex.muchas-glacias.com', {
        method: 'POST',
        body: '{"URL":"'+url2Test+'"}'
    })
    .then(response => response.json())
    .then(json => {
        testTube("ei", parseInt(json.Score));
        //specific return in the then for the promise.all
        return parseInt(json.Score);
    })
    .catch(err => {
        console.log(err)
    })
}

// Asking LightHouse
async function googleLH(url, type, id)
{
    const req = setUpQuery(url, type);
    return await fetch(req)
        .then(response => response.json())
        .then(json => {
            const lhRes = json.lighthouseResult;
            testTube(id, parseInt(lhRes.categories[type].score*100));
            //specific return in the then for the promise.all
            return parseInt(lhRes.categories[type].score*100);
        });
}

// Seting up query for PageSpeed
function setUpQuery(url, type) {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const parameters = {
      url: encodeURIComponent(url),
      category: type,
      strategy: "mobile",
      key: "AIzaSyBDMfNxNncSxZkXrWob_o7pyqBRFGYt0GI",
    };
    let query = `${api}?`;
    for (key in parameters) {
      query += `&${key}=${parameters[key]}`;
    }
    return query;
}

// Animating results
function testTube(id, score)
{
    if(score === null)
        console.log("error null");
    else{
        color = "";
        colorHex = "";
        if(score >= 75) {color = "green";colorHex = "#1CAF9C";} else
        if(score >= 25 && score < 75) {color = "orange";colorHex = "#F4AB00";} else
        if(score >= 0 && score < 25) {color = "red";colorHex = "#C8222C";}

        //Define specific SS rules
        var ss = document.getElementById("animationSS").sheet;
        var extendSlime = ((score*9)/100)+4.5;
        var extendLevel = ((score*9)/100)+3.75;

        var rules = [
            '@keyframes slime-'+id.toUpperCase()+' {from {height: 4.5rem;} to {height: '+extendSlime+'rem;}}',
            '@keyframes level-up-'+id.toUpperCase()+' {from {bottom:3.75rem;} to {bottom: '+extendLevel+'rem}}',
            '@keyframes mergeColor-'+id.toUpperCase()+' {from {color: $c_white;} to {color: '+colorHex+';}}'
        ];

        rules.forEach(item => {
            ss.insertRule(item, ss.cssRules.length);
        });
        

        //Add Score + Color + Animated
        if(score<41)
            document.getElementById("res-"+id).classList.add(color,"mixDiff","animated");
        else
        document.getElementById("res-"+id).classList.add(color,"animated");
        document.getElementById("s-"+id).innerHTML = score;
    }
}