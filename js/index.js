// Welcome to HELL
// Please enjoy your stay, and do not forget to apply sunscreen when visiting our wonderfully cursed land

const recetteEndpoint = 'http://localhost:3000/recipes';

const form = document.forms['ajouter-recette'];
const editForm = document.forms['edit-recette'];
const formIngredients = [];
let editRecetteID = -1; // I just want to SLEEP RIGHT THE [expletive] NOW OK.

const onFormSubmit = event =>
{
    event.preventDefault();
    let data = {};

    // TODO: ID is not transformed into an int.
    for (element of form.elements)
    {
        if (element.name)
            data[element.name] = element.value;
    }

    data.ingredients = formIngredients;

    const request = new XMLHttpRequest();
    request.open('POST', recetteEndpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = () =>
    {
        if (request.readyState == XMLHttpRequest.DONE)
            updateRecetteList();
    }
    request.send(JSON.stringify(data));
};

const onEditFormSubmit = event => // FIXME: ID !!! I GOT YOU YOUR ID, HAPPY NOW ?
{
    event.preventDefault();
    let data = {};

    // TODO: ID is not transformed into an int.
    for (element of editForm.elements)
    {
        if (element.name)
            data[element.name] = element.value;
    }

    data.ingredients = formIngredients;

    const request = new XMLHttpRequest();
    request.open('PUT', `${recetteEndpoint}/${editRecetteID}`, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = () =>
    {
        if (request.readyState == XMLHttpRequest.DONE)
            updateRecetteList();
    }
    request.send(JSON.stringify(data));
};

const setSidePanelView = view =>
{
    const sidePanel = document.getElementById('side-panel');
    const viewNode = [...sidePanel.childNodes].filter(node => node.id === view)[0];

    sidePanel.childNodes.forEach(node => node.hidden = true);

    if (viewNode)
        viewNode.hidden = false;
}

const addRecette = event =>
{
    event.preventDefault();
    setSidePanelView('add-recette-panel');

    const table = document.querySelector('#form-ingredient-list tbody');
    table.innerHTML = '';

    formIngredients.splice(0); // Clear ingredients.

    const addEntry = () =>
    {
        const row = document.createElement('tr');
        table.appendChild(row);

        const name = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        name.appendChild(nameInput);
        row.appendChild(name);
        
        const quantity = document.createElement('td');
        const quantityInput = document.createElement('input');
        quantityInput.setAttribute('type', 'number');
        quantityInput.setAttribute('min', 1);
        quantity.appendChild(quantityInput);
        row.appendChild(quantity);
        
        const unit = document.createElement('td');
        const unitInput = document.createElement('input');
        unitInput.setAttribute('type', 'text');
        unit.appendChild(unitInput);
        row.appendChild(unit);

        const actions = document.createElement('td');
        const validateAction = document.createElement('button');
        validateAction.classList.add('success');
        validateAction.innerHTML = '✔️';
        validateAction.onclick = event =>
        {
            event.preventDefault();
            actions.removeChild(validateAction);

            let ingredient =
            {
                name: nameInput.value,
                quantity: parseInt(quantityInput.value),
                unit: unitInput.value,
            };

            //console.log(ingredient);
            const index = formIngredients.push(ingredient) - 1; // No validation :D

            const removeAction = document.createElement('button');
            removeAction.classList.add('danger');
            removeAction.innerHTML = '🗑️';
            removeAction.onclick = event =>
            {
                event.preventDefault();
                table.removeChild(row);
                formIngredients.splice(index, 1);
            };
            actions.appendChild(removeAction);

            addEntry();
        };
        actions.appendChild(validateAction);

        row.appendChild(actions);
    }

    addEntry();
}

const editRecette = recetteID => fetch(`${recetteEndpoint}/${recetteID}`).then(response => response.json()).then(recette =>
{
    setSidePanelView('edit-recette-panel');

    editRecetteID = recetteID;
    const table = document.querySelector('#edit-form-ingredient-list tbody');
    table.innerHTML = '';

    editForm.name.value = recette.name;
    editForm.description.value = recette.description;
    editForm.link.value = recette.link;
    editForm.nb_part.value = recette.nb_part;

    formIngredients.splice(0); // Clear ingredients.

    const addEntry = (ingredient = {}) =>
    {
        const row = document.createElement('tr');
        table.appendChild(row);

        const name = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.value = ingredient.name;
        name.appendChild(nameInput);
        row.appendChild(name);
        
        const quantity = document.createElement('td');
        const quantityInput = document.createElement('input');
        quantityInput.setAttribute('type', 'number');
        quantityInput.setAttribute('min', 1);
        quantityInput.value = ingredient.quantity;
        quantity.appendChild(quantityInput);
        row.appendChild(quantity);
        
        const unit = document.createElement('td');
        const unitInput = document.createElement('input');
        unitInput.setAttribute('type', 'text');
        unitInput.value = ingredient.unit;
        unit.appendChild(unitInput);
        row.appendChild(unit);

        const actions = document.createElement('td');
        const validateAction = document.createElement('button');
        validateAction.classList.add('success');
        validateAction.innerHTML = '✔️';
        validateAction.onclick = event =>
        {
            event.preventDefault();
            actions.removeChild(validateAction);

            let ingredient =
            {
                name: nameInput.value,
                quantity: parseInt(quantityInput.value),
                unit: unitInput.value,
            };

            //console.log(ingredient);
            const index = formIngredients.push(ingredient) - 1; // No validation :D

            const removeAction = document.createElement('button');
            removeAction.classList.add('danger');
            removeAction.innerHTML = '🗑️';
            removeAction.onclick = event =>
            {
                event.preventDefault();
                table.removeChild(row);
                formIngredients.splice(index, 1);
            };
            actions.appendChild(removeAction);

            addEntry();
        };
        actions.appendChild(validateAction);

        row.appendChild(actions);
    }

    recette.ingredients.forEach(addEntry);
});

const updateRecetteList = event =>
{
    if (event)
        event.preventDefault();

    let table = document.getElementById("recette-list");

    const request = new XMLHttpRequest();
    request.open('GET', recetteEndpoint, true);
    request.responseType = 'json';
    request.onreadystatechange = () =>
    {
        if (request.readyState != XMLHttpRequest.DONE)
            return;

        const recettes = request.response; // Fetch recettes.
        table.innerHTML = ''; // Clear table rows.

        // Insert rows.
        for (recette of recettes)
        {
            table.innerHTML += `
                <tr>
                <td><a href="${recette.link}">${recette.name}</a></td>
                <td>${recette.description}</td>
                <td>${recette.nb_part}</td>
                <td>
                    <button onclick="showRecetteIngredients(${recette.id})">Ingrédients</button>
                    <button class="warning" onclick="editRecette(${recette.id})">✏️</button>
                    <button class="danger" onclick="deleteRecette(${recette.id})">🗑️</button>
                </td>
                </tr>
            `;
        }
    };
    request.send();
}

const deleteRecette = recetteID =>
{
    const request = new XMLHttpRequest();
    request.open('DELETE', `${recetteEndpoint}/${recetteID}`, true);
    request.onreadystatechange = () =>
    {
        if (request.readyState == XMLHttpRequest.DONE)
            updateRecetteList();
    };
    request.send();
};

const showRecetteIngredients = recetteID =>
{
    const request = new XMLHttpRequest();
    request.open('GET', `${recetteEndpoint}/${recetteID}`, true);
    request.responseType = 'json';
    request.onreadystatechange = () =>
    {
        if (request.readyState != XMLHttpRequest.DONE)
            return;

        setSidePanelView('ingredient-list');

        const ingredients = request.response.ingredients;
        let info = document.getElementById("recette-info");

        if (ingredients.length == 0)
        {
            info.innerText = "Aucun ingrédient.";
            return;
        }

        info.innerHTML = '';

        for (ingredient of ingredients) // 'of' iterates an iterable, whereas 'in' iterates an object's attributes.
        {
            info.innerHTML += `<li>${ingredient.name}: ${ingredient.quantity} ${ingredient.unit}</li>`;
        }
    };
    
    request.send();
};

form.addEventListener('submit', onFormSubmit);
editForm.addEventListener('submit', onEditFormSubmit);
document.getElementById('add-recette').onclick = addRecette;
document.getElementById('update-recette-list').onclick = updateRecetteList;

updateRecetteList();

// I wish to thank you, personally, for visiting HELL
// May I offer you a nice cup of bleach to cancel out the grotesque circus you've just witnessed ?
