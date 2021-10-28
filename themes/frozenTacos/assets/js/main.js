// Global Actions
let reboot = false;
let mobile = null;

// Listeners
if (document.readyState === 'loading') {  // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', keyPressed);
} else {  // `DOMContentLoaded` has already fired
    keyPressed();
}

//Check Enter
function keyPressed(){
  const { display } = window.getComputedStyle(document.getElementById('res-ei'));
  mobile = display == 'none';
  /*

    const url2Test = document.getElementById('url2test');
    if (!!url2Test) {
        url2Test.addEventListener('keydown', event => {
            if(event.key === 'Enter') {
                document.getElementById('url2testButton').dispatchEvent(new Event('click'));
            }
        });
    }
    */
}

// Toggling Class
const contentToggle = (id, id2) => {
    document.getElementById(id).classList.toggle('hidden');
    document.getElementById(id2).classList.add('hidden');
}

// Launch Pepper Index Score
const launch = async url => {
    //Check if test has already been asked
    if(!reboot)
      reboot = true;
    else
      rebootData();
  
    //Create New StyleSheet
    if(!mobile){
        const styleEl = document.createElement('style');
        styleEl.setAttribute('id', 'animationSS');
        document.head.appendChild(styleEl);
    }
  
    //preformating url
    let reg = /(http:\/\/|https:\/\/)/;
    if(!reg.test(url))
      url = 'https://'+url;
  
    //Verify if the URL is valid
    if(!checkURL(url))
      alert('Veuillez entrer une URL valide')
    else {
        document.getElementById('waiting').classList.remove('unvisible');
        getPepper(await getScores(url));
    }
}

// Get data set to default
const rebootData = () => {
    console.log('reboot');
    /*
    //Waiting reinit
    document.getElementById('waiting').classList.remove('error');
    document.getElementById('waiting').classList.add('unvisible');
    document.getElementById('waiting').getElementsByClassName('txt')[0].innerHTML = "Veuillez patienter...";
    document.getElementById('waiting').getElementsByClassName('material-icons-outlined')[0].innerHTML = 'refresh';

    //Share reinit
    document.getElementById('link2Share').setAttribute('href', '');
    document.getElementById('link2Share').classList.add('hidden');


    //delete color & score
    const elts = ['ei', 'perf', 'acc', 'bp', 'seo'];
    const classes =  ['green', 'orange', 'red', 'mixDiff', 'animated'];
    const grades = ['done','A','B','C','D','E'];
  
    // EI & LH
    elts.forEach(elt => {
        const suffix = mobile ? 'M' : '';
        const resItem = `res${suffix}-${elt}`;
        const sItem = `s${suffix}-${elt}`;
  
        classes.forEach(css => {
            document.getElementById(resItem).classList.remove(css);
        });
        document.getElementById(sItem).innerHTML = '--';
  
        if(mobile) {
            document.getElementById(resItem).getElementsByClassName('slime')[0].style.width = '0';
            document.getElementById(resItem).classList.add('hidden');
        }
    });
  
    //delete ss
    if (!mobile)
      document.getElementById('animationSS').remove();
  
    // Pepper Index
    grades.forEach(grade => {
        document.getElementById('res-pepper').classList.remove(grade);
    })
    document.getElementById('s-pepper').innerHTML = '--';
    */
}

// Launch Pepper Index
const getScores = async url => {
    //Launch the different test
    console.log('calling');

    try {
        const responses = await Promise.all([
            ecoindexNcarbon(url),
            googleLH(url, 'performance', 'perf'),
            googleLH(url, 'accessibility', 'acc'),
            googleLH(url, 'best-practices', 'bp'),
            googleLH(url, 'seo', 'seo'),
            url
        ]);
        console.log(responses)
        return responses;
    } catch (err) {
        console.log('Erreur promise all');
        showErr(err);
        throw err;
    }
}

// Show Error message
const showErr = e => {
    //Change waiting message
    document.getElementById('waiting').classList.add('error');
    document.getElementById('waiting').getElementsByClassName('txt')[0].innerHTML = "Une erreur s'est produite, veuillez vérifiez l'url et recommencez";
    document.getElementById('waiting').getElementsByClassName('material-icons-outlined')[0].innerHTML = 'error';
}

//Calculate Pepper Index
const getPepper = data => {
    /*
    repartition peperdindex  : 15 / 15 / 20 / 20 / 30
    formule corrigée : (40A +20B + 20 C + 10 D + 10E ) / 100
    */
    const score = (40*data[0]+20*data[1]+20*data[2]+10*data[3]+10*data[4])/100;
    console.log('score');
    console.log(score);
    const grade = getPepperGrade(score);
    console.log(grade);
    const colors = {'A':'blue', 'B':'green', 'C':'yellow', 'D':'orange', 'E':'red'};
    console.log()

    const select = document.getElementById('res-pepper');

    select.classList.remove('prez');
    select.classList.add(colors[grade]);
    select.querySelector('div').textContent = grade;
    select.querySelector('p:last-of-type span').textContent = score;

    console.log('Pepper Index :', score, 'et', grade);
    document.getElementById('waiting').classList.add('unvisible');

    /*setData(data, score, grade);*/
}

// Saving in BDD
const setData = async (data, piScore, piGrade) => {
    try {
        const response = await fetch('https://api.muchas-glacias.com/results-logs', {
            method: 'POST',
            body: `{"eco-index":${data[0]}, "lighthouse-perf":${data[1]}, "lighthouse-accessibility":${data[2]}, "lighthouse-best-practices":${data[3]}, "lighthouse-seo":${data[4]}, "url":"${data[5]}", "pepper-index":"${piGrade}", "pepper-index-score":${piScore}}`
        });
        const { id } = await response.json();
        showLink(id);
    } catch (err) {
        console.log(err)
        throw err;
    }
}

// Show Link to share
const showLink = id => {
    document.getElementById('link2Share').setAttribute('href', `/score/?id=${id}`);
    document.getElementById('link2Share').classList.remove('hidden');
}

//Getting Grade depending on Score
const getPepperGrade = score => {
    if(score > 100 || score < 0) {
        return 'INVALID SCORE';
    }
  
    const grades = [
        {max: 85, grade: 'A'},
        {max: 70, grade: 'B'},
        {max: 50, grade: 'C'},
        {max: 30, grade: 'D'},
    ];
    const index = grades.findIndex(({max}) => score >= max);
  
    return index !== -1 ? grades[index].grade : 'E';
}


// Validating URL
const checkURL = url =>
{
    try {
        new URL(url);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

// Asking EcoIndex/Carbon from MG
const ecoindexNcarbon = async url2Test => {
    try {
        const response = await fetch('https://ecoindex.muchas-glacias.com', {
            method: 'POST',
            body: `{"URL":"${url2Test}"}`
        });
        const data = await response.json();
        let score = parseInt(data.Score);
        let carbon = parseFloat(data.Carbon);
        console.log(carbon);
        if (mobile)
          gauge('ei', score);
        else
          pills('ei', score);
        showCarbon(carbon);
        //specific return for the promise.all
        return score;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

const showCarbon = carbon => {
  select = document.getElementById('res-carbon');
  select.classList.remove('prez');
  select.classList.add('green');
  select.querySelector('p:last-of-type span').textContent = Math.floor(carbon*100)/100;
}

// Asking LightHouse
const googleLH = async (url, type, id) => {
    const req = setUpQuery(url, type);

    try {
        const response = await fetch(req);
        const { lighthouseResult: lhRes } = await response.json();
        const score = parseInt(lhRes.categories[type].score * 100);

        if(mobile)
          gauge(id, score);
        else
          pills(id, score);
        //specific return for the promise.all
        return score;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

// Seting up query for PageSpeed
const setUpQuery = (url, type) => {
    const api = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';
    const searchParams = new URLSearchParams({
        url: url,
        category: type,
        strategy: 'mobile',
        key: 'AIzaSyBDMfNxNncSxZkXrWob_o7pyqBRFGYt0GI',
    });
  
    return `${api}?${searchParams.toString()}`;
}

//Animating pills
const pills = (id, score) => {
  if(score === null) {
    console.log('error null');
    return;
  }

  const color = score >= 75 ? 'green' :
    score >= 25 ? 'yellow' : 'red';

  //Define specific SS rules
  let ss = document.getElementById('animationSS').sheet;
  let extend = 16.5*(score/100)-5.25;
  ss.insertRule(`@keyframes level-up-${id.toUpperCase()} {from {height:0rem;} to {height: ${extend}rem}}`, ss.cssRules.length);

  document.getElementById('res-'+id).classList.add(color,'animated');
  document.querySelector(`#res-${id} .score span`).innerHTML = score;
}

// Animating Mobile results
const gauge = (id, score) => {
    if(score === null)
      console.log('error null');
    else{
        color = score >= 75 ? 'green' :
            score >= 25 ? 'orange' :
                'red';
  
        //Add Score + Color + Animated
        document.getElementById('resM-'+id).classList.add(color);
        document.getElementById('sM-'+id).innerHTML = score;
        document.querySelector(`#resM-${id} .slime`).style.width = score+'%';
        document.getElementById('resM-'+id).classList.remove('hidden');
    }
}

// Cookies
// Create cookie
function setCookie() {
  var d = new Date(Date.now() + (90*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  var cookieLB = "labanqui.se_cookie=cookie-consent-labanqui.se;path=/; " + expires + "; Secure; sameSite=None";
  document.cookie = cookieLB;
  document.getElementById('cookie').style.display = "none";
}

// On loading of the page -> if there is already a cookie, doesn't display the message in order to create one
//                        -> if there is alredy a cookie for the font -> take the value of the cookie for the font
//                        -> if there is alredy a cookie for the font size -> take the value of the cookie for the font size
var d = new Date(Date.now() + (90*24*60*60*1000));
var expires = "expires="+ d.toUTCString();

window.onload = function ()
{
    if (document.cookie.match(/labanqui.se_cookie/))
      document.getElementById('cookie').style.display = "none";
    var cookieName = /cookie_labanqui.se_font/;
    var cookieName2 = /cookie_labanqui.se_size/;
    if (document.cookie.match(cookieName)){
      var styfont = getValueCookie(cookieName);
      if (styfont == "OpenDys")
        document.body.classList.add("opendys");
      }
    else{
      document.body.classList.remove("opendys");
    }
    if (document.cookie.match(cookieName2)){
      var stysize = getValueCookie(cookieName2);
      if (stysize != 100 && stysize >= 90 && stysize <= 200)
        document.documentElement.classList.add("fz"+stysize);
      else
      document.cookie = "cookie_labanqui.se_size=100; path=/; " + expires + "; Secure; sameSite=None";

    }
};

// Get the value of a cookie by giving its name
function getValueCookie(cname){
    tab = [];
    tab = document.cookie.split(/=|;/)
    for (i = 0; i < tab.length; i++){
      if (tab[i].match(cname)){
        return tab[i+1];
      }
    }
  }

// Change font -> dyslexia if poppins / poppins if dyslexia
function changeFont(){
    if (document.body.classList.contains("opendys")){
      document.body.classList.remove("opendys");
      document.cookie = "cookie_labanqui.se_font=Poppins, Verdana, sans-serif; path=/; " + expires + "; Secure; sameSite=None";  
    }
    else{
      document.body.classList.add("opendys");
      document.cookie = "cookie_labanqui.se_font=OpenDys; path=/; " + expires + "; Secure; sameSite=None";
    }
  }
  
  // Change size of the font
  var size = 100;
  function changeSizeFont(param){
    var size2 = getValueCookie(/cookie_labanqui.se_size/);
    size2 = parseInt(size2);
    var ht = document.documentElement.classList;
    if (size2 != size && size2 <= 200 && size2 >= 90)
      size = size2;
      
    else
      ht.remove("fz" + size);
  
    if (param == 1 && size < 200){
        if (size < 110){
          size += 10;
        }
        else if (size < 125){
          size += 15;
        }
        else if(size < 150)
          size += 25;
  
        else if(size < 200)
          size += 50;
      }
      else if (param == 0 && size > 90){
        if(size >= 200)
          size -= 50;
        else if(size >= 150)
          size -= 25;
        else if (size >= 125){
          size -= 15;
        }
        else if (size >= 110 || size < 110){
          size -= 10;
        } 
      }
      if (size != 100 && size >= 90 && size <= 200){
        ht.add("fz" + size);
        document.cookie = "cookie_labanqui.se_size=" + size +"; path=/; " + expires + "; Secure; sameSite=None";
      }
      else{
        document.cookie = "cookie_labanqui.se_size=100; path=/; " + expires + "; Secure; sameSite=None";
        size = 100;
      }
    }
  
  //delete the classes of the html (those put for the font and the font size)
  function initialVersion(){
  
    if (document.body.classList.contains("opendys")){
       document.body.classList.remove("opendys");
       document.cookie = "cookie_labanqui.se_font=Poppins, Verdana, sans-serif; path=/; + expires +; Secure; sameSite=None"; 
    }
    if (document.cookie.match(/cookie_labanqui.se_size/)){
      var size = getValueCookie(/cookie_labanqui.se_size/);
      if (size != 100 && size >= 90 && size <= 200)
        document.documentElement.classList.remove("fz"+size);
      
        document.cookie = "cookie_labanqui.se_size=100; path=/; " + expires + "; Secure; sameSite=None";
  
    }
  }

const score = () => {
  document.querySelector('#score .details').classList.toggle('hidden');
}