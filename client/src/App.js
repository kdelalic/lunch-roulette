import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './App.css';

const BASE_SERVER_URL = 'http://localhost:3001';
const LIMIT = 50;
const RESTAURANT_RESET = 900;

class App extends Component {
    constructor(props) {
        super(props);

        // window.localStorage.clear();

        const prevOffset = parseInt(
            window.localStorage.getItem('prevOffset'),
            10
        );
        const prevRestaurants = JSON.parse(
            window.localStorage.getItem('prevRestaurants')
        );

        console.log('prevOffset', prevOffset);
        console.log('prevRestaurants', prevRestaurants);

        this.state = {
            offset:
                prevOffset || prevOffset > RESTAURANT_RESET ? 0 : prevOffset,
            limit: LIMIT,
            restaurants: [],
            fetching: false,
            prevRestaurants: prevRestaurants || []
        };

        console.log('offset', this.state.offset);
    }

    // Gets geolocation info if enabled
    getLocation() {
        if (navigator.geolocation) {
            this.setState(
                {
                    message: 'Getting geolocation info...'
                },
                () => {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            this.setState(
                                {
                                    coords: {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude
                                    },
                                    message: 'Getting restaurant information...'
                                },
                                () => {
                                    // Loads restaurants into app
                                    this.fetchRestaurants(true)
                                        .then(() => {
                                            // Displays next restaurants after restaurants are done loading
                                            this.getNextRestaurant();
                                        })
                                        .catch(err => {
                                            console.log(
                                                `fetchRestaurants ${err}`
                                            );
                                        });
                                }
                            );
                        },
                        error => {
                            let message;

                            // Geolocation get errors
                            switch (error.code) {
                                case error.PERMISSION_DENIED:
                                    message =
                                        'User denied the request for Geolocation.';
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    message =
                                        'Location information is unavailable.';
                                    break;
                                case error.TIMEOUT:
                                    message =
                                        'The request to get user location timed out.';
                                    break;
                                case error.UNKNOWN_ERROR:
                                    message = 'An unknown error occurred.';
                                    break;
                                default:
                                    break;
                            }

                            this.setState({
                                message
                            });
                        }
                    );
                }
            );
        } else {
            this.setState({
                message: 'Geolocation is not supported by this browser.'
            });
        }
    }

    // Makes API call to backend to fetch restaurants in bulk
    fetchRestaurants = firstLoad =>
        new Promise((resolve, reject) => {
            const {coords, offset, limit} = this.state;
            let {prevRestaurants} = this.state;
            axios
                .get(
                    `${BASE_SERVER_URL}/api/restaurants?latitude=${
                        coords.latitude
                    }` +
                        `&longitude=${coords.longitude}` +
                        `&offset=${offset}` +
                        `&limit=${limit}`
                )
                .then(res => {
                    this.setState(
                        prevState => {
                            window.localStorage.setItem(
                                'prevOffset',
                                prevState.offset
                            );

                            let restaurants;

                            if (firstLoad) {
                                restaurants = res.data.filter(
                                    value => !prevRestaurants.includes(value.id)
                                );
                            } else {
                                restaurants = res.data;
                                prevRestaurants = [];
                            }

                            return {
                                restaurants: restaurants.concat(
                                    prevState.restaurants
                                ),
                                message: null,
                                fetching: false,
                                offset: prevState.offset + prevState.limit,
                                prevRestaurants
                            };
                        },
                        () => {
                            resolve();
                        }
                    );
                })
                .catch(err => {
                    reject(err);
                });
        });

    // Displays next restaurant
    getNextRestaurant = () => {
        const {
            message,
            restaurants,
            fetching,
            limit,
            prevRestaurants
        } = this.state;

        if (
            !message &&
            restaurants.length <= Math.round(limit * 0.2) &&
            !fetching
        ) {
            this.setState(
                {
                    fetching: true
                },
                () => {
                    this.getNextRestaurant();
                    this.fetchRestaurants();
                }
            );
        } else {
            const randomNumber = this.getRandomNumber(restaurants.length);
            const restaurant = restaurants[randomNumber];

            prevRestaurants.push(restaurant.id);

            window.localStorage.setItem(
                'prevRestaurants',
                JSON.stringify(prevRestaurants)
            );

            this.setState(
                prevState => ({
                    restaurant: {
                        name: restaurant.name,
                        rating: restaurant.rating,
                        location: restaurant.location.address1
                    },
                    restaurants: prevState.restaurants.filter(
                        (_, i) => i !== randomNumber
                    ),
                    message: null,
                    prevRestaurants
                }),
                () => {
                    console.log(restaurants);
                }
            );
        }
    };

    getRandomNumber = max => Math.floor(Math.random() * max);

    render() {
        const {message, coords, restaurant} = this.state;

        if (!message && !coords) {
            return (
                <div className="App">
                    <Button
                        onClick={this.getLocation}
                        variant="contained"
                        color="primary"
                    >
                        Show nearby restaurants
                    </Button>
                </div>
            );
        }
        if (!message && restaurant) {
            return (
                <div className="App">
                    <h2> {restaurant.name} </h2>
                    <h2> {restaurant.rating} </h2>
                    <h2> {restaurant.location} </h2>
                    <Button
                        onClick={this.getNextRestaurant}
                        variant="contained"
                        color="primary"
                    >
                        Shuffle
                    </Button>
                </div>
            );
        }
        return (
            <div className="App">
                <h2>{message} </h2>
            </div>
        );
    }
}

export default App;
