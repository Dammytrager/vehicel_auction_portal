(function ($) {

    const user = JSON.parse(localStorage.getItem('user'));

    getFeaturedVehicles();

    function getFeaturedVehicles() {
        $.ajax({
            url: "../../backend/api/featured-vehicles.php",
            success: base
        })
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

        if (!user || (user && !user.is_admin)) {
          actions.push({
                label: 'Bid',
                target: '#base-modal',
                classType: 'bid-btn'
            })
        }

        ReactDOM.render(<Table data={vehicles} actions={actions} />, document.querySelector('#vehicles'));
        ReactDOM.render(<NavBar actions={actions} />, document.querySelector('#navbar'));
    }

})(jQuery)
