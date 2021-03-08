// Listeners
if (document.readyState === 'loading') {  // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', getData);
} else {  // `DOMContentLoaded` has already fired
    getData();
}



// Saving in BDD
async function getData(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')

    try {
        const response = await fetch(`https://api.muchas-glacias.com/results-logs/${id}`, {
            method: 'GET',
        });
        const res = await response.json();
        console.log(res);
        populate(res, id);
    } catch (err) {
        console.log(err)
        throw err;
    }
}

// Populate data
const populate = (res,id) => {

    const date = getDate(res['datehour']);
    document.getElementById('url').innerHTML = res['url'];
    document.getElementById('date').innerHTML = date;


    gauge('ei',res['eco-index']);
    gauge('perf',res['lighthouse-perf']);
    gauge('acc',res['lighthouse-accessibility']);
    gauge('bp',res['lighthouse-best-practices']);
    gauge('seo',res['lighthouse-seo']);

    document.getElementById('res-pepper').classList.add('done', res['pepper-index']);
    document.getElementById('s-pepper').innerHTML = res['pepper-index-score'];
    document.getElementById('link2Share').setAttribute('href', `/score/?id=${id}`);

}

const getDate = date => {
    date = date.toString();
    const readableDate = date.substring(6,8)+'/'+date.substring(4,6)+'/'+date.substring(0,4)+' à '+date.substring(8,10)+'H';
    return readableDate;
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
        document.getElementById('res-'+id).classList.add(color);
        document.getElementById('s-'+id).innerHTML = score;
        document.querySelector(`#res-${id} .slime`).style.width = score+'%';
    }
}