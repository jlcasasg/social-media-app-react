import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Scream from '../components/Scream/Scream';
import StaticProfile from '../components/Profile/StaticProfile';

import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';

import { getUserData } from '../redux/actions/dataActions';

import ScreamSkeleton from '../util/ScreamSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

export class user extends Component {
    state = {
        profile: null,
        screamIdParam: null,
    }
    componentDidMount() {
        const handle = this.props.match.params.handle;
        const screamId = this.props.match.params.screamId;

        if (screamId) {
            this.setState({ screamIdParam: screamId })
        }

        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(result => {
                this.setState({ profile: result.data.user })
            })
            .catch(error => console.error(error))
    }

    render() {
        const { screams, loading } = this.props.data;
        const { screamIdParam } = this.state;

        const screamsMarkup = loading
            ? <ScreamSkeleton />
            : screams === null
                ? <p>No screams from user</p>
                : !screamIdParam ?
                    (screams.map(scream => <Scream key={scream.screamId} scream={scream} />))
                    : (
                        (screams.map(scream => {
                            if (scream.screamId !== screamIdParam) {
                                return <Scream key={scream.screamId} scream={scream} />
                            }
                            else {
                                return <Scream key={scream.screamId} scream={scream} openDialog />
                            }
                        }))
                    )

        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null
                        ? <ProfileSkeleton />
                        : <StaticProfile profile={this.state.profile} />
                    }
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    data: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { getUserData })(user);

