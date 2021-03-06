import { useState } from 'react';
import axios from 'axios';

const getErrorsContent = (err) => {
  const values = err.response.data;
  const content = (
    <div className='alert  alert-danger'>
      <h4>{values.message}</h4>

      {values.errors ? (
        <ul className='my-0'>
          {values.errors.map((err, i) => (
            <li key={i}>{err.message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return content;
};

const useRequest = ({ url, method = 'GET', data = {} }) => {
  const [errors, setErrors] = useState(null);

  const request = async (props = {}) => {
    try {
      const res = await axios(url, { method, data: { ...data, ...props } });

      setErrors(null);

      return res.data;
    } catch (err) {
      setErrors(getErrorsContent(err));

      throw err;
    }
  };

  return { request, errors };
};

export default useRequest;
