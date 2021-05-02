// This file holds all the helper functions that are used to interact with the backend

/**
 * Adds a comment on a vehicle
 * @param id
 * @param comment
 * @param actions
 */
function addComment(id, comment, actions) {
    $.ajax({
        url: "../../backend/api/add-comment.php",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({id, comment}),
        method: 'POST',
        success: function (data, textStatus, jqXHR) {
            let updatedVehicle = vehicles.find(item => item.id === id);
            let index = vehicles.indexOf(updatedVehicle);
            updatedVehicle.comments.push(comment);
            vehicles[index] = updatedVehicle;
            $('#base-modal').modal('hide');
            $('.modal-backdrop').remove();
            $('#vehicles').empty();
            toastr.success('Comment added sucessfully');
            ReactDOM.render(<Table data={vehicles} actions={actions} />, document.querySelector('#vehicles'));
        }
    })
}

/**
 * Vote on a vehicle
 * @param id
 * @param actions
 */
function voteVehicle(id, actions) {
    grecaptcha.ready(function() { // Google recaptcha to prevent bots from voting
        grecaptcha.execute('6LfZpakaAAAAAFVdIyUHg8m3FYljxa3wiJPd9GS4', {action: 'submit'}).then(function(token) {

            $.ajax({
                url: "../../backend/api/vote.php",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({id, token}),
                method: 'POST',
                success: function (data, textStatus, jqXHR) {
                    let updatedVehicle = vehicles.find(item => item.id === id);
                    let index = vehicles.indexOf(updatedVehicle);
                    updatedVehicle.votes = parseInt(updatedVehicle.votes) + 1;
                    vehicles[index] = updatedVehicle;
                    $('#base-modal').modal('hide');
                    $('.modal-backdrop').remove();
                    $('#vehicles').empty();
                    toastr.success('Vote registered successfully');
                    ReactDOM.render(<Table data={vehicles} actions={actions} />, document.querySelector('#vehicles'));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#base-modal').modal('hide');
                    $('.modal-backdrop').remove();
                    toastr.error('Vote not registered')
                }
            })
        });
    });
}


/**
 * Bid on a vehicle
 * @param data
 * @param actions
 */
function bidVehicle(data, actions) {
  $.ajax({
      url: "../../backend/api/bid.php",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      method: 'POST',
      success: function (data, textStatus, jqXHR) {
          let updatedVehicle = vehicles.find(item => item.id === data.vehicle_id);
          $('#base-modal').modal('hide');
          $('.modal-backdrop').remove();
          $('#vehicles').empty();
          toastr.success('Bid Submitted successfully');
          ReactDOM.render(<Table data={vehicles} actions={actions} />, document.querySelector('#vehicles'));
      }
  })
}


/**
 * Adds a vehicle
 * @param name
 * @param image
 * @param actions
 */
function addVehicle(name, image, actions) {
    let reader = new FileReader();
    reader.onloadend = function() {
        const data = {
            name: name,
            img_url: reader.result
        };
        $.ajax({
            url: "../../backend/api/add-vehicle.php",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            method: 'POST',
            success: function (data, textStatus, jqXHR) {
                $('#base-modal').modal('hide');
                $('.modal-backdrop').remove();
                toastr.success('Vehicle Added successfully');

                if (path === 'active.html' || path === 'index.html' || path === '') {
                    vehicles.unshift(JSON.parse(data));
                    $('#vehicles').empty();
                    ReactDOM.render(<Table data={vehicles} actions={actions} />, document.querySelector('#vehicles'));
                }
            }
        })
    }
    reader.readAsDataURL(image);
}


/**
 * Adds a user
 * @param username
 * @param password
 * @param role
 */
function addUser(username, password, role) {
    const data = {username, password, [role]: 1};

    $.ajax({
        url: "../../backend/api/create-user.php",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        method: 'POST',
        success: function (data, textStatus, jqXHR) {
            $('#base-modal').modal('hide');
            $('.modal-backdrop').remove();
            toastr.success('User Added successfully');

            if (path === 'admin-users.html') {
                users.push({username});
                $('#users').empty();
                ReactDOM.render(<UsersTable data={users} />, document.querySelector('#users'));
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (errorThrown === 'Bad Request') {
                $('#base-modal').modal('hide');
                $('.modal-backdrop').remove();
                toastr.error('User Exists');
            }
            console.log(errorThrown)
            console.log(textStatus)
        }
    })
}
