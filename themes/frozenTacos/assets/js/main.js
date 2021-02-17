
        




// Launch Pepper Index
function launch(url)
{
    //Create New StyleSheet
    var styleEl = document.createElement('style');
    styleEl.setAttribute("id", "animationSS");
    document.head.appendChild(styleEl);
    //var styleSheet = styleEl.sheet;

    //styleSheet.insertRule('header .version { background-color: white }', 0);
    //Verify if the URL is valid
    if(!checkURL(url))
        alert("Veuillez entrer une URL valide")
    else {
        //Launch the different test
        googleLH(url, "performance", "perf");
        googleLH(url, "accessibility", "acc");
        googleLH(url, "best-practices", "bp");
        googleLH(url, "seo", "seo");
    }
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

// Asking LightHouse
function googleLH(url, type, id)
{
    console.log(url);
    const req = setUpQuery(url, type);
    fetch(req)
        .then(response => response.json())
        .then(json => {
            const lhRes = json.lighthouseResult;
            console.log("réponse : "+lhRes.categories[type].score);
            testTube(id, lhRes.categories[type].score*100);
            //document.getElementById(id).innerHTML = lhRes.categories[type].score*100;
        });
}

// Seting up query for PageSpeed
function setUpQuery(url, type) {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const parameters = {
      url: encodeURIComponent(url),
      category: type,
      strategy: "desktop",
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
        if(score >= 75) {color = "green"} else
        if(score >= 25 && score < 75) {color = "orange"} else
        if(score >= 0 && score < 25) {color = "red"}

       

        
    
        document.getElementById("res-"+id).classList.add(color);
        document.getElementById("s-"+id).innerHTML = score;

        var ss = document.getElementById("animationSS").sheet;
        ss.insertRule('.mg .resultats #res-'+id+'.pill { background-color: white }', ss.cssRules.length);
        console.log("d "+ss.cssRules.length);
    }
}