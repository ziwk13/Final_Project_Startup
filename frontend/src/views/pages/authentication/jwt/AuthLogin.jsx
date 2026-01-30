import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT - LOGIN ||=============================== //

export default function JWTLogin({ ...others }) {
  const { login, isLoggedIn } = useAuth();
  const scriptedRef = useScriptRef();

  // localStorage에서 'rememberedUsername' 키로 저장된 사용자 이름 가져오기
  const rememberedUsername = localStorage.getItem('rememberedUsername');

  // 저장된 사용자 이름이 있으면(null이나 undefined가 아니면) true, 없으면 false
  const [checked, setChecked] = useState(!!rememberedUsername);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth');

  return (
    <Formik
      initialValues={{
<<<<<<< HEAD:frontend/src/views/pages/authentication/jwt/AuthLogin.jsx
        email: 'info@codedthemes.com',
        password: '123456',
=======
        username: rememberedUsername || '',
        password: '',
>>>>>>> frontend_origin/develop:src/views/pages/authentication/jwt/AuthLogin.jsx
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string()
<<<<<<< HEAD:frontend/src/views/pages/authentication/jwt/AuthLogin.jsx
          .required('Password is required')
          .test('no-leading-trailing-whitespace', 'Password can not start or end with spaces', (value) => value === value.trim())
          .max(10, 'Password must be less than 10 characters')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const trimmedEmail = values.email.trim();
          await login?.(trimmedEmail, values.password);
=======
          .required('비밀번호는 필수입니다.')
          .test('no-leading-trailing-whitespace', '비밀번호는 공백으로 시작하거나 끝날 수 없습니다.', (value) => value === value.trim())
          .max(20, '비밀번호는 20자 이하여야합니다.')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // 아이디 기억하기 체크 여부에 따라 localStorage 처리
          if (checked) {
            // 체크되어 있으면 localStorage에 사용자 이름 저장
            localStorage.setItem('rememberedUsername', values.username.trim());
          } else {
            // 체크되어 있지 않으면 localStorage에서 사용자 이름 제거
            localStorage.removeItem('rememberedUsername');
          }

          await login?.(values.username.trim(), values.password);
>>>>>>> frontend_origin/develop:src/views/pages/authentication/jwt/AuthLogin.jsx

          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <CustomFormControl fullWidth error={Boolean(touched.email && errors.email)}>
            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {errors.email}
              </FormHelperText>
            )}
          </CustomFormControl>

          <CustomFormControl fullWidth error={Boolean(touched.password && errors.password)}>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                {errors.password}
              </FormHelperText>
            )}
          </CustomFormControl>

          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="아이디 기억하기"
              />
            </Grid>
            <Grid>
              <Typography
                variant="subtitle1"
                component={Link}
                to={
                  isLoggedIn
                    ? '/pages/forgot-password/forgot-password3'
                    : authParam
                      ? `/forgot-password?auth=${authParam}`
                      : '/forgot-password'
                }
                sx={{ textDecoration: 'none', color: 'secondary.main' }}
              >
                Forgot Password?
              </Typography>
            </Grid>
          </Grid>

          {errors.submit && (
            <Box sx={{ mt: 1 }}>
              <FormHelperText error sx={{ fontSize: '15px' }}>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button color="secondary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
<<<<<<< HEAD:frontend/src/views/pages/authentication/jwt/AuthLogin.jsx
                Sign In
=======
                로그인
>>>>>>> frontend_origin/develop:src/views/pages/authentication/jwt/AuthLogin.jsx
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
}
