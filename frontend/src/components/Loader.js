import Spinner from 'react-bootstrap/Spinner';

function Loader() {
  return (
    <div className='vh-100 w-100 d-flex align-items-center justify-content-center'>
      <Spinner animation="grow" variant='dark' />;
    </div>
  )
}

export default Loader;