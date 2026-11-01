import { apiClient } from './client';
import type { BlogInput } from '@portfolio/shared';

export interface Blog extends BlogInput { id: string; createdAt: string; updatedAt: string; publishedAt: string | null }
const unwrap = <T>(response: { data: { data: T } }) => response.data.data;
export const getBlogs = (projectSlug?: string) => apiClient.get('/blogs', { params: projectSlug ? { projectSlug } : {} }).then(unwrap<Blog[]>);
export const getBlog = (slug: string) => apiClient.get(`/blogs/${slug}`).then(unwrap<Blog>);
export const sendFeedback = (slug: string, value: { name: string; email?: string; message: string }) => apiClient.post(`/blogs/${slug}/feedback`, value);
export const getAdminBlogs = () => apiClient.get('/admin/blogs').then(unwrap<Blog[]>);
export const createBlog = (value: BlogInput) => apiClient.post('/admin/blogs', value).then(unwrap<Blog>);
export const updateBlog = (id: string, value: BlogInput) => apiClient.patch(`/admin/blogs/${id}`, value).then(unwrap<Blog>);
