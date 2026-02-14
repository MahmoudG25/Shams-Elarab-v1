import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast, openModal } from '../../store/slices/uiSlice';
import DataTable from '../components/DataTable';
import { orderService } from '../../services/orderService';
import { MdCheckCircle, MdCancel, MdVisibility, MdAccessTime } from 'react-icons/md';

const OrdersListPage = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      dispatch(addToast({ type: 'error', message: 'فشل تحميل الطلبات' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (order, newStatus) => {
    const isApproval = newStatus === 'approved';

    dispatch(openModal({
      type: 'CONFIRM',
      props: {
        title: isApproval ? 'قبول الطلب' : 'رفض الطلب',
        message: `هل أنت متأكد من ${isApproval ? 'قبول' : 'رفض'} طلب "${order.customerName}"؟`,
        confirmText: isApproval ? 'قبول' : 'رفض',
        isDestructive: newStatus === 'rejected',

        // Input for Access Link (Only for Approval)
        showInput: isApproval,
        inputLabel: 'رابط الوصول (اختياري)',
        inputPlaceholder: 'https://cloud.shamsalarab.com/access/...',
        inputHelp: 'أدخل رابط المجلد السحابي أو المحتوى هنا. سيظهر هذا الرابط للمستخدم في صفحة النجاح.',

        onConfirm: async (inputValue) => {
          try {
            await orderService.updateStatus(order.id, newStatus, inputValue);
            dispatch(addToast({ type: 'success', message: `تم ${isApproval ? 'قبول' : 'رفض'} الطلب بنجاح` }));
            // Refresh local state optimistically or re-fetch
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus, accessLink: inputValue } : o));
          } catch (error) {
            console.error("Update failed:", error);
            dispatch(addToast({ type: 'error', message: 'فشل تحديث الحالة' }));
          }
        }
      }
    }));
  };

  const handleViewReceipt = (order) => {
    if (!order.receiptUrl) {
      return dispatch(addToast({ type: 'info', message: 'لا يوجد إيصال مرفق' }));
    }

    // Check if it's a valid URL (roughly)
    if (order.receiptUrl.startsWith('http')) {
      window.open(order.receiptUrl, '_blank');
    } else {
      // It's likely a legacy order with just a filename
      dispatch(addToast({ type: 'warning', message: `ملف قديم (غير مرفوع): ${order.receiptUrl}` }));
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full"><MdCheckCircle /> مقبول</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"><MdCancel /> مرفوض</span>;
      default: return <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full"><MdAccessTime /> معلق</span>;
    }
  };

  const columns = [
    {
      header: 'رقم الطلب',
      accessor: 'id',
      render: (item) => <span className="text-xs text-gray-400 font-mono">#{item.id.slice(0, 8)}</span>
    },
    {
      header: 'العميل',
      accessor: 'customerName',
      render: (item) => (
        <div>
          <p className="font-bold text-sm text-heading-brown">{item.customerName || 'Unknown'}</p>
          <p className="text-xs text-gray-500">{item.customerEmail}</p>
        </div>
      )
    },
    {
      header: 'المنتجات',
      accessor: 'item',
      render: (item) => (
        <div className="text-sm">
          {/* Assuming items is array or single item details are flattened */}
          {item.items ? (
            item.items.map((i, idx) => (
              <p key={idx} className="line-clamp-1 text-gray-700">- {i.title}</p>
            ))
          ) : (
            <p className="text-gray-500">No items</p>
          )}
        </div>
      )
    },
    {
      header: 'المبلغ',
      accessor: 'totalAmount',
      render: (item) => <span className="font-bold text-heading-brown">${item.totalAmount}</span>
    },
    {
      header: 'الحالة',
      accessor: 'status',
      render: (item) => getStatusBadge(item.status)
    },
    {
      header: 'الإيصال',
      accessor: 'receiptUrl',
      render: (item) => (
        item.receiptUrl ? (
          <button onClick={() => handleViewReceipt(item)} className="text-primary hover:text-gold-cta text-sm underline">
            عرض
          </button>
        ) : <span className="text-gray-400 text-xs">لا يوجد</span>
      )
    },
    {
      header: 'إجراءات',
      accessor: 'actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate(item, 'approved')}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="قبول"
              >
                <MdCheckCircle size={20} />
              </button>
              <button
                onClick={() => handleStatusUpdate(item, 'rejected')}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="رفض"
              >
                <MdCancel size={20} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  if (loading) return <div>Loading...</div>;

  const handleDeleteOrder = (order) => {
    dispatch(openModal({
      type: 'CONFIRM',
      props: {
        title: 'حذف الطلب',
        message: `هل أنت متأكد من حذف طلب "${order.customerName}" نهائياً؟`,
        confirmText: 'حذف',
        isDestructive: true,
        onConfirm: async () => {
          try {
            await orderService.deleteOrder(order.id);
            dispatch(addToast({ type: 'success', message: 'تم حذف الطلب بنجاح' }));
            setOrders(prev => prev.filter(o => o.id !== order.id));
          } catch (error) {
            console.error("Delete failed:", error);
            dispatch(addToast({ type: 'error', message: 'فشل حذف الطلب' }));
          }
        }
      }
    }));
  };

  const handleEditOrder = (order) => {
    // Re-use the modal to edit the Access Link
    dispatch(openModal({
      type: 'CONFIRM',
      props: {
        title: 'تعديل رابط الوصول',
        message: `تعديل رابط الوصول للطلب رقم #${order.id.slice(0, 8)}`,
        confirmText: 'حفظ',
        isDestructive: false,

        showInput: true,
        inputLabel: 'رابط الوصول',
        inputPlaceholder: 'https://cloud.shamsalarab.com/access/...',
        inputHelp: 'تحديث الرابط الذي يظهر للمستخدم في صفحة النجاح.',
        // Pre-fill if possible? Currently our simple modal might not support pre-fill without more changes.
        // But the user can type the new one.

        onConfirm: async (inputValue) => {
          try {
            // We just update the access link, status remains same
            await orderService.updateStatus(order.id, order.status, inputValue);
            dispatch(addToast({ type: 'success', message: 'تم تحديث الرابط بنجاح' }));
            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, accessLink: inputValue } : o));
          } catch (error) {
            console.error("Update failed:", error);
            dispatch(addToast({ type: 'error', message: 'فشل تحديث الرابط' }));
          }
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading-brown">إدارة الطلبات</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-light pb-4 overflow-x-auto">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === status
              ? 'bg-heading-brown text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
          >
            {status === 'all' ? 'الكل' :
              status === 'pending' ? 'معلق' :
                status === 'approved' ? 'مقبول' : 'مرفوض'}
          </button>
        ))}
      </div>

      <DataTable
        title={`الطلبات (${filteredOrders.length})`}
        data={filteredOrders}
        columns={columns}
        onDelete={handleDeleteOrder}
        onEdit={handleEditOrder}
      />
    </div>
  );
};

export default OrdersListPage;
