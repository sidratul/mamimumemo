import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { env } from '../config/env';
import { clearSessionToken, getSessionToken } from '../shared/storage';
import { refreshAdminSession } from './auth';

async function authFetch(url: string, options: RequestInit) {
  const token = await getSessionToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let res = await fetch(url, { ...options, headers });
  if (res.status !== 401) return res;

  const next = await refreshAdminSession();
  if (!next?.accessToken) {
    await clearSessionToken();
    return res;
  }

  headers.set('Authorization', `Bearer ${next.accessToken}`);
  res = await fetch(url, { ...options, headers });
  if (res.status === 401) await clearSessionToken();
  return res;
}

async function upload(file: any, folder: string, visibility: 'public' | 'private') {
  const form = new FormData();
  form.append('folder', folder);
  form.append('filename', file.name);
  form.append('visibility', visibility);
  form.append('file', { uri: file.uri, name: file.name, type: file.mimeType || 'application/octet-stream' } as any);

  const res = await authFetch(`${env.apiBaseUrl}/uploads`, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload gagal');
  return data;
}

export async function pickAndUploadDaycareLogo() {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9, allowsEditing: true, aspect: [1, 1] });
  if (result.canceled || !result.assets[0]) return null;
  const a = result.assets[0];
  return upload({ uri: a.uri, mimeType: a.mimeType, name: a.fileName || `logo-${Date.now()}.jpg` }, 'logos', 'public');
}

export async function pickAndUploadDaycareDocument() {
  const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false, type: ['application/pdf', 'image/*'] });
  if (result.canceled || !result.assets[0]) return null;
  const a = result.assets[0];
  return upload({ uri: a.uri, mimeType: a.mimeType, name: a.name || `doc-${Date.now()}` }, 'documents/tmp', 'private');
}
