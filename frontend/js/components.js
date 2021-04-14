const NavBar = React.createClass({
    getInitialState() {
        const user = JSON.parse(localStorage.getItem('user'));

        return {
            count: 0,
            items: [
                {
                    path: 'login.html',
                    label: 'Login',
                    extraClass: 'login-link',
                    visible: !user
                },
                {
                    path: '#',
                    label: 'Add Vehicle',
                    extraClass: 'add-vehicle-link',
                    visible: user && (user.is_admin || user.is_ceo_cto),
                    target: "#base-modal"
                },
                {
                    path: '#',
                    label: 'Add User',
                    extraClass: 'add-user-link',
                    visible: user && (user.is_admin || user.is_ceo_cto),
                    target: "#base-modal"
                },
                {
                    path: '#',
                    label: 'Logout',
                    extraClass: 'logout-link',
                    visible: !!user
                }
            ]
        }
    },

    propTypes: {
        actions: React.PropTypes.any
    },

    componentDidMount() {
        const that = this;
        $('.login-link').on('click', function () {
            location.href = 'login.html';
        });

        $('.logout-link').on('click', function () {
            localStorage.removeItem('user');
            location.href = 'login.html';
        });

        $('.add-vehicle-link').on('click', function () {
            that.setState(prevState => {
                return {...prevState, count: that.state.count + 1}
            });
            $('.add-vehicle-form').trigger('reset');
            ReactDOM.render(
                <AddVehicleModal actions={that.props.actions} count={that.state.count} />,
                document.querySelector('#base-modal-dialog')
            );
        })

        $('.add-user-link').on('click', function () {
            that.setState(prevState => {
                return {...prevState, count: that.state.count + 1}
            });
            $('.add-user-form').trigger('reset');
            ReactDOM.render(
                <AddUserModal count={that.state.count} />,
                document.querySelector('#base-modal-dialog')
            );
        })
    },

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light">
                <a className="navbar-brand" href="#">Vehicle Auction Portal</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        {
                            this.state.items.map((item, index) => {
                                return <li className="nav-item" key={index}>
                                    {
                                        item.visible ?
                                            <a
                                                className={`nav-link text-white ${item.extraClass}`}
                                                href={item.path}
                                                data-toggle="modal"
                                                data-target={item.target}
                                            >
                                                {item.label}
                                            </a>
                                            :
                                            ''
                                    }
                                </li>
                            })
                        }

                    </ul>
                </div>
            </nav>
        );
    }
});

const SideBar = React.createClass({
    propTypes: {
        path: React.PropTypes.string
    },

    getInitialState() {
        const user = JSON.parse(localStorage.getItem('user'));

        return {
            items: [
                {
                    path: 'index.html',
                    label: 'All Vehicles',
                    activeClass: this.props.path === '' || this.props.path === 'index.html' ? 'active' : '',
                    visible: true
                },
                {
                    path: 'featured.html',
                    label: 'Featured Vehicles',
                    activeClass: this.props.path === 'featured.html' ? 'active' : '',
                    visible: true
                },
                {
                    path: 'active.html',
                    label: 'Active Vehicles',
                    activeClass: this.props.path === 'active.html' ? 'active' : '',
                    visible: true
                },
                {
                    path: 'sold-out.html',
                    label: 'Sold out Vehicles',
                    activeClass: this.props.path === 'sold-out.html' ? 'active' : '',
                    visible: true
                },
                {
                    path: 'bids.html',
                    label: 'Bids',
                    activeClass: this.props.path === 'bids.html' ? 'active' : '',
                    visible: user && !!(user.is_ceo_cto || user.is_admin)
                },
                {
                    path: 'registered-users.html',
                    label: 'Registered Users',
                    activeClass: this.props.path === 'registered-users.html' ? 'active' : '',
                    visible: user && !!(user.is_ceo_cto || user.is_admin)
                },
                {
                    path: 'admin-users.html',
                    label: 'Admin Users',
                    activeClass: this.props.path === 'admin-users.html' ? 'active' : '',
                    visible: user && !!user.is_ceo_cto
                }
            ]
        }
    },

    render() {
        return (
            <div className="list-group list-group-flush bg-light-dark mb-4">
                {
                    this.state.items.map((item, index) => {
                        return (
                          <span key={index}>
                              {
                                  item.visible &&
                                  <a

                                      href={item.path}
                                      className={`list-group-item list-group-item-action text-white bg-transparent ${item.activeClass}`}>
                                      {item.label}
                                  </a>
                              }
                          </span>
                        );
                    })
                }
            </div>
        );
    }
});

const Table = React.createClass({
    propTypes: {
        data: React.PropTypes.any,
        actions: React.PropTypes.any,
        view: React.PropTypes.string
    },

    componentDidMount() {
        const that = this;
        $('.table').DataTable({
            searching: false,
            lengthChange: false
        });

        $('.view-btn').on('click', function () {
            const data = $(this).data('data');
            ReactDOM.render(
                <ViewVehicleModal
                    title={data.name}
                    image={data.img_url}
                    votes={data.votes}
                    username={data.username || null}
                    comments={data.comments} />,
                document.querySelector('#base-modal-dialog')
            );
        });

        $('.comment-btn').on('click', function () {
            const data = $(this).data('data');
            ReactDOM.render(
                <CommentModal id={data.id} actions={that.props.actions} />,
                document.querySelector('#base-modal-dialog')
            );

            $('.add-comment-form').trigger('reset')
        });

        $('.bid-btn').on('click', function () {
            const user = localStorage.getItem('user');
            if (!user) {
              sessionStorage.setItem('redirect', 'featured.html');
              location.href = 'login.html';
            } else {
              const data = $(this).data('data');
              ReactDOM.render(
                  <BidModal id={data.id} actions={that.props.actions} />,
                  document.querySelector('#base-modal-dialog')
              );

              $('.add-bid-form').trigger('reset')
            }
        });

        $('.vote-btn').on('click', function () {
            const data = $(this).data('data');
            ReactDOM.render(
                <VoteModal id={data.id} actions={that.props.actions} />,
                document.querySelector('#base-modal-dialog')
            );
        });
    },

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped table-dark nm-size rounded">
                    <thead>
                    <tr className="text-orange">
                        <th scope="col">S/N</th>
                        <th scope="col">Name</th>
                        <th scope="col">Votes</th>
                        <th scope="col">Date Created</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.name}</td>
                                    <td>{item.votes}</td>
                                    <td>{item.created_at}</td>
                                    <td><Actions data={item} items={this.props.actions} /></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <BaseModal />
            </div>
        );
    }
});

const UsersTable = React.createClass({
    propTypes: {
        data: React.PropTypes.any
    },

    componentDidMount() {
        $('.table').DataTable({
            searching: false,
            lengthChange: false
        });
    },

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped table-dark nm-size rounded">
                    <thead>
                    <tr className="text-orange">
                        <th scope="col">S/N</th>
                        <th scope="col">Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.username}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <BaseModal />
            </div>
        );
    }
});

const BidsTable = React.createClass({
    propTypes: {
        data: React.PropTypes.any
    },

    componentDidMount() {
        $('.table').DataTable({
            searching: false,
            lengthChange: false
        });
    },

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped table-dark nm-size rounded">
                    <thead>
                    <tr className="text-orange">
                        <th scope="col">S/N</th>
                        <th scope="col">Vehicle</th>
                        <th scope="col">User</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date Bidded</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.name}</td>
                                    <td>{item.username}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.created_at}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <BaseModal />
            </div>
        );
    }
});

const Actions = React.createClass({

    propTypes: {
        items: React.PropTypes.any,
        data: React.PropTypes.any
    },

    componentDidMount() {
    },

    render() {
        return (
            <div className="btn-group">
                <button type="button" className="btn btn-sm btn-light rounded dropdown-btn" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                    Action
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                    {
                        this.props.items.map((item, index) => {
                            return (
                                <button
                                    key={index}
                                    className={`dropdown-item ${item.classType}`}
                                    data-data={JSON.stringify(this.props.data)}
                                    data-toggle="modal"
                                    data-target={item.target}
                                    type="button">
                                        {item.label}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
});

const BaseModal = React.createClass({
    render() {
        return (
            <div className="modal fade" id="base-modal" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document" id="base-modal-dialog">
                </div>
            </div>
        );
    }
});

const ViewVehicleModal = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        image: React.PropTypes.string,
        votes: React.PropTypes.any,
        comments: React.PropTypes.any,
        username: React.PropTypes.any
    },

    render() {
        return (
            <div className="modal-content" >
                <div className="modal-header">
                    <h5 className="modal-title">{this.props.title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div>
                        <img src={this.props.image} className="img-responsive mx-auto" style={{width: '100%'}} />
                    </div>
                    <div className="my-4">
                        Total Votes:
                        <span className="text-success font-weight-bold ml-2">{this.props.votes}</span>
                    </div>

                    <div className="">
                        {
                            !!this.props.username &&
                            <span className="">Sold to - {this.props.username}</span>
                        }
                    </div>

                    <div className="my-4">
                        <div className="font-weight-bold mb-2">Comments</div>
                        {
                            this.props.comments && this.props.comments.length ?
                                this.props.comments.map((item, index) => {
                                    return <div key={index} className="p-2 mb-1 comment-card">{item}</div>
                                }) :
                                <span className="text-muted">No comments Available</span>
                        }
                    </div>
                </div>
            </div>
        );
    }
});

const CommentModal = React.createClass({
    propTypes: {
        id: React.PropTypes.any,
        actions: React.PropTypes.any
    },

    getInitialState() {
        return {
            saveBtnText: 'Save',
            btnDisabled: true,
            comment: '',
            disableText: false
        }
    },

    handleChangeComment(e) {
        const comment = e.currentTarget.value;
        const btnDisabled = !comment;

        this.setState(prevState => {
            return {...prevState, comment, btnDisabled};
        })
    },

    async handleComment() {
        this.setState(prevState => {
            return {saveBtnText: 'Saving', btnDisabled: true, disableText: true}
        });

        addComment(this.props.id, this.state.comment, this.props.actions);
    },

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return {...prevState, comment: '', btnDisabled: true, saveBtnText: 'Save', disableText: false}
        })
    },

    render() {
        return (
            <div className="modal-content" >
                <div className="modal-header">
                    <h5 className="modal-title">Add Comment</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="modal-body">
                    <form className="add-comment-form">
                        <div className="form-group">
                            <label htmlFor="name">Comment</label>
                            <textarea
                                disabled={this.state.disableText}
                                onChange={this.handleChangeComment}
                                className="form-control"
                                id="comment-field"
                                aria-describedby="comment"
                                rows="4">
                            </textarea>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-standard btn-light btn-sm" data-dismiss="modal">Close</button>
                    <button
                        type="button"
                        disabled={this.state.btnDisabled}
                        className="btn btn-standard btn-orange btn-sm"
                        id="add-comment"
                        onClick={this.handleComment}>
                        {this.state.saveBtnText}
                    </button>
                </div>
            </div>
        );
    }
});

const BidModal = React.createClass({
    propTypes: {
        id: React.PropTypes.any,
        actions: React.PropTypes.any
    },

    getInitialState() {
        return {
            saveBtnText: 'Bid',
            btnDisabled: true,
            amount: '',
            disableText: false
        }
    },

    handleChangeBid(e) {
        const amount = e.currentTarget.value;
        const btnDisabled = !amount;

        this.setState(prevState => {
            return {...prevState, amount, btnDisabled};
        })
    },

    async handleBid() {
        this.setState(prevState => {
            return {saveBtnText: 'Bidding', btnDisabled: true, disableText: true}
        });

        const user = JSON.parse(localStorage.getItem('user'))

        const data = {
            vehicle_id: this.props.id,
            amount: this.state.amount,
            user_id: user.id
        }

        bidVehicle(data, this.props.actions);
    },

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return {...prevState, amount: '', btnDisabled: true, saveBtnText: 'Bid', disableText: false}
        })
    },

    render() {
        return (
            <div className="modal-content" >
                <div className="modal-header">
                    <h5 className="modal-title">Bid</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="modal-body">
                    <form className="add-bid-form">
                        <div className="form-group">
                            <label htmlFor="name">Bid</label>
                            <input
                                type="number"
                                min={0}
                                disabled={this.state.disableText}
                                onChange={this.handleChangeBid}
                                className="form-control"
                                id="bid-field"
                                aria-describedby="bid" />
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-standard btn-light btn-sm" data-dismiss="modal">Close</button>
                    <button
                        type="button"
                        disabled={this.state.btnDisabled}
                        className="btn btn-standard btn-orange btn-sm"
                        id="add-bid"
                        onClick={this.handleBid}>
                        {this.state.saveBtnText}
                    </button>
                </div>
            </div>
        );
    }
});

const VoteModal = React.createClass({
    propTypes: {
        id: React.PropTypes.any,
        actions: React.PropTypes.any
    },

    getInitialState() {
        return {
            saveBtnText: 'Vote',
            btnDisabled: false
        }
    },

    async handleVote() {
        this.setState(prevState => {
            return {saveBtnText: 'Voting', btnDisabled: true}
        });

        voteVehicle(this.props.id, this.props.actions);
    },

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return {...prevState, btnDisabled: false, saveBtnText: 'Vote'}
        })
    },

    render() {
        return (
            <div className="modal-content" >
                <div className="modal-header">
                    <h5 className="modal-title">Vote</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="modal-body">
                    <div>Are you sure you want to vote for this car</div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-standard btn-light btn-sm" data-dismiss="modal">Close</button>
                    <button
                        type="button"
                        disabled={this.state.btnDisabled}
                        className="btn btn-standard btn-orange btn-sm"
                        id="add-comment"
                        onClick={this.handleVote}>
                        {this.state.saveBtnText}
                    </button>
                </div>
            </div>
        );
    }
});

const AddVehicleModal = React.createClass({
    propTypes: {
        actions: React.PropTypes.any,
        count: React.PropTypes.any
    },

    getInitialState() {
        return {
            saveBtnText: 'Add',
            btnDisabled: true,
            image: null,
            name: ''
        }
    },

    handleChangeName(e) {
        const name = e.currentTarget.value;
        const btnDisabled = !name || !this.state.image;

        this.setState(prevState => {
            return {...prevState, name, btnDisabled};
        })
    },

    handleChangeImage(e) {
        const image = e.currentTarget.files[0];
        console.log(e.currentTarget.files[0]);
        const btnDisabled = !image || !this.state.name;

        this.setState(prevState => {
            return {...prevState, image, btnDisabled};
        })
    },

    async handleAdd() {
        this.setState(prevState => {
            return {saveBtnText: 'Adding', btnDisabled: true}
        });

        addVehicle(this.state.name, this.state.image, this.props.actions);
    },

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return {...prevState, saveBtnText: 'Add', btnDisabled: true, image: null, name: ''}
        })
    },

    render() {
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add Vehicle</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form className="add-vehicle-form">
                        <div className="form-group">
                            <label htmlFor="name">Vehicle Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                aria-describedby="name"
                                placeholder="Enter name"
                                onChange={this.handleChangeName}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Image</label>
                            <input
                                type="file"
                                className="form-control"
                                id="image"
                                accept="image/*"
                                onChange={this.handleChangeImage}
                            />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-standard btn-light btn-sm" data-dismiss="modal">Close</button>
                    <button
                        type="button"
                        disabled={this.state.btnDisabled}
                        className="btn btn-standard btn-orange btn-sm"
                        id="add-comment"
                        onClick={this.handleAdd}>
                        {this.state.saveBtnText}
                    </button>
                </div>
            </div>
        );
    }
});

const AddUserModal = React.createClass({
    propTypes: {
        count: React.PropTypes.any
    },

    getInitialState() {
        return {
            saveBtnText: 'Add',
            role: 'is_admin',
            password: null,
            username: '',
            btnDisabled: true
        }
    },

    handleChangeUsername(e) {
        const username = e.currentTarget.value;
        const btnDisabled = !username || !this.state.role || !this.state.password;

        this.setState(prevState => {
            return {...prevState, username, btnDisabled};
        })
    },

    handleChangePassword(e) {
        const password = e.currentTarget.value;
        const btnDisabled = !password || !this.state.role || !this.state.username;

        this.setState(prevState => {
            return {...prevState, password, btnDisabled};
        })
    },

    handleChangeRole(e) {
        const role = e.currentTarget.value;
        const btnDisabled = !role || !this.state.username || !this.state.password;

        this.setState(prevState => {
            return {...prevState, role, btnDisabled};
        })
    },

    async handleAdd() {
        this.setState(prevState => {
            return {saveBtnText: 'Adding', btnDisabled: true}
        });

        addUser(this.state.username, this.state.password, this.state.role);
    },

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return {...prevState,  saveBtnText: 'Add', role: 'is_admin', password: null, username: '', btnDisabled: true}
        })
    },

    render() {
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add User</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form className="add-user-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                aria-describedby="username"
                                placeholder="Enter username"
                                onChange={this.handleChangeUsername}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                onChange={this.handleChangePassword}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                className="form-control"
                                id="role"
                                onChange={this.handleChangeRole}>
                                <option value="is_admin">Admin</option>
                                <option value="is_ceo_cto">CEO/CTO</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-standard btn-light btn-sm" data-dismiss="modal">Close</button>
                    <button
                        type="button"
                        disabled={this.state.btnDisabled}
                        className="btn btn-standard btn-orange btn-sm"
                        id="add-user"
                        onClick={this.handleAdd}>
                        {this.state.saveBtnText}
                    </button>
                </div>
            </div>
        );
    }
});

const path = window.location.href.split('/').pop();
const domContainer = document.querySelector('#sidebar');
ReactDOM.render(<SideBar path={path} />, domContainer);
