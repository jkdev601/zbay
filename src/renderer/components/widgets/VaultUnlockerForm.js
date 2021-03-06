import React from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import PasswordField from '../ui/form/PasswordField'
import Icon from '../ui/Icon'
import LoadingButton from '../ui/LoadingButton'

import icon from '../../static/images/zcash/logo-lockup--circle.svg'
import electronStore from '../../../shared/electronStore'

const styles = theme => ({
  paper: {
    width: '100vw',
    height: '100vh',
    padding: 20,
    WebkitAppRegion: process.platform === 'win32' ? 'no-drag' : 'drag'
  },
  icon: {
    width: 285,
    height: 67
  },
  logoContainer: {
    height: 167
  },
  passwordField: {
    width: 286
  },
  title: {
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
    height: 36,
    marginBottom: 16
  },
  torDiv: {
    marginTop: -8
  },
  status: {
    marginTop: 9,
    padding: 8,
    width: '100%',
    textAlign: 'center'
  },
  progressBar: {
    backgroundColor: theme.palette.colors.linkBlue
  },
  rootBar: {
    width: 250
  }
})

const formSchema = Yup.object().shape({
  password: Yup.string().required('Required')
})

export const VaultUnlockerForm = ({
  classes,
  locked,
  unlocking,
  initialValues,
  onSubmit,
  loader,
  nodeConnected,
  done,
  exists,
  setDone,
  tor,
  node,
  isLogIn,
  checkForUpdate
}) => {
  const isDev = process.env.NODE_ENV === 'development'
  const vaultPassword = electronStore.get('vaultPassword')
  React.useEffect(() => {
    // for tests
    // checkForUpdate()
  }, [])
  return (
    <Formik
      onSubmit={(values, actions) => {
        onSubmit(values, actions, setDone)
      }}
      validationSchema={vaultPassword || isDev ? null : formSchema}
      initialValues={initialValues}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid
            container
            direction='column'
            spacing={2}
            justfy='center'
            alignItems='center'
            alignContent='center'
          >
            <Grid
              className={classes.logoContainer}
              container
              item
              xs={12}
              justify='center'
              alignItems='center'
              alignContent='center'
            >
              <Icon className={classes.icon} src={icon} />
            </Grid>
            <Grid container item xs={12} wrap='wrap' justify='center'>
              <Typography
                className={classes.title}
                variant='body1'
                gutterBottom
              >
                {vaultPassword ? 'Welcome Back' : 'Log In'}
              </Typography>
            </Grid>
            {((!vaultPassword && !isDev) ||
              (isDev && exists && !vaultPassword)) && (
              <Grid container item justify='center'>
                <PasswordField
                  name='password'
                  className={classes.passwordField}
                  label='Enter Password'
                  fullWidth
                />
              </Grid>
            )}
            <Grid container item justify='center'>
              <LoadingButton
                type='submit'
                variant='contained'
                size='large'
                color='primary'
                margin='normal'
                text={vaultPassword ? 'Sign in' : 'Login'}
                fullWidth
                disabled
                inProgress
              />
            </Grid>
          </Grid>
          <Grid item container justify='center' alignItems='center'>
            <Typography variant='body2' className={classes.status}>
              {'Updating please wait...'}
            </Typography>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}
VaultUnlockerForm.propTypes = {
  classes: PropTypes.object.isRequired,
  isLogIn: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  unlocking: PropTypes.bool.isRequired,
  exists: PropTypes.bool.isRequired,
  done: PropTypes.bool.isRequired,
  nodeConnected: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loader: PropTypes.object.isRequired,
  initialValue: PropTypes.shape({
    password: PropTypes.string.isRequired
  })
}
VaultUnlockerForm.defaultProps = {
  initialValues: {
    password: ''
  },
  unlocking: false,
  locked: true
}

export default withStyles(styles)(VaultUnlockerForm)
