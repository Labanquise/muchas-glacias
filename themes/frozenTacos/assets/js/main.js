// Global Actions
let reboot = false;
const { display } = window.getComputedStyle(document.getElementById('res-ei'));
const mobile = display == 'none';

// Listeners
document.addEventListener('DOMContentLoaded', function() {
    const url2Test = document.getElementById('url2test');
    if (!!url2Test) {
    url2Test.addEventListener('keydown', event => {
        if(event.key === 'Enter') {
            document.getElementById('url2testButton').dispatchEvent(new Event('click'));
        }
    });
  }
});

// Toggling Class
const contentToggle = () => {
    document.getElementById('moreInfo').classList.toggle('hidden');
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
    //Waiting reinit
    document.getElementById('waiting').classList.remove('error');
    document.getElementById('waiting').classList.add('unvisible');
    document.getElementById('waiting').getElementsByClassName('txt')[0].innerHTML = "Veuillez patienter...";
    document.getElementById('waiting').getElementsByClassName('material-icons-outlined')[0].innerHTML = 'refresh';


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
}

// Launch Pepper Index
const getScores = async url => {
    //Launch the different test
    console.log('calling');

    try {
        const responses = await Promise.all([
            ecoindex(url),
            googleLH(url, 'performance', 'perf'),
            googleLH(url, 'accessibility', 'acc'),
            googleLH(url, 'best-practices', 'bp'),
            googleLH(url, 'seo', 'seo')
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
    const grade = getPepperGrade(score);

    document.getElementById('res-pepper').classList.add('done', grade);
    document.getElementById('s-pepper').innerHTML = score;
    console.log('Pepper Index :', score, 'et', grade);

    document.getElementById('waiting').classList.add('unvisible');
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

// Asking EcoIndex from MG
const ecoindex = async url2Test => {
    try {
        const response = await fetch('https://ecoindex.muchas-glacias.com', {
            method: 'POST',
            body: `{"URL":"${url2Test}"}`
        });
        const { Score } = await response.json();
        if (mobile)
            gauge('ei', parseInt(Score));
        else
            testTube('ei', parseInt(Score));
        //specific return for the promise.all
        return parseInt(Score);
    } catch (err) {
        console.log(err)
        throw err;
    }
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
            testTube(id, score);
        //specific return for the promise.all
        return score;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

// Seting up query for PageSpeed
const setUpQuery = (url, type) => {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const searchParams = new URLSearchParams({
        url: url,
        category: type,
        strategy: 'mobile',
        key: 'AIzaSyBDMfNxNncSxZkXrWob_o7pyqBRFGYt0GI',
    });
  
    return `${api}?${searchParams.toString()}`;
}

// Animating results
const testTube = (id, score) => {
    if(score === null) {
      console.log('error null');
      return;
    }
  
    const { color, colorHex } = score >= 75 ? {color: 'green', colorHex: '#1CAF9C'} :
        score >= 25 ? {color: 'orange', colorHex: '#F4AB00'} :
            { color: 'red', colorHex: '#C8222C'};
  
    //Define specific SS rules
    var ss = document.getElementById('animationSS').sheet;
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
        document.getElementById('res-'+id).classList.add(color,'mixDiff','animated');
    else
        document.getElementById('res-'+id).classList.add(color,'animated');
    document.getElementById('s-'+id).innerHTML = score;
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