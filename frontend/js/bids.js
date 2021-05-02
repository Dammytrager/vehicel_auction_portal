/**
 * This function is run when the bids page loads
 */
(function ($) {

    getBids();

    /**
     * Gets the bids from the backend
     */
    function getBids() {
        $.ajax({
            url: "../../backend/api/get-bids.php",
            success: base
        })
    }

    /**
     * This function runs when the bids are successfully fetched from the backend
     * It renders the bids in a table and also renders the navbar
     * @param data
     * @param textStatus
     * @param jqXHR
     */
    function base (data, textStatus, jqXHR) {
        const bids = JSON.parse(data);
        ReactDOM.render(<BidsTable data={bids} />, document.querySelector('#vehicles'));
        ReactDOM.render(<NavBar />, document.querySelector('#navbar'));
    }

})(jQuery)
