import { FormikHelpers, useFormik } from "formik";
import { ClassAttributes, InputHTMLAttributes, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { AuthContext } from "../AppContext/AppContext";
import { onAuthStateChanged, auth } from "../firebase/firebase";
import { FormikConfig, FormikValues } from 'formik';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from '@material-tailwind/react';

import PacmanLoader from 'react-spinners/PacmanLoader';


const Register = () => {
    const [loading, setLoading] = useState(false);
    const { registerWithEmailAndPassword } = useContext(AuthContext);
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
        name: "",
        email: "",
        password: "",
      };
    
      const validationSchema = Yup.object({
        name: Yup.string()
          .required("Required")
          .min(4, "Must be at least 4 characters long")
          .matches(/^[a-zA-Z]+$/, "Name can only contain letters"),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .required("Required")
          .min(6, "Must be at least 6 characters long")
          .matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
      });
    


      const handleRegister = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const { name, email, password } = formik.values;
        if (formik.isValid === true) {
          registerWithEmailAndPassword(name, email, password);
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
        handleRegister: (e: { preventDefault: () => void }) => void;
      }

      const formikCustom: CustomFormikConfig<FormikValues> = {
        initialValues,
        validationSchema,
        handleRegister,
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
        <>
        {loading ? (<div className="grid grid-cols-1 justify-items-center items-center h-screen"><PacmanLoader
      color="#367fd6"
      size={150}
      speedMultiplier={0.5}
    /></div>) : (
        <div className="grid grid-cols-1 justify-items-center items-center h-screen">
    <Card className="w-96">
      <CardHeader
        variant="gradient"
        color="blue"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          REGISTER
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <form onSubmit={handleRegister}>
          <div className="mb-2 ">
            <Input
              type="text"
              label="Name"
              size="lg"
              {...formik.getFieldProps('name')}
            />
          </div>
          <div>
            {formik.touched.name && formik.errors.name && (
              <Typography variant="small" color="red">
                {formik.errors.name}
              </Typography>
            )}
          </div>
          <div className="mt-4 mb-2">
            <Input
              type="email"
              label="Email"
              size="lg"
              {...formik.getFieldProps('email')}
            />
          </div>
          <div>
            {formik.touched.email && formik.errors.email && (
              <Typography variant="small" color="red">
                {formik.errors.email}
              </Typography>
            )}
          </div>
          <div className="mt-4 mb-2">
            <Input
              type="password"
              label="Password"
              size="lg"
              {...formik.getFieldProps('password')}
            />
          </div>
          <div>
            {formik.touched.password && formik.errors.password && (
              <Typography variant="small" color="red">
                {formik.errors.password}
              </Typography>
            )}
          </div>
          <Button variant="gradient" type="submit" fullWidth className="mb-4">
            Sign In
          </Button>
        </form>
      </CardBody>
      <CardFooter className="pt-0">
        <div className="mt-6 flex text-base justify-center">
          Already have an account?
          <Link to="/login">
            <p className="ml-1 font-bold text-base text-blue-500 text-center">
              Login
            </p>
          </Link>
        </div>
      </CardFooter>
    </Card>
  </div>
)}
    </>
  )
}

export default Register