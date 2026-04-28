'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tag, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface TagData {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count: { threads: number };
}

export default function AdminTagsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const { data: tags, isLoading } = useQuery<TagData[]>({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const { data } = await api.get('/admin/tags');
      return data;
    },
  });

  const createTagMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const res = await api.post('/admin/tags', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Đã thêm tag');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setIsCreating(false);
      setNewName('');
      setNewSlug('');
    },
    onError: () => toast.error('Lỗi khi thêm tag'),
  });

  const updateTagMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; slug: string } }) => {
      const res = await api.post(`/admin/tags/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Đã cập nhật tag');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setEditingId(null);
    },
    onError: () => toast.error('Lỗi khi cập nhật tag'),
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/admin/tags/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Đã xoá tag');
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
    },
    onError: () => toast.error('Lỗi khi xoá tag'),
  });

  const startEdit = (tag: TagData) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditSlug(tag.slug);
  };

  const handleCreate = () => {
    if (!newName.trim() || !newSlug.trim()) return toast.error('Vui lòng nhập đầy đủ tên và slug');
    createTagMutation.mutate({ name: newName, slug: newSlug });
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim() || !editSlug.trim()) return toast.error('Vui lòng nhập đầy đủ tên và slug');
    updateTagMutation.mutate({ id, data: { name: editName, slug: editSlug } });
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black">Quản lý Tags</h1>
          <p className="text-gray-500 font-medium">Thêm, sửa, xoá các thẻ phân loại bài viết.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-black rounded-xl font-bold hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm Tag Mới
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 font-black uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-4">Tên Tag</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Số bài viết</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
            {isCreating && (
              <tr className="bg-primary-50 dark:bg-primary-900/10">
                <td className="px-6 py-4">
                  <input
                    placeholder="VD: Kiếm Tiền"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border outline-none bg-white dark:bg-slate-800 min-w-[200px]"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    placeholder="VD: kiem-tien"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border outline-none bg-white dark:bg-slate-800 min-w-[200px]"
                  />
                </td>
                <td className="px-6 py-4 text-gray-500">0</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={handleCreate} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsCreating(false)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )}

            {tags?.map((tag) => (
              <motion.tr
                key={tag.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
               {editingId === tag.id ? (
                 <>
                   <td className="px-6 py-4">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border outline-none bg-white dark:bg-slate-800 min-w-[200px]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border outline-none bg-white dark:bg-slate-800 min-w-[200px]"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-500">{tag._count.threads}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleUpdate(tag.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                 </>
               ) : (
                 <>
                  <td className="px-6 py-4">
                    <div className="font-bold flex items-center gap-2 text-primary-600">
                      <Tag className="w-4 h-4" /> {tag.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{tag.slug}</td>
                  <td className="px-6 py-4 text-gray-500 font-bold">{tag._count.threads}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => startEdit(tag)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn xoá tag ${tag.name}?`)) {
                          deleteTagMutation.mutate(tag.id);
                        }
                      }} 
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                 </>
               )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
