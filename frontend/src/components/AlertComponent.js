import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

export default function AlertComponent({ alert, setAlert, variant, message }) {

  useEffect(() => {
    setTimeout(() => {
      setAlert({
        show: false,
        variant: '',
        message: ''
      });
    }, 3000);
  }, [setAlert]);

  return (
    <>
      {alert && (
        <Alert variant={variant} className="fixed-bottom">
          {message}
        </Alert>
      )}
    </>
  );
}

