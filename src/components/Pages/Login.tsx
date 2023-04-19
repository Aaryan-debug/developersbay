import { ClassAttributes, InputHTMLAttributes, useContext, useEffect, useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AppContext/AppContext";
import { onAuthStateChanged, auth } from "../firebase/firebase";
import { FormikConfig, FormikValues } from 'formik';

import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
} from '@material-tailwind/react';


const Login = () => {
    const [loading, setLoading] = useState(false);
    const { signInWithGoogle, loginWithEmailAndPassword } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
          if(user) {
            navigate('/');
            setLoading(false)
          } else {
            setLoading(false)
          }
        })
    }, [navigate])


    let initialValues = {
        email: "",
        password: "",
      };

      const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .required("Required")
          .min(6, "Must be at least 6 characters long")
          .matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
      });    


      const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const { email, password } = formik.values;
        if (formik.isValid === true) {
          loginWithEmailAndPassword(email, password);
          setLoading(true);
        } else {
          setLoading(false);
          alert("Check your input fields");
        }
      };


      interface CustomFormikConfig<Values> extends FormikConfig<Values> {
          values: { email: any; password: any; };
          isValid: boolean;
          getFieldProps(arg0: string): JSX.IntrinsicAttributes & import("react").ClassAttributes<HTMLInputElement> & import("react").InputHTMLAttributes<HTMLInputElement>;
          touched: any;
          errors: any;
          handleSubmit: (e: { preventDefault: () => void }) => void;
        }


      const formikCustom: CustomFormikConfig<FormikValues> = {
            initialValues,
            validationSchema,
            handleSubmit,
            values: {
              email: undefined,
              password: undefined
            },
            isValid: false,
            getFieldProps: function (arg0: string): JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement> {
              throw new Error("Function not implemented.");
            },
            touched: undefined,
            errors: undefined,
            onSubmit: function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
              throw new Error("Function not implemented.");
            }
          };

      const formik = useFormik(formikCustom);

    
    
  return (
<div className="h-screen bg-gradient-to-tl from-green-400 to-indigo-900 w-full py-16 px-4">
<div className="flex flex-col items-center justify-center mt-12">
  <Typography className="font-light pb-10"variant="h1" color="white" style={{ fontFamily: "Courier New" }}>
  <span className='text-transparent bg-clip-text bg-green-400'>
                Only<span className='text-green-600'>Devs</span>
            </span> 
            <p className="text-sm">social media app for developers</p>
                 </Typography>
  <Card className="w-90 flex flex-col gap-4 bg-white shadow rounded p-8">
    <CardBody className="">
      <form action="" onSubmit={handleSubmit}>
        <div className="mb-2">
          <Input
            label="Email"
            type="email"
            size="lg"
            {...formik.getFieldProps('email')}
          />
        </div>
        <div>
          {formik.touched.email && formik.errors.email && (
            <Typography variant="small" color="red"></Typography>
          )}
        </div>

        <div className="mt-4 mb-2">
          <Input
            label="Password"
            type="password"
            size="lg"
            {...formik.getFieldProps('password')}
          />
        </div>
        <div>
          {formik.touched.password && formik.errors.password && (
            <Typography varient="small" color="red">
              {formik.errors.password}
            </Typography>
          )}
        </div>
        <Button
          fullWidth
          className="mb-4 bg-green-400"
          type="submit"
        >
          Login
        </Button>
      </form>
    </CardBody>
    <CardFooter className="pt-0">
      <div className="flex flex-col items-center">
        <button
          onClick={signInWithGoogle}
          className="w-full mb-4 bg-green-400 text-white py-2 px-4 rounded-lg flex items-center justify-center"
        >
          <img
            className="w-5 h-5 mr-2"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1920px-Google_%22G%22_Logo.svg.png"
            alt=""
          />
          Sign In with Google
        </button>
      </div>
      <Link to={'/reset'}>
        <p className="ml-1 font-bold text-sm text-green-400 text-center ">
          Reset your password
        </p>
      </Link>
      <div className="mt-6 flex items-center text-base justify-center">
        Don't have an account?
        <Link to={'/register'}>
          <p className="ml-1 font-bold text-sm text-green-400 text-center ">
            Register
          </p>
        </Link>
      </div>
    </CardFooter>
  </Card>
</div>
</div>

  )
}

export default Login