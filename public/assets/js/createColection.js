

document.getElementById('createCollection').addEventListener('click', function () {
    const collectionName = document.getElementById('collectionNameInput').value.trim();
    const year = document.getElementById('yearInput').value.trim();

    if (collectionName && year) {
        $.ajax({
            type: 'POST',
            url: '/create-collection',
            data: JSON.stringify({ collectionName: `${collectionName}_${year}` }),
            contentType: 'application/json',
            success: function (response) {
                console.log(response.message);
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error(`Error al crear la colección: ${xhr.responseJSON.error}`);
            }
        });
    } else {
        console.error('Por favor, completa todos los campos');
    }
});