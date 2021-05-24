document.addEventListener('DOMContentLoaded', function () {
    alert ('coucou');
    fetch('http://localhost:5000/res')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));

});
//MIKHAEL
document.getElementById("inscription").addEventListener("submit", function(e) {
    var erreur;
    var inputs = this.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        console.log(inputs[i]);
        if (!inputs[i].value) {
            erreur = "Veuillez renseigner tous les champs";
        }
    }
    if (erreur) {
        e.preventDefault();
        document.getElementById("erreur").innerHTML = erreur;
        return false;
    } else {
        alert('Formulaire envoyé !');
    }


    var nom = document.getElementById("nom");
    var prenom = document.getElementById("email");
    var email = document.getElementById("email");
    var mdp = document.getElementById("mdp");

    if (!mdp.value) {
        erreur = "Veuillez renseigner un mot de passe";
    }
    if (!email.value) {
        erreur = "Veuillez renseigner un email";
    }
    if (!nom.value) {
        erreur = "Veuillez renseigner un nom";
    }
    if (!prenom.value) {
        erreur = "Veuillez renseigner un prénom";
    }
    console.log(erreur);

});
// const searchBtn = document.querySelector('#search-btn');
// const updateBtn = document.querySelector('#update-row-btn');

// document.querySelector('table tbody').addEventListener('click', function(event) {
//     if (event.target.className === 'delete-row-btn') {
//         deleteRowById(event.target.dataset.id);
//     }
//     if (event.target.className === 'edit-row-btn') {
//         handleEditRow(event.target.dataset.id);
//     }
// });
// searchBtn.onclick = function() {
//     const searchValue = document.querySelector('#search-input').value;
//
//     fetch('http://localhost:5000/search/' + searchValue)
//         .then(response => response.json())
//         .then(data => loadHTMLTable(data['data']));
// }
// updateBtn.onclick = function() {
//     const updateNameInput = document.querySelector('#update-name-input');
//
//     console.log(updateNameInput);
//
//     fetch('http://localhost:5000/update', {
//         method: 'PATCH',
//         headers: {
//             'Content-type' : 'application/json'
//         },
//         body: JSON.stringify({
//             id: updateNameInput.dataset.id,
//             name: updateNameInput.value
//         })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 location.reload();
//             }
//         })
// }
function loadHTMLTable(data) { //charge le tableau
    const table = document.querySelector('table tbody');
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = '';


    data.forEach(function ({idParc, nom,type,libelle,image,pays,description,note,site,publie}) {
        tableHtml +="<div class='col-lg-7'><img class='img-fluid rounded mb-4 mb-lg-0' src='../assets/images/'+${image} alt='...'/></div>"
        tableHtml +="<div class='col-lg-5'>"
        tableHtml +="<h1 class='font-weight-light'>${nom}</h1>"
        tableHtml +="<div class='info-site'>"
        tableHtml +="<h6 class = 'libelle'>${libelle}</h6>"
        tableHtml +="<img src='../assets/images/question.png' style='width: 5%;'>"
        tableHtml +="<a class='type'>${type}</a> <br>"
        tableHtml +="<img src='../assets/images/adresse1.png' style='width: 5%;'>"
        tableHtml +="<a class='pays'>${pays}</a> <br>"
        tableHtml +="<img src='../assets/images/website.png' style='width: 5%;'>"
        tableHtml +=" <a class='website' href=${site} >Site officiel</a><br>"
        tableHtml +="<img src='../assets/images/vote.png' style='width: 5%;'>"
        tableHtml +=" <a class='vote'> n votes</a></div>"


        tableHtml +=" <div class='rating'><!--"
        tableHtml +="--><a href='#5' title='Donner 5 étoiles'>☆</a><!--"
        tableHtml +="--><a href='#4' title='Donner 4 étoiles'>☆</a><!--"
        tableHtml +="--><a href='#3' title='Donner 3 étoiles'>☆</a><!--"
        tableHtml +="--><a href='#2' title='Donner 2 étoiles'>☆</a><!--"
        tableHtml +="--><a href='#2' title='Donner 2 étoiles'>☆</a><!--"
        tableHtml +="--><a href='#1' title='Donner 1 étoile'>☆</a>"
        tableHtml +="</div><br><br><p>${description}</p></div>"
        // tableHtml += '<tr>';
        // tableHtml += `<td>${idUser}</td>`;
        // tableHtml += `<td>${login}</td>`;
        // tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        // tableHtml += `<td><button class='delete-row-btn' data-id=${idUser}>Delete</td>`;
        // tableHtml += `<td><button class='edit-row-btn' data-id=${idUser}>Edit</td>`;
        // tableHtml += '</tr>';
    });

    table.innerHTML = tableHtml;
}
// //sur interaction du bouton ajouter un login
// const addBtn = document.querySelector('#add-name-btn');
//
// addBtn.onclick = function () {
//     const nameInput = document.querySelector('#name-input');
//     const name = nameInput.value;
//     nameInput.value = '';
//
//     fetch('http://localhost:5000/insert', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({ name : name})
//     })
//         .then(response => response.json())
//         .then(data => insertRowIntoTable(data['data']));
// }
// function insertRowIntoTable(data) {
//     console.log(data);
//     const table = document.querySelector('table tbody');
//     const isTableData = table.querySelector('.no-data');
//
//     let tableHtml = '<tr>';
//
//     for (var key in data) {
//         if (data.hasOwnProperty(key)) {
//             if (key === 'dateAdded') {
//                 data[key] = new Date(data[key]).toLocaleString();
//             }
//             tableHtml += `<td>${data[key]}</td>`;
//         }
//     }
//
//     tableHtml += `<td><button class='delete-row-btn' data-id=${data.id}>Delete</td>`;
//     tableHtml += `<td><button class='edit-row-btn' data-id=${data.id}>Edit</td>`;
//
//     tableHtml += '</tr>';
//
//     if (isTableData) {
//         table.innerHTML = tableHtml;
//     } else {
//         const newRow = table.insertRow();
//         newRow.innerHTML = tableHtml;
//     }
// }
// function deleteRowById(id) {
//     fetch('http://localhost:5000/delete/' + id, {
//         method: 'DELETE'
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 location.reload();
//             }
//         });
// }
// function handleEditRow(id) {
//     const updateSection = document.querySelector('#update-row');
//     updateSection.hidden = false;
//     document.querySelector('#update-name-input').dataset.id = id;
// }
