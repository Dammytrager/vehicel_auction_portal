(function ($) {

    getBids();

    function getBids() {
        $.ajax({
            url: "../../backend/api/get-bids.php",
            success: base
        })
    }

    function base (data, textStatus, jqXHR) {
        const bids = JSON.parse(data);
        ReactDOM.render(<BidsTable data={bids} />, document.querySelector('#vehicles'));
        ReactDOM.render(<NavBar />, document.querySelector('#navbar'));
    }

})(jQuery)
