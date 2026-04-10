import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { env } from '../../config/env';
import { clearSessionToken, getSessionToken } from '../storage/session';
import { refreshAdminSession } from '../auth/session-auth';

type UploadResponse = {
  bucket: string;
  path: string;
  url: string;
  contentType: string;
  size: number;
};

async function authenticatedFetch(url: string, options: RequestInit) {
  const token = await getSessionToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });
  if (response.status !== 401) {
    return response;
  }

  const nextTokens = await refreshAdminSession();
  if (!nextTokens?.accessToken) {
    await clearSessionToken();
    return response;
  }

  headers.set('Authorization', `Bearer ${nextTokens.accessToken}`);
  const retried = await fetch(url, { ...options, headers });
  if (retried.status === 401) {
    await clearSessionToken();
  }
  return retried;
}

async function uploadAsset(
  file: { uri: string; mimeType?: string; name: string },
  folder: string,
  visibility: 'public' | 'private',
) {
  const formData = new FormData();
  formData.append('folder', folder);
  formData.append('filename', file.name);
  formData.append('visibility', visibility);
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/octet-stream',
  } as unknown as Blob);

  const response = await authenticatedFetch(`${env.apiBaseUrl}/uploads`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message || 'Gagal upload file.');
  }

  return (await response.json()) as UploadResponse;
}

export async function pickAndUploadDaycareLogo() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.9,
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return await uploadAsset(
    {
      uri: asset.uri,
      mimeType: asset.mimeType,
      name: asset.fileName || `logo-${Date.now()}.jpg`,
    },
    'logos',
    'public',
  );
}

export async function pickAndUploadDaycareDocument() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: ['application/pdf', 'image/*'],
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return await uploadAsset(
    {
      uri: asset.uri,
      mimeType: asset.mimeType,
      name: asset.name || `document-${Date.now()}`,
    },
    'documents/tmp',
    'private',
  );
}
