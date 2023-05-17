import currency from 'currency-formatter';
import { discount } from '../../utils/discount';
import { useSelector, useDispatch } from 'react-redux';
import Wrapper from './Wrapper';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { ImCross } from 'react-icons/im';
import { clearMessage, setSuccess } from '../../redux/reducers/globalReducer';
import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from '../../redux/services/userOrdersService';
import { useEffect } from 'react';
import { setInfoUser } from '../../redux/reducers/orderReducer';
import useToastify from '../../hooks/useToatify';

const AdminOrder = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }
  const { statusOrder, infoUser } = useSelector((state) => state.orderReducer);
  const [openModal, setOpenModal] = useState(false);
  const [orderBody, setOrderBody] = useState({});
  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const [status, setStatus] = useState('WAITTING');
  const { cart, total } = useSelector((state) => state.cartReducer);
  const orders = useGetOrdersQuery(page);
  const [deleteOrders, response] = useDeleteOrderMutation();
  const [updateOrder, res] = useUpdateOrderMutation();
  const toast = useToastify();
  const navigate = useNavigate();

  const deleteOrder = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        deleteOrders(id);
      }
    });
  };

  useEffect(() => {
    if (!res.isSuccess) {
      res?.error?.data?.errors.map((err) => {
        toast.handleOpenToastify('error', err.msg, 1000);
      });
    }
  }, [res?.error?.data?.errors]);

  useEffect(() => {
    if (res?.isSuccess) {
      orders.refetch(page);
      toast.handleOpenToastify('success', 'Update successfully', 1000);
      setOpenModal(false);
    }
  }, [res?.isSuccess]);

  return (
    <div>
      {openModal && (
        <div className="scroll-none overflow-x-scroll">
          <Modal setOpen={setOpenModal} className="overflow-x-auto w-full">
            <div className="modal_container bg-white w-[80%] h-[90%] p-5 z-[60] rounded-lg">
              <div className="flex justify-between items-center text-slate-800 font-bold text-[30px] uppercase">
                <p>Bill Order</p>
                <ImCross
                  onClick={() => setOpenModal(false)}
                  className="text-[#242424] hover:text-red-600 cursor-pointer"
                  size={24}
                />
              </div>
              <hr className="my-2"></hr>
              <div className="mt-3 grid grid-cols-2 gap-5">
                <div className="w-full">
                  <p
                    htmlFor=""
                    className="label block mb-1 text-sm text-gray-700"
                  >
                    Name:
                  </p>
                  <input
                    className="input-white"
                    placeholder="Enter customer name"
                    value={infoUser.name}
                    onChange={(e) =>
                      dispatch(
                        setInfoUser({ ...infoUser, name: e.target.value })
                      )
                    }
                  />
                </div>
                <div className="w-full">
                  <p
                    htmlFor=""
                    className="label block mb-1 text-sm text-gray-700"
                  >
                    Adress:
                  </p>
                  <input
                    value={infoUser.address}
                    className="input-white"
                    placeholder="Enter customer adress"
                    onChange={(e) =>
                      dispatch(
                        setInfoUser({
                          ...infoUser,
                          address: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className="w-full">
                  <p
                    htmlFor=""
                    className="label block mb-1 text-sm text-gray-700"
                  >
                    Phone:
                  </p>
                  <input
                    value={infoUser.phone}
                    className="input-white"
                    placeholder="Enter customer phone number"
                    onChange={(e) =>
                      dispatch(
                        setInfoUser({ ...infoUser, phone: e.target.value })
                      )
                    }
                  />
                </div>
                <div className="w-full">
                  <p
                    htmlFor=""
                    className="label block mb-1 text-sm text-gray-700"
                  >
                    Status:
                  </p>
                  <select
                    id="countries"
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
                  >
                    <option selected={status === 'WAITTING'} value="WAITTING">
                      WAITTING
                    </option>
                    <option selected={status === 'DELIVERED'} value="DELIVERED">
                      DELIVERED
                    </option>
                    <option selected={status === 'FINISH'} value="FINISH">
                      FINISH
                    </option>
                  </select>
                </div>
              </div>
              <p className="mt-10 font-bold uppercase text-lg text-center">
                Product Informations
              </p>
              <hr className="mt-[10px] h-[1.5px]" />
              <table className="w-full table-fixed">
                <thead className="w-full table">
                  <tr className="border-b border-gray-300 text-center uppercase">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      image
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      name
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      color
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      size
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      quantity
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      price
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      total
                    </th>
                  </tr>
                </thead>
                <tbody className="h-[240px] w-full overflow-auto block scroll-none mb-3">
                  {orderBody.cart &&
                    orderBody.cart.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="w-full text-center table table-fixed"
                        >
                          <td className="p-3 capitalize text-sm font-normal text-gray-400">
                            <img
                              src={`/${
                                import.meta.env.VITE_PATH_IMAGE
                              }/products/${item.images[0]}`}
                              alt=""
                              className="w-[80px]"
                            />
                          </td>
                          <td className="p-3 capitalize text-md">
                            {item.name}
                          </td>
                          <td className="p-3 capitalize text-md">
                            <span
                              className="block w-[25px] h-[25px] rounded-full"
                              style={{
                                backgroundColor: item.color,
                                margin: '0 auto',
                              }}
                            ></span>
                          </td>
                          <td className="p-3 capitalize text-md">
                            {item.size}
                          </td>
                          <td className="p-3 capitalize text-md">
                            {item.quantity}
                          </td>
                          <td className="p-3 capitalize text-md">
                            {currency.format(
                              discount(item.price, item.discount),
                              {
                                code: 'VND',
                              }
                            )}
                          </td>
                          <td className="p-3 capitalize text-md font-semibold">
                            {currency.format(
                              item.quantity *
                                discount(item.price, item.discount),
                              {
                                code: 'VND',
                              }
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <div className="w-[100%] flex justify-end gap-x-[20px]">
                <button
                  onClick={() => {
                    updateOrder({
                      id: orderBody.id,
                      body: {
                        fullname: infoUser.name,
                        address: infoUser.address,
                        phone: infoUser.phone,
                        status: status,
                      },
                    });
                  }}
                  className="btn btn-success"
                >
                  Update
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      <Wrapper>
        {success && <div className="alert-success">{success}</div>}
        {!orders?.isFetching ? (
          <>
            <div>
              <table className="w-full bg-gray-900 rounded-md">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      id order
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      name customer
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      phone customer
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      adress customer
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      status
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 text-center">
                      edit
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500 ">
                      delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.data &&
                    orders.data?.orders.map((item, index) => (
                      <tr key={index} className="odd:bg-gray-800">
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.id ? item?.id : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.fullname ? item?.fullname : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.phone ? item?.phone : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.address ? item?.address : '-'}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          {item?.status}
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 text-center">
                          <a
                            className="btn btn-indigo"
                            onClick={() => {
                              setOrderBody({ ...item });
                              setStatus(item.status);
                              dispatch(
                                setInfoUser({
                                  ...infoUser,
                                  name: item.fullname,
                                  address: item.address,
                                  phone: item.phone,
                                })
                              );
                              setOpenModal(true);
                            }}
                          >
                            edit
                          </a>
                        </td>
                        <td className="p-3 capitalize text-sm font-normal text-gray-400 pr-0">
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteOrder(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={orders.data?.perPage}
              count={orders.data?.count}
              path="admin/orders"
            />
          </>
        ) : (
          <Spinner />
        )}
      </Wrapper>
    </div>
  );
};
export default AdminOrder;
