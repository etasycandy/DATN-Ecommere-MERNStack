import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AccountList from '../components/AccountList';
import { useVerifyPaymentQuery } from '../redux/services/paymentService';
import { emptyCart } from '../redux/reducers/cartReducer';
import { useFetchUserQuery } from '../redux/services/authService';

const Profile = () => {
  const { user } = useSelector((state) => state.authReducer);
  const { result } = useFetchUserQuery(user?.id);
  const [params] = useSearchParams();
  const id = params.get('session_id');
  const { data, isSuccess } = useVerifyPaymentQuery(id, {
    skip: id ? false : true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(result);
    if (isSuccess) {
      localStorage.removeItem('cart');
      toast.success(data.msg);
      dispatch(emptyCart());
      navigate('/profile');
    }
  }, [isSuccess]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {/* <Header>my account</Header> */}
      <div className="container w-[90%] pb-10 mt-10 mx-auto">
        <div className="flex mx-6">
          <AccountList />
          <div className="w-[80%] px-5">
            {/* <div className="image h-40 w-40 rounded object-cover">
              <img
                className="w-full"
                src={`../${import.meta.env.VITE_PATH_IMAGE}/users/${
                  result?.avatar
                }`}
                alt="Avatar"
              />
            </div> */}
            <h1 className="text-lg">
              Name: <span className="font-bold">{user?.fullname}</span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
