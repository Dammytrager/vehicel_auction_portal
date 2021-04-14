
(function ($) {

    getVehicles();

    function getVehicles() {
        $.ajax({
            url: "../../backend/api/get-vehicles.php",
            success: base
        })
    }

    function render(template, target, object) {
        console.log(object)
        const rendered = Mustache.render(template, object);
        target.html(rendered);
    }

    function addVehicle() {
        const name = addVehicleForm.find('#name');
        const image = addVehicleForm.find('#image');
        if (name.val() && image[0].files.length) {
            let reader = new FileReader();
            reader.onloadend = function() {
                const data = {
                    name: name.val(),
                    img_url: reader.result
                };
                $.ajax({
                    url: "../../backend/api/add-vehicle.php",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    method: 'POST',
                    success: function (data, textStatus, jqXHR) {
                        vehicles.vehicles.unshift(JSON.parse(data));
                        renderVehicles();
                        addVehicleBtn.html('Add').attr('disabled', false);
                        addVehicleForm.trigger('reset');
                        $('#addModal').modal('hide');
                        if (textStatus === 'success') {
                            renderAlert('Vehicle added successfully')
                        }
                    },
                    error: function () {
                        addVehicleBtn.html('Add').attr('disabled', false);
                    }
                })
            }
            reader.readAsDataURL(image[0].files[0]);
        }
    }

    function base (data, textStatus, jqXHR) {
        vehicles = JSON.parse(data);
        const actions = [
            {
                label: 'View',
                target: '#base-modal',
                classType: 'view-btn'
            },
            {
                label: 'Comment',
                target: '#base-modal',
                classType: 'comment-btn'
            }
        ];
        ReactDOM.render(<Table data={vehicles} actions={actions}/>, document.querySelector('#vehicles'));
        ReactDOM.render(<NavBar actions={actions}/>, document.querySelector('#navbar'));
    }
})(jQuery)
