import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteRoadmap } from '../../store/slices/dbSlice';
import { openModal, addToast } from '../../store/slices/uiSlice';
import DataTable from '../components/DataTable';

const RoadmapsListPage = () => {
  const { roadmaps } = useSelector(state => state.db);
  const dispatch = useDispatch();

  const handleDelete = (roadmap) => {
    dispatch(openModal({
      type: 'CONFIRM',
      props: {
        title: 'حذف المسار',
        message: `هل أنت متأكد من حذف مسار "${roadmap.title}"؟`,
        confirmText: 'حذف',
        isDestructive: true,
        onConfirm: () => {
          dispatch(deleteRoadmap(roadmap.id));
          dispatch(addToast({ type: 'success', message: 'تم حذف المسار بنجاح' }));
        }
      }
    }));
  };

  const data = roadmaps.allIds.map(id => roadmaps.byId[id]);

  const columns = [
    {
      header: 'المسار',
      accessor: 'title',
      render: (item) => (
        <div>
          <p className="font-bold text-heading-brown text-sm">{item.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
        </div>
      )
    },
    {
      header: 'عدد الوحدات',
      accessor: 'modules',
      render: (item) => <span className="text-sm font-bold text-primary">{item.modules?.length || 0} وحدات</span>
    },
    {
      header: 'المستوى',
      accessor: 'level',
      render: (item) => <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{item.level}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="إدارة المسارات"
        data={data}
        columns={columns}
        onDelete={handleDelete}
        onEdit="/admin/roadmaps"
        createLink="/admin/roadmaps/new"
      />
    </div>
  );
};

export default RoadmapsListPage;
