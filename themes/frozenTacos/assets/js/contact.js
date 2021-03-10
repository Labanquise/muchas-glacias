// Contact form
const sendContact = async () => {
    const formData = new FormData(document.getElementById('contact'));
    let data = new Array;
    for (var pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }
    try {
        const rest = await apiContact(data);
        alert("Votre Message a bien été envoyé 🎉");
    } catch (err) {
        throw err;
    }
}

// Send email to contact@labanqui.se
const apiContact = async (data) => {
    try {
        const response = await fetch('https://contact.labanqui.se/', {
            method: 'POST',
            body: `{"origin":"MUCHAS-GLACIAS", "tel":"${data['tel']}", "email":"${data['email']}", "recontact":"${data['recontact']}", "message":"${encodeURI(data['message'])}"}`
        });
        return response.text();
    } catch (err) {
        throw err;
    }
}

// Show recontact
const showR = state => {
    if (state)
        document.getElementsByClassName('grid')[0].classList.remove('hidden');
    else
        document.getElementsByClassName('grid')[0].classList.add('hidden');
}