let vehicles = [];

let users = [];

// Assigns the cars with the highest bid amount to respective users at the end of the week
$.ajax({
    url: "../../backend/api/set-bid.php",
    contentType: "application/json; charset=utf-8",
    method: 'GET',
    success: function (data, textStatus, jqXHR) {
    }
})
