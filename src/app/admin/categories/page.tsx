'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderTree, 
  ToggleLeft, 
  ToggleRight, 
  LayoutList, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  ChevronRight,
  GripVertical
} from 'lucide-react';

interface Board {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  order: number;
  _count: { threads: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  order: number;
  boards: Board[];
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'board'>('category');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    order: 0,
    categoryId: ''
  });

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/admin/categories');
      return data;
    },
  });

  // --- MUTATIONS ---
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = modalType === 'category' ? '/admin/categories' : '/admin/boards';
      if (editingItem) {
        return api.post(`${endpoint}/${editingItem.id}`, data);
      }
      return api.post(endpoint, data);
    },
    onSuccess: () => {
      toast.success('Đã lưu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      closeModal();
    },
    onError: () => toast.error('Lỗi khi lưu dữ liệu'),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'category' | 'board' }) => {
      const endpoint = type === 'category' ? '/admin/categories/delete' : '/admin/boards/delete';
      return api.post(`${endpoint}/${id}`);
    },
    onSuccess: () => {
      toast.success('Đã xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Không thể xóa. Có thể có dữ liệu ràng buộc.'),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, type, status }: { id: string; type: 'category' | 'board'; status: string }) => {
      const endpoint = type === 'category' ? `/admin/categories/${id}/status` : `/admin/boards/${id}/status`;
      return api.post(endpoint, { status });
    },
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  // --- MODAL HANDLERS ---
  const openModal = (type: 'category' | 'board', item?: any, parentId?: string) => {
    setModalType(type);
    setEditingItem(item || null);
    setFormData({
      name: item?.name || '',
      slug: item?.slug || '',
      description: item?.description || '',
      order: item?.order || 0,
      categoryId: parentId || item?.categoryId || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black">Quản lý Chủ đề & Danh mục</h1>
          <p className="text-gray-500 font-medium font-bold">Thêm, sửa, xóa và sắp xếp phân cấp diễn đàn.</p>
        </div>
        <button 
          onClick={() => openModal('category')}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-2xl font-black text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Tạo Danh mục mới
        </button>
      </div>

      <div className="space-y-6">
        {categories?.map((cat) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {/* CATEGORY HEADER */}
            <div className="p-6 bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl dark:bg-emerald-900/30">
                  <FolderTree className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl text-gray-900 dark:text-white">
                      {cat.name}
                    </h3>
                    {cat.status === 'INACTIVE' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase">Đã ẩn</span>}
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">/{cat.slug} • Thứ tự: {cat.order}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => openModal('board', null, cat.id)}
                  className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                  title="Thêm Khu vực con"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => openModal('category', cat)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => statusMutation.mutate({ id: cat.id, type: 'category', status: cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                  className="p-2"
                >
                  {cat.status === 'ACTIVE' ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                </button>
                <button 
                  onClick={() => confirm('Xóa danh mục này sẽ ảnh hưởng đến các Board bên trong. Bạn chắc chắn chứ?') && deleteMutation.mutate({ id: cat.id, type: 'category' })}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* BOARDS LIST */}
            <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {cat.boards.length > 0 ? (
                cat.boards.map(board => (
                  <div key={board.id} className="p-4 pl-12 flex items-center justify-between hover:bg-gray-50/30 dark:hover:bg-slate-800/20 transition-all group/item">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 flex-shrink-0">
                         <LayoutList className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <h4 className="font-bold text-gray-800 dark:text-zinc-200">
                             {board.name}
                           </h4>
                           {board.status === 'INACTIVE' && <span className="text-[9px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold border border-red-100 uppercase">Ẩn</span>}
                         </div>
                         <p className="text-[11px] text-gray-500 font-medium">/{board.slug} • {board._count.threads} bài viết</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button 
                         onClick={() => openModal('board', board)}
                         className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all"
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => statusMutation.mutate({ id: board.id, type: 'board', status: board.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                         className="p-1"
                      >
                         {board.status === 'ACTIVE' ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                      </button>
                      <button 
                         onClick={() => confirm('Bạn chắc chắn muốn xóa khu vực này?') && deleteMutation.mutate({ id: board.id, type: 'board' })}
                         className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic opacity-50">
                   Chưa có chủ đề nào trong danh mục này.
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL FORM */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-emerald-500 flex justify-between items-center" style={{ color: '#000000' }}>
                <div className="text-black">
                   <h2 className="text-2xl font-black text-black" style={{ color: '#000000' }}>
                     {editingItem ? 'Chỉnh sửa' : 'Tạo mới'} {modalType === 'category' ? 'Danh mục' : 'Board'}
                   </h2>
                   <p className="text-black/70 text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(0,0,0,0.7)' }}>Vui lòng điền đầy đủ thông tin bên dưới</p>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-black/10 rounded-full transition-colors text-black" style={{ color: '#000000' }}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-300 ml-1">Tên hiển thị</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        name: val,
                        slug: prev.slug || val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                      }));
                    }}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold outline-none text-gray-900 dark:text-white"
                    placeholder="VD: Thảo luận chung"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-300 ml-1">Đường dẫn (Slug)</label>
                  <input 
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold outline-none font-mono text-gray-900 dark:text-white"
                    placeholder="vd-thao-luan-chung"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-300 ml-1">Mô tả ngắn</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold outline-none h-24 resize-none text-gray-900 dark:text-white"
                    placeholder="Nhập mô tả cho chủ đề này..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-300 ml-1">Thứ tự hiển thị</label>
                    <input 
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                  {modalType === 'board' && (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-300 ml-1">Thuộc danh mục</label>
                      <select 
                        required
                        value={formData.categoryId}
                        onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold outline-none text-gray-900 dark:text-white"
                      >
                         <option value="">Chọn danh mục...</option>
                         {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl font-black text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl font-black text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {saveMutation.isPending ? 'Đang lưu...' : (
                      <>
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
